import { dashboardService } from "./initializer";

export async function getDashboard(req: any, res: any) {
  const response = {
    todos: dashboardService.displayNotifications(),
    pets: await dashboardService.downloadImages(),
  };

  return res.json(response);
}
