import NodeCacheService from '@services/cache/cache-service';
import ImageService from '@services/files/image-service';
import { extractFileId } from '@utils/image-utils';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
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
      const petPromises = rows.map(async row => {
        const photoFileDriveID = extractFileId(row.row.photo);
        const username = (
          await this.nodeCacheService.get<User>(`user:${userID}`)
        ).fullName;
        const profilePicture = await this.imageService.downloadProfileImage(
          row.row.catName,
          photoFileDriveID,
          username
        );

        return { name: row.row.catName, pathToImage: profilePicture };
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
