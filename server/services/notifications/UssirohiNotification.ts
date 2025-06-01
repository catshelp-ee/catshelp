import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class UssirohiNotification implements DashboardNotification {
  getText(): string {
    return "Anna vähemalt 2 kuud enne vaktsineerimist ussirohi";
  }

  shouldShow(triggerDate: Date): boolean {
    const currentDate = moment(new Date());
    currentDate.subtract(10, "M");

    if (currentDate.toDate() < triggerDate) return false;

    return true;
  }

  isUrgent(compareDate: Date): boolean {
    const currentDate = moment(new Date());
    if (currentDate.toDate() > compareDate) return true;
    return false;
  }

  getDueDate(currentDate: Date): Date {
    return moment(currentDate).add(1, "y").toDate();
  }

  dbColumnName = "USSIROHU/ TURJATILGA KP";
  buttonText = "Vaata juhendit";
  redirectURL =
    "https://docs.google.com/document/d/1fJeYtNlLr8Bw_XJ18tr0bQcuupCYtaQAtK2Yfs7LhQo/edit?usp=sharing";
}
