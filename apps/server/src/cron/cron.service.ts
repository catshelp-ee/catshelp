import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { DeleteExpiredTokensJob } from './jobs/delete-expired-tokens-job';
import { SyncUserDataToDBJob } from './jobs/sync-users-to-db-job';
import { SyncSheetDataToDBJob } from './jobs/sync-sheets-to-db-job';
import { TodoNotificationJob } from './jobs/todo-notification-job';

@Injectable()
export class CronService {
    constructor(
        private readonly deleteExpiredTokensJob: DeleteExpiredTokensJob,
        private readonly syncUserDataToDBJob: SyncUserDataToDBJob,
        private readonly syncSheetsToDbJob: SyncSheetDataToDBJob,
        private readonly todoNotificationJob: TodoNotificationJob,
    ) { }

    @Cron('0 0 * * *')
    async deleteExpiredTokens() {
        await this.deleteExpiredTokensJob.run();
    }

    //@Cron('* * * * *')
    async syncUsersToDb() {
        await this.syncUserDataToDBJob.run();
    }

    @Cron('*/10 * * * *')
    async syncSheetsToDb() {
        await this.syncSheetsToDbJob.run();
    }

    @Cron('0 12 1,15 * *')
    async sendTodoNotifications() {
        await this.todoNotificationJob.run();
    }
}
