import ImageService from '@services/files/image-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { AvatarInfo } from 'types/animal';
import TYPES from 'types/inversify-types';

@injectable()
export default class DashboardService {
  constructor(
    @inject(TYPES.ImageService)
    private imageService: ImageService
  ) {}

  async getAvatars(animals: Animal[]): Promise<AvatarInfo[]> {
    const avatars: AvatarInfo[] = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];
      const profileImage = await this.imageService.fetchProfilePicture(
        animal.id
      );
      if (!profileImage) {
        avatars.push({
          name: animal.name,
          pathToImage: `missing64x64.png`,
        });
        continue;
      }
      avatars.push({
        name: animal.name,
        pathToImage: `images/${profileImage.uuid}.jpg`,
      });
    }
    return avatars;
  }
}
