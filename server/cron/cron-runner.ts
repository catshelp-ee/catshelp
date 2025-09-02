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
    cron.schedule('0 0 * * *', deleteExpiredRevokedTokens);
    cron.schedule('*/10 * * * *', async () => this.syncSheetDataToDBJob.syncSheetsToDb());
    cron.schedule('0 12 1,15 * *', async () => this.todoNotificationJob.sendNotifications());
  }
}
