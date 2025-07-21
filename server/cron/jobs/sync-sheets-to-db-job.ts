import CharacteristicsService from '@services/animal/characteristics-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { GaxiosResponse } from 'gaxios';
import { Animal } from 'generated/prisma';
import { sheets_v4 } from 'googleapis';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { prisma } from 'server/prisma';
import AnimalRepository from 'server/repositories/animal-repository';
import UserRepository from 'server/repositories/user-repository';
import { CatSheetsHeaders, headerMapping, Rows } from 'types/google-sheets';
import TYPES from 'types/inversify-types';

@injectable()
export default class SyncSheetDataToDBJob {
  headers: (keyof CatSheetsHeaders)[];
  constructor(
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService
  ) {
    this.headers = Object.values(headerMapping);
  }

  async getNewSheet() {
    const sheetData: GaxiosResponse<sheets_v4.Schema$Spreadsheet> =
      await this.googleSheetsService.getNewSheet();

    const rows = sheetData.data.sheets[0].data;

    const rowData = rows[0].rowData;
    const rowObjects: Rows = [];
    this.googleSheetsService.convertRowToObject(rowData, rowObjects);

    return rowObjects;
  }

  async run() {
    const currentSheet = this.googleSheetsService.rows;
    const newSheet = await this.getNewSheet();
    const users = await UserRepository.getAllUsers();
    const allAnimals: Record<string, Animal[]> = {};

    await prisma.$transaction(async tx => {
      let updated;
      let animals;
      for (let i = 1; i < newSheet.length; i++) {
        const updatedRow = newSheet[i].row;
        updated = false;
        for (let j = 1; j < currentSheet.length; j++) {
          const row = currentSheet[j].row;

          if (updatedRow.rescueSequenceNumber !== row.rescueSequenceNumber) {
            continue;
          }

          for (const key of this.headers) {
            if (updatedRow[key] === row[key]) {
              continue;
            }

            updated = true;
          }
        }

        if (!updated) {
          continue;
        }

        const user = users.find(
          user => user.fullName === updatedRow.shelterOrClinicName
        );

        if (!user) {
          console.error('User name in sheets and in database does not match');
          continue;
        }

        if (allAnimals[updatedRow.shelterOrClinicName]) {
          animals = allAnimals[updatedRow.shelterOrClinicName];
        } else {
          animals = await this.animalRepository.getCatsByUserEmail(user.email);
          allAnimals[updatedRow.shelterOrClinicName] = animals;
        }

        const animal = animals.find(
          animal => animal.name === updatedRow.catName
        );

        // update animal
        await tx.animal.update({
          where: { id: animal.id },
          data: {
            name: updatedRow.catName,
            birthday: moment(updatedRow.birthDate, 'YYYYMMDD').toDate() || null,
            chipNumber: updatedRow.microchip || null,
            chipRegisteredWithUs: updatedRow.microchipRegisteredInLLR === 'Jah',
          },
        });

        // update animal rescue
        const animalToAnimalRescue = await tx.animalToAnimalRescue.findFirst({
          where: { animalId: animal.id },
          orderBy: { id: 'desc' },
        });

        await tx.animalRescue.update({
          where: { id: animalToAnimalRescue.animalRescueId },
          data: {
            rescueDate: moment(
              updatedRow.rescueOrBirthDate,
              'YYYYMMDD'
            ).toDate(),
            address: updatedRow.findingLocation,
          },
        });

        // update characteristics
        for (const [key, value] of Object.entries({
          coatColour: updatedRow.catColor,
          coatLength: updatedRow.furLength,
          gender: updatedRow.gender,
          spayedOrNeutered: updatedRow.spayedOrNeutered,
        })) {
          const currentValues = await tx.animalCharacteristic.findMany({
            where: { animalId: animal.id, type: key },
          });
          await this.characteristicsService.updateSingleCharacteristic(
            tx,
            animal.id,
            key,
            value,
            currentValues
          );
        }

        // update fosterhome
        await tx.fosterHome.update({
          where: { userId: user.id },
          data: {
            location: updatedRow.location,
          },
        });

        // update vaccine info
      }
    });
    this.googleSheetsService.rows = newSheet;
  }
}
