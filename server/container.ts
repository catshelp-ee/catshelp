import AuthorizationMiddleware from '@middleware/authorization-middleware';
import NotificationService from '@notifications/notification-service';
import AnimalService from '@services/animal/animal-service';
import CatProfileBuilder from '@services/animal/cat-profile-builder';
import CharacteristicsService from '@services/animal/characteristics-service';
import AuthService from '@services/auth/auth-service';
import DashboardService from '@services/dashboard/dashboard-service';
import ImageService from '@services/files/image-service';
import GoogleAuthService from '@services/google/google-auth-service';
import GoogleDriveService from '@services/google/google-drive-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import UserService from '@services/user/user-service';
import { Container } from 'inversify';
import TYPES from 'types/inversify-types';

import AnimalCharacteristicRepository from '@repositories/animal-characteristic-repository';
import AnimalRescueRepository from '@repositories/animal-rescue-repository';
import FosterHomeRepository from '@repositories/foster-home-repository';
import TreatmentHistoryRepository from '@repositories/treatment-history-repository';
import UserRepository from '@repositories/user-repository';
import AddRescueController from './controllers/add-rescue-controller';
import AnimalController from './controllers/animal-controller';
import DashboardController from './controllers/dashboard-controller';
import FileController from './controllers/file-controller';
import LoginController from './controllers/login-controller';
import ProfileController from './controllers/profile-controller';
import UserController from './controllers/user-controller';
import CronRunner from './cron/cron-runner';
import SyncSheetDataToDBJob from './cron/jobs/sync-sheets-to-db-job';
import AnimalRepository from './repositories/animal-repository';

/**
 * Dependency Injection Container Setup
 * This file configures the Inversify container for dependency injection,
 * binding services, controllers, and repositories to their respective types.
 * The container manages the lifecycle of these components based on defined scopes.
 */

// Create the container
let container: Container;

async function init() {
  container = new Container();

  // ─── External Auth Provider ─────────────────────────────────────
  const googleAuthService = await GoogleAuthService.create();
  container
    .bind<GoogleAuthService>(TYPES.GoogleAuthService)
    .toConstantValue(googleAuthService);

  // ─── Core/Infrastructure Services ───────────────────────────────

  // ─── External Google Services ───────────────────────────────────
  container
    .bind<GoogleSheetsService>(TYPES.GoogleSheetsService)
    .to(GoogleSheetsService)
    .inSingletonScope();
  container
    .bind<GoogleDriveService>(TYPES.GoogleDriveService)
    .to(GoogleDriveService)
    .inSingletonScope();

  // ─── Application Services ───────────────────────────────────────
  container
    .bind<AuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();
  container
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();
  container
    .bind<AnimalService>(TYPES.AnimalService)
    .to(AnimalService)
    .inSingletonScope();
  container
    .bind<DashboardService>(TYPES.DashboardService)
    .to(DashboardService)
    .inSingletonScope();
  container
    .bind<NotificationService>(TYPES.NotificationService)
    .to(NotificationService)
    .inSingletonScope();
  container
    .bind<ImageService>(TYPES.ImageService)
    .to(ImageService)
    .inSingletonScope();
  container
    .bind<CharacteristicsService>(TYPES.CharacteristicsService)
    .to(CharacteristicsService)
    .inSingletonScope();
  container
    .bind<CatProfileBuilder>(TYPES.CatProfileBuilder)
    .to(CatProfileBuilder)
    .inSingletonScope();

  // ─── Repositories ───────────────────────────────────────────────
  container
    .bind<AnimalRepository>(TYPES.AnimalRepository)
    .to(AnimalRepository)
    .inSingletonScope();
  container
    .bind<AnimalRescueRepository>(TYPES.AnimalRescueRepository)
    .to(AnimalRescueRepository)
    .inSingletonScope();
  container
    .bind<AnimalCharacteristicRepository>(TYPES.AnimalCharacteristicRepository)
    .to(AnimalCharacteristicRepository)
    .inSingletonScope();
  container
    .bind<FosterHomeRepository>(TYPES.FosterHomeRepository)
    .to(FosterHomeRepository)
    .inSingletonScope();
  container
    .bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
  container
    .bind<TreatmentHistoryRepository>(TYPES.TreatmentHistoryRepository)
    .to(TreatmentHistoryRepository)
    .inSingletonScope();

  // ─── Controllers ────────────────────────────────────────────────
  container
    .bind<DashboardController>(TYPES.DashboardController)
    .to(DashboardController)
    .inSingletonScope();
  container
    .bind<ProfileController>(TYPES.ProfileController)
    .to(ProfileController)
    .inSingletonScope();
  container
    .bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope();
  container
    .bind<LoginController>(TYPES.LoginController)
    .to(LoginController)
    .inSingletonScope();
  container
    .bind<AddRescueController>(TYPES.AddRescueController)
    .to(AddRescueController)
    .inSingletonScope();
  container
    .bind<FileController>(TYPES.FileController)
    .to(FileController)
    .inSingletonScope();
  container
    .bind<AnimalController>(TYPES.AnimalController)
    .to(AnimalController)
    .inSingletonScope();

  // ─── Middleware ─────────────────────────────────────────────────
  container
    .bind<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware)
    .to(AuthorizationMiddleware)
    .inSingletonScope();

  // ─── Cron jobs ───────────────────────────────────────────────────
  container
    .bind<SyncSheetDataToDBJob>(TYPES.SyncSheetDataToDBJob)
    .to(SyncSheetDataToDBJob)
    .inSingletonScope();

  container
    .bind<CronRunner>(TYPES.CronRunner)
    .to(CronRunner)
    .inSingletonScope();

  return container;
}

export { init };
