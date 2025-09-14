
import UserRepository from '@repositories/user-repository';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class SyncUserDataToDBJob {
    constructor(
        @inject(TYPES.GoogleSheetsService)
        private googleSheetsService: GoogleSheetsService,
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
    ) {

    }
    public async syncSheetsToDb() {
        if (!process.env.HOIUKODUDE_SHEETS_ID || !process.env.HOIKUODUDE_TABLE_NAME) {
            console.log("Google hoikukodude sheet id or table name not set. Skipping db sync");
            return;
        }

        const sheetData = await this.googleSheetsService.getSheetData(process.env.HOIUKODUDE_SHEETS_ID, process.env.HOIKUODUDE_TABLE_NAME);
        if (!sheetData) {
            console.log("Could not sync user data");
        }

        const formattedData = this.getFormattedUserData(sheetData);
        await this.saveFormattedData(formattedData);
    }

    private getFormattedUserData(sheet) {
        const result = [];

        const sheetRows = sheet.data.sheets[0].data[0].rowData;
        for (let index = 1; index < sheetRows.length; index++) {
            let row = sheetRows[index];
            let email = row.values[9].formattedValue;
            if (!email) {
                continue;
            }

            let newObject = {
                fullName: row.values[2].formattedValue + " " + row.values[3].formattedValue,
                identityCode: row.values[4].formattedValue,
                email: email
            };
            result.push(newObject);
        }

        return result;
    }

    private async saveFormattedData(formattedData) {
        for(let index = 0; index < formattedData.length; index++) {
            await this.userRepository.saveOrUpdateUser(formattedData[index]);
        }
    }
}
