import { DashboardNotification } from "@notifications/DasboardNotification";
import UssirohiNotification from "@notifications/UssirohiNotification";
import KompleksVaktsiiniKinnitusNotification from "@notifications/KompleksVaktsiiniKinnitusNotification";
import MarutaudVaktsiiniKinnitusNotification from "@notifications/MarutaudVaktsiiniKinnitusNotification";
import PoleKassiNotification from "@notifications/PoleKassiNotification";
import { SheetCell, Result } from '@types/dashboard';
import { parseEstonianDate, formatEstonianDate } from '@utils/date-utils';
import { DEFAULT_COLORS } from '../dashboard/constants';
import { injectable } from "inversify";

@injectable()
export default class NotificationService {
    private readonly notifications: DashboardNotification[];
    private readonly colours: string[];

    constructor() {
        this.notifications = [
            new UssirohiNotification(),
            new KompleksVaktsiiniKinnitusNotification(),
            new MarutaudVaktsiiniKinnitusNotification()
        ];
        this.colours = DEFAULT_COLORS;
    }

    processNotifications(
        rows: any,
        columnMapping: Record<string, number>
    ): Result[] {

        if (rows.length === 0) {
            return this.createEmptyStateNotification();
        }

        const results: Result[] = [];

        rows.forEach((row, index) => {
            this.notifications.forEach(notification => {
                const result = this.processNotification(notification, row, index, columnMapping);
                if (result) {
                    results.push(result);
                }
            });
        });

        return results;
    }

    private processNotification(
        notification: DashboardNotification,
        row: any,
        catIndex: number,
        columnMapping: Record<string, number>
    ): Result | null {
        const columnIndex = columnMapping[notification.dbColumnName];
        if (columnIndex === undefined) return null;

        const dateCell = row[columnIndex];
        const sheetsDate = dateCell?.formattedValue;
        const catName = row[columnMapping['KASSI NIMI']].formattedValue

        const result: Result = {
            label: notification.getText(),
            assignee: catName,
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
        if (!triggerDate) return null;

        // Check if notification should be shown
        if (!notification.shouldShow(triggerDate)) return null;

        const dueDate = notification.getDueDate(triggerDate);
        const isUrgent = notification.isUrgent(dueDate);

        result.urgent = isUrgent;
        result.due = formatEstonianDate(dueDate);

        return result;

    }

    private createEmptyStateNotification(): Result[] {
        const notification = new PoleKassiNotification();
        const dueDate = new Date();

        return [{
            label: notification.getText(),
            assignee: "Sina ise",
            due: formatEstonianDate(dueDate),
            action: {
                label: notification.buttonText,
                redirect: notification.redirectURL,
            },
            urgent: false,
            catColour: "#000",
        }];
    }
}
