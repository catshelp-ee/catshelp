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
import db from "@models/index.cjs";
import CronRunner from "./cron/cron-runner.ts";
import errorMiddleware from "./middleware/error-middleware.ts";
import uploadImages from "./middleware/storage-middleware.ts";
import 'express-async-errors';
import {initializeRedis, cache} from "./middleware/caching-middleware.ts";

dotenv.config();
initializeDb();
await initializeRedis();

const app = express();
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("dist"));

startCronRunner();


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

//Public endpoints
app.post("/api/login-google", loginController.googleLogin);
app.post("/api/login-email", loginController.emailLogin);
app.get("/api/verify", loginController.verify);
app.post("/api/logout", loginController.logout);

//Secure endpoints
app.post("/api/animals", authenticate, animalController.postAnimal);
app.post("/api/pilt/lisa", authenticate, uploadImages, animalController.addPicture);
app.get("/api/user", authenticate, userController.getUserData);
app.get("/api/animals/dashboard", authenticate, cache, dashboardController.getDashboard);
app.get("/api/animals/cat-profile", authenticate, cache, animalController.getProfile);
app.put("/api/animals/cat-profile", authenticate, animalController.updatePet);
app.post("/api/animals/gen-ai-cat", authenticate, animalController.genText);

// Fallback for client-side routes (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

app.use(errorMiddleware);

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
