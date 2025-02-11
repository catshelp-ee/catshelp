export interface DashboardNotification {
    getText(): string;
    isUrgent(compareDate: Date): boolean;
    shouldShow(triggerDate: Date): boolean;
    dbColumnName: string;
    buttonText: string;
    redirectURL: string;
}
