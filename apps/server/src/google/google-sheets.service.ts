import { AnimalRescueDto } from '@animal/dto/create-animal.dto';
import { Profile } from '@catshelp/types';
import { Injectable } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuthService } from './google-auth.service';
import { formatDate } from '@catshelp/utils';

@Injectable()
export class GoogleSheetsService {
    sheets: sheets_v4.Sheets;

    constructor(
        private readonly googleAuthService: GoogleAuthService,
    ) {
        this.sheets = google.sheets({
            version: 'v4',
            auth: this.googleAuthService.getAuth(),
        });
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
            throw new Error('Error fetching sheet: ', { cause: e });
        }
    }

    public async addNewAnimalDataToSheet(data: AnimalRescueDto, user: User) {
        const row = new Array(30).fill('');
        row[0] = data.rankNr!;
        row[1] = data.rankNr!;
        row[7] = user.fullName;
        row[17] = formatDate(new Date());
        row[20] = `${data.state}, ${data.location}`;
        row[30] = data.notes;

        await this.sheets.spreadsheets.values.append({
            auth: this.googleAuthService.getAuth(),
            spreadsheetId: process.env.CATS_SHEETS_ID!,
            range: process.env.CATS_TABLE_NAME!,
            valueInputOption: 'RAW',
            requestBody: {
                values: [row],
            },
        });
    }

    private createUserEnteredValue(value: string): sheets_v4.Schema$CellData {
        return {
            userEnteredValue: {
                stringValue: value ?? ''
            }
        };
    }

    private getUpdatedCellData(row: sheets_v4.Schema$RowData, animalProfile: Profile) : sheets_v4.Schema$CellData[] {
        if (!row.values) {
            return [];
        }
        const values: sheets_v4.Schema$CellData[] = [];

        //NAME
        values[0] = this.createUserEnteredValue(animalProfile.mainInfo.name);
        //RESCUE SEQUENCE NUMBER
        values[1] = this.createUserEnteredValue(animalProfile.mainInfo.rankNr);
        //OVER ONE YEAR
        values[2] = this.createUserEnteredValue(row[2].formattedValue);
        //UNDER ONE YEAR
        values[3] = this.createUserEnteredValue(row[3].formattedValue);
        //CONTRACT NUMBER
        values[4] = this.createUserEnteredValue(row[4].formattedValue);
        //STATUS
        values[5] = this.createUserEnteredValue(animalProfile.mainInfo.status);
        //LOCATION
        values[6] = this.createUserEnteredValue(animalProfile.mainInfo.location);
        //SHELTER OR CLINIC NAME
        values[7] = this.createUserEnteredValue(row[7].formattedValue);
        //MENTOR
        values[8] = this.createUserEnteredValue(row[8].formattedValue);
        //BIRTH DATE
        values[9] = this.createUserEnteredValue(formatDate(animalProfile.mainInfo.birthDate));
        //GENDER
        values[10] = this.createUserEnteredValue(animalProfile.mainInfo.gender);
        //COAT COLOR
        values[11] = this.createUserEnteredValue(animalProfile.mainInfo.coatColour);
        //FUR LENGTH
        values[12] = this.createUserEnteredValue(animalProfile.mainInfo.coatLength);
        //ADDITIONAL NOTES
        values[13] = this.createUserEnteredValue(animalProfile.mainInfo.additionalNotes);
        //MICROCHIP
        values[14] = this.createUserEnteredValue(animalProfile.mainInfo.microchip);
        //MICROCHIP REGISTERED IN LLR
        values[15] = this.createUserEnteredValue(animalProfile.mainInfo.chipRegisteredWithUs ? 'Jah' : 'Ei');
        //PHOTO
        values[16] = this.createUserEnteredValue(row[16].formattedValue);
        //RESCUE DATE
        values[17] = this.createUserEnteredValue(formatDate(animalProfile.mainInfo.rescueDate));
        //ARRIVAL AT SHELTER DATE
        values[18] = this.createUserEnteredValue(row[18].formattedValue);
        //ADOPTION DATE
        values[19] = this.createUserEnteredValue(row[19].formattedValue);
        //FINDING LOCATION
        values[20] = this.createUserEnteredValue(row[20].formattedValue);
        //LAST POSTED ON FACEBOOK
        values[21] = this.createUserEnteredValue(row[21].formattedValue);
        //LAST POSTED ON WEBSITE
        values[22] = this.createUserEnteredValue(row[22].formattedValue);
        //SPAYED OR NEUTERED
        values[23] = this.createUserEnteredValue(animalProfile.mainInfo.spayedOrNeutered ? 'Jah' : 'Ei');
        //COMPLEX VACCINE
        values[24] = this.createUserEnteredValue(row[24].formattedValue);
        //NEXT VACCINE DATE
        values[25] = this.createUserEnteredValue(row[25].formattedValue);
        //RABIES VACCINE
        values[26] = this.createUserEnteredValue(row[26].formattedValue);
        //NEXT RABIES DATE
        values[27] = this.createUserEnteredValue(row[27].formattedValue);
        //DEWORMING OR FLEA TREATMENT DATE
        values[28] = this.createUserEnteredValue(row[28].formattedValue);
        //DEWORMING OR FLEA TREATMENT NAME
        values[29] = this.createUserEnteredValue(row[29].formattedValue);
        //OTHER
        values[30] = this.createUserEnteredValue(animalProfile.mainInfo.additionalNotes);

        return values;
    }

    private async getRow(animalRescueSequenceNumber: string): Promise<[sheets_v4.Schema$RowData, number, number] | null> {
        const sheet = await this.getSheetData(process.env.CATS_SHEETS_ID!, process.env.CATS_TABLE_NAME!);
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
            const sheetRow = await this.getRow(animalRescueSequenceNumber);
            if (!sheetRow) {
                return;
            }
            const [row, rowIndex, sheetId] = sheetRow;
            const updatedCellData = this.getUpdatedCellData(row, animalProfile);

            const updateRequests = this.buildUpdateRequests(
                updatedCellData,
                rowIndex,
                sheetId
            );

            await this.executeSheetUpdate(updateRequests, process.env.CATS_SHEETS_ID!);
        } catch (error) {
            console.error('Error updating sheet cells:', error);
            throw new Error('Failed to update sheet cells', { cause: error });
        }
    }

    private buildUpdateRequests(cellData: sheets_v4.Schema$CellData[], rowIndex: number, sheetId: number): sheets_v4.Schema$Request[] {
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
                        values: cellData,
                    },
                ],
                fields: 'userEnteredValue',
            },
        });

        return updateRequests;
    }

    private async executeSheetUpdate(updateRequests: sheets_v4.Schema$Request[], sheetId: string): Promise<void> {
        if (!updateRequests.length) {
            throw new Error('No update requests provided');
        }

        try {
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: { requests: updateRequests },
            });
        } catch (error) {
            throw new Error('Sheet update failed', { cause: error });
        }
    }
}
