import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class PoleKassiNotification implements DashboardNotification {
    getText(): string {
        return "Teil pole kassi. Võta ühe palun 🙏";
    }

    shouldShow(triggerDate: Date): boolean {
        return true;
    }

    isUrgent(compareDate: Date): boolean {
        return true;
    }

    getDueDate(currentDate: Date): Date {
        return currentDate;
    }

    dbColumnName = "";
    buttonText = "Võtke kass";
    redirectURL = "https://docs.google.com/document/d/1fJeYtNlLr8Bw_XJ18tr0bQcuupCYtaQAtK2Yfs7LhQo/edit?usp=sharing";
}
