import path from 'node:path';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import 'express-async-errors';

import * as animalController from "./controllers/animal-controller";
import * as dashboardController from "./controllers/dashboard-controller";
import * as loginController from "./controllers/login-controller";
import * as userController from "./controllers/user-controller";

import { authenticate } from "./middleware/authorization-middleware";
import { cache } from '@middleware/caching-middleware';
import errorMiddleware from "./middleware/error-middleware";
import uploadImages from "./middleware/storage-middleware";

import CronRunner from "./cron/cron-runner";


dotenv.config();
//initializeRedis();

const rootDir = path.join(__dirname, '..');
const app = express();
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(rootDir, "dist")));
app.use('/images', express.static(path.join(__dirname, 'images')));

startCronRunner();

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
  console.log(`connected to backend on port ${process.env.BACKEND_PORT}!`);
});


function startCronRunner() {
  const runner = new CronRunner();
  runner.startCronJobs();
}
