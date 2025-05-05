import GoogleService from "../services/google-service.ts";
import fs from "node:fs";
import db from "../../models/index.cjs";
import { generateCatDescription } from "../services/ai-service.ts";
import { getCatProfilesByOwner } from "../services/animal-service.ts";

export async function postAnimal(req: any, res: any) {
  const googleService = await GoogleService.create();
  const formData = req.body;

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const animal = await db.Animal.create(process.env.CATS_SHEETS_ID);

  const animalRescue = await db.AnimalRescue.create({
    rescueDate: formattedDate,
    state: formData.maakond,
    address: formData.asula,
    locationNotes: formData.lisa,
  });

  const animalToAnimalRescue = await db.AnimalToAnimalRescue.create({
    animalId: animal.id,
    animalRescueId: animalRescue.id,
  });

  delete formData.pildid;
  const row = { id: animalRescue.rankNr, ...formData };

  await googleService.addDataToSheet(
    process.env.CATS_SHEETS_ID,
    "HOIUKODUDES",
    row
  );

  res.json(animalRescue.identifier);
}

export async function addPicture(req, res) {
  const googleService = await GoogleService.create();

  try {
    const catName = req.body.catName;
    const driveFolder = await googleService.createDriveFolder(catName);
    const folderID = driveFolder.data.id;
    let uploadedFiles = req.files;

    uploadedFiles = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];

    uploadedFiles.forEach((file, idx) => {
      const tempPath = file.path;
      googleService.uploadToDrive(
        file.originalname,
        fs.createReadStream(tempPath),
        folderID!
      );
    });

    return res.json("Pildid laeti üles edukalt");
  } catch (error) {
    return res.json("Tekkis tõrge piltide üles laadimisega: " + error);
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const googleService = await GoogleService.create();
    //const ownerName = req.body.ownerName;
    const ownerName = "markop";
    console.log([ownerName])
    const catProfiles = await getCatProfilesByOwner(ownerName, googleService);
    res.json({ catProfiles });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
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
