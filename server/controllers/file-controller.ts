import { Request, Response } from "express";
import { fileService } from "@services/files/file-service";
import { handleControllerError } from "@utils/error-handler";

export async function addPicture(req: Request, res: Response): Promise<void> {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ error: "No files provided" });
      return;
    }

    if (!req.body.driveId) {
      res.status(400).json({ error: "Drive folder ID is required" });
      return;
    }

    await fileService.uploadFiles(req.files, req.body.driveId);
    res.status(200).json({ success: true, message: "Pildid laeti üles edukalt" });
  } catch (error) {
    handleControllerError(error, res, "Failed to upload pictures");
  }
}