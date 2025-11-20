
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@user/user.repository';
import { BaseCronJob } from './base-cron-job';
import { DataSource} from 'typeorm';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class SyncUserDataToDBJob extends BaseCronJob {
    private userRepository;

    constructor(
        protected dataSource: DataSource,
        protected moduleRef: ModuleRef,
        private readonly googleSheetsService: GoogleSheetsService,
    ) {
        super(dataSource, moduleRef);
    }

    protected async resolveScopeDependencies() { // Create a unique context
        this.userRepository = await this.moduleRef.resolve(UserRepository, this.contextId);
    }

    public async doWork() {
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
        const result: {
            fullName: string;
            identityCode: string;
            email: string;
        }[] = [];

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
        for (let index = 0; index < formattedData.length; index++) {
            await this.userRepository.saveOrUpdateUser(formattedData[index]);
        }
    }
}
