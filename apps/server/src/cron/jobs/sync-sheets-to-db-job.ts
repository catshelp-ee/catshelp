import { Animal } from '@animal/entities/animal.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { CharacteristicRepository } from '@animal/repositories/characteristic.repository';
import { FosterHomeRepository } from '@animal/repositories/foster-home.repository';
import { RescueRepository } from '@animal/repositories/rescue.repository';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AnimalToFosterHome } from '@server/src/animal/entities/animalToFosterhome.entity';
import { Treatment } from '@server/src/animal/entities/treatment.entity';
import { AnimalToFosterHomeRepository } from '@server/src/animal/repositories/animal-to-fosterhome.repository';
import { TreatmentRepository } from '@server/src/animal/repositories/treatment.repository';
import { UserRepository } from '@user/user.repository';
import sha256 from 'crypto-js/sha256';
import moment from 'moment';
import fs from "node:fs";
import path from "node:path";
import { DataSource } from 'typeorm';
import { BaseCronJob } from './base-cron-job';

@Injectable()
export class SyncSheetDataToDBJob extends BaseCronJob {
    private rescueRepository: RescueRepository;
    private animalRepository: AnimalRepository;
    private characteristicRepository: CharacteristicRepository;
    private userRepository: UserRepository;
    private fosterhomeRepository: FosterHomeRepository;
    private animalToFosterhomeRepository: AnimalToFosterHomeRepository;
    private treatmentRepository: TreatmentRepository;

    constructor(
        protected dataSource: DataSource,
        protected moduleRef: ModuleRef,
        private readonly googleSheetsService: GoogleSheetsService,
    ) {
        super(dataSource, moduleRef);
    }

    protected async resolveScopeDependencies() {
        this.rescueRepository = await this.moduleRef.resolve(RescueRepository, this.contextId);
        this.animalRepository = await this.moduleRef.resolve(AnimalRepository, this.contextId);
        this.userRepository = await this.moduleRef.resolve(UserRepository, this.contextId);
        this.fosterhomeRepository = await this.moduleRef.resolve(FosterHomeRepository, this.contextId);
        this.characteristicRepository = await this.moduleRef.resolve(CharacteristicRepository, this.contextId);
        this.animalToFosterhomeRepository = await this.moduleRef.resolve(AnimalToFosterHomeRepository, this.contextId);
        this.treatmentRepository = await this.moduleRef.resolve(TreatmentRepository, this.contextId);
    }

    protected async doWork() {
        if (!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) {
            console.log("Google cats sheet id or table name not set. Skipping db sync");
            return;
        }

        const currentSheet = await this.getCurrentSheetData();
        if (!currentSheet) {
            console.log("Could not load data from google sheets. Skipping sync");
            return;
        }

        const previousSheet = this.getPreviousSheetData();
        const formattedSheet = this.formatSheetData(currentSheet);

        await this.syncSheetDataToDb(previousSheet, formattedSheet);
        this.saveCurrentSheetAsPrevious(formattedSheet);
    }

    private formatSheetData(sheet) {
        const result: any = [];

        const sheetRows = sheet.data.sheets[0].data[0].rowData;
        const headerRow = this.getHeaderRowsColumnNames(sheetRows[0].values);
        for (let index = 1; index < sheetRows.length; index++) {
            let row = sheetRows[index];
            let newObject: any = {};
            for (let j = 0; j < row.values.length; j++) {
                let columnValue = row.values[j];
                let headerName = headerRow[j];
                newObject[headerName] = columnValue;
            }
            let hash = sha256(JSON.stringify(newObject));
            newObject['hash'] = hash.toString();
            result.push(newObject);
        }

        //remove header row
        return result.slice(1);
    }

    private getHeaderRowsColumnNames(headerValues) {
        const result: string[] = [];
        for (let index = 0; index < headerValues.length; index++) {
            const headerColumnValue = headerValues[index].formattedValue ? headerValues[index].formattedValue : '';
            if (headerColumnValue == 'PÄÄSTETUD JÄRJEKORRA NR (AA\'KK nr ..)') {
                result.push('jarjekorraNr')
            } else {
                result.push(headerColumnValue.replaceAll(' ', '_'));
            }
        }
        return result;
    }

