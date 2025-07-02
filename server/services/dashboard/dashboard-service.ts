import { SheetsData, SheetData, Result, SheetCell } from 'types/dashboard';
import TYPES from 'types/inversify-types';
import { extractColumnMapping, findUserRows, extractCatNames } from '@utils/sheet-utils';
import { SHEET_COLUMNS } from './constants';
import GoogleSheetsService from '@services/google/google-sheets-service';
import ImageService from '@services/files/image-service';
import NotificationService from '../notifications/notification-service';
import { injectable, inject } from 'inversify';
import { extractFileId } from '@utils/image-utils';
import UserService from '@services/user/user-service';
import NodeCacheService from '@services/cache/cache-service';
import { User } from 'generated/prisma';

interface Pet{
    name: string;
    pathToImage: string;
}

@injectable()
export class DashboardService {
    constructor(
        @inject(TYPES.GoogleSheetsService) private googleSheetsService: GoogleSheetsService,
        @inject(TYPES.ImageService) private imageService: ImageService,
        @inject(TYPES.NotificationService) private notificationService: NotificationService,
        @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService,
    ) { }

    public async init() {
        await this.googleSheetsService.getSheetData();
    }

    async getPets(userID: number): Promise<Pet[]> {
        let pets = await this.nodeCacheService.get<Pet[]>(`pets:${userID}`);
        if (!pets){
            const petPromises = this.googleSheetsService.rows.map(async (row) => {
                const catName = row[this.googleSheetsService.headers['KASSI NIMI']].formattedValue;
                const imageLink = row[this.googleSheetsService.headers['PILT']].hyperlink;

                const fileDriveID = extractFileId(imageLink);
                const username = (await this.nodeCacheService.get<User>(`user:${userID}`)).fullName;
                const profilePicture = await this.imageService.downloadProfileImage(catName, fileDriveID, username);

                return { name: catName, image: profilePicture };
            });

            pets = await Promise.all(petPromises);
            this.nodeCacheService.set(`pets:${userID}`, pets);
        }

        return pets;
    }

    async displayNotifications(userID: number): Promise<Result[]> {
        let todos = await this.nodeCacheService.get<Result[]>(`todos:${userID}`)
        if (!todos) {
            todos = this.notificationService.processNotifications(
                this.googleSheetsService.rows,
                this.googleSheetsService.headers
            );
            this.nodeCacheService.set(`todos:${userID}`, todos);
        }
        return todos;
    }
}