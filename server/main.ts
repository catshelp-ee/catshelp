import path from 'node:path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import TYPES from 'types/inversify-types';

import { init } from './container';
/**
 * Application Bootstrap and Server Setup
 * This file initializes the Express server for the CatsHelp backend,
 * setting up middleware, routes, and dependency injection.
 * It also starts cron jobs for background tasks.
 */

import uploadImages from '@middleware/storage-middleware';
import AddRescueController from './controllers/add-rescue-controller';
import AnimalController from './controllers/animal-controller';
import DashboardController from './controllers/dashboard-controller';
import FileController from './controllers/file-controller';
import LoginController from './controllers/login-controller';
import ProfileController from './controllers/profile-controller';
import UserController from './controllers/user-controller';
import CronRunner from './cron/cron-runner';
import AuthorizationMiddleware from './middleware/authorization-middleware';
import errorMiddleware from './middleware/error-middleware';

dotenv.config();

async function bootstrap() {
  // Initialize dependency injection container
  const container = await init();

  const loginController = container.get<LoginController>(TYPES.LoginController);
  const userController = container.get<UserController>(TYPES.UserController);
  const fileController = container.get<FileController>(TYPES.FileController);
  const animalController = container.get<AnimalController>(
    TYPES.AnimalController
  );
  const addRescueController = container.get<AddRescueController>(
    TYPES.AddRescueController
  );
  const dashboardController = container.get<DashboardController>(
    TYPES.DashboardController
  );
  const profileController = container.get<ProfileController>(
    TYPES.ProfileController
  );
  const auth = container.get<AuthorizationMiddleware>(
    TYPES.AuthorizationMiddleware
  );
  const cron = container.get<CronRunner>(TYPES.CronRunner);

  const rootDir = path.join(__dirname, '..');
  const app = express();

  // Middleware setup
  app.use(
    cors({
      origin: process.env.VITE_FRONTEND_URL,
      methods: 'GET,POST',
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(rootDir, 'dist')));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  cron.startCronJobs();

  // Public endpoints for authentication
  app.post('/api/login-google', (req, res) => {
    loginController.googleLogin(req, res);
  });
  app.post('/api/login-email', (req, res) => {
    loginController.emailLogin(req, res);
  });
  app.get('/api/verify', (req, res) => {
    loginController.verify(req, res);
  });
  app.post('/api/logout', (req, res) => {
    loginController.logout(req, res);
  });

  // Secure endpoints requiring authentication
  app.post(
    '/api/animals',
    auth.authenticate,
    addRescueController.postAnimal.bind(addRescueController)
  );
  app.post(
    '/api/images',
    auth.authenticate,
    uploadImages,
    fileController.addPicture.bind(fileController)
  );

  app.get(
    '/api/user',
    auth.authenticate,
    userController.getUserData.bind(userController)
  );
  app.get(
    '/api/animals/dashboard',
    auth.authenticate,
    dashboardController.getDashboard.bind(dashboardController)
  );
  app.get(
    '/api/animals/cat-profile',
    auth.authenticate,
    profileController.getProfile.bind(profileController)
  );
  app.put(
    '/api/animals/cat-profile',
    auth.authenticate,
    animalController.updateAnimal.bind(animalController)
  ); // Commented out for future implementation or deprecated
  // Fallback for client-side routes (React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'dist', 'index.html'));
  });

  app.use(errorMiddleware);

  app.listen(process.env.BACKEND_PORT, () => {
    console.log(`connected to backend on port ${process.env.BACKEND_PORT}!`);
  });
}

bootstrap();
