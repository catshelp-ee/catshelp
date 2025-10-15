import * as cron from 'node-cron';

import { Controller } from '@nestjs/common';
import { DeleteExpiredTokensJob } from './jobs/delete-expired-tokens-job';
import { SyncSheetDataToDBJob } from './jobs/sync-sheets-to-db-job';
import { TodoNotificationJob } from './jobs/todo-notification-job';

@Controller()
export class CronController {
  constructor(
    private readonly syncSheetDataToDBJob: SyncSheetDataToDBJob,
    private readonly deleteExpiredTokensJob: DeleteExpiredTokensJob,
    private readonly todoNotificationJob: TodoNotificationJob
  ) { }

  public startCronJobs() {
    cron.schedule('0 0 * * *', this.withErrorHandling(this.deleteExpiredTokensJob.execute, true));
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
