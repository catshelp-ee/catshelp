import { Animal } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { Pet } from 'types/animal';

@injectable()
export default class DashboardService {
  constructor() { }

  async getAvatars(animals: Animal[]): Promise<Pet[]> {
    const avatars: Pet[] = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];
      const profilePicture = await prisma.File.findUnique({
        where: {
          animalId: animal.id,
        },
      });

      avatars.push({
        name: animal.name,
        pathToImage: `images/${profilePicture.uuid}.jpg`,
      });
    }

    return avatars;
  }
}
