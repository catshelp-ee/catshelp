import DashboardService from "@services/dashboard-service";
import { getCurrentUser } from "@middleware/authorization-middleware";
import GoogleService from "@services/google-service";

export async function getDashboard(req: any, res: any) {
  const user = await getCurrentUser(req);
  const googleService = await GoogleService.create();

  const sheetsDataFosterHomes = await googleService.getSheetData(
    process.env.CATS_SHEETS_ID!,
    process.env.CATS_TABLE_NAME!
  );
  const sheetsDataContracts = await googleService.getSheetData(
    process.env.CONTRACTS_SHEETS_ID!,
    "Hoiukodude lepingud"
  );

  const sheetsData = {
    cats: sheetsDataFosterHomes.data.sheets![0].data,
    contracts: sheetsDataContracts.data.sheets![0].data,
  };

  const dashboardService = new DashboardService(
    sheetsData,
    user.fullName,
    googleService
  );

  const response = {
    todos: dashboardService.displayNotifications(),
    pets: await dashboardService.downloadImages(),
  };

  return res.json(response);
}
