import GoogleService from "../services/google-service.ts";
import rules from "./rules.json" with {type: "json"};
import fs from "node:fs";
import process from "node:process";

const DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const MONTHS_IN_MILLISECONDS = 30 * DAYS_IN_MILLISECONDS;
const YEARS_IN_MILLISECONDS = 12 * MONTHS_IN_MILLISECONDS;

interface ToDoResponse {
  assignee: string;
  urgent: boolean;
  label: string;
  due: string;
  action: {
    label: string;
    redirect: string;
  };
}

// TODO:
// 1. meelespea tabel
export async function getDashboard(req: any, res: any) {
  const username = req.params.name;
  const googleService = await GoogleService.create();
  const sheetsData = await googleService.getSheetData(
    process.env.CATS_SHEETS_ID!,
    "HOIUKODUDES"
  );

  const sheetData = sheetsData.data.sheets![0].data;

  const namesOfColumnsWithCorrespondingPositionIndex: {
    [key: string]: number;
  } = {};
  sheetData![0].rowData![0].values!.forEach((col: any, idx: number) => {
    if (!col.formattedValue) return;
    namesOfColumnsWithCorrespondingPositionIndex[col.formattedValue!] = idx;
  });

  const rows = findFosterHome(
    username,
    sheetData,
    namesOfColumnsWithCorrespondingPositionIndex["_HOIUKODU/ KLIINIKU NIMI"]
  );

  const cats: string[] = [];

  rows.forEach((row) => {
    const cat = row[namesOfColumnsWithCorrespondingPositionIndex["KASSI NIMI"]];
    cats.push(cat.formattedValue);
  });

  const [days, months, years] = rules.triggers[0].trigger_delta_time
    .split("/")
    .map(Number);
  const trigger = rules.triggers[0];

  let offset;
  let offset2;

  const response: ToDoResponse[] = [];
  const currentDate = new Date();
  const currentTime = currentDate.getTime();

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const [day, month, year] = row[
      namesOfColumnsWithCorrespondingPositionIndex[trigger.columns[0]]
    ].formattedValue
      .split(".")
      .map(Number);
    const triggerDate = new Date(Date.UTC(year, month - 1, day));

    const notifications = trigger.notifications;

    const triggerTime = triggerDate.getTime();

    // offset is added since in the config file
    // when comparing to the past the number is negative
    offset =
      days * DAYS_IN_MILLISECONDS +
      months * MONTHS_IN_MILLISECONDS +
      years * YEARS_IN_MILLISECONDS;

    currentDate.setTime(currentTime + offset);

    // It hasnt been longer than the specified time in the trigger
    if (triggerDate >= currentDate) {
      console.log("no trigger");
      console.log(currentDate);
      console.log(triggerDate);
      continue;
    }
    const dueDate = new Date();

    for (let index1 = 0; index1 < notifications.length; index1++) {
      const notification = notifications[index1];
      const [days, months, years] = notification.date_delta
        .split("/")
        .map(Number);
      const [days_latest, months_latest, years_latest] =
        notification.time.latest.split("/").map(Number);

      offset =
        days * DAYS_IN_MILLISECONDS +
        months * MONTHS_IN_MILLISECONDS +
        years * YEARS_IN_MILLISECONDS;
      currentDate.setTime(currentTime + offset);

      offset2 =
        days_latest * DAYS_IN_MILLISECONDS +
        months_latest * MONTHS_IN_MILLISECONDS +
        years_latest * YEARS_IN_MILLISECONDS;

      triggerDate.setTime(triggerTime + offset2);
      dueDate.setTime(triggerTime + offset + offset2);

      const todo: ToDoResponse = {
        label: notification.content,
        assignee: cats[index],
        due: dueDate.toLocaleDateString(),
        action: {
          label: notification.button.text,
          redirect: notification.button.redirect,
        },
        urgent: false,
      };

      if (notification.button.internal)
        todo.action.redirect = `${process.env.VITE_BACKEND_URL}${todo.action.redirect}`;
      if (triggerDate < currentDate) todo.urgent = true;

      response.push(todo);
    }
  }

  /*
  const [day, month, year] =
    rows[0][
      namesOfColumnsWithCorrespondingPositionIndex[trigger.columns[0]]
    ].formattedValue.split(".").map(Number);
  const triggerDate = new Date(Date.UTC(year, month - 1, day));
  const currentDate = new Date();

  const notifications = trigger.notifications;

  const currentTime = currentDate.getTime();
  const triggerTime = triggerDate.getTime();

  // offset is added since in the config file
  // when comparing to the past the number is negative
  let offset =
    days * DAYS_IN_MILLISECONDS +
    months * MONTHS_IN_MILLISECONDS +
    years * YEARS_IN_MILLISECONDS;

  currentDate.setTime(currentTime + offset);

  // It hasnt been longer than the specified time in the trigger
  if (triggerDate >= currentDate) {
    console.log("no trigger");
    console.log(currentDate);
    console.log(triggerDate);
    return;
  }

  const response: ToDoResponse[] = [];

  const dueDate = new Date();

  let offset2;

  for (let index = 0; index < notifications.length; index++) {
    const notification = notifications[index];
    const [days, months, years] = notification.date_delta
      .split("/")
      .map(Number);
    const [days_latest, months_latest, years_latest] = notification.time.latest
      .split("/")
      .map(Number);

    offset =
      days * DAYS_IN_MILLISECONDS +
      months * MONTHS_IN_MILLISECONDS +
      years * YEARS_IN_MILLISECONDS;
    currentDate.setTime(currentTime + offset);

    offset2 =
      days_latest * DAYS_IN_MILLISECONDS +
      months_latest * MONTHS_IN_MILLISECONDS +
      years_latest * YEARS_IN_MILLISECONDS;

    triggerDate.setTime(triggerTime + offset2);
    dueDate.setTime(triggerTime + offset + offset2);

    const todo: ToDoResponse = {
      label: notification.content,
      assignee: cats[0],
      due: dueDate.toLocaleDateString(),
      action: {
        label: notification.button.text,
        redirect: notification.button.redirect,
      },
      urgent: false,
    };

    if (notification.button.internal)
      todo.action.redirect = `${process.env.VITE_BACKEND_URL}${todo.action.redirect}`;
    if (triggerDate < currentDate) todo.urgent = true;

    response.push(todo);
  }*/

  console.log(response);
  return res.json(response);

  /*
    const fosterhomeCats: { [key: string]: any } = {
        pets: [],
        todos: [],
    };

    const pattern = new RegExp("(?<=/d/).+(?=/)");

    random?.forEach((grid) => {
        grid.rowData!.forEach(async (row) => {
            const fosterhome =
                row.values![columnNamesWithIndexes["_HOIUKODU/ KLIINIKU NIMI"]];
            if (fosterhome.formattedValue! !== "Mari Oks") return;

            const values = row.values!;
            const catName =
                values[columnNamesWithIndexes["KASSI NIMI"]].formattedValue;
            fosterhomeCats.pets.push({
                name: catName,
                image: `Cats/${catName}.png`,
            });
            if (
                new Date(
                    values[
                        columnNamesWithIndexes["JÄRGMISE VAKTSIINI AEG"]
                    ].formattedValue!
                ) < new Date()
            ) {
                console.log("overdue!");
                fosterhomeCats["todos"].push({
                    label: "Broneeri veterinaari juures vaktsineerimise aeg",
                    date: values[columnNamesWithIndexes["JÄRGMISE VAKTSIINI AEG"]]
                        .formattedValue,
                    assignee: catName,
                    action: "Broneeri aeg",
                    pet: catName,
                    urgent: true,
                    isCompleted: false,
                });
            }
            try {
                const stat = await Deno.stat(`./public/Cats/${catName}.png`);
                if (stat.isFile) {
                    console.log("The file exists.");
                } else {
                    console.log("The path exists but is not a file.");
                }
            } catch (error) {
                if (error instanceof Deno.errors.NotFound) {
                    // TODO: hyperlink voib olla undefined
                    const imageID =
                        values[columnNamesWithIndexes["PILT"]].hyperlink!.match(
                            pattern
                        )![0];

                    //TODO: kontrolli kas fail on juba kaustas olemas
                    const file = await drive.files.get(
                        {
                            supportsAllDrives: true,
                            fileId: imageID,
                            alt: "media",
                        },
                        { responseType: "stream" }
                    );

                    const destination = fs.createWriteStream(
                        `./public/Cats/${fosterhomeCats["pets"]["name"]}.png`
                    );

                    await new Promise((resolve) => {
                        file.data.pipe(destination);

                        destination.on("finish", () => {
                            resolve(true);
                        });
                    });
                    console.log("The file does not exist.");
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            }
        });
    });

    return res.json(fosterhomeCats);
    */
}

function findFosterHome(
  username: string,
  sheetData: any,
  usernameColIndex: number
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

function shiftDate(
  dateToShift: Date,
  days: number,
  months: number,
  years: number
) {
  dateToShift.setDate(dateToShift.getDate() + days);
  dateToShift.setMonth(dateToShift.getMonth() + months);
  dateToShift.setFullYear(dateToShift.getFullYear() + years);
}
