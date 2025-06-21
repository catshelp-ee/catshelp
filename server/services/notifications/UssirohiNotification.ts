import { DashboardNotification } from "./DasboardNotification";
import moment from "moment";

export default class UssirohiNotification implements DashboardNotification {
  getText(): string {
    if (this.cellIsEmpty)
      return "Kompleksvaktsiini info puudub";
    return "Anna vähemalt 2 kuud enne vaktsineerimist ussirohi";
  }

  shouldShow(triggerDate: Date): boolean {
    const currentDate = moment(new Date());
    currentDate.subtract(10, "M");

    return currentDate.toDate() > triggerDate;
  }

  isUrgent(compareDate: Date): boolean {
    const currentDate = moment(new Date());
    return currentDate.toDate() > compareDate;
  }

  getDueDate(currentDate: Date): Date {
    return moment(currentDate).add(1, "y").toDate();
  }

  dbColumnName = "USSIROHU/ TURJATILGA KP";
  buttonText = "Vaata juhendit";
  redirectURL = process.env.WORD_MED_REDIRECT!;
  cellIsEmpty = false;
}
