import { DashboardNotification } from '@notifications/DasboardNotification';
import KompleksVaktsiiniKinnitusNotification from '@notifications/KompleksVaktsiiniKinnitusNotification';
import MarutaudVaktsiiniKinnitusNotification from '@notifications/MarutaudVaktsiiniKinnitusNotification';
import PoleKassiNotification from '@notifications/PoleKassiNotification';
import UssirohiNotification from '@notifications/UssirohiNotification';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { formatEstonianDate, parseEstonianDate } from '@utils/date-utils';
import { inject, injectable } from 'inversify';
import { Result } from 'types/dashboard';
import { CatSheetsHeaders, Rows } from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import { DEFAULT_COLORS } from '../dashboard/constants';

@injectable()
export default class NotificationService {
  private readonly notifications: DashboardNotification[];
  private readonly colours: string[];

  constructor(
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {
    this.notifications = [
      new UssirohiNotification(),
      new KompleksVaktsiiniKinnitusNotification(),
      new MarutaudVaktsiiniKinnitusNotification(),
    ];
    this.colours = DEFAULT_COLORS;
  }

  processNotifications(rows: Rows): Result[] {
    if (rows.length === 0) {
      return this.createEmptyStateNotification();
    }

    const results: Result[] = [];

    rows.forEach((row, index) => {
      this.notifications.forEach(notification => {
        const result = this.processNotification(notification, row.row, index);
        if (result) {
          results.push(result);
        }
      });
    });

    return results;
  }

  private processNotification(
    notification: DashboardNotification,
    row: CatSheetsHeaders,
    catIndex: number
  ): Result | null {
    const columnIndex =
      this.googleSheetsService.headers[notification.dbColumnName];
    if (columnIndex === undefined) {
      return null;
    }

    const dateCell = row[columnIndex];
    const sheetsDate = dateCell?.formattedValue;

    const result: Result = {
      label: notification.getText(),
      assignee: row.catName,
      due: formatEstonianDate(new Date()),
      action: {
        label: notification.buttonText,
        redirect: notification.redirectURL,
      },
      urgent: true,
      catColour: this.colours[catIndex % this.colours.length],
    };

    // Handle empty cell
    if (!sheetsDate) {
      notification.cellIsEmpty = true;
      return result;
    }

    // Parse and validate date
    const triggerDate = parseEstonianDate(sheetsDate);
    if (!triggerDate) {
      return null;
    }

    // Check if notification should be shown
    if (!notification.shouldShow(triggerDate)) {
      return null;
    }

    const dueDate = notification.getDueDate(triggerDate);
    const isUrgent = notification.isUrgent(dueDate);

    result.urgent = isUrgent;
    result.due = formatEstonianDate(dueDate);

    return result;
  }

  private createEmptyStateNotification(): Result[] {
    const notification = new PoleKassiNotification();
    const dueDate = new Date();

    return [
      {
        label: notification.getText(),
        assignee: 'Sina ise',
        due: formatEstonianDate(dueDate),
        action: {
          label: notification.buttonText,
          redirect: notification.redirectURL,
        },
        urgent: false,
        catColour: '#000',
      },
    ];
  }
}
