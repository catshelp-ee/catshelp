import { GaxiosResponse } from 'gaxios';
import { google, sheets_v4 } from "googleapis";
import { inject, injectable } from "inversify";
import { Headers, Rows } from "types/google-sheets";
import TYPES from "types/inversify-types";
import GoogleAuthService from "./google-auth-service";

/*const SHEETS_COLUMNS = {
  name: "KIISU NIMI",
  chipNr: "KIIP",
  llr: "KIIP LLR-is MTÜ nimel- täidab registreerija",
  birthData: "SÜNNIAEG",
  gender: "SUGU",
  coatColour: "KASSI VÄRV",
  coatLength: "KASSI KARVA PIKKUS",
  foundLoc: "LEIDMISKOHT",
  vacc: "KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)",
  vaccEnd: "JÄRGMISE VAKTSIINI AEG",
  rabiesVacc: "MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)",
  rabiesVaccEnd: "JÄRGMINE MARUTAUDI AEG",
  wormMedName: "Ussirohu/ turjatilga nimi",
  cut: "LÕIGATUD",
};*/

@injectable()
export default class GoogleSheetsService {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetTable: string;
  headers: Headers;
  rows: Rows;

  constructor(
    @inject(TYPES.GoogleAuthService) private googleAuthService: GoogleAuthService,
  ) {
    this.sheets = google.sheets({
      version: "v4",
      auth: this.googleAuthService.getAuth(),
    })
      ;

    if (!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) {
      throw new Error("Missing CATS_SHEETS_ID or CATS_TABLE_NAME from env");
    }

    this.sheetID = process.env.CATS_SHEETS_ID!;
    this.sheetTable = process.env.CATS_TABLE_NAME!;
  }

  async init() {
    if (this.headers) {
      throw new Error("Google Auth Service already initialized");
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
      throw new Error("Error fetching sheet: ", e);
    }


    if (!sheetData.data.sheets || sheetData.data.sheets.length === 0) {
      throw new Error("No sheet found");
    }

    const rows = sheetData.data.sheets[0].data;
    if (!rows || rows.length === 0) {
      throw new Error("No rows in sheet");
    }

    this.headers = this.extractColumnMapping(rows);

    const fosterhomeColumn = this.headers['_HOIUKODU/ KLIINIKU NIMI'];

    const rowData = rows[0].rowData
    const filteredRows: sheets_v4.Schema$CellData[][] = [];
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const values = row.values;

      const fosterhome = values[fosterhomeColumn].formattedValue;
      if (fosterhome === "Marko Peedosk") {
        filteredRows.push(values);
      }
    }

    this.rows = filteredRows;

  }

  /*
  async addDataToSheet(sheetId: string, tabName: string, data: any) {
    const row = new Array(30).fill("");

    row[0] = data.id;
    row[1] = data.id;
    row[17] = moment(new Date(), "DD.MM.YYYY").toDate().toString();
    row[20] = `${data.state}, ${data.location}`;
    row[30] = data.notes;

    await this.sheets.spreadsheets.values.append({
      auth: this.googleAuthService.getAuth(),
      spreadsheetId: sheetId,
      range: tabName,
      valueInputOption: "RAW",
      resource: {
        values: [row],
      },
    });
  }
  
  async updateSheetCells({
    sheetId,
    tabName,
    find,
    data
  }: UpdateSheetCellsParams): Promise<void> {
    try {
      // Get sheet data with validation
      const sheetData = await this.getSheetData();
      this.validateSheetData(sheetData);

      const sheet = sheetData.data.sheets[0];
      const rows = sheet.data;
      const pageId = sheet.properties.sheetId;

      // Extract column mappings
      const columnMapping = this.extractColumnMapping(rows);

      // Find the target row
      const targetRow = this.findTargetRow(rows, columnMapping, data);

      // Build and execute update requests
      const updateRequests = this.buildUpdateRequests(
        find,
        data,
        columnMapping,
        pageId,
        targetRow.rowIndex
      );

      await this.executeSheetUpdate(sheetId, updateRequests);

    } catch (error) {
      console.error('Error updating sheet cells:', error);
      throw new Error(`Failed to update sheet cells: ${error.message}`);
    }
  }
  
*/
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
  /*

  private buildUpdateRequests(
    find: Record<string, string>,
    data: Record<string, any>,
    columnMapping: any,
    pageId: number,
    rowIndex: number
  ): any[] {
    const updateRequests: any[] = [];

    Object.entries(data).forEach(([dataKey, value]) => {
      // Skip if this data key is not in the find mapping
      if (!(dataKey in find)) return;

      const columnName = find[dataKey];
      const columnIndex = columnMapping[columnName];

      if (columnIndex === undefined) {
        console.warn(`Column "${columnName}" not found in sheet`);
        return;
      }

      updateRequests.push({
        updateCells: {
          start: {
            sheetId: pageId,
            rowIndex: rowIndex - 1, // Convert to 0-based index
            columnIndex,
          },
          rows: [{
            values: [{
              userEnteredValue: {
                stringValue: String(value) // Ensure string conversion
              },
            }],
          }],
          fields: 'userEnteredValue',
        },
      });
    });

    if (updateRequests.length === 0) {
      throw new Error('No valid update requests generated');
    }

    return updateRequests;
  }

  private async executeSheetUpdate(
    sheetId: string,
    updateRequests: any[]
  ): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: updateRequests },
      });
    } catch (error) {
      console.error('Failed to execute sheet update:', error);
      throw new Error(`Sheet update failed: ${error.message}`);
    }
  }

  async updateCatInSheet(catData: any): Promise<void> {
    this.processGenderData(catData);

    await this.googleService.updateSheetCells(
      process.env.CATS_SHEETS_ID!,
      process.env.CATS_TABLE_NAME!,
      SHEETS_COLUMNS,
      catData
    );
  }

  private processGenderData(catData: any): void {
    if (!catData.gender) return;

    const [cut, gender] = catData.gender.split(" ");
    catData.gender = gender;
    catData.cut = "false";

    if (cut === "Steriliseeritud" || cut === "Kastreeritud") {
      catData.cut = "true";
    }
  }
    */

}
