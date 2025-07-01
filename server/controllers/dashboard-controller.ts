// controllers/dashboard-controller.ts
import { inject, injectable } from "inversify";
import TYPES  from "@types/inversify-types";
import { DashboardService } from "@services/dashboard/dashboard-service";
import { Request, Response } from "express";

@injectable()
export default class DashboardController {
  constructor(
    @inject(TYPES.DashboardService)
    private dashboardService: DashboardService
  ) {}

  public async getDashboard(req: Request, res: Response): Promise<Response> {
    const response = {
      todos: await this.dashboardService.displayNotifications(),
      pets: await this.dashboardService.getPets(),
    };
    return res.json(response);
  }
}
