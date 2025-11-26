import { SyncUserDataToDBJob } from '@cron/jobs/sync-users-to-db-job';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(
        private readonly syncUserDataToDBJob: SyncUserDataToDBJob
    ) { }

    public async runJob(jobName) {
        switch (jobName) {
            case 'userSync':
                await this.syncUserDataToDBJob.run();
                return;
        }
    }
}
