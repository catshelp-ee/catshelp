import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";

/**
 * Application Bootstrap and Server Setup
 * This file initializes the Express server for the CatsHelp backend,
 * setting up middleware, routes, and dependency injection.
 * It also starts cron jobs for background tasks.
 */

// Commented-out imports for potential future use or deprecated functionality
//import * as animalController from "./controllers/animal-controller";
import DashboardController from "./controllers/dashboard-controller";
//import * as loginController from "./controllers/login-controller";
//import * as userController from "./controllers/user-controller";
//import * as fileController from "./controllers/file-controller";
//import * as profileController from "./controllers/profile-controller"
import LoginController from "./controllers/login-controller";

import AuthorizationMiddleware from "./middleware/authorization-middleware";
import errorMiddleware from "./middleware/error-middleware";

import CronRunner from "./cron/cron-runner";

import DashboardService from "@services/dashboard/dashboard-service";
import TYPES from "types/inversify-types";
import { init } from "./container";
import ProfileController from "./controllers/profile-controller";


//initializeRedis();
async function bootstrap() {
  // Initialize dependency injection container
  const container = await init();
  const dashboardService = container.get<DashboardService>(TYPES.DashboardService);
  await dashboardService.init();
  const loginController = container.get<LoginController>(TYPES.LoginController);
  const dashboardController = container.get<DashboardController>(TYPES.DashboardController);
  const profileController = container.get<ProfileController>(TYPES.ProfileController);
  const auth = container.get<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware);

  const rootDir = path.join(__dirname, "..");
  const app = express();

  // Middleware setup
  app.use(
    cors({
      origin: process.env.VITE_FRONTEND_URL,
      methods: "GET,POST",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(rootDir, "dist")));
  app.use("/images", express.static(path.join(__dirname, "images")));
  // Custom middleware to inject a request-scoped container for dependency injection
  startCronRunner();

  // Public endpoints for authentication
  app.post("/api/login-google", (req, res) => {
    loginController.googleLogin(req, res);
  });
  app.post("/api/login-email", (req, res) => {
    loginController.emailLogin(req, res);
  });
  app.get("/api/verify", (req, res) => {
    loginController.verify(req, res);
  });
  app.post("/api/logout", (req, res) => {
    loginController.logout(req, res);
  });

  // Secure endpoints requiring authentication
  //app.post("/api/animals", authenticate, animalController.postAnimal); // Commented out for future implementation or deprecated
  //app.post("/api/images", authenticate, uploadImages, fileController.addPicture); // Commented out for future implementation or deprecated
  
  app.get("/api/user", auth.authenticate, loginController.googleLogin.bind(loginController));
  app.get("/api/animals/dashboard", auth.authenticate, dashboardController.getDashboard.bind(dashboardController));
  app.get("/api/animals/cat-profile", auth.authenticate, profileController.getProfile.bind(profileController));
  //app.put("/api/animals/cat-profile", authenticate, animalController.updatePet); // Commented out for future implementation or deprecated
  // Fallback for client-side routes (React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "dist", "index.html"));
  });

  app.use(errorMiddleware);

  app.listen(process.env.BACKEND_PORT, () => {
    console.log(`connected to backend on port ${process.env.BACKEND_PORT}!`);
  });


  function startCronRunner() {
    const runner = new CronRunner();
    runner.startCronJobs();
  }
}

bootstrap();
