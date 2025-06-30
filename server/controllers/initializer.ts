import { getCurrentUser } from "@middleware/authorization-middleware";
import AnimalService from "@services/animal-service";
import DashboardService from "@services/dashboard-service";
import GoogleService from "@services/google-service";

export let googleService;
export let animalService;
export let dashboardService;

export const initializeServices = async (req) => {
  googleService = await GoogleService.create();
  animalService = new AnimalService();

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

  const user = await getCurrentUser(req);

  dashboardService = new DashboardService(sheetsData, user.fullName);
};
