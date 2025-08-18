import GoogleSheetsService from '@services/google/google-sheets-service';
import path from "node:path";
import fs from "node:fs";
import sha256 from 'crypto-js/sha256';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import AnimalRescueRepository from '@repositories/animal-rescue-repository';
import AnimalRepository from '@repositories/animal-repository';
import AnimalCharacteristicRepository from '@repositories/animal-characteristic-repository';
import UserRepository from '@repositories/user-repository';
import FosterHomeRepository from '@repositories/foster-home-repository';
import moment from 'moment';

@injectable()
export default class SyncSheetDataToDBJob {
    constructor(
        @inject(TYPES.GoogleSheetsService)
        private googleSheetsService: GoogleSheetsService,
        @inject(TYPES.AnimalRescueRepository)
        private animalRescueRepository: AnimalRescueRepository,
        @inject(TYPES.AnimalRepository)
        private animalRepository: AnimalRepository,
        @inject(TYPES.AnimalCharacteristicRepository)
        private animalCharacteristicRepository: AnimalCharacteristicRepository,
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
        @inject(TYPES.FosterHomeRepository)
        private fosterHomeRepository: FosterHomeRepository,
    ) { }

    public async syncSheetsToDb() {
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

        this.syncSheetDataToDb(previousSheet, formattedSheet);
        this.saveCurrentSheetAsPrevious(formattedSheet);
    }

    private formatSheetData(sheet) {
        const result = [];

        const sheetRows = sheet.data.sheets[0].data[0].rowData;
        const headerRow = this.getHeaderRowsColumnNames(sheetRows[0].values);
        for (let index = 1; index < sheetRows.length; index++) {
            let row = sheetRows[index];
            let newObject = {};
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
        const result = [];
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
        const tempDir = path.join(process.cwd(), "./files");
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
        const animalRescue = await this.animalRescueRepository.getAnimalRescueByRankNr(oldData['jarjekorraNr'].formattedValue);
        const animal = await this.animalRepository.getAnimalByAnimalRescueId(animalRescue.id);

        await this.animalCharacteristicRepository.deleteAllCharacteristicsByAnimalId(animal.id);
        await this.animalRepository.deleteAnimalById(animal.id);
        await this.animalRescueRepository.deleteAnimalRescueById(animalRescue.id);
        await this.animalRescueRepository.deleteAnimalToAnimalRescueByRescueId(animalRescue.id);
    }

    private async updateData(newData) {
        const animalRescue = await this.updateAnimalRescue(newData);
        const animal = await this.updateAnimal(newData, animalRescue);

        const animalToAnimalRescueData = {
            animalRescueId: animalRescue.id,
            animalId: animal.id
        };
        await this.animalRescueRepository.saveOrUpdateAnimalToAnimalRescue(animalToAnimalRescueData);
        await this.updateCharacteristics(newData, animal.id);

        const user = await this.updateUser(newData);
        const fosterHome = await this.updateFosterHome({ userId: user.id });
        const animalToFosterHomeData = {
            animalId: animal.id,
            fosterHomeId: fosterHome.id
        }
        await this.fosterHomeRepository.saveOrUpdateAnimalToFosterHome(animalToFosterHomeData);
    }

    private async updateFosterHome(newData) {
        const fosterHomeData = {
            userId: newData.userId
        };
        return await this.fosterHomeRepository.saveOrUpdateFosterHome(fosterHomeData);
    }

    private async updateUser(newData) {
        const userData = {
            fullName: newData['_HOIUKODU/_KLIINIKU_NIMI'].formattedValue
        };
        return await this.userRepository.saveOrUpdateUser(userData);
    }

    private async updateAnimal(newData, animalRescue) {
        let animal = await this.animalRepository.getAnimalByAnimalRescueId(animalRescue.id);
        const animalData = {
            id: animal?.id || null,
            name: newData['KASSI_NIMI'].formattedValue,
            birthday: moment(newData['SÜNNIAEG'].formattedValue, 'DD.MM.YYYY').toISOString() || null,
            chipNumber: newData['KIIP'].formattedValue || null,
            chipRegisteredWithUs: newData['KIIP_LLR-is_MTÜ_nimel-_täidab_registreerija'].formattedValue === 'Jah',
        };
        return await this.animalRepository.saveOrUpdateAnimal(animalData);
    }

    private async updateAnimalRescue(newData) {
        const animalRescueData = {
            rank_nr: newData['jarjekorraNr'].formattedValue,
            address: newData['LEIDMISKOHT'].formattedValue,
            rescue_date: moment(newData['PÄÄSTMISKP/_SÜNNIKP'].formattedValue, 'DD.MM.YYYY').toISOString() || null
        }
        return await this.animalRescueRepository.saveOrUpdateAnimalRescue(animalRescueData);
    }

    private async updateCharacteristics(newData, animalId) {
        if (newData['KASSI_VÄRV'].formattedValue) {
            await this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'coatColour', name: newData['KASSI_VÄRV'].formattedValue });
        } else {
            await this.animalCharacteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'coatColour' });
        }

        if (newData['KASSI_KARVA_PIKKUS'].formattedValue) {
            await this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'coatLength', name: newData['KASSI_KARVA_PIKKUS'].formattedValue });
        } else {
            await this.animalCharacteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'coatLength' });
        }

        if (newData['SUGU'].formattedValue) {
            await this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'gender', name: newData['SUGU'].formattedValue });
        } else {
            await this.animalCharacteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'gender' });
        }

        if (newData['LÕIGATUD'].formattedValue) {
            await this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId: animalId, type: 'spayedOrNeutered', name: newData['LÕIGATUD'].formattedValue });
        } else {
            await this.animalCharacteristicRepository.deleteCharacteristic({ animalId: animalId, type: 'spayedOrNeutered' });
        }
    }

    private getValuesToUpdate(data, oldValues) {
        const valuesToUpdate = [];
        data.forEach(row => {
            const oldHash = oldValues[row.jarjekorraNr.formattedValue];
            if (oldHash != row.hash) {
                valuesToUpdate.push(row);
            }
        });
        return valuesToUpdate;
    }

    private getValuesToRemove(data, oldValues) {
        const valuesToRemove = [];
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
