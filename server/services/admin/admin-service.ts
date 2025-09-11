import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import SyncUserDataToDBJob from '@cron/jobs/sync-users-to-db-job'

@injectable()
export default class AdminService {
    constructor(
        @inject(TYPES.SyncUserDataToDBJob)
        private syncUserDataToDBJob: SyncUserDataToDBJob
    ) { }

    public async runJob(jobName) {
        switch (jobName) {
            case 'userSync':
                await this.syncUserDataToDBJob.syncSheetsToDb();
                return;
        }
    }
}