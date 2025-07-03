import GoogleDriveService from '@services/google/google-drive-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { extractFileId, isValidHyperlink } from '@utils/image-utils';
import { inject, injectable } from 'inversify';
import { Cat } from 'types/cat';
import { Row } from 'types/google-sheets';
import TYPES from 'types/inversify-types';

@injectable()
export default class ImageService {
  constructor(
    @inject(TYPES.GoogleDriveService)
    private googleDriveService: GoogleDriveService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {}

  async processImages(
    profile: Cat,
    values: Row,
    ownerName: string
  ): Promise<void> {
    const imageLink =
      values[this.googleSheetsService.headers['PILT']]?.hyperlink || '';

    if (!isValidHyperlink(imageLink)) {
      console.warn(
        `Skipping image for ${profile.name} due to invalid image link.`
      );
      return;
    }

    const fileId = extractFileId(imageLink);
    if (!fileId) {
      console.warn(`Unable to extract fileId from imageLink: ${imageLink}`);
      return;
    }

    await this.downloadProfileImage(profile.name, fileId, ownerName);
    await this.downloadAdditionalImages(profile, ownerName);
  }

  async downloadProfileImage(
    catName: string,
    fileId: string,
    ownerName: string
  ): Promise<string> {
    const destinationPath = `./images/${ownerName}/${catName}.png`;

    try {
      await this.googleDriveService.downloadImage(fileId, destinationPath);
      return `images/${ownerName}/${catName}.png`;
    } catch (e) {
      //console.error("Failed to download image: ", e);
      return 'missing256x256.png';
    }
  }

  private async downloadAdditionalImages(
    profile: Cat,
    ownerName: string
  ): Promise<void> {
    try {
      console.log(profile);
      await this.googleDriveService.downloadImages(
        profile.driveId,
        ownerName,
        profile
      );
    } catch (error) {
      console.error(
        `Failed to download additional images for ${profile.name}:`,
        error
      );
    }
  }
}
