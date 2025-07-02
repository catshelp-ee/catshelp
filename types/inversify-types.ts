const TYPES = {
  AnimalService: Symbol.for("AnimalService"),
  DashboardService: Symbol.for("DashboardService"),
  ImageService: Symbol.for("ImageService"),
  NotificationService: Symbol.for("NotificationService"),
  AuthService: Symbol.for("AuthService"),
  CharacteristicsService: Symbol.for("CharacteristicsService"),
  FileService: Symbol.for("FileService"),
  ProfileService: Symbol.for("ProfileService"),
  UserService: Symbol.for("UserService"),

  CatProfileBuilder: Symbol.for("CatProfileBuilder"),

  GoogleSheetsService: Symbol.for("GoogleSheetsService"),
  GoogleAuthService: Symbol.for("GoogleAuthService"),
  GoogleDriveService: Symbol.for("GoogleDriveService"),


  DashboardController: Symbol.for("DashboardController"),
  LoginController: Symbol.for("LoginController"),
  UserController: Symbol.for("UserController"),
  ProfileController: Symbol.for("ProfileController"),

  AnimalRepository: Symbol.for("AnimalRepository"),
};

export default TYPES;