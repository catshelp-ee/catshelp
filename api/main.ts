import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import * as jwt from "jsonwebtoken";
import * as utils from "./utils.ts";
import * as dotenv from "dotenv";
import { CatFormData } from "../src/types.ts";
import { google } from "googleapis";
import { join } from "https://deno.land/std/path/mod.ts";
import fs from "node:fs";
import { MIMEType } from "node:util";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Neid ei tohi kasutada, muidu keerab perse
// DENO-l on enda API oleams failidega tegelemise jaoks
//import fs from "fs";
//import { fileURLToPath } from "url";
//import { dirname, join } from "path";

// Get the equivalent of __dirname
const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/")); // Get the directory path

// Check if a file exists
async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await Deno.stat(filePath);
    return true; // File exists
  } catch (err) {
    return false; // File doesn't exist
  }
}

// Ensure a directory exists
async function ensureDirectoryExists(dirPath: string): Promise<string> {
  try {
    // Check if the directory exists
    await Deno.stat(dirPath);
    return `Directory already exists: ${dirPath}`;
  } catch (err) {
    // Directory does not exist, create it
    if (err instanceof Deno.errors.NotFound) {
      try {
        await Deno.mkdir(dirPath, { recursive: true });
        return `Directory created: ${dirPath}`;
      } catch (mkdirErr) {
        return `Error creating directory: ${mkdirErr.message}`;
      }
    }
    throw new Error(`Error accessing directory: ${err.message}`);
  }
}

const isNull = (attr: string) => {
  if (attr === "") return null;
  return attr;
};

const fileExists = async (fileName: string): Promise<boolean> => {
  try {
    await Deno.stat(`./public/${fileName}`);
    return true; // The file exists
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false; // The file does not exist
    }
    throw error; // Re-throw other errors
  }
};

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/drive",
});

const client = await auth.getClient();

const drive = google.drive({
  version: "v3",
  auth: client,
});

app.use("/public", express.static(join(__dirname, "public")));

const createDriveFolder = (catName: string) => {
  var fileMetadata = {
    name: catName,
    mimeType: "application/vnd.google-apps.folder",
    parents: ["1_WfzFwV0623sWtsYwkp8RiYnCb2_igFd"],
    driveId: "0AAcl4FOHQ4b9Uk9PVA",
  };
  return drive.files.create({
    supportsAllDrives: true,
    requestBody: fileMetadata,
    fields: "id",
  });
};

const uploadToDrive = async (
  filename: string,
  catName: string,
  driveId: string
) => {
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    tiff: "image/tiff",
    svg: "image/svg+xml",
  };
  const lastDotIndex = filename.lastIndexOf(".");
  const ext = filename.slice(lastDotIndex + 1).toLowerCase();

  const requestBody = {
    name: filename,
    fields: "id",
    parents: [driveId],
  };

  const media = {
    mimetype: mimeTypes[ext],
    body: fs.createReadStream(`public/Cats/${catName}/${filename}`),
  };

  try {
    const file = await drive.files.create({
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
};

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const catName = req.get("Cat-Name");
    await ensureDirectoryExists(`./public/Cats/${catName}`);
    cb(null, `./public/Cats/${catName}`);
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname); // see tuleb muuta, et ei kirjutata samanimelisi üle
  },
});

const upload = multer({ storage: storage });
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ch",
});

app.post("/api/login", (req: any, res: any) => {
  const body = req.body;
  const id = body.id;
  const email = body.email;
  utils.sendRequest(id, email);
  res.json("Success");
});

app.get("/api/verify", (req: any, res: any) => {
  const token = req.query.token;
  if (token == null) return res.sendStatus(401);
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect("/dashboard");
  } catch (e) {
    res.sendStatus(401);
  }
});

