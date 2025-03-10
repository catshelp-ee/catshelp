import GoogleService from "../services/google-service.ts";
import fs from "node:fs";

// TODO:
// 1. query paramina hooldekodu nime kaudu otsimine
// 2. meelespea tabel
export async function getDashboard(req, res) {
    const googleService = await GoogleService.create();
    const rows = googleService.getSheetData(process.env.CATS_SHEETS_ID, "HOIUKODUDES")

    const random = rows.data.sheets![0].data;
    const columnNamesWithIndexes: { [key: string]: number } = {};

    random![0].rowData![0].values!.forEach((col, idx) => {
        if (!col.formattedValue) return;
        columnNamesWithIndexes[col.formattedValue!] = idx;
    });

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
};