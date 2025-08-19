import GoogleDriveService from '@services/google/google-drive-service';
import { extractFileId, isValidHyperlink } from '@utils/image-utils';
import { inject, injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { Profile } from 'types/cat';
import { CatSheetsHeaders } from 'types/google-sheets';
import TYPES from 'types/inversify-types';

@injectable()
export default class ImageService {
  constructor(
    @inject(TYPES.GoogleDriveService)
    private googleDriveService: GoogleDriveService
  ) {}

  async fetchImages(animalID: number) {
    const files = await prisma.file.findMany({
      where: { animalID: animalID },
    });
    return files.map(file => {
      return `./images/${file.uuid}.jpg`;
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
    files:{ [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[],
    animalID: number
  ) {
    const normalizedFiles = this.normalizeFiles(files);
    await Promise.all(
      normalizedFiles.map(file =>
        prisma.file.create({
          data: {
            animalID: animalID,
            uuid: file.filename.split('.')[0],
          },
        })
      )
    );
  }

  async fetchProfilePicture(animalID: number) {
    return prisma.file.findFirst({
      where: {
        profileAnimalID: animalID,
      },
    });
  }

  async processImages(
    profile: Profile,
    values: CatSheetsHeaders,
    ownerName: string
  ): Promise<void> {
    const imageLink = values.photo;

    if (!isValidHyperlink(imageLink)) {
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
      return 'missing256x256.png';
    }
  }

  private async downloadAdditionalImages(
    profile: Profile,
    ownerName: string
  ): Promise<void> {
    try {
      await this.googleDriveService.downloadImages(
        profile.driveID,
        ownerName,
        profile
      );
    } catch (error) {
      console.error(
        `Failed to download additional images for ${profile.mainInfo.name}:`,
        error
      );
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<void> {
    const fileArray = Array.isArray(files) ? files : [files];

    const uploadPromises = fileArray.map(async file => {
      /*
      const tempPath = file.path;
      return await this.googleDriveService.uploadToDrive(
        file.originalname,
        fs.createReadStream(tempPath),
        folderId
      );
      */
    });

    await Promise.all(uploadPromises);
  }
}
