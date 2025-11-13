import { AnimalRescueDto } from '@animal/dto/create-animal.dto';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { CatSheetsHeaders, Profile } from '@catshelp/types';
import { Injectable } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { google, sheets_v4 } from 'googleapis';
import moment from 'moment';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class GoogleSheetsService {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetTable: string;

  constructor(
    private readonly googleAuthService: GoogleAuthService,
  ) {
    this.sheets = google.sheets({
      version: 'v4',
      auth: this.googleAuthService.getAuth(),
    });

    if (!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) {
      throw new Error('Missing CATS_SHEETS_ID or CATS_TABLE_NAME from env');
    }

    //TODO see vajab natuke ümber tegemist. hetkel on enamik funktsioone eeldusega, et tegemist saab olla ainult kassi andmetega.
    this.sheetID = process.env.CATS_SHEETS_ID!;
    this.sheetTable = process.env.CATS_TABLE_NAME!;
  }

  /**
 * Alternative function if you have the values in the exact order of your original interface
 * @param values - Array of 30 values in the exact order of the Header interface
 * @returns Object with English property names and corresponding values
 */
  private sheetsRowToObject(row: sheets_v4.Schema$CellData[]): CatSheetsHeaders {
    return {
      catName: row[0].formattedValue,
      rescueSequenceNumber: row[1].formattedValue,
      overOneYear: row[2].formattedValue,
      underOneYear: row[3].formattedValue,
      contractNumber: row[4].formattedValue,
      status: row[5].formattedValue,
      location: row[6].formattedValue,
      shelterOrClinicName: row[7].formattedValue,
      mentor: row[8].formattedValue,
      birthDate: row[9].formattedValue,
      gender: row[10].formattedValue,
      catColor: row[11].formattedValue,
      furLength: row[12].formattedValue,
      additionalNotes: row[13].formattedValue,
      microchip: row[14].formattedValue,
      microchipRegisteredInLLR: row[15].formattedValue,
      photo: row[16].formattedValue,
      rescueOrBirthDate: row[17].formattedValue,
      arrivalAtShelterDate: row[18].formattedValue,
      adoptionDate: row[19].formattedValue,
      findingLocation: row[20].formattedValue,
      lastPostedOnFacebook: row[21].formattedValue,
      lastPostedOnWebsite: row[22].formattedValue,
      spayedOrNeutered: row[23].formattedValue,
      complexVaccine: row[24].formattedValue,
      nextVaccineDate: row[25].formattedValue,
      rabiesVaccine: row[26].formattedValue,
      nextRabiesDate: row[27].formattedValue,
      dewormingOrFleaTreatmentDate: row[28].formattedValue,
      dewormingOrFleaTreatmentName: row[29].formattedValue,
      other: row[30].formattedValue,
    }
  }

  private formatEstonianDate = (date: Date): string => {
    return date.toLocaleDateString('et-EE');
  };

  private async getNewSheet() {
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

  public async getSheetData(sheetId, sheetTable) {
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

  public async addDataToSheet(data: AnimalRescueDto, user: User) {
    const row = new Array(30).fill('');
    row[0] = data.rankNr!;
    row[1] = data.rankNr!;
    row[7] = user.fullName;
    row[17] = this.formatEstonianDate(new Date());
    row[20] = `${data.state}, ${data.location}`;
    row[30] = data.notes;

    await this.sheets.spreadsheets.values.append({
      auth: this.googleAuthService.getAuth(),
      spreadsheetId: this.sheetID,
      range: this.sheetTable,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });
  }

  private formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const m = moment(date);
    return m.isValid() ? m.format('DD.MM.YYYY') : '';
  }

  private updateSheetRow(row: sheets_v4.Schema$RowData, animalProfile: Profile) {
    const values = this.sheetsRowToObject(row.values!);

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

  private convertAnimalToCellDataArray(animal: CatSheetsHeaders): sheets_v4.Schema$CellData[] {
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

  private async getRow(animalProfile: Profile, animalRescueSequenceNumber: string): Promise<[sheets_v4.Schema$RowData, number, number] | null> {
    const sheet = await this.getNewSheet();
    const sheetRows = sheet.data.sheets![0].data![0].rowData!;

    for (let index = 1; index < sheetRows.length; index++) {
      const row = sheetRows[index];
      const rescueSequenceNumber = row.values![1].formattedValue;

      if (rescueSequenceNumber !== animalRescueSequenceNumber) {
        continue;
      }

      return [row, index, sheet.data.sheets![0].properties!.sheetId!];
    }
    return null;
  }

  public async updateSheetCells(animalProfile: Profile, animalRescueSequenceNumber: string): Promise<void> {
    try {
      const sheetRow = await this.getRow(animalProfile, animalRescueSequenceNumber);
      if (!sheetRow) {
        return;
      }
      const [row, rowIndex, sheetId] = sheetRow;
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
        spreadsheetId: this.sheetID,
        requestBody: { requests: updateRequests },
      });
    } catch (error) {
      throw new Error(`Sheet update failed: ${error.message}`);
    }
  }
}
