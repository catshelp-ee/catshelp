import { DashboardNotification } from '@notifications/DasboardNotification';
import KompleksVaktsiiniKinnitusNotification from '@notifications/KompleksVaktsiiniKinnitusNotification';
import MarutaudVaktsiiniKinnitusNotification from '@notifications/MarutaudVaktsiiniKinnitusNotification';
import PoleKassiNotification from '@notifications/PoleKassiNotification';
import UssirohiNotification from '@notifications/UssirohiNotification';
import TreatmentHistoryRepository from '@repositories/treatment-history-repository';
import { formatEstonianDate } from '@utils/date-utils';
import { Animal, Treatment, TreatmentHistory } from 'generated/prisma';
import { injectable } from 'inversify';
import { Result } from 'types/dashboard';
import { DEFAULT_COLORS } from '../dashboard/constants';

@injectable()
export default class NotificationService {
  private readonly notifications: DashboardNotification[];
  private readonly colours: string[];

  constructor() {
    this.notifications = [
      new UssirohiNotification(),
      new KompleksVaktsiiniKinnitusNotification(),
      new MarutaudVaktsiiniKinnitusNotification(),
    ];
    this.colours = DEFAULT_COLORS;
  }

  async processNotifications(animals: Animal[]): Promise<Result[]> {
    if (animals.length === 0) {
      return this.createEmptyStateNotification();
    }

    const results: Result[] = [];

    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];

      const treatmentHistories =
        await TreatmentHistoryRepository.getEntireTreatmentHistory(animal.id);

      this.notifications.forEach(notification => {
        const treatment = treatmentHistories.find(treatmentHistory => {
          treatmentHistory.treatment.treatmentName ===
            notification.dbColumnName;
        });
        const result = this.processNotification(
          notification,
          treatment,
          animal,
          index
        );
        if (result) {
          results.push(result);
        }
      });
    }

    return results;
  }

  private processNotification(
    notification: DashboardNotification,
    treatmentHistory: TreatmentHistory & { treatment: Treatment },
    animal: Animal,
    catColourIndex: number
  ): Result | null {
    const result: Result = {
      label: notification.getText(),
      assignee: animal.name,
      due: formatEstonianDate(new Date()),
      action: {
        label: notification.buttonText,
        redirect: notification.redirectURL,
      },
      urgent: true,
      catColour: this.colours[catColourIndex % this.colours.length],
    };

    // Handle empty cell
    if (!treatmentHistory) {
      notification.cellIsEmpty = true;
      return result;
    }

    // Parse and validate date
    const triggerDate = treatmentHistory.visitDate;
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
