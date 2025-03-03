import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { join } from "@std/path";
import * as animalController from "./controllers/animal-controller.ts";
import * as loginController from "./controllers/login-controller.ts";
import * as dashboardController from "./controllers/dashboard-controller.ts";
import * as userController from "./controllers/user-controller.ts";
import { authenticate } from "./middleware/authorization-middleware.ts";
import cookieParser from "cookie-parser";
import db from "../models/index.cjs";
import multer from "multer";

initializeDb();
dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Get the equivalent of __dirname
const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/")); // Get the directory path
app.use("/public", express.static(join(__dirname, "../public")));

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "../public/Temp")); // Specify the folder to save the uploaded files
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
app.post("/api/pilt/lisa", authenticate, upload.array("images"),animalController.addPicture);
app.get("/api/user", authenticate, userController.getUserData);
app.get("/api/animals/dashboard", authenticate, dashboardController.getDashboard);
app.get("/api/animals/cat-profile", authenticate, animalController.getProfile);
app.post("/api/animals/gen-ai-cat", authenticate, animalController.genText);

app.listen(process.env.BACKEND_PORT, () => {
  console.log("connected to backend!");
});

function initializeDb() {
  // Seda ei tohi eemaldada
  // Mingi fucked magic toimub siin, et peab vähemalt
  // üks kord kutsuma teda, muidu ei toimi
  db;
}
