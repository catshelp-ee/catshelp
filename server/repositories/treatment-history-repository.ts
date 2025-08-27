import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class TreatmentHistoryRepository {
  public static getEntireTreatmentHistory(animalId: number) {
    return prisma.treatmentHistory.findMany({
      where: {
        animalId,
      },
      include: {
        treatment: true,
      },
    });
  }
}
