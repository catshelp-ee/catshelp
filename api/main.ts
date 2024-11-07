import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import * as jwt from "jsonwebtoken";
import * as utils from "./utils.ts";

const app = express();
app.use(cors());
app.use(express.json());
// Neid ei tohi kasutada, muidu keerab perase
// DENO-l on enda API oleams failidega tegelemise jaoks
//import fs from "fs";
//import { fileURLToPath } from "url";
//import { dirname, join } from "path";

// <a href="http://localhost:3000/dashboard"></a>

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
//app.use("/public", express.static(join(__dirname, "public")));

/*const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const catName = req.get("Cat-Name");
    await ensureDirectoryExists(`./public/${catName}`);
    cb(null, `./public/${catName}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // see tuleb muuta, et ei kirjutata samanimelisi üle
  },
});

const upload = multer({ storage: storage });
*/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "catshelp",
});

/*router.post("/api", async (context) => {
  const body = await context.request.body.json();
  const id = body.id;
  const email = body.email;
  sendRequest(id, email);
});*/

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
// Get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function ensureDirectoryExists(dirPath) {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, create it
        fs.mkdir(dirPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            return reject(`Error creating directory: ${mkdirErr.message}`);
          }
          resolve(`Directory created: ${dirPath}`);
        });
      } else {
        // Directory exists
        resolve(`Directory already exists: ${dirPath}`);
      }
    });
  });
}

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

app.post("/api/animals", (req, res) => {
  const formData = req.body;
  const name = formData.nimi;
  const birthday = formData.synniaeg === "" ? null : `'${formData.synniaeg}'`;
  const chipNumber = formData.kiibi_nr;
  const isLLR = formData.llr === "jah";
  const q =
    "INSERT INTO animals" +
    "(name, birthday, description, status, notes, chip_number, chip_registered_with_us)" +
    `VALUES('${name}', ${birthday}, '', '', '', ${chipNumber}, ${isLLR});`;
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

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

app.post("/pilt/lisa", upload.array("images", 10), (req, res) => {
  const catName = req.get("Cat-Name");
  if (req.files.length === 0) {
    ensureDirectoryExists(`./public/${catName}`);
  }
  res.json("");
});

app.get("/images", (req, res) => {
  const fileExists = checkFileExists(`./public/${req.query.nimi}.png`);
  if (fileExists)
    return res.sendFile(`public/${req.query.nimi}.png`, { root: "./" });
  return res.sendFile("public/Missing.png", { root: "./" });
});

*/
app.listen(8000, () => {
  console.log("connected to backend!");
});

/*const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });*/
