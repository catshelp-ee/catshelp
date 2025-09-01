import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import NotificationService from '@notifications/notification-service';
import AnimalService from '@services/animal/animal-service';
import AuthService from '@services/auth/auth-service';
import DashboardService from '@services/dashboard/dashboard-service';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService)
    private dashboardService: DashboardService,
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.AnimalService)
    private animalService: AnimalService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) { }

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const userID = req.user.id;
    const animals = await this.animalService.getAnimalsByUserId(userID);
    const response = {
      todos: await this.notificationService.processNotifications(animals),
      pets: await this.dashboardService.getAvatars(animals),
    };
    return res.json(response);
  }
}
