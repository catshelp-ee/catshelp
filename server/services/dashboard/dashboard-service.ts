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

@injectable()
export class DashboardService {
    private todos: any;
    notifications: Result[];

    constructor(
        @inject(TYPES.GoogleSheetsService) private googleSheetsService: GoogleSheetsService,
        @inject(TYPES.ImageService) private imageService: ImageService,
        @inject(TYPES.NotificationService) private notificationService: NotificationService,
        @inject(TYPES.UserService) private userService: UserService,
    ) { }

    public async init() {
        await this.googleSheetsService.getSheetData();
    }

    async getPets() {
        if(!this.todos){
            const petPromises = this.googleSheetsService.rows.map(async (row) => {
                const catName = row[this.googleSheetsService.headers['KASSI NIMI']].formattedValue;
                const imageLink = row[this.googleSheetsService.headers['PILT']].hyperlink;

                const fileDriveID = extractFileId(imageLink);
                const profilePicture = await this.imageService.downloadProfileImage(catName, fileDriveID, this.userService.getUser().fullName);

                return { name: catName, image: profilePicture };
            });

            this.todos = await Promise.all(petPromises);
        }

        return this.todos;
    }

    async displayNotifications(): Promise<Result[]> {
        if (!this.notifications) {
            this.notifications = this.notificationService.processNotifications(
                this.googleSheetsService.rows,
                this.googleSheetsService.headers
            );
        }
        return this.notifications;
    }
}