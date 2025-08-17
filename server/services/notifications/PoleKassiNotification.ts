import { DashboardNotification } from './DasboardNotification';

export default class PoleKassiNotification implements DashboardNotification {
  getText(): string {
    return 'Teil pole kassi. Võta üks palun 🙏';
  }

  shouldShow(_triggerDate: Date): boolean {
    return true;
  }

  isUrgent(_compareDate: Date): boolean {
    return true;
  }

  getDueDate(currentDate: Date): Date {
    return currentDate;
  }

  dbColumnName = '';
  buttonText = 'Võtke kass';
  redirectURL = process.env.NO_CATS_REDIRECT!;
  cellIsEmpty = false;
}
