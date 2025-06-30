// controllers/animal-controller.ts
import AnimalService from "@services/animal-service";
import fs from "node:fs";
import { prisma } from "server/prisma";
import { generateCatDescription } from "@services/ai-service";
import { Request, Response } from "express";
import { getUser } from "@services/user-service";
import { animalService, googleService } from "./initializer";

export async function postAnimal(req: Request, res: Response) {
  try {
    const formData = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const animal = await prisma.animal.create();

    const animalRescue = await prisma.animalRescue.create({
      data: {
        rescueDate: formattedDate,
        state: formData.state,
        address: formData.location,
        locationNotes: formData.notes,
      }
    });

    await prisma.animalToAnimalRescue.create({
      data: {
        animalId: animal.id,
        animalRescueId: animalRescue.id,
      }
    });

    delete formData.pildid;
    const row = { id: animalRescue.rankNr, ...formData };

    await googleService.addDataToSheet(
      process.env.CATS_SHEETS_ID,
      process.env.CATS_TABLE_NAME,
      row
    );

    const folderId = await createFolder(animalRescue.rankNr.toString());

    await prisma.animal.update({
      where: {
        id: animal.id
      },
      data:{
        driveId: folderId,
      }
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
    const user = await getUser(req.cookies.jwt);
    const catProfiles = await animalService.getCatProfilesByOwner(user);
    res.json({ profiles: catProfiles });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile data", debugMessage: error });
  }
}

export async function updatePet(req: Request, res: Response) {
  try {
    const catData = req.body;
    const cats = await AnimalService.getUserCats(catData.owner.email);
    await animalService.updateCatProfile(
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
