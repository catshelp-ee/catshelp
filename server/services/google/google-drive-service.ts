import { drive_v3, google } from 'googleapis';
import { inject, injectable } from 'inversify';
import fs from 'node:fs';
import path from 'node:path';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';
import GoogleAuthService from './google-auth-service';

const ALLOWED_DRIVE_MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  svg: 'image/svg+xml',
};

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

  async downloadImages(
    folderId: string,
    ownerName: string,
    profile: Profile
  ): Promise<boolean> {
    const res = await this.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, mimeType)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: 'drive',
      driveId: process.env.GOOGLE_DRIVE_ID,
    });

    await Promise.all(
      res.data.files.map(async file => {
        const filePath = `./images/${ownerName}/${file.name}`;
        try {
          await this.downloadImage(file.id, filePath);
          profile.images.push(`images/${ownerName}/${file.name}`);
        } catch (e) {
          console.error(e);
        }
      })
    );
    return true;
  }

  createDriveFolder(name: string) {
    const fileMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID],
      driveId: process.env.GOOGLE_DRIVE_ID,
    };
    return this.drive.files.create({
      supportsAllDrives: true,
      requestBody: fileMetadata,
      fields: 'id',
    });
  }

  async uploadToDrive(
    filename: string,
    filestream: fs.ReadStream,
    driveId: string
  ) {
    const lastDotIndex = filename.lastIndexOf('.');
    const ext = filename.slice(lastDotIndex + 1).toLowerCase();

    const requestBody = {
      name: filename,
      fields: 'id',
      parents: [driveId],
    };

    const media = {
      mimetype: ALLOWED_DRIVE_MIME_TYPES[ext],
      body: filestream,
    };

    try {
      const file = await this.drive.files.create({
        supportsAllDrives: true,
        requestBody,
        media: media,
        uploadType: 'resumable',
        fields: 'id',
      });
      return file.data.id;
    } catch (e) {
      throw new Error('Error uploading file to drive: ', e);
    }
  }
}
