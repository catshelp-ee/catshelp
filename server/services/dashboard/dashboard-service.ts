import NodeCacheService from '@services/cache/cache-service';
import ImageService from '@services/files/image-service';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { extractFileId } from 'server/utils/google-utils';
import { Pet } from 'types/animal';
import { Result } from 'types/dashboard';
import { Rows } from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import NotificationService from '../notifications/notification-service';

@injectable()
export default class DashboardService {
  constructor(
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
  ) {}

  private getPets(userID: number | string) {
    return this.nodeCacheService.get<Pet[]>(`pets:${userID}`);
  }

  private setPets(userID: number | string, pets) {
    this.nodeCacheService.set(`pets:${userID}`, pets);
  }

  async getPetAvatars(userID: number | string, rows: Rows): Promise<Pet[]> {
    let pets = await this.getPets(userID);
    if (!pets) {
      const user = await this.nodeCacheService.get<User>(`user:${userID}`);
      const petPromises = rows.map(async row => {
        const fileDriveID = extractFileId(row.row.photo);

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

      pets = await Promise.all(petPromises);
      this.setPets(userID, pets);
    }

    return pets;
  }

  private getNotifications(userID: number | string) {
    return this.nodeCacheService.get<Result[]>(`notifications:${userID}`);
  }

  private setNotifications(userID: number | string, pets) {
    this.nodeCacheService.set(`notifications:${userID}`, pets);
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
