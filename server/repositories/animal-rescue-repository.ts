import { AnimalRescue } from 'generated/prisma';
import { prisma } from 'server/prisma';

export default class AnimalRescueRepository {
  static async getAnimalRescue(animalID: number): Promise<AnimalRescue> {
    const rescue = prisma.animalRescue.findFirst({
      where: {
        animalsToRescue: {
          some: {
            id: animalID,
          },
        },
      },
    });
    return rescue;
  }
}
