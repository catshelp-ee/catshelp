import moment from 'moment';

import type { DashboardNotification } from './DasboardNotification';

export default class UssirohiNotification implements DashboardNotification {
    getText(): string {
        return 'Anna vähemalt 2 kuud enne vaktsineerimist ussirohi';
    }

    shouldShow(triggerDate: Date): boolean {
        const currentDate = moment(new Date());
        currentDate.subtract(10, 'M');

        return currentDate.toDate() > triggerDate;
    }

    isUrgent(compareDate: Date): boolean {
        const currentDate = moment(new Date());
        return currentDate.toDate() > compareDate;
    }

    getDueDate(currentDate: Date): Date {
        return moment(currentDate).add(1, 'y').toDate();
    }

    name = 'DEWORMING_MEDICATION';
    buttonText = 'Vaata juhendit';
    redirectURL = process.env.WORM_MED_REDIRECT!;
}
