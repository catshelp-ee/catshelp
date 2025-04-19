import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as animalController from "./controllers/animal-controller.ts";
import * as loginController from "./controllers/login-controller.ts";
import * as dashboardController from "./controllers/dashboard-controller.ts";
import * as userController from "./controllers/user-controller.ts";
import { authenticate } from "./middleware/authorization-middleware.ts";
import cookieParser from "cookie-parser";
import db from "../models/index.cjs";
import multer from "multer";
import CronRunner from "./cron/cron-runner.ts";

dotenv.config();
initializeDb();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
startCronRunner();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
app.use(express.static("dist"));

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(rootDir, "public", "Temp")); // Specify the folder to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename
  },
});

// Set file upload limits and filter (optional)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error("Invalid file type"), false); // Reject non-image files
    }
  },
});

//Public endpoints
app.post("/api/login-google", loginController.googleLogin);
app.post("/api/login-email", loginController.emailLogin);
app.get("/api/verify", loginController.verify);
app.post("/api/logout", loginController.logout);

//Secure endpoints
app.post("/api/animals", authenticate, animalController.postAnimal);
app.post("/api/pilt/lisa", authenticate, upload.array("images"), animalController.addPicture);
app.get("/api/user", authenticate, userController.getUserData);
app.get("/api/animals/dashboard/:name", authenticate, dashboardController.getDashboard);
app.get("/api/animals/cat-profile", authenticate, animalController.getProfile);
app.post("/api/animals/gen-ai-cat", authenticate, animalController.genText);

// Fallback for client-side routes (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log("connected to backend!");
});

function initializeDb() {
  // Seda ei tohi eemaldada
  // Mingi fucked magic toimub siin, et peab vähemalt
  // üks kord kutsuma teda, muidu ei toimi
  db;
}

function startCronRunner() {
  const runner = new CronRunner();
  runner.startCronJobs();
}
