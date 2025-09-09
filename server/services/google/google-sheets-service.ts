import AnimalRepository from '@repositories/animal-repository';
import { formatEstonianDate } from '@utils/date-utils';
import { google, sheets_v4 } from 'googleapis';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { CreateAnimalData } from 'types/animal';
import { Profile } from 'types/cat';
import { User } from 'generated/prisma';
import {
  CatSheetsHeaders
} from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import { sheetsRowToObject } from 'utils/sheet-utils';
import GoogleAuthService from './google-auth-service';

@injectable()
export default class GoogleSheetsService {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetTable: string;

  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: GoogleAuthService,
    @inject(TYPES.AnimalRepository)
    private animalRepository: AnimalRepository,
  ) {
    this.sheets = google.sheets({
      version: 'v4',
      auth: this.googleAuthService.getAuth(),
    });

    if (!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) {
      throw new Error('Missing CATS_SHEETS_ID or CATS_TABLE_NAME from env');
    }

    this.sheetID = process.env.CATS_SHEETS_ID!;
    this.sheetTable = process.env.CATS_TABLE_NAME!;
  }


  async getNewSheet() {
    try {
      const sheetData = await this.sheets.spreadsheets.get({
        auth: this.googleAuthService.getAuth(),
        spreadsheetId: this.sheetID,
        ranges: [this.sheetTable],
        includeGridData: true,
      });
      return sheetData;
    } catch (e) {
      throw new Error('Error fetching sheet: ', e);
    }
  }

  async getSheetData(sheetId, sheetTable) {
    try {
      const sheetData = await this.sheets.spreadsheets.get({
        auth: this.googleAuthService.getAuth(),
        spreadsheetId: sheetId,
        ranges: [sheetTable],
        includeGridData: true,
      });
      return sheetData;
    } catch (e) {
      throw new Error('Error fetching sheet: ', e);
    }
  }



  async addDataToSheet(data: CreateAnimalData, user: User) {
    const row = new Array(30).fill('');
    row[0] = data.rankNr!;
    row[1] = data.rankNr!;
    row[7] = user.fullName;
    row[17] = formatEstonianDate(new Date());
    row[20] = `${data.state}, ${data.location}`;
    row[30] = data.notes;

    await this.sheets.spreadsheets.values.append({
      auth: this.googleAuthService.getAuth(),
      spreadsheetId: process.env.CATS_SHEETS_ID,
      range: process.env.CATS_TABLE_NAME,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const m = moment(date);
    return m.isValid() ? m.format('DD.MM.YYYY') : '';
  }

  updateSheetRow(row: sheets_v4.Schema$RowData, animalProfile: Profile) {
    const values = sheetsRowToObject(row.values);

    values.catName = animalProfile.mainInfo.name;
    values.microchip = animalProfile.mainInfo.microchip;
    values.microchipRegisteredInLLR = animalProfile.mainInfo.microchipRegisteredInLLR
      ? 'Jah'
      : 'Ei';
    values.birthDate = this.formatDate(animalProfile.mainInfo.birthDate);

    values.catColor = animalProfile.characteristics.selectFields.coatColour;
    values.furLength = animalProfile.characteristics.selectFields.coatLength;
    values.gender = animalProfile.characteristics.textFields.gender;
    values.spayedOrNeutered = animalProfile.characteristics.textFields.spayedOrNeutered.endsWith('mata') ? "EI" : "JAH";

    values.findingLocation = animalProfile.animalRescueInfo.rescueLocation;

    values.complexVaccine = this.formatDate(animalProfile.vaccineInfo.complexVaccine);
    values.nextVaccineDate = this.formatDate(animalProfile.vaccineInfo.nextComplexVaccineDate);
    values.rabiesVaccine = this.formatDate(animalProfile.vaccineInfo.rabiesVaccine);
    values.nextRabiesDate = this.formatDate(animalProfile.vaccineInfo.nextRabiesVaccineDate);
    values.dewormingOrFleaTreatmentName = animalProfile.vaccineInfo.dewormingOrFleaTreatmentName;
    values.dewormingOrFleaTreatmentDate = this.formatDate(animalProfile.vaccineInfo.dewormingOrFleaTreatmentDate);

    return values;
  }

  convertAnimalToCellDataArray(animal: CatSheetsHeaders): sheets_v4.Schema$CellData[] {
    const orderedKeys: (keyof CatSheetsHeaders)[] = [
      'catName',
      'rescueSequenceNumber',
      'overOneYear',
      'underOneYear',
      'contractNumber',
      'status',
      'location',
      'shelterOrClinicName',
      'mentor',
      'birthDate',
      'gender',
      'catColor',
      'furLength',
      'additionalNotes',
      'microchip',
      'microchipRegisteredInLLR',
      'photo',
      'rescueOrBirthDate',
      'arrivalAtShelterDate',
      'adoptionDate',
      'findingLocation',
      'lastPostedOnFacebook',
      'lastPostedOnWebsite',
      'spayedOrNeutered',
      'complexVaccine',
      'nextVaccineDate',
      'rabiesVaccine',
      'nextRabiesDate',
      'dewormingOrFleaTreatmentDate',
      'dewormingOrFleaTreatmentName',
      'other',
    ];

    return orderedKeys.map(key => ({
      userEnteredValue: {
        stringValue: String(animal[key] ?? ''),
      },
    }));
  }

  async getRow(animalProfile: Profile): Promise<[sheets_v4.Schema$RowData, number, number]> {
    const sheet = await this.getNewSheet();

    const sheetRows = sheet.data.sheets[0].data[0].rowData;

    const animalWithRescue = await this.animalRepository.getAnimalByIdWithRescue(animalProfile.animalId);
    const animalRescueSequenceNumber = animalWithRescue.animalsToRescue[animalWithRescue.animalsToRescue.length - 1].animalRescue.rankNr

    for (let index = 1; index < sheetRows.length; index++) {
      const row = sheetRows[index];
      const rescueSequenceNumber = row.values[1].formattedValue;

      if (rescueSequenceNumber !== animalRescueSequenceNumber) {
        continue;
      }

      return [row, index, sheet.data.sheets[0].properties.sheetId];
    }
    return null;

  }

  async updateSheetCells(
    animalProfile: Profile,
  ): Promise<void> {

    try {
      const [row, rowIndex, sheetId] = await this.getRow(animalProfile);
      const updatedRow = this.updateSheetRow(row, animalProfile);

      const updateRequests = this.buildUpdateRequests(
        updatedRow,
        rowIndex,
        sheetId
      );

      await this.executeSheetUpdate(updateRequests);
    } catch (error) {
      console.error('Error updating sheet cells:', error);
      throw new Error(`Failed to update sheet cells: ${error.message}`);
    }
  }

  private buildUpdateRequests(row: CatSheetsHeaders, rowIndex: number, sheetId: number): sheets_v4.Schema$Request[] {
    const updateRequests: sheets_v4.Schema$Request[] = [];

    updateRequests.push({
      updateCells: {
        start: {
          sheetId,
          rowIndex,
          columnIndex: 0,
        },
        rows: [
          {
            values: this.convertAnimalToCellDataArray(row),
          },
        ],
        fields: 'userEnteredValue',
      },
    });

    return updateRequests;
  }

  private async executeSheetUpdate(updateRequests: sheets_v4.Schema$Request[]): Promise<void> {
    if (!updateRequests.length) {
      throw new Error('No update requests provided');
    }

    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.CATS_SHEETS_ID,
        requestBody: { requests: updateRequests },
      });
    } catch (error) {
      throw new Error(`Sheet update failed: ${error.message}`);
    }
  }
}
