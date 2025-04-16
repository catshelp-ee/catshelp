export interface DashboardNotification {
    getText(): string;
    isUrgent(compareDate: Date): boolean;
    shouldShow(triggerDate: Date): boolean;
    getDueDate(currentDate: Date): Date;
    dbColumnName: string;
    buttonText: string;
    redirectURL: string;
}
