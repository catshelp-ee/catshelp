import { DashboardNotification } from "./notifications/DasboardNotification.ts";
import UssirohiNotification from "./notifications/UssirohiNotification.ts";
import BroneeriArstiAegNotification from "./notifications/BroneeriArstiAegNotification.ts";
import KompleksVaktsiiniKinnitusNotification from "./notifications/KompleksVaktsiiniKinnitusNotification.ts";
import MarutaudVaktsiiniKinnitusNotification from "./notifications/MarutaudVaktsiiniKinnitusNotification.ts";
import PoleKassiNotification from "./notifications/PoleKassiNotification.ts";
import GoogleService from "./google-service.ts";
import { google } from "googleapis";

type Result = {
    assignee: string;
    urgent: boolean;
    label: string;
    due: string;
    action: {
        label: string;
        redirect: string;
    };
    catColour: string;
};

export default class DashboardService {
    sheetColumnNamesWithIndex: { [key: string]: number } = {};
    rows = [];
    cats = [];
    userHasContract = false;
    username = "";
    colours = ["#b24747", "#b28747", "#8eb200", "#23b200", "#00b247", "#47b2b2", "#0047b2", "#2300b2", "#8e00b2", "#b24787"];
    googleService?: GoogleService = undefined;
    constructor(sheetsData: any, username: string, googleService: GoogleService) {
        this.googleService = googleService;
        this.username = username;

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
    notifications: DashboardNotification[] = [new UssirohiNotification(), new BroneeriArstiAegNotification(), new KompleksVaktsiiniKinnitusNotification(), new MarutaudVaktsiiniKinnitusNotification()];

    downloadImages(){
        let regex = /\/d\/(.*)\//;  // Capturing group has the id from the url in it
        const imageUrls: {image: string, name: string} = [];
        this.rows.forEach((row, index) => {
            const image = row[this.sheetColumnNamesWithIndex["PILT"]];
            const imageUrl = image.hyperlink;
            if (imageUrl === undefined){
                imageUrls.push({image: `missingCat.png`, name: this.cats[index]});
                return;
            };


            const imagePath = `Temp/${this.username}/${this.cats[index]}.png`

            this.googleService!.downloadImage(
                imageUrl.match(regex)[1],
                `./public/Temp/${this.username}/${this.cats[index]}.png`
            )
            
            imageUrls.push({image: `Temp/${this.username}/${this.cats[index]}.png`, name: this.cats[index]});
        })

        return imageUrls;
    }

    displayNotifications() {
        const results: Result[] = [];
        
        let result: Result;
        let triggerDate: Date;
        let dueDate: Date;


        for (let index = 0; index < this.rows.length; index++) {
            this.notifications.forEach((notification) => {
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
                    return;
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
                    catColour: this.colours[index],
                };

                if(notification.isUrgent(dueDate)){
                    result.urgent = true;
                }


                results.push(result);
            });
        }

        if(this.rows.length === 0){
            const notification = new PoleKassiNotification()
            const dueDate = new Date();

            result = {
                label: notification.getText(),
                assignee: "Sina ise",
                due: dueDate.toLocaleDateString("ru-RU", { timeZone: "UTC" }),
                action: {
                    label: notification.buttonText,
                    redirect: notification.redirectURL,
                },
                urgent: false,
                catColour: "#000",
            };

            results.push(result);
        }

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