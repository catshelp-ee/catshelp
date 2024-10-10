import express from "express";
import mysql from "mysql2";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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

const app = express();
app.use(cors());
app.use(express.json());
app.use("/public", express.static(join(__dirname, "public")));

const storage = multer.diskStorage({
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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "catshelp",
});

app.get("/", (req, res) => {
  res.json("Tere backendist!");
});

app.get("/kassid", (req, res) => {
  const q = "select * from kassid where nimi='" + req.query.nimi + "'";
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

app.get("/kassid", (req, res) => {
  const q = "select * from kassid;";
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
  */
});

app.post("/pilt/lisa", upload.array("images", 10), (req, res) => {
  const catName = req.get("Cat-Name");
  console.log(catName);
  res.json("");
});

app.get("/images", (req, res) => {
  const fileExists = checkFileExists(`./public/${req.query.nimi}.png`);
  if (fileExists)
    return res.sendFile(`public/${req.query.nimi}.png`, { root: "./" });
  return res.sendFile("public/Missing.png", { root: "./" });
});

app.listen(8080, () => {
  console.log("connected to backend!");
});
