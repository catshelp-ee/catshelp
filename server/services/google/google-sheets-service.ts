import NodeCacheService from '@services/cache/cache-service';
import { formatEstonianDate } from '@utils/date-utils';
import { GaxiosResponse } from 'gaxios';
import { Animal } from 'generated/prisma';
import { google, sheets_v4 } from 'googleapis';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { CreateAnimalData } from 'types/animal';
import { Profile } from 'types/cat';
import {
  CatSheetsHeaders,
  Headers,
  RowLocation,
  Rows,
} from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import { rowToObjectFixed } from 'utils/sheet-utils';
import GoogleAuthService from './google-auth-service';

@injectable()
export default class GoogleSheetsService {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetIDNum: number;
  sheetTable: string;
  headers: Headers;
  rows: Rows;

  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: GoogleAuthService,
    @inject(TYPES.NodeCacheService)
    private nodeCacheService: NodeCacheService
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
    this.rows = [];
  }

  getRows(userID: number | string) {
    return this.nodeCacheService.get<Rows>(`rows:${userID}`);
  }

  setRows(userID: number | string, rows: Rows) {
    return this.nodeCacheService.set(`rows:${userID}`, rows);
  }

  async getSheetRows(animals: Animal[]) {
    const filteredRows = [] as Rows;
    for (let i = 1; i < this.rows.length; i++) {
      const row = this.rows[i].row;
      const animal = animals.find(animal => animal.name === row.catName);
      if (!animal) {
        continue;
      }
      this.rows[i].id = animal.id;
      filteredRows.push(this.rows[i]);
    }
    return filteredRows;
  }

  async setInitRows(userID: number | string, animals: Animal[]) {
    const filteredRows = [] as Rows;
    for (let i = 1; i < this.rows.length; i++) {
      const row = this.rows[i].row;
      const animal = animals.find(animal => animal.name === row.catName);
      if (!animal) {
        continue;
      }
      this.rows[i].id = animal.id;
      filteredRows.push(this.rows[i]);
    }
    await this.setRows(userID, filteredRows);
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

  convertRowToObject(rowData: sheets_v4.Schema$RowData[], rows: Rows) {
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const values = rowToObjectFixed({ row: row.values });

      rows.push({
        row: values,
        index: i,
        id: -1,
      });
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

  private extractColumnMapping(rows: sheets_v4.Schema$GridData[]) {
    const columnMapping: Headers = {};
    const headerRow = rows[0]?.rowData?.[0]?.values;

    if (!headerRow) {
      throw new Error('No header row found');
    }

    headerRow.forEach((col, index: number) => {
      if (col?.formattedValue) {
        columnMapping[col.formattedValue] = index;
      }
    });

    return columnMapping;
  }

  async init() {
    if (this.headers) {
      throw new Error('Google Auth Service already initialized');
    }

    const sheetData: GaxiosResponse<sheets_v4.Schema$Spreadsheet> =
      await this.getNewSheet();

    if (!sheetData.data.sheets || sheetData.data.sheets.length === 0) {
      throw new Error('No sheet found');
    }

    this.sheetIDNum = sheetData.data.sheets[0].properties.sheetId;
    const rows = sheetData.data.sheets[0].data;
    if (!rows || rows.length === 0) {
      throw new Error('No rows in sheet');
    }

    this.headers = this.extractColumnMapping(rows);

    const rowData = rows[0].rowData;
    this.convertRowToObject(rowData, this.rows);
  }

  async addDataToSheet(data: CreateAnimalData) {
    const row = new Array(30).fill('');
    row[0] = data.rankNr!;
    row[1] = data.rankNr!;
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

  updateRowValues(animalRow: RowLocation, animal: Profile) {
    const newRow = animalRow.row;

    const [spayedOrNeutered, gender] =
      animal.characteristics.textFields.gender.split(' ');

    newRow.catName = animal.mainInfo.name;
    newRow.microchip = animal.mainInfo.microchip;
    newRow.microchipRegisteredInLLR = animal.mainInfo.microchipRegisteredInLLR
      ? 'Jah'
      : 'Ei';
    newRow.birthDate = this.formatDate(animal.mainInfo.birthDate);
    newRow.gender = gender.toUpperCase();
    newRow.spayedOrNeutered = spayedOrNeutered.endsWith('mata') ? 'EI' : 'JAH';
    newRow.catColor = animal.characteristics.selectFields.coatColour;
    newRow.furLength = animal.characteristics.selectFields.coatLength;
    newRow.findingLocation = animal.animalRescueInfo.rescueLocation;
    newRow.complexVaccine = this.formatDate(animal.vaccineInfo.complexVaccine);
    newRow.nextVaccineDate = this.formatDate(
      animal.vaccineInfo.nextComplexVaccineDate
    );
    newRow.rabiesVaccine = this.formatDate(animal.vaccineInfo.rabiesVaccine);
    newRow.nextRabiesDate = this.formatDate(
      animal.vaccineInfo.nextRabiesVaccineDate
    );
    newRow.dewormingOrFleaTreatmentName =
      animal.vaccineInfo.dewormingOrFleaTreatmentName;
    newRow.dewormingOrFleaTreatmentDate = this.formatDate(
      animal.vaccineInfo.dewormingOrFleaTreatmentDate
    );
    animalRow.row = newRow;
  }

  convertAnimalToCellDataArray(
    cat: CatSheetsHeaders
  ): sheets_v4.Schema$CellData[] {
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
        stringValue: String(cat[key] ?? ''),
      },
    }));
  }

  async updateSheetCells(
    animal: Profile,
    animalRowIndex: number,
    animalRow: RowLocation
  ): Promise<void> {
    try {
      this.updateRowValues(animalRow, animal);
      const updateRequests = this.buildUpdateRequests(
        animalRow,
        animalRowIndex
      );

      await this.executeSheetUpdate(updateRequests);
    } catch (error) {
      console.error('Error updating sheet cells:', error);
      throw new Error(`Failed to update sheet cells: ${error.message}`);
    }
  }

  private buildUpdateRequests(
    animalRow: RowLocation,
    animalRowIndex: number
  ): any[] {
    const updateRequests: sheets_v4.Schema$Request[] = [];

    updateRequests.push({
      updateCells: {
        start: {
          sheetId: this.sheetIDNum,
          rowIndex: animalRowIndex, // Convert to 0-based index
          columnIndex: 0,
        },
        rows: [
          {
            values: this.convertAnimalToCellDataArray(animalRow.row),
          },
        ],
        fields: 'userEnteredValue',
      },
    });

    return updateRequests;
  }

  private async executeSheetUpdate(
    updateRequests: sheets_v4.Schema$Request[]
  ): Promise<void> {
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
