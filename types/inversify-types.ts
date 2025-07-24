const TYPES = {
  AnimalService: Symbol.for('AnimalService'),
  DashboardService: Symbol.for('DashboardService'),
  ImageService: Symbol.for('ImageService'),
  NotificationService: Symbol.for('NotificationService'),
  AuthService: Symbol.for('AuthService'),
  CharacteristicsService: Symbol.for('CharacteristicsService'),
  ProfileService: Symbol.for('ProfileService'),
  UserService: Symbol.for('UserService'),
  NodeCacheService: Symbol.for('NodeCacheService'),

  CatProfileBuilder: Symbol.for('CatProfileBuilder'),

  GoogleSheetsService: Symbol.for('GoogleSheetsService'),
  GoogleAuthService: Symbol.for('GoogleAuthService'),
  GoogleDriveService: Symbol.for('GoogleDriveService'),

  DashboardController: Symbol.for('DashboardController'),
  LoginController: Symbol.for('LoginController'),
  UserController: Symbol.for('UserController'),
  ProfileController: Symbol.for('ProfileController'),
  AddRescueController: Symbol.for('AddRescueController'),
  FileController: Symbol.for('FileController'),
  AnimalController: Symbol.for('AnimalController'),

  AuthorizationMiddleware: Symbol.for('AuthorizationMiddleware'),
  AnimalRepository: Symbol.for('AnimalRepository'),
  SyncSheetDataToDBJob: Symbol.for('SyncSheetDataToDBJob'),
  CronRunner: Symbol.for('CronRunner'),
};

export default TYPES;
