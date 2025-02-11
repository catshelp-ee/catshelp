import { DashboardNotification } from "./notifications/DasboardNotification.ts";
import UssirohiNotification from "./notifications/UssirohiNotification.ts";
import moment from "moment";

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
    constructor(sheetData: any, username: string) {
        sheetData![0].rowData![0].values!.forEach((col: any, idx: number) => {
            if (!col.formattedValue) return;
            this.sheetColumnNamesWithIndex[col.formattedValue!] = idx;
        });

        this.rows = findFosterHome(
            username,
            sheetData,
            this.sheetColumnNamesWithIndex["_HOIUKODU/ KLIINIKU NIMI"],
        );

        this.rows.forEach((row) => {
            const cat = row[this.sheetColumnNamesWithIndex["KASSI NIMI"]];
            this.cats.push(cat.formattedValue);
        });
    }
    notifications: DashboardNotification[] = [new UssirohiNotification()];

    displayNotifications() {
        const results: Result[] = [];
        let triggerDate;
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

                triggerDate = moment(triggerDate).add(1, 'y').toDate();

                const result: Result = {
                    label: notification.getText(),
                    assignee: this.cats[index],
                    due: triggerDate.toLocaleDateString("ru-RU", { timeZone: "UTC" }),
                    action: {
                        label: notification.buttonText,
                        redirect: notification.redirectURL,
                    },
                    urgent: false,
                };

                if(notification.isUrgent(triggerDate)){
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
