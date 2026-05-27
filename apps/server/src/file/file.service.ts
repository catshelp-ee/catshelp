import { CatSheetsHeaders, Profile } from '@catshelp/types';
import { extractFileId } from '@common/utils/google-utils';
import { GoogleDriveService } from '@google/google-drive.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FileRepository } from './file.repository';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FileService {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly fileRepository: FileRepository,
    ) {}

    private isValidHyperlink = (link: string): boolean => {
        try {
            new URL(link);
            return true;
        } catch (_error) {
            return false;
        }
    };

    public async getImagesByAnimalId(animalId: number): Promise<FileDto[]> {
        const imageFiles = await this.fileRepository.getImages(animalId);
        return imageFiles.map(file => ({
            id: file.id,
            uuid: file.uuid,
            extension: file.extension,
            type: file.type,
            animalId: file.animalId
        }));
    }

    public async saveFiles(files: FileDto[]): Promise<void> {
        return await this.fileRepository.saveFiles(files);
    }

    public async deleteFiles(fileIds: number[]): Promise<void> {
        return await this.fileRepository.deleteFiles(fileIds);
    }

    private normalizeFiles(
        files: Express.Request['files'],
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
        animalId: number | string,
    ) {
        const normalizedFiles = this.normalizeFiles(files);
        await this.fileRepository.insertImageFilenamesIntoDB(
            normalizedFiles,
            animalId,
        );
    }

    //UNUSED
    public async processImages(
        profile: Profile,
        values: CatSheetsHeaders,
        ownerName: string,
    ): Promise<void> {
        const imageLink = values.photo;

        if (!imageLink) {
            console.warn(`No image`);
            return;
        }

        if (!this.isValidHyperlink(imageLink)) {
            console.warn(
                `Skipping image for ${profile.mainInfo.name} due to invalid image link.`,
            );
            return;
        }

        const fileId = extractFileId(imageLink);
        if (!fileId) {
            console.warn(
                `Unable to extract fileId from imageLink: ${imageLink}`,
            );
            return;
        }

        await this.downloadProfileImage(
            profile.mainInfo.name,
            fileId,
            ownerName,
        );
    }

    public async downloadProfileImage(
        catName: string,
        fileId: string,
        ownerName: string,
    ): Promise<string> {
        const destinationPath = `./images/${ownerName}/${catName}.png`;

        try {
            await this.googleDriveService.downloadImage(
                fileId,
                destinationPath,
            );
            return `images/${ownerName}/${catName}.png`;
        } catch (_e) {
            return 'missing256x256.png';
        }
    }
}
