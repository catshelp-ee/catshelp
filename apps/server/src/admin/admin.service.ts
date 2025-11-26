import { SyncUserDataToDBJob } from '@cron/jobs/sync-users-to-db-job';
import { Injectable } from '@nestjs/common';
import { SyncSheetDataToDBJob } from '../cron/jobs/sync-sheets-to-db-job';

@Injectable()
export class AdminService {
    constructor(
        private readonly syncUserDataToDBJob: SyncUserDataToDBJob,
    ) { }

    public async runJob(jobName) {
        switch (jobName) {
            case 'userSync':
                await this.syncUserDataToDBJob.run();
                return;
        }
    }
}
