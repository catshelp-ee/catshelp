// controllers/dashboard-controller.ts
import { inject, injectable } from "inversify";
import TYPES  from "types/inversify-types";
import { DashboardService } from "@services/dashboard/dashboard-service";
import { Request, Response } from "express";
import AuthService from "@services/auth/auth-service";

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService) private dashboardService: DashboardService,
    @inject(TYPES.AuthService) private authService: AuthService
  ) {}

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
    const userID = Number(decodedToken.id);
    const response = {
      todos: await this.dashboardService.displayNotifications(userID),
      pets: await this.dashboardService.getPets(userID),
    };
    return res.json(response);
  }
}
