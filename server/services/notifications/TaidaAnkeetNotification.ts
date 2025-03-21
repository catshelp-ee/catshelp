import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class TaidaAnkeetNotification implements DashboardNotification {
    getText(): string {
        return "Täida hoiukoduankeet ja nõustu tingimustega";
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
        return moment(currentDate).add(1, 'y').add(14, "d").toDate();
    }

    dbColumnName = "KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)";
    buttonText = "Täida ankeet";
    redirectURL = "https://docs.google.com/forms/d/e/1FAIpQLScVxngcYrKm4_ZgSLa39AL13Iap6_dz7TYMxQHIzv35wovnQA/viewform?usp=sf_link";
}
