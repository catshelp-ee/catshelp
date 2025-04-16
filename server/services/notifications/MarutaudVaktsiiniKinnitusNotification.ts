import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class MarutaudVaktsiiniKinnitusNotification implements DashboardNotification {
    getText(): string {
        return "Broneeri veterinaari juures vaktsineerimise aeg";
    }

    shouldShow(triggerDate: Date): boolean {
        const currentDate = moment(new Date());
        currentDate.subtract(1, "y");

        if (currentDate.toDate() < triggerDate) return false;

        return true;
    }

    isUrgent(compareDate: Date): boolean {
        const currentDate = moment(new Date());
        if (currentDate.toDate() > compareDate) return true;
        return false;
    }

    getDueDate(currentDate: Date): Date {
        return moment(currentDate).add(1, 'y').add(7, 'd').toDate();
    }

    dbColumnName = "KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)";
    buttonText = "Broneeri aeg";
    redirectURL = "https://docs.google.com/document/d/1fJeYtNlLr8Bw_XJ18tr0bQcuupCYtaQAtK2Yfs7LhQo/edit?usp=sharing";
}
