import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class VaktsineerimiseInfoPuudubNotification
  implements DashboardNotification
{
  getText(): string {
    return "Info vaktsineerimise või ussirohu kohta puudub";
  }

  shouldShow(triggerDate: Date): boolean {
    return true;
  }

  isUrgent(compareDate: Date): boolean {
    return true;
  }

  getDueDate(currentDate: Date): Date {
    return new Date();
  }

  dbColumnName = "";
  buttonText = "Täida infot profiili vaates";
  redirectURL =
    "https://docs.google.com/document/d/1fJeYtNlLr8Bw_XJ18tr0bQcuupCYtaQAtK2Yfs7LhQo/edit?usp=sharing";
}
