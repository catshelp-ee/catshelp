import { drive_v3, google } from 'googleapis';
import { inject, injectable } from 'inversify';
import fs from 'node:fs';
import path from 'node:path';
import TYPES from 'types/inversify-types';
import GoogleAuthService from './google-auth-service';

@injectable()
export default class GoogleDriveService {
  drive: drive_v3.Drive;
  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: GoogleAuthService
  ) {
    this.drive = google.drive({
      version: 'v3',
      auth: this.googleAuthService.getAuth(),
    });
  }

  async downloadImage(fileId: string, destinationPath: string): Promise<void> {
    try {
      if (fs.existsSync(destinationPath)) {
        return;
      }

      // Ensure the destination folder exists
      const folderPath = path.dirname(destinationPath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // Creates all missing folders
      }
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      const writeStream = fs.createWriteStream(destinationPath);
      await new Promise((resolve, reject) => {
        response.data
          .pipe(writeStream)
          .on('finish', () => resolve(true))
          .on('error', reject);
      });
    } catch (e) {
      throw new Error(`failed to download image with ID ${fileId}\n`, e);
    }
  }
}
