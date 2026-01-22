import { CatSheetsHeaders, Profile } from '@catshelp/types';
import { extractFileId } from '@common/utils/google-utils';
import { GoogleDriveService } from '@google/google-drive.service';
import { Injectable } from '@nestjs/common';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly fileRepository: FileRepository,
    ) { }

    private isValidHyperlink = (link: string): boolean => {
        try {
            new URL(link);
            return true;
        } catch (_error) {
            return false;
        }
    };

    //TODO images kaust tekib valesti. rooti ja server kausta. Alati peaks olema root. Tuleb üle kontrollida ka muud kohad.
    public async fetchImagePathsByAnimalId(animalId: number) {
        const files = await this.fileRepository.getImages(animalId);
        return files.map(file => {
            return `/images/${file.uuid}.jpg`;
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

    public async insertImageFilenamesIntoDB(
        files:
            | { [fieldname: string]: Express.Multer.File[] }
            | Express.Multer.File[],
        animalId: number | string
    ) {
        const normalizedFiles = this.normalizeFiles(files);
        await this.fileRepository.insertImageFilenamesIntoDB(normalizedFiles, animalId);
    }

    public fetchProfilePicture(animalID: number | string) {
        return this.fileRepository.fetchProfilePicture(animalID);
    }

    public async processImages(
        profile: Profile,
        values: CatSheetsHeaders,
        ownerName: string
    ): Promise<void> {
        const imageLink = values.photo;

        if (!imageLink) {
            console.warn(`No image`);
            return;
        }

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

    public async downloadProfileImage(
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
