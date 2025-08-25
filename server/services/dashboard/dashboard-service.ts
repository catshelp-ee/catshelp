import NodeCacheService from '@services/cache/cache-service';
import ImageService from '@services/files/image-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { AvatarInfo } from 'types/animal';
import { Result } from 'types/dashboard';
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

  async displayNotifications(
    userID: number | string,
    rows: Rows
  ): Promise<Result[]> {
    let todos = await this.getNotifications(userID);
    if (!todos) {
      todos = this.notificationService.processNotifications(rows);
      this.setNotifications(userID, todos);
    }
    return todos;
  }
}
