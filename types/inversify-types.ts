
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
  AdminService: Symbol.for('AdminService'),

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
  AdminController: Symbol.for('AdminController'),

  AnimalRepository: Symbol.for('AnimalRepository'),
  AnimalRescueRepository: Symbol.for('AnimalRescueRepository'),
  AnimalCharacteristicRepository: Symbol.for('AnimalCharacteristicRepository'),
  FosterHomeRepository: Symbol.for('FosterHomeRepository'),
  UserRepository: Symbol.for('UserRepository'),
  RevokedTokenRepository: Symbol.for('RevokedTokenRepository'),
  TreatmentHistoryRepository: Symbol.for("TreatmentHistoryRepository"),
  FileRepository: Symbol.for("FileRepository"),

  AuthorizationMiddleware: Symbol.for('AuthorizationMiddleware'),

  CronRunner: Symbol.for('CronRunner'),
  SyncSheetDataToDBJob: Symbol.for('SyncSheetDataToDBJob'),
  SyncUserDataToDBJob: Symbol.for('SyncUserDataToDBJob'),
};

export default TYPES;
