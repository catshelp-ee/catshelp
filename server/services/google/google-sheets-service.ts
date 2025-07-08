import NodeCacheService from '@services/cache/cache-service';
import UserService from '@services/user/user-service';
import { formatEstonianDate } from '@utils/date-utils';
import { GaxiosResponse } from 'gaxios';
import { google, sheets_v4 } from 'googleapis';
import { inject, injectable } from 'inversify';
import { CreateAnimalData } from 'types/animal';
import { formFields } from 'types/cat';
import { Headers, RowLocation, Rows } from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import { rowToObjectFixed } from 'utils/sheet-utils';
import GoogleAuthService from './google-auth-service';

const SHEETS_COLUMNS = {
  name: 'KASSI NIMI',
  chipNr: 'KIIP',
  llr: 'KIIP LLR-is MTÜ nimel- täidab registreerija',
  birthData: 'SÜNNIAEG',
  gender: 'SUGU',
  coatColour: 'KASSI VÄRV',
  coatLength: 'KASSI KARVA PIKKUS',
  foundLoc: 'LEIDMISKOHT',
  vacc: 'KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)',
  vaccEnd: 'JÄRGMISE VAKTSIINI AEG',
  rabiesVacc:
    'MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)',
  rabiesVaccEnd: 'JÄRGMINE MARUTAUDI AEG',
  wormMedName: 'Ussirohu/ turjatilga nimi',
  cut: 'LÕIGATUD',
};

@injectable()
export default class GoogleSheetsService {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetIDNum: number;
  sheetTable: string;
  headers: Headers;

  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: GoogleAuthService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
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

  getRows(userID: number | string) {
    return this.nodeCacheService.get<Rows>(`rows:${userID}`);
  }

  setRows(userID: number | string, rows: Rows) {
    this.nodeCacheService.set(`rows:${userID}`, rows);
  }

  async init(userID: number | string) {
    if (this.headers) {
      throw new Error('Google Auth Service already initialized');
    }

    let sheetData: GaxiosResponse<sheets_v4.Schema$Spreadsheet>;
    try {
      sheetData = await this.sheets.spreadsheets.get({
        auth: this.googleAuthService.getAuth(),
        spreadsheetId: this.sheetID,
        ranges: [this.sheetTable],
        includeGridData: true,
      });
    } catch (e) {
      throw new Error('Error fetching sheet: ', e);
    }

    if (!sheetData.data.sheets || sheetData.data.sheets.length === 0) {
      throw new Error('No sheet found');
    }

    this.sheetIDNum = sheetData.data.sheets[0].properties.sheetId;
    const rows = sheetData.data.sheets[0].data;
    if (!rows || rows.length === 0) {
      throw new Error('No rows in sheet');
    }

    this.headers = this.extractColumnMapping(rows);

    const fosterhomeColumn = this.headers['_HOIUKODU/ KLIINIKU NIMI'];

    const rowData = rows[0].rowData;
    const filteredRows: RowLocation[] = [];

    const username = (await this.userService.getUser(userID)).fullName;
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const values = row.values;

      const fosterhome = values[fosterhomeColumn].formattedValue;
      if (fosterhome === username) {
        filteredRows.push({
          row: rowToObjectFixed({ row: values }),
          index: i,
        });
      }
    }

    this.setRows(userID, filteredRows);
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

  async updateSheetCells(
    animal: formFields,
    animalRowIndex: number
  ): Promise<void> {
    try {
      // Build and execute update requests
      this.processGenderData(animal);
      const updateRequests = this.buildUpdateRequests(animal, animalRowIndex);

      await this.executeSheetUpdate(updateRequests);
    } catch (error) {
      console.error('Error updating sheet cells:', error);
      throw new Error(`Failed to update sheet cells: ${error.message}`);
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

  private buildUpdateRequests(data: formFields, animalRowIndex: number): any[] {
    const updateRequests: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!(key in SHEETS_COLUMNS)) {
        return;
      }

      const columnIndex = this.headers[SHEETS_COLUMNS[key]];

      if (columnIndex === undefined) {
        console.warn(`Column "${key}" not found in sheet`);
        return;
      }

      updateRequests.push({
        updateCells: {
          start: {
            sheetId: this.sheetIDNum,
            rowIndex: animalRowIndex, // Convert to 0-based index
            columnIndex,
          },
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    stringValue: String(value), // Ensure string conversion
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredValue',
        },
      });
    });

    if (updateRequests.length === 0) {
      throw new Error('No valid update requests generated');
    }

    return updateRequests;
  }

  private async executeSheetUpdate(updateRequests: any[]): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.CATS_SHEETS_ID,
        requestBody: { requests: updateRequests },
      });
    } catch (error) {
      throw new Error(`Sheet update failed: ${error.message}`);
    }
  }

  private processGenderData(catData: formFields): void {
    if (!catData.gender) return;

    const [cut, gender] = catData.gender.split(' ');
    catData.gender = gender;
    catData.cut = 'false';

    if (cut === 'Steriliseeritud' || cut === 'Kastreeritud') {
      catData.cut = 'true';
    }
  }
}
