import { SyncUserDataToDBJob } from '@cron/jobs/sync-users-to-db-job';
import { Injectable } from '@nestjs/common';
import { DeleteExpiredTokensJob } from '@cron/jobs/delete-expired-tokens-job';
import { SyncSheetDataToDBJob } from '@cron/jobs/sync-sheets-to-db-job';
import { TodoNotificationJob } from '@cron/jobs/todo-notification-job';

@Injectable()
export class AdminService {
    constructor(
        private readonly syncUserDataToDBJob: SyncUserDataToDBJob,
        private readonly deleteExpiredTokensJob: DeleteExpiredTokensJob,
        private readonly syncSheetDataToDBJob: SyncSheetDataToDBJob,
        private readonly sendTodoNotificationJob: TodoNotificationJob,
    ) { }

    public async runJob(jobName) {
        switch (jobName) {
            case 'userSync':
                await this.syncUserDataToDBJob.run();
                return;
            case 'sheetsSync':
                await this.syncSheetDataToDBJob.run();
                return;
            case 'todoNotification':
                await this.sendTodoNotificationJob.run();
                return;
            case 'expiredTokens':
                await this.deleteExpiredTokensJob.run();
                return;
        }
    }
}
