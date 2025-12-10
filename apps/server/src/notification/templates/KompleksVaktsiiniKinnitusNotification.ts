import moment from 'moment';

import { DashboardNotification } from './DasboardNotification';

export default class KompleksVaktsiiniKinnitusNotification
    implements DashboardNotification {
    getText(): string {
        return 'Broneeri veterinaari juures vaktsineerimise aeg';
    }

    shouldShow(triggerDate: Date): boolean {
        const currentDate = moment(new Date());
        currentDate.subtract(1, 'y');

        return currentDate.toDate() > triggerDate;
    }

    isUrgent(compareDate: Date): boolean {
        const currentDate = moment(new Date());
        return currentDate.toDate() > compareDate;
    }

    getDueDate(currentDate: Date): Date {
        return moment(currentDate).add(1, 'y').add(7, 'd').toDate();
    }

    name = "COMPLEX_VACCINE";
    buttonText = 'Broneeri aeg';
    redirectURL = process.env.VACCINE_REDIRECT!;
}
