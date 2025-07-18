export interface DashboardNotification {
  getText(): string;
  isUrgent(compareDate: Date): boolean;
  shouldShow(triggerDate: Date): boolean;
  getDueDate(currentDate: Date): Date;
  cellIsEmpty: boolean;
  dbColumnName: string;
  buttonText: string;
  redirectURL: string;
}