    private getSheetSaveLocation() {
        const tempDir = path.join(__dirname, '../../../../files');
        const fullPath = path.resolve(tempDir, "previous_sheets_data.txt");
        return fullPath;
    }

    private getPreviousSheetData() {
        const saveLocation = this.getSheetSaveLocation();
        if (!fs.existsSync(saveLocation)) {
            return;
        }
        const data = fs.readFileSync(saveLocation, 'utf-8');
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    }

    private async getCurrentSheetData() {
        const sheetData = await this.googleSheetsService.getSheetData(
            process.env.CATS_SHEETS_ID!,
            process.env.CATS_TABLE_NAME!
        );
        return sheetData;
    }

    private saveCurrentSheetAsPrevious(currentSheetData) {
        try {
            if (!currentSheetData) {
                return;
            }
            const data = JSON.stringify(currentSheetData);

            const saveLocation = this.getSheetSaveLocation();
            fs.writeFileSync(saveLocation, data);
        } catch (err) {
            console.error("Error writing sheets file:", err);
        }
    }

    private async syncSheetDataToDb(previousSheetData, currentSheetData) {
        const oldValues = this.getPaastetudKpToHash(previousSheetData);

        const valuesToUpdate = this.getValuesToUpdate(currentSheetData, oldValues);
        const valuesToRemove = this.getValuesToRemove(currentSheetData, oldValues);

        for (let i = 0; i < valuesToUpdate.length; i++) {
            await this.updateData(valuesToUpdate[i]);
        }

        for (let i = 0; i < valuesToRemove.length; i++) {
            await this.deleteData(valuesToRemove[i]);
        }
    }

    private async deleteData(oldData) {
        const animalRescue = (await this.rescueRepository.getAnimalRescueByRankNr(oldData['jarjekorraNr'].formattedValue))!;
        const animal = (await this.animalRepository.getAnimalByAnimalRescueId(animalRescue.id))!;

        await this.characteristicRepository.deleteAllCharacteristicsByAnimalId(animal.id);
        await this.animalRepository.deleteAnimalById(animal.id);
        await this.rescueRepository.deleteAnimalRescueById(animalRescue.id);
    }

    private async updateData(newData) {
        const animalRescue = await this.updateAnimalRescue(newData);
        const animal = await this.updateAnimal(newData, animalRescue);
        animalRescue.animalId = animal.id;
        await this.rescueRepository.save(animalRescue);
        await this.updateCharacteristics(newData, animal.id);

        const user = await this.updateUser(newData);
        const fosterHome = await this.updateFosterHome({ userId: user.id });
        const animalToFosterHomeData: Partial<AnimalToFosterHome> = {
            animalId: animal.id,
            fosterHomeId: fosterHome.id
        };
        await this.animalToFosterhomeRepository.saveOrUpdate(animalToFosterHomeData);
        await this.updateTreatments(animal, newData);
    }

    private async updateTreatments(animal: Animal, newData) {
        const treatments = await this.treatmentRepository.getActiveTreatments(animal.id);
        const treatmentNameToTreatmentMap = Object.fromEntries(
            treatments.map(t => [t.treatmentName, t])
        );

        const sheetTreatments = {
            COMPLEX_VACCINE: newData["KOMPLEKSVAKTSIIN_(nt_Feligen_CRP,_Versifel_CVR,_Nobivac_Tricat_Trio)"].formattedValue,
            RABIES_VACCINE: newData["MARUTAUDI_VAKTSIIN_(nt_Feligen_R,_Biocan_R,_Versiguard,_Rabisin_Multi,_Rabisin_R,_Rabigen_Mono,_Purevax_RCP)"].formattedValue,
            DEWORMING_MEDICATION: newData["USSIROHU/_TURJATILGA_KP"].formattedValue
        };

        for (const treatment in sheetTreatments) {
            const visitDate = moment(sheetTreatments[treatment], 'DD.MM.YYYY');

            if (treatment in treatmentNameToTreatmentMap) {
                const existingTreatment = treatmentNameToTreatmentMap[treatment];

                existingTreatment.visitDate = visitDate.toDate();
                existingTreatment.nextVisitDate = visitDate.add(1, 'y').toDate();
                await this.treatmentRepository.saveOrUpdate(existingTreatment);
                continue;
            }

            const treatmentData: Partial<Treatment> = {
                treatmentName: treatment,
                visitDate: visitDate.toDate(),
                nextVisitDate: visitDate.add(1, 'y').toDate(),
                animalId: animal.id
            };

            await this.treatmentRepository.saveOrUpdate(treatmentData);
        }
    }

