import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import AuthService from '@services/auth/auth-service';
import DashboardService from '@services/dashboard/dashboard-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { handleControllerError } from '@utils/error-handler';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService) private dashboardService: DashboardService,
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {}

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
    const userID = decodedToken.id;
    try {
      const rows = await this.googleSheetsService.getRows(userID);
      const response = {
        todos: await this.dashboardService.displayNotifications(userID, rows),
        pets: await this.dashboardService.getPetAvatars(userID, rows),
      };
      return res.json(response);
    } catch (e) {
      handleControllerError(e, res, 'Failed to fetch dashboard data');
    }
  }
}
