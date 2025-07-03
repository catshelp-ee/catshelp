import GoogleDriveService from "@services/google/google-drive-service";
import TYPES from "types/inversify-types";
import { inject, injectable } from "inversify";
//import fs from "node:fs";

@injectable()
export default class FileService {
  constructor(
    @inject(TYPES.GoogleDriveService) private googleDriveService: GoogleDriveService
  ){}

  /*async uploadFiles(files: any[], folderId: string): Promise<void> {
    const fileArray = Array.isArray(files) ? files : [files];
    
    const uploadPromises = fileArray.map(async (file) => {
      const tempPath = file.path;
      return await this.googleDriveService.uploadToDrive(
        file.originalname,
        fs.createReadStream(tempPath),
        folderId
      );
    });

    await Promise.all(uploadPromises);
  }*/
}
