import FileRepository from '@repositories/file-repository';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Pet } from 'types/animal';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardService {
  constructor(
    @inject(TYPES.FileRepository)
    private fileRepository: FileRepository
  ) { }

  async getAvatars(animals: Animal[]): Promise<Pet[]> {
    const avatars: Pet[] = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];
      const profilePicture = await this.fileRepository.getProfilePicture(animal.id);

      const pathToImage = profilePicture ? `images/${profilePicture.uuid}.jpg` : "missing64x64.png";

      avatars.push({
        name: animal.name,
        pathToImage,
      });
    }

    return avatars;
  }
}
