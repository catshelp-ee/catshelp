import * as cron from 'node-cron';
import { deleteExpiredRevokedTokens } from './jobs/delete-expired-tokens-job.ts';

export default class CronRunner {

    public startCronJobs() {
        cron.schedule('0 0 * * *', deleteExpiredRevokedTokens);
    }
}
