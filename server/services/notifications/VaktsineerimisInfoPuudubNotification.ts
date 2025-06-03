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
  redirectURL = process.env.MISSING_INFO_REDIRECT!;
}
