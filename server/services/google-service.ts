import { google } from "googleapis";
import fs from "node:fs";

export default class GoogleService {
  private auth;
  private drive;
  private sheets;

  private allowedDriveMimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    tiff: "image/tiff",
    svg: "image/svg+xml",
  };

  private constructor(auth, drive, sheets) {
    this.auth = auth;
    this.drive = drive;
    this.sheets = sheets;
  }

  static async create() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
      clientOptions: {
        subject: "markopeedosk@catshelp.ee",
      },
    });
    const client = await auth.getClient();

    const drive = google.drive({
      version: "v3",
      auth: client,
    });

    const sheets = google.sheets({
      version: "v4",
      auth: client,
    });

    return new GoogleService(auth, drive, sheets);
  }

  public createDriveFolder(catName: string) {
    var fileMetadata = {
      name: catName,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1_WfzFwV0623sWtsYwkp8RiYnCb2_igFd"],
      driveId: "0AAcl4FOHQ4b9Uk9PVA",
    };
    return this.drive.files.create({
      supportsAllDrives: true,
      requestBody: fileMetadata,
      fields: "id",
    });
  }

  public async uploadToDrive(
    filename: string,
    filestream: fs.ReadStream,
    driveId: string
  ) {
    const lastDotIndex = filename.lastIndexOf(".");
    const ext = filename.slice(lastDotIndex + 1).toLowerCase();

    const requestBody = {
      name: filename,
      fields: "id",
      parents: [driveId],
    };

    const media = {
      mimetype: this.allowedDriveMimeTypes[ext],
      body: filestream,
    };

    try {
      const file = await this.drive.files.create({
        supportsAllDrives: true,
        requestBody,
        media: media,
        uploadType: "resumable",
        fields: "id",
      });
      return file.data.id;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  public async getSheetData(sheetId: string, tabName: string) {
    const rows = await this.sheets.spreadsheets.get({
      auth: this.auth,
      spreadsheetId: sheetId,
      ranges: [tabName],
      includeGridData: true,
    });
    return rows;
  }

  public async addDataToSheet(sheetId: string, tabName: string, data: any) {
    await this.sheets.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId: sheetId,
      range: tabName,
      valueInputOption: "RAW",
      resource: {
        values: [Object.values(data)],
      },
    });
  }

  public async downloadImage(
    fileId: string,
    destinationPath: string
  ): Promise<boolean> {
    try {
      const response = await this.drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" }
      );

      const writeStream = fs.createWriteStream(destinationPath);
      await new Promise((resolve, reject) => {
        response.data
          .pipe(writeStream)
          .on("finish", () => resolve(true))
          .on("error", reject);
      });

      console.log(`Image downloaded and saved to: ${destinationPath}`);
      return true;
    } catch (error) {
      console.error(`failed to download image with ID ${fileId}:`, error);
      return false;
    }
  }
}
