import NodeCacheService from '@services/cache/cache-service';
import ImageService from '@services/files/image-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Avatar } from 'types/animal';
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

  async getAvatars(animals: Animal[]): Promise<Avatar[]> {
    const avatars: Avatar[] = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];
      avatars.push({
        name: animal.name,
        pathToImage: await this.imageService.fetchProfilePicture(animal.id),
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
