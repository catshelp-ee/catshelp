import GoogleService from "../services/google-service.ts";
import fs from "node:fs";
import { CatFormData } from "../../src/types.ts";
import db from "../../models/index.cjs";

export async function postAnimal (req: any, res: any) {
    const googleService = await GoogleService.create();
    const formData: CatFormData = req.body;
    const rescueDate = formData.leidmis_kp;

    const animal = await db.Animal.create(process.env.CATS_SHEETS_ID);

    delete formData.pildid;
    const a = { id: animal.id, ...formData };

    await googleService.addDataToSheet(process.env.CATS_SHEETS_ID, "HOIUKODUDES", a);

    const animalRescue = await db.AnimalRescue.create({
        rescue_date: rescueDate,
    });

    const animalToAnimalRescue = await db.AnimalToAnimalRescue.create({
        animal_id: animal.id,
        animal_rescue_id: animalRescue.id,
    });
    res.json("Success");
};

export async function addPicture(req, res) {
    const googleService = await GoogleService.create();

    try {
        const catName = req.get("Cat-Name");
        const driveFolder = await googleService.createDriveFolder(catName);
        const folderID = driveFolder.data.id;
        let uploadedFiles = req.files.images;

        uploadedFiles = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

        uploadedFiles.forEach((file, idx) => {
            const tempPath = file.tempFilePath;
            googleService.uploadToDrive(catName, fs.createReadStream(tempPath), folderID!);
        });

        return res.json("Pildid laeti üles edukalt");
    } catch (error) {
        return res.error("Tekkis tõrge piltide üles laadimisega:", error);
    }
};