import { Animal } from '@animal/entities/animal.entity';
import { Treatment } from '@animal/entities/treatment.entity';
import { TreatmentRepository } from '@animal/repositories/treatment.repository';
import { Result } from '@catshelp/types';
import { formatEstonianDate } from '@catshelp/utils';
import { Injectable } from '@nestjs/common';
import { DEFAULT_COLORS } from '@animal/constants';
import { DashboardNotification } from './templates/DasboardNotification';
import KompleksVaktsiiniKinnitusNotification from './templates/KompleksVaktsiiniKinnitusNotification';
import MarutaudVaktsiiniKinnitusNotification from './templates/MarutaudVaktsiiniKinnitusNotification';
import PoleKassiNotification from './templates/PoleKassiNotification';
import UssirohiNotification from './templates/UssirohiNotification';
import {AnimalTodoDto} from "@animal/dto/animal-todo.dto";

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

    public async processNotifications(animal: Animal): Promise<AnimalTodoDto[]> {
        const todos: AnimalTodoDto[] = [];

        const treatments = await this.treatmentRepository.getTreatements(animal.id);
        const treatmentNameToTreatmentMap = Object.fromEntries(
            treatments.map(t => [t.treatmentName, t])
        );

        for (let j = 0; j < this.notifications.length; j++) {

            const treatment = treatmentNameToTreatmentMap[this.notifications[j].name];

            if (!treatment) {
                continue;
            }

            const catColour = this.colours[0];
            const notification = this.notifications[j];

            const todo = this.processNotification(
                notification,
                treatment,
                animal,
                catColour
            );
            if (todo) {
                todos.push(todo);
            }

        }
        return todos;
    }

    private processNotification(
        notification: DashboardNotification,
        treatment: Treatment,
        animal: Animal,
        catColour
    ): AnimalTodoDto | null {
        const todo: AnimalTodoDto = {
            label: notification.getText(),
            assignee: animal.name,
            due: formatEstonianDate(new Date()),
            action: {
                label: notification.buttonText,
                redirect: notification.redirectURL,
            },
            urgent: true,
            catColour
        };

        // Parse and validate date
        const triggerDate = treatment.visitDate;
        if (!triggerDate) {
            return todo;
        }

        // Check if notification should be shown
        if (!notification.shouldShow(triggerDate)) {
            return null;
        }

        const dueDate = notification.getDueDate(triggerDate);

        todo.urgent = notification.isUrgent(dueDate);;
        todo.due = formatEstonianDate(dueDate);

        return todo;
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
