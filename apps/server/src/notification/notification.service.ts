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
    //TODO see ei ole kuidagi notificationitega seotud. Peaks eksisteerima mujal
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

    for (let i = 0; i < animals.length; i++) {
      const animal = animals[i];

      const treatments = await this.treatmentRepository.getTreatements(animal.id);
      const treatmentNameToTreatmentMap = Object.fromEntries(
        treatments.map(t => [t.treatmentName, t])
      );

      for (let j = 0; j < this.notifications.length; j++) {

        const treatment = treatmentNameToTreatmentMap[this.notifications[j].name];

        if (!treatment) {
          continue;
        }


        const result = this.processNotification(
          this.notifications[j],
          treatment,
          animal,
          i
        );
        if (result) {
          results.push(result);
        }

      }
    }
    return results;
  }

  private processNotification(
    notification: DashboardNotification,
    treatment: Treatment,
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

    // Parse and validate date
    const triggerDate = treatment.visitDate;
    if (!triggerDate) {
      return result;
    }

    // Check if notification should be shown
    if (!notification.shouldShow(triggerDate)) {
      return null;
    }

    const dueDate = notification.getDueDate(triggerDate);

    result.urgent = notification.isUrgent(dueDate);;
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
