import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import NotificationService from '@notifications/notification-service';
import AnimalService from '@services/animal/animal-service';
import AuthService from '@services/auth/auth-service';
import DashboardService from '@services/dashboard/dashboard-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService)
    private dashboardService: DashboardService,
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.AnimalService)
    private animalService: AnimalService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) { }

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const userID = req.user.id;
    const animals = await this.animalService.getAnimalsByUserId(userID);
    const rows = await this.googleSheetsService.getSheetRows(animals);
    const response = {
      todos: await this.notificationService.processNotifications(rows),
      pets: await this.dashboardService.getPetAvatars(rows),
    };
    return res.json(response);
  }
}
