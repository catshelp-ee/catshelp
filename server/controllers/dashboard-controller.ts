import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import NotificationService from '@notifications/notification-service';
import AnimalRepository from '@repositories/animal-repository';
import AuthService from '@services/auth/auth-service';
import DashboardService from '@services/dashboard/dashboard-service';
import { handleControllerError } from '@utils/error-handler';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService)
    private dashboardService: DashboardService,
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,
    @inject(TYPES.AnimalRepository)
    private animalRepository: AnimalRepository
  ) {}

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
    const animals = await this.animalRepository.getAnimalsByUserId(
      Number(decodedToken.id)
    );
    try {
      const response = {
        todos: await this.notificationService.processNotifications(animals),
        pets: await this.dashboardService.getAvatars(animals),
      };
      return res.json(response);
    } catch (e) {
      handleControllerError(e, res, 'Failed to fetch dashboard data');
    }
  }
}
