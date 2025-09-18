import GoogleDriveService from '@services/google/google-drive-service';
import { inject, injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { extractFileId } from 'server/utils/google-utils';
import { Profile } from 'types/cat';
import { CatSheetsHeaders } from 'types/google-sheets';
import TYPES from 'types/inversify-types';

@injectable()
export default class ImageService {
  constructor(
    @inject(TYPES.GoogleDriveService)
    private googleDriveService: GoogleDriveService
  ) { }

  private isValidHyperlink = (link: string): boolean => {
    try {
      new URL(link);
      return true;
    } catch (_error) {
      return false;
    }
  };

  async fetchImagePathsByAnimalId(animalId: number) {
    const current = process.cwd();
    const files = await prisma.file.findMany({
      where: { animalId },
    });
    return files.map(file => {
      return `${current}/images/${file.uuid}.jpg`;
    });
  }

  private normalizeFiles(
    files: Express.Request['files']
  ): Express.Multer.File[] {
    if (!files) return [];

    if (Array.isArray(files)) {
      return files;
    }

    return Object.values(files).flat();
  }

  async insertImageFilenamesIntoDB(
    files:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[],
    animalId: number | string
  ) {
    animalId = Number(animalId);
    const normalizedFiles = this.normalizeFiles(files);
    await Promise.all(
      normalizedFiles.map(file =>
        prisma.file.create({
          data: {
            animalId,
            uuid: file.filename.split('.')[0],
          },
        })
      )
    );
  }

  async fetchProfilePicture(animalID: number) {
    return prisma.file.findFirst({
      where: {
        profileAnimalId: animalID,
      },
    });
  }

  async processImages(
    profile: Profile,
    values: CatSheetsHeaders,
    ownerName: string
  ): Promise<void> {
    const imageLink = values.photo;

    if (!this.isValidHyperlink(imageLink)) {
      console.warn(
        `Skipping image for ${profile.mainInfo.name} due to invalid image link.`
      );
      return;
    }

    const fileId = extractFileId(imageLink);
    if (!fileId) {
      console.warn(`Unable to extract fileId from imageLink: ${imageLink}`);
      return;
    }

    await this.downloadProfileImage(profile.mainInfo.name, fileId, ownerName);
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
      return 'missing256x256.png';
    }
  }
}
