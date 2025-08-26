import NodeCacheService from '@services/cache/cache-service';
import ImageService from '@services/files/image-service';
import { inject, injectable } from 'inversify';
import { Pet } from 'types/animal';
import { Rows } from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import NotificationService from '../notifications/notification-service';

@injectable()
export default class DashboardService {
  constructor(
    @inject(TYPES.ImageService)
    private imageService: ImageService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,
    @inject(TYPES.NodeCacheService)
    private nodeCacheService: NodeCacheService
  ) { }

  async getPetAvatars(rows: Rows): Promise<Pet[]> {
    const petPromises = rows.map(async row => {
      const profilePicture = await this.imageService.fetchProfilePicture(
        row.id
      );

      let pathToImage = 'missing64x64.png';
      if (profilePicture) {
        pathToImage = `images/${profilePicture.uuid}.jpg`;
      }

      return {
        name: row.row.catName,
        pathToImage: pathToImage,
      };
    });

    return Promise.all(petPromises);
  }
}
