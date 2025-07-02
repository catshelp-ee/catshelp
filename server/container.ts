import { Container } from "inversify";
import TYPES from "types/inversify-types";
import { DashboardService } from "@services/dashboard/dashboard-service";
import DashboardController from "./controllers/dashboard-controller";
import LoginController from "./controllers/login-controller";
import GoogleSheetsService from "@services/google/google-sheets-service";
import GoogleAuthService from "@services/google/google-auth-service";
import ImageService from "@services/files/image-service";
import GoogleDriveService from "@services/google/google-drive-service";
import NotificationService from "@notifications/notification-service";
import UserController from "./controllers/user-controller";
import ProfileController from "./controllers/profile-controller";
import AuthService from "@services/auth/auth-service";
import AnimalService from "@services/animal/animal-service";
import AnimalRepository from "./repositories/animal-repository";
import CharacteristicsService from "@services/animal/characteristics-service";
import CatProfileBuilder from "@services/animal/cat-profile-builder";
import ProfileService from "@services/profile/profile-service";
import UserService from "@services/user/user-service";
import NodeCacheService from "@services/cache/cache-service";
import AuthorizationMiddleware from "@middleware/authorization-middleware";

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

  const googleAuthService = await GoogleAuthService.create();

  // Use inRequestScope to create a new instance per HTTP request for services handling user-specific data.
  container.bind<GoogleSheetsService>(TYPES.GoogleSheetsService).to(GoogleSheetsService).inSingletonScope();
  container.bind<GoogleDriveService>(TYPES.GoogleDriveService).to(GoogleDriveService).inSingletonScope();
  container.bind<GoogleAuthService>(TYPES.GoogleAuthService).toConstantValue(googleAuthService);

  // Use inSingletonScope for services that should have a single instance across the application.
  container.bind<NodeCacheService>(TYPES.NodeCacheService).to(NodeCacheService).inSingletonScope();

  container.bind<ImageService>(TYPES.ImageService).to(ImageService).inSingletonScope();
  container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService).inSingletonScope();
  container.bind<CharacteristicsService>(TYPES.CharacteristicsService).to(CharacteristicsService).inSingletonScope();
  container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
  
  container.bind<DashboardService>(TYPES.DashboardService).to(DashboardService).inRequestScope();
  container.bind<ProfileService>(TYPES.ProfileService).to(ProfileService).inRequestScope();
  container.bind<AnimalService>(TYPES.AnimalService).to(AnimalService).inRequestScope();
  container.bind<UserService>(TYPES.UserService).to(UserService).inRequestScope();
  

  container.bind<CatProfileBuilder>(TYPES.CatProfileBuilder).to(CatProfileBuilder).inSingletonScope();

  container.bind<DashboardController>(TYPES.DashboardController).to(DashboardController).inRequestScope();
  container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController).inRequestScope();
  container.bind<UserController>(TYPES.UserController).to(UserController).inRequestScope();
  container.bind<LoginController>(TYPES.LoginController).to(LoginController).inSingletonScope();

  container.bind<AnimalRepository>(TYPES.AnimalRepository).to(AnimalRepository).inSingletonScope();
  container.bind<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware).to(AuthorizationMiddleware).inSingletonScope();

  return container;
}

export { init };
