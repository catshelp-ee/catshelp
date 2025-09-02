import * as cron from 'node-cron';

import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import { deleteExpiredRevokedTokens } from './jobs/delete-expired-tokens-job';
import SyncSheetDataToDBJob from './jobs/sync-sheets-to-db-job';

@injectable()
export default class CronRunner {
  constructor(
    @inject(TYPES.SyncSheetDataToDBJob)
    private syncSheetDataToDBJob: SyncSheetDataToDBJob
  ) { }

  public startCronJobs() {
    cron.schedule('0 0 * * *', this.withErrorHandling(deleteExpiredRevokedTokens));
    cron.schedule('*/10 * * * *', this.withErrorHandling(this.syncSheetDataToDBJob.syncSheetsToDb, true));
  }

  private withErrorHandling(functionToRun, async = false) {
    if (async) {
      return async function (...args) {
        try {
          return await functionToRun.apply(this, args);
        } catch (error) {
          console.error("Error during cron job: " + error);
        }
      }
    }
    return function (...args) {
      try {
        return functionToRun.apply(this, args);
      } catch (error) {
        console.error("Error during cron job: " + error);
      }
    }
  }
}
