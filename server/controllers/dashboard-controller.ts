import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import AuthService from "@services/auth/auth-service";
import DashboardService from "@services/dashboard/dashboard-service";
import TYPES from "types/inversify-types";

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService) private dashboardService: DashboardService,
    @inject(TYPES.AuthService) private authService: AuthService
  ) {}

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
    const userID = decodedToken.id;
    const response = {
      todos: await this.dashboardService.displayNotifications(userID),
      pets: await this.dashboardService.getPetAvatars(userID),
    };
    return res.json(response);
  }
}
