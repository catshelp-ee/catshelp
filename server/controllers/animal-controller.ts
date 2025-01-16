import GoogleService from "../services/google-service.ts";
import fs from "node:fs";
import { CatFormData } from "../../src/types.ts";
import db from "../../models/index.cjs";
import { generateCatDescription } from "../services/ai-service.ts";

export async function postAnimal(req: any, res: any) {
  const googleService = await GoogleService.create();
  const formData: CatFormData = req.body;
  const rescueDate = formData.leidmis_kp;

  const animal = await db.Animal.create(process.env.CATS_SHEETS_ID);

  delete formData.pildid;
  const a = { id: animal.id, ...formData };

  await googleService.addDataToSheet(
    process.env.CATS_SHEETS_ID,
    "HOIUKODUDES",
    a
  );

  const animalRescue = await db.AnimalRescue.create({
    rescue_date: rescueDate,
  });

  const animalToAnimalRescue = await db.AnimalToAnimalRescue.create({
    animal_id: animal.id,
    animal_rescue_id: animalRescue.id,
  });
  res.json("Success");
}

export async function addPicture(req, res) {
  const googleService = await GoogleService.create();

  try {
    const catName = req.get("Cat-Name");
    const driveFolder = await googleService.createDriveFolder(catName);
    const folderID = driveFolder.data.id;
    let uploadedFiles = req.files.images;

    uploadedFiles = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];

    uploadedFiles.forEach((file, idx) => {
      const tempPath = file.tempFilePath;
      googleService.uploadToDrive(
        catName,
        fs.createReadStream(tempPath),
        folderID!
      );
    });

    return res.json("Pildid laeti üles edukalt");
  } catch (error) {
    return res.error("Tekkis tõrge piltide üles laadimisega:", error);
  }
}

export async function getProfile(req, res) {
  try {
    const ownerName = "Mari Oks";

    const googleService = await GoogleService.create();
    const sheetData = await googleService.getSheetData(
      process.env.CATS_SHEETS_ID,
      "HOIUKODUDES"
    );

    const columnNamesWithIndexes: { [key: string]: number } = {};
    const rows = sheetData.data.sheets![0].data;

    rows![0].rowData![0].values!.forEach((col, idx) => {
      if (col.formattedValue) {
        columnNamesWithIndexes[col.formattedValue] = idx;
      }
    });

    const catProfiles: any[] = [];
    for (const grid of rows) {
      for (const row of grid.rowData || []) {
        const values = row.values;
        const fosterhome =
          row.values![columnNamesWithIndexes["_HOIUKODU/ KLIINIKU NIMI"]];
        if (fosterhome.formattedValue! !== ownerName) continue;
        if (!values) continue;

        const catName =
          values[columnNamesWithIndexes["KASSI NIMI"]]?.formattedValue || "";
        const imageLink =
          values[columnNamesWithIndexes["PILT"]]?.hyperlink || "";
        const catProfile = {
          primaryInfo: {
            name: catName,
            image: "",
            rescueId:
              values[
                columnNamesWithIndexes["PÄÄSTETUD JÄRJEKORRA NR (AA'KK nr ..)"]
              ]?.formattedValue || "",
            location:
              values[columnNamesWithIndexes["ASUKOHT"]]?.formattedValue || "",
            dateOfBirth:
              values[columnNamesWithIndexes["SÜNNIAEG"]]?.formattedValue || "",
            gender:
              values[columnNamesWithIndexes["SUGU"]]?.formattedValue || "",
            color:
              values[columnNamesWithIndexes["KASSI VÄRV"]]?.formattedValue ||
              "",
            furLength:
              values[columnNamesWithIndexes["KASSI KARVA PIKKUS"]]
                ?.formattedValue || "",
            additionalNotes:
              values[columnNamesWithIndexes["TÄIENDAVAD MÄRKMED"]]
                ?.formattedValue || "",
            chipId:
              values[columnNamesWithIndexes["KIIP"]]?.formattedValue || "",
            rescueDate:
              values[columnNamesWithIndexes["PÄÄSTMISKP/ SÜNNIKP"]]
                ?.formattedValue || "",
          },
          moreInfo: {
            otherInfo:
              values[columnNamesWithIndexes["MUU"]]?.formattedValue || "",
          },
        };
        if (imageLink && isHyperlink(imageLink)) {
          const fileId = extractFileId(imageLink);
          if (fileId) {
            const destinationPath = `./public/Cats/${catName}.png`;
            const downloadSuccess = await googleService.downloadImage(
              fileId,
              destinationPath
            );
            if (downloadSuccess) {
              catProfile.primaryInfo.image = `Cats/${catName}.png`;
            }
          } else {
            console.warn(
              `Unable to extract fileId from imageLink: ${imageLink}`
            );
          }
        } else {
          console.warn(
            `Skipping image for ${catName} due to invalid or missing image link.`
          );
        }

        catProfiles.push(catProfile);
      }
    }
    console.log("Returning cat data:", catProfiles);
    res.json({ catProfiles });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
}

function isHyperlink(link: string): boolean {
  try {
    new URL(link);
    return true;
  } catch (_error) {
    console.warn(`Imagelink invalid, skip link: ${link}`);
    return false;
  }
}

function extractFileId(link: string): string | null {
  const match = link.match(/\/file\/d\/(.+?)\//);
  return match ? match[1] : null;
}

export async function genText(req: any, res: any) {
  try {
    const catInfo = req.body.formData;
    const description = await generateCatDescription(catInfo);
    if (!description || description.trim() === "") {
      return res
        .status(503)
        .json({ error: "AI tekstiloome pole hetkel saadaval" });
    }

    res.json({ description });
  } catch (error) {
    console.error("Error generating AI text:", error);
    res.status(500).json({ error: "Probleemid AI tekstiga" });
  }
}
