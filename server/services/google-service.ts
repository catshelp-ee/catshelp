import { google } from "googleapis";
import fs from "node:fs";
import moment from "moment";
import path from "node:path";

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

  public createDriveFolder(name: string) {
    var fileMetadata = {
      name: name,
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
    const row = new Array(30).fill("");

    row[0] = data.id;
    row[1] = data.id;
    row[17] = moment(new Date(), "DD.MM.YYYY").toDate().toString();
    row[20] = `${data.state}, ${data.location}`;
    row[30] = data.notes;
    await this.sheets.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId: sheetId,
      range: tabName,
      valueInputOption: "RAW",
      resource: {
        values: [row],
      },
    });
  }

  public async updateSheetCells(
    sheetId: string,
    tabName: string,
    find: any,
    data: any
  ) {
    const sheetData = await this.getSheetData(sheetId, tabName);

    const rows = sheetData.data.sheets![0].data || [];
    const pageID = sheetData.data.sheets![0].properties.sheetId;

    const columnNamesWithIndexes: { [key: string]: number } = {};
    rows[0]?.rowData?.[0]?.values?.forEach((col, idx) => {
      if (col.formattedValue) {
        columnNamesWithIndexes[col.formattedValue] = idx;
      }
    });

    let catRow;

    let rowIndex = 0;

    for (const grid of rows) {
      for (const row of grid.rowData || []) {
        rowIndex++;
        const values = row.values;
        if (!values) continue;

        const fosterhome =
          values[columnNamesWithIndexes["_HOIUKODU/ KLIINIKU NIMI"]];
        if (fosterhome?.formattedValue !== data.owner.name) continue;
        const cat = values[columnNamesWithIndexes["KASSI NIMI"]];

        if (cat?.formattedValue !== data.name) continue;

        catRow = row;
        break;
      }
      if (catRow) break;
    }

    const updateRequests: any = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!(key in find)) return;
      const columnIndex = columnNamesWithIndexes[find[key]];
      updateRequests.push({
        updateCells: {
          start: {
            sheetId: pageID,
            rowIndex: rowIndex - 1,
            columnIndex,
          },
          rows: [
            {
              values: [
                {
                  userEnteredValue: { stringValue: value },
                },
              ],
            },
          ],
          fields: "userEnteredValue",
        },
      });
    });
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: updateRequests },
      });
    } catch (e) {
      console.warn(e);
    }
  }

  public async downloadImages(
    folderId: string,
    ownerName: string,
    catProfile: any
  ): Promise<boolean> {
    const res = await this.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name, mimeType)",
      supportsAllDrives: true, // ✅ Key for shared drives!
      includeItemsFromAllDrives: true, // ✅ Also needed
      corpora: "drive", // Use 'drive' instead of 'user'
      driveId: "0AAcl4FOHQ4b9Uk9PVA", // 🔑 Required for shared drives
    });

    await Promise.all(
      res.data.files.map(async (file) => {
        const filePath = `./public/Temp/${ownerName}/${file.name}`;
        await this.downloadImage(file.id, filePath);
        catProfile.images.push(`Temp/${ownerName}/${file.name}`);
      })
    );

    return true;
  }

  public async downloadImage(
    fileId: string,
    destinationPath: string
  ): Promise<boolean> {
    try {
      if (fs.existsSync(destinationPath)) {
        return false; // Return false because the image already exists
      }

      // Ensure the destination folder exists
      const folderPath = path.dirname(destinationPath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // Creates all missing folders
      }
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

      return true;
    } catch (error) {
      console.error(`failed to download image with ID ${fileId}:`, error);
      return false;
    }
  }
}
