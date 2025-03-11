import { DashboardNotification } from "./notifications/DasboardNotification.ts";
import UssirohiNotification from "./notifications/UssirohiNotification.ts";
import BroneeriArstiAegNotification from "./notifications/BroneeriArstiAegNotification.ts";
import VaktsiiniKinnitusNotification from "./notifications/VaktsiiniKinnitusNotification.ts";
import TaidaAnkeetNotification from "./notifications/TaidaAnkeetNotification.ts";

type Result = {
    assignee: string;
    urgent: boolean;
    label: string;
    due: string;
    action: {
        label: string;
        redirect: string;
    };
};

export default class DashboardService {
    sheetColumnNamesWithIndex: { [key: string]: number } = {};
    rows = [];
    cats = [];
    userHasContract = false;
    constructor(sheetsData: any, username: string) {
        sheetsData.cats![0].rowData![0].values!.forEach((col: any, idx: number) => {
            if (!col.formattedValue) return;
            this.sheetColumnNamesWithIndex[col.formattedValue!] = idx;
        });

        this.rows = findFosterHome(
            username,
            sheetsData.cats,
            this.sheetColumnNamesWithIndex["_HOIUKODU/ KLIINIKU NIMI"],
        );

        this.rows.forEach((row) => {
            const cat = row[this.sheetColumnNamesWithIndex["KASSI NIMI"]];
            this.cats.push(cat.formattedValue);
        });

        sheetsData.contracts![0].rowData![0].values!.forEach((col: any, idx: number) => {
            if (!col.formattedValue) return;
            this.sheetColumnNamesWithIndex[col.formattedValue!] = idx;
        });
    }
    notifications: DashboardNotification[] = [new UssirohiNotification(), new BroneeriArstiAegNotification(), new VaktsiiniKinnitusNotification()];

    displayNotifications() {
        const results: Result[] = [];


        const ankeetNotification = new TaidaAnkeetNotification();

        let result: Result = {
            label: ankeetNotification.getText(),
            assignee: "Sina ise",
            due: new Date().toLocaleDateString("ru-RU", { timeZone: "UTC" }),
            action: {
                label: ankeetNotification.buttonText,
                redirect: ankeetNotification.redirectURL,
            },
            urgent: this.userHasContract,
        };

        results.push(result)
        
        let triggerDate: Date;
        let dueDate: Date;

        this.notifications.forEach((notification) => {
            for (let index = 0; index < this.rows.length; index++) {
                const row = this.rows[index];

                const [day, month, year] =
                    row[
                        this.sheetColumnNamesWithIndex[
                            notification.dbColumnName
                        ]
                    ]
                        .formattedValue
                        .split(".")
                        .map(Number);

                triggerDate = new Date(Date.UTC(year, month - 1, day));
                if (!notification?.shouldShow(triggerDate)) {
                    continue;
                }
                
                dueDate = notification.getDueDate(triggerDate);

                result = {
                    label: notification.getText(),
                    assignee: this.cats[index],
                    due: dueDate.toLocaleDateString("ru-RU", { timeZone: "UTC" }),
                    action: {
                        label: notification.buttonText,
                        redirect: notification.redirectURL,
                    },
                    urgent: false,
                };

                if(notification.isUrgent(dueDate)){
                    result.urgent = true;
                }


                results.push(result);
            }
        });

        return results;
    }
}

function findFosterHome(
    username: string,
    sheetData: any,
    usernameColIndex: number,
) {
    const rowData = sheetData[0].rowData;
    let row;
    const rows = [];
    for (let index = 0; index < rowData.length; index++) {
        row = rowData[index].values;

        const fosterhome = row[usernameColIndex];

        if (fosterhome.formattedValue !== username) continue;

        rows.push(row);
    }
    return rows;
}
