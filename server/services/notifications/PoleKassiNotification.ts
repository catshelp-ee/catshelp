import { DashboardNotification } from "./DasboardNotification.ts";
import moment from "moment";

export default class PoleKassiNotification implements DashboardNotification {
  getText(): string {
    return "Teil pole kassi. Võta üks palun 🙏";
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
  redirectURL = process.env.NO_CAT_REDIRECT!;
}
