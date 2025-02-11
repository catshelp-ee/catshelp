import DashboardService from "../services/dashboard-service.ts";
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

export async function getDashboard(req: any, res: any) {
  const username = req.params.name;
  const googleService = await GoogleService.create();
  const sheetsData = await googleService.getSheetData(
    process.env.CATS_SHEETS_ID!,
    "HOIUKODUDES"
  );

  const sheetData = sheetsData.data.sheets![0].data;

  const dashboardService = new DashboardService(sheetData, username);
  const response = dashboardService.displayNotifications();

  return res.json(response);
               /*
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

