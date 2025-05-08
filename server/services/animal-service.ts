import GoogleService from "./google-service.ts";
import db from "../../models/index.cjs";
import moment from "moment";

export async function getCatProfilesByOwner(
  ownerName: string,
  googleService: GoogleService
) {
  const sheetData = await googleService.getSheetData(
    process.env.CATS_SHEETS_ID,
    "HOIUKODUDES"
  );

  const rows = sheetData.data.sheets![0].data || [];

  const columnNamesWithIndexes: { [key: string]: number } = {};
  rows[0]?.rowData?.[0]?.values?.forEach((col, idx) => {
    if (col.formattedValue) {
      columnNamesWithIndexes[col.formattedValue] = idx;
    }
  });

  const catProfiles: any[] = [];

  for (const grid of rows) {
    for (const row of grid.rowData || []) {
      const values = row.values;
      if (!values) continue;

      const fosterhome =
        values[columnNamesWithIndexes["_HOIUKODU/ KLIINIKU NIMI"]];
      if (fosterhome?.formattedValue !== ownerName) continue;

      console.log("loll + " + [ownerName]);

      const catProfile = await buildCatProfile(
        values,
        columnNamesWithIndexes,
        googleService
      );
      catProfiles.push(catProfile);
    }
  }

  return catProfiles;
}

async function buildCatProfile(
  values: any[],
  columnMap: { [key: string]: number },
  googleService: any
) {
  const catName = values[columnMap["KASSI NIMI"]]?.formattedValue || "";
  const imageLink = values[columnMap["PILT"]]?.hyperlink || "";

  const appearance =
    values[columnMap["KASSI VÄRV"]]?.formattedValue +
      ", " +
      values[columnMap["KASSI KARVA PIKKUS"]]?.formattedValue || "";

  const procedures: string[] = getCatProcedures(columnMap, values);

  const animal = await db.Animal.findByPk(3);

  const characteristics: any = await getCharacteristics(animal.id);

  const catProfile = {
    title: animal.profileTitle || "",
    description: animal.description || "",
    name: catName,
    age: values[columnMap["SÜNNIAEG"]]?.formattedValue || "",
    appearance: appearance,
    procedures: procedures.join(", "),
    issues: characteristics.issues || "",
    rescueDate: values[columnMap["PÄÄSTMISKP/ SÜNNIKP"]]?.formattedValue || "",
    history: characteristics.history || "",
    characteristics: characteristics.characteristics || "",
    likes: characteristics.likes || "",
    descriptionOfCharacter: characteristics.descriptionOfCharacter || "",
    treatOtherCats: characteristics.treatOtherCats || "",
    treatDogs: characteristics.treatDogs || "",
    treatChildren: characteristics.treatChildren || "",
    outdoorsIndoors: characteristics.outdoorsIndoors || "",
    images: [],
  };

  if (imageLink && isHyperlink(imageLink)) {
    const fileId = extractFileId(imageLink);
    if (fileId) {
      const destinationPath = `./public/Cats/${catName}.png`;
      const success = await googleService.downloadImage(
        fileId,
        destinationPath
      );
      if (success) {
        catProfile.images.push(`Cats/${catName}.png`);
      }
    } else {
      console.warn(`Unable to extract fileId from imageLink: ${imageLink}`);
    }
  } else {
    console.warn(
      `Skipping image for ${catName} due to invalid or missing image link.`
    );
  }

  console.log(catProfile);
  return catProfile;
}

async function getCharacteristics(id: number) {
  const characteristics = await db.AnimalCharacteristic.findAll({
    where: {
      animalId: id,
    },
  });

  const characteristicsObject = {};
  characteristics.forEach((characteristic) => {
    characteristicsObject[characteristic.type] = characteristic.name;
  });

  return characteristicsObject;
}

function getCatProcedures(columnMap: any, values: any) {
  const procedures: string[] = [];

  if (values[columnMap["ASUKOHT"]]?.formattedValue === "JAH")
    procedures.push("Lõigatud");
  if (
    moment(new Date()).isBefore(
      moment(
        values[columnMap["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue.replaceAll(
          ".",
          "-"
        ),
        "DD-MM-YYYY"
      )
    )
  )
    procedures.push("Kompleksvaktsiin");
  if (
    moment(new Date()).isBefore(
      moment(
        values[columnMap["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue.replaceAll(
          ".",
          "-"
        ),
        "DD-MM-YYYY"
      )
    )
  )
    procedures.push("Marutaudi vaktsiin");
  if (values[columnMap["USSIROHU/ TURJATILGA KP"]]?.formattedValue !== "") {
    procedures.push("Ussirohi");
  }

  return procedures;
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
