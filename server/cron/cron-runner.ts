import * as cron from 'node-cron';

import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import { deleteExpiredRevokedTokens } from './jobs/delete-expired-tokens-job';
import SyncSheetDataToDBJob from './jobs/sync-sheets-to-db-job';
import TodoNotificationJob from './jobs/todo-notification-job';

@injectable()
export default class CronRunner {
  constructor(
    @inject(TYPES.SyncSheetDataToDBJob)
    private syncSheetDataToDBJob: SyncSheetDataToDBJob,
    @inject(TYPES.TodoNotificationJob)
    private todoNotificationJob: TodoNotificationJob
  ) { }

  public startCronJobs() {
    cron.schedule('0 0 * * *', this.withErrorHandling(deleteExpiredRevokedTokens));
    cron.schedule('*/10 * * * *', this.withErrorHandling(this.syncSheetDataToDBJob.syncSheetsToDb, true));
    cron.schedule('0 12 1,15 * *', this.withErrorHandling(this.todoNotificationJob.sendNotifications, true));
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