/*


app.get("/kassid", (req, res) => {
  let q;
  if (req.query.nimi !== undefined) {
    q = "select * from kassid where nimi='" + req.query.nimi + "';";
  } else {
    q = "select * from kassid;";
  }
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.put("/kassid", (req, res) => {
  // update kassid
  // set ... = ...
  // where ... = ...;
  console.log(req.body);
});
*/
app.post("/api/animals", async (req: any, res: any) => {
  const formData: CatFormData = req.body;
  const rescueDate = formData.leidmis_kp;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const SHEETS_ID = process.env.CATS_SHEETS_ID;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insert into animals table
    const animalQuery = `
      INSERT INTO animals
      (name, birthday, description, status, chip_number, chip_registered_with_us)
      VALUES (NULL, NULL, NULL, NULL, NULL, NULL)
    `;

    db.query(animalQuery, async (err, animalResult) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: err.message }));
      }
      const animalId = animalResult.insertId;

      delete formData.pildid;
      const a = { id: animalId, ...formData };

      await sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: SHEETS_ID,
        range: "HOIUKODUDES",
        valueInputOption: "RAW",
        resource: {
          values: [Object.values(a)],
        },
      });

      // Insert into animal_rescues table
      const rescueQuery = `
        INSERT INTO animal_rescues
        (rank_nr, rescue_date, location, location_notes)
        VALUES (NULL, ?, NULL, NULL)
      `;
      db.query(rescueQuery, [rescueDate || null], (err, rescueResult) => {
        if (err) {
          return db.rollback(() =>
            res.status(500).json({ error: err.message })
          );
        }

        const rescueId = rescueResult.insertId;

        // Link the animal and the rescue in the animals_to_animal_rescues table
        const linkQuery = `
          INSERT INTO animals_to_animal_rescues
          (animal_id, animal_rescue_id)
          VALUES (?, ?)
        `;
        db.query(linkQuery, [animalId, rescueId], (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ error: err.message })
            );
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() =>
                res.status(500).json({ error: err.message })
              );
            }

            res.json({
              id: rescueId,
            });
          });
        });
      });
    });
  });
});

/*
app.get("/teated", (req, res) => {
  const q =
    `select teade from teated, kassid where` +
    ` nimi = '${req.query.nimi}' and kassid.id = kass_id;`;
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/hoiukodud", (req, res) => {
  const q = "select * from hoiukodud;";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/pildid", (req, res) => {
  const catName = req.query.nimi;
  fs.readdir(`./public/${catName}`, (err, files) => {
    if (files === undefined) {
      return res.json([
        `${req.protocol}://${req.get("host")}/public/Missing.png`,
      ]);
    }
    const fileUrls = files.map(
      (file) => `${req.protocol}://${req.get("host")}/public/${catName}/${file}`
    );
    res.json(fileUrls);
  });
  /*
  const images = [];
  console.log("tere");
  fs.readdir(`./public/${req.query.nimi}`, (err, files) => {
    if (err) {
      console.log("mida?");
      res.json("viga");
    }
    files.forEach((file) => {
      images.push(file);
    });
  });
  console.log(images);
  res.json(images);
});

*/
app.post("/api/pilt/lisa", upload.array("images", 10), async (req, res) => {
  const catName = req.get("Cat-Name");

  if (req.files.length === 0) {
    ensureDirectoryExists(`./public/${catName}`);
  }

  try {
    // Read the directory entries
    const driveFolder = await createDriveFolder(catName);
    const folderID = driveFolder.data.id;
    for await (const entry of Deno.readDir(`public/Cats/${catName}`)) {
      uploadToDrive(entry.name, catName, folderID!);
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }

  res.json("");
});
/*

app.get("/images", (req, res) => {
  const fileExists = checkFileExists(`./public/${req.query.nimi}.png`);
  if (fileExists)
    return res.sendFile(`public/${req.query.nimi}.png`, { root: "./" });
  return res.sendFile("public/Missing.png", { root: "./" });
});

*/
app.listen(8080, () => {
  console.log("connected to backend!");
});

/*const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });*/