    private async updateFosterHome(newData) {
        return await this.fosterhomeRepository.saveOrUpdateFosterHome(newData.userId);
    }

    private async updateUser(newData) {
        const userData = {
            fullName: newData['_HOIUKODU/_KLIINIKU_NIMI'].formattedValue
        };
        if (!userData.fullName) {
            throw new Error("No user for data sync");
        }

        return await this.userRepository.saveOrUpdateUser(userData);
    }

    private async updateAnimal(newData, animalRescue) {
        const animal = await this.animalRepository.getAnimalByAnimalRescueId(animalRescue.id);
        const animalData: Partial<Animal> = {
            id: animal?.id ?? undefined,
            name: newData['KASSI_NIMI'].formattedValue,
            birthday: moment(newData['SÜNNIAEG'].formattedValue, 'DD.MM.YYYY').toDate(),
            chipNumber: newData['KIIP'].formattedValue || null,
            chipRegisteredWithUs: newData['KIIP_LLR-is_MTÜ_nimel-_täidab_registreerija'].formattedValue === 'Jah',
        };
        return await this.animalRepository.saveOrUpdateAnimal(animalData);
    }

    private async updateAnimalRescue(newData) {
        const animalRescueData = {
            rankNr: newData['jarjekorraNr'].formattedValue as string,
            address: newData['LEIDMISKOHT'].formattedValue as string,
            rescueDate: moment(newData['PÄÄSTMISKP/_SÜNNIKP'].formattedValue, 'DD.MM.YYYY').toDate()
        }
        return await this.rescueRepository.saveOrUpdateAnimalRescue(animalRescueData);
    }

    private async updateCharacteristics(newData, animalId) {
        if (newData['KASSI_VÄRV'].formattedValue) {
            await this.characteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'coatColour', value: newData['KASSI_VÄRV'].formattedValue });
        } else {
            await this.characteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'coatColour' });
        }

        if (newData['KASSI_KARVA_PIKKUS'].formattedValue) {
            await this.characteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'coatLength', value: newData['KASSI_KARVA_PIKKUS'].formattedValue });
        } else {
            await this.characteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'coatLength' });
        }

        if (newData['SUGU'].formattedValue) {
            await this.characteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'gender', value: newData['SUGU'].formattedValue });
        } else {
            await this.characteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'gender' });
        }

        if (newData['LÕIGATUD'].formattedValue) {
            await this.characteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'spayedOrNeutered', value: newData['LÕIGATUD'].formattedValue });
        } else {
            await this.characteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'spayedOrNeutered' });
        }
    }

    private getValuesToUpdate(data, oldValues) {
        const valuesToUpdate: any = [];
        data.forEach(row => {
            const oldHash = oldValues[row.jarjekorraNr.formattedValue];
            if (oldHash != row.hash) {
                valuesToUpdate.push(row);
            }
        });
        return valuesToUpdate;
    }

    private getValuesToRemove(data, oldValues) {
        const valuesToRemove: any = [];
        const valuesToKeep = {};

        data.forEach(row => {
            let jarjekorraNr = row['jarjekorraNr'].formattedValue;
            valuesToKeep[jarjekorraNr] = true;
        });

        Object.keys(oldValues).forEach(key => {
            if (!valuesToKeep[key]) {
                valuesToRemove.push(key);
            }
        });
        return valuesToRemove;
    }

    private getPaastetudKpToHash(data) {
        const map = {};

        if (!data) {
            return map;
        }
        data.forEach(row => {
            map[row['jarjekorraNr'].formattedValue] = row['hash'];
        });
        return map;
    }
}
