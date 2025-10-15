import { Animal } from '@animal/entities/animal.entity';
import { Treatment } from '@animal/entities/treatment.entity';
import { TreatmentRepository } from '@animal/repositories/treatment.repository';
import { Result } from '@catshelp/types';
import { formatEstonianDate } from '@catshelp/utils';
import { Injectable } from '@nestjs/common';
import { DEFAULT_COLORS } from '../dashboard/constants';
import { DashboardNotification } from './templates/DasboardNotification';
import KompleksVaktsiiniKinnitusNotification from './templates/KompleksVaktsiiniKinnitusNotification';
import MarutaudVaktsiiniKinnitusNotification from './templates/MarutaudVaktsiiniKinnitusNotification';
import PoleKassiNotification from './templates/PoleKassiNotification';
import UssirohiNotification from './templates/UssirohiNotification';

@Injectable()
export class NotificationService {
  private readonly notifications: DashboardNotification[];
  private readonly colours: string[];

  constructor(
    private readonly treatmentRepository: TreatmentRepository,
  ) {
    this.notifications = [
      new UssirohiNotification(),
      new KompleksVaktsiiniKinnitusNotification(),
      new MarutaudVaktsiiniKinnitusNotification(),
    ];
    this.colours = DEFAULT_COLORS;
  }

  public async processNotifications(animals: Animal[]): Promise<Result[]> {
    if (animals.length === 0) {
      return this.createEmptyStateNotification();
    }

    const results: Result[] = [];

    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];

      const treatments = await this.treatmentRepository.getTreatements(animal.id);

      this.notifications.forEach(notification => {
        const treatment = treatments.find(treatment => {
          treatment.treatmentName === notification.dbColumnName
        });

        if (!treatment) {
          return;
        }

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
    treatmentHistory: Treatment,
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
