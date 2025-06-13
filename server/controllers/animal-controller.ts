// controllers/animal-controller.ts
import GoogleService from "@services/google-service.ts";
import AnimalService from "@services/animal-service.ts";
import fs from "node:fs";
import db from "@models/index.cjs";
import { generateCatDescription } from "@services/ai-service.ts";
import { Request, Response } from "express";

// Initialize services once
let googleService: GoogleService;
let catProfileService: AnimalService;

async function initializeServices() {
  if (!googleService) {
    googleService = await GoogleService.create();
    catProfileService = new AnimalService(googleService);
  }
}

// Initialize services when this module loads
initializeServices().catch(console.error);

export async function postAnimal(req: Request, res: Response) {
  try {
    await initializeServices(); // Ensure services are ready
    const formData = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const animal = await db.Animal.create(process.env.CATS_SHEETS_ID);
    const animalRescue = await db.AnimalRescue.create({
      rescueDate: formattedDate,
      state: formData.state,
      address: formData.location,
      locationNotes: formData.notes,
    });

    await db.AnimalToAnimalRescue.create({
      animalId: animal.id,
      animalRescueId: animalRescue.id,
    });

    delete formData.pildid;
    const row = { id: animalRescue.rankNr, ...formData };

    await googleService.addDataToSheet(
      process.env.CATS_SHEETS_ID,
      process.env.CATS_TABLE_NAME,
      row
    );

    const folderId = await createFolder(animalRescue.rankNr);
    animal.update({
      driveId: folderId,
    });
    res.json(folderId);
  } catch (error) {
    console.error("Error creating animal:", error);
    res.status(500).json({ error: "Failed to create animal record" });
  }
}

async function createFolder(catId: string) {
  const driveFolder = await googleService.createDriveFolder(catId);
  return driveFolder.data.id;
}

export async function addPicture(req: Request, res: Response) {
  try {
    await initializeServices();
    let uploadedFiles = req.files;
    const folderID = req.body.driveId;

    uploadedFiles = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];
    const uploadPromises = uploadedFiles.map((file) => {
      const tempPath = file.path;
      return googleService.uploadToDrive(
        file.originalname,
        fs.createReadStream(tempPath),
        folderID!
      );
    });

    await Promise.all(uploadPromises);
    res.json("Pildid laeti üles edukalt");
  } catch (error) {
    console.error("Error uploading pictures:", error);
    res.status(500).json({
      error: "Tekkis tõrge piltide üles laadimisega: " + error.message,
    });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    await initializeServices();
    const owner = req.query.owner;
    const catProfiles = await catProfileService.getCatProfilesByOwner(owner);
    res.json({ profiles: catProfiles });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile data", debugMessage: error });
  }
}

export async function updatePet(req: Request, res: Response) {
  try {
    await initializeServices();
    const catData = req.body;
    const cats = await getUserCats(catData.owner.email);
    await catProfileService.updateCatProfile(
      catData,
      cats?.find((cat) => cat.name === catData.name)
    );
    res.json("uuendatud edukalt");
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Failed to update pet data" });
  }
}

export async function genText(req: Request, res: Response) {
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
