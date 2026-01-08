import { File } from '@file/file.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable({ scope: Scope.REQUEST })
export class FileRepository extends BaseRepository<File> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(File, dataSource, request);
    }

    /** Get the first file associated with an animal (profile picture) */
    async getProfilePicture(animalId: number): Promise<File | null> {
        return this.findOne({
            where: {
                animalId: animalId,
                type: "PROFILE-PICTURE"
            },
        });
    }

    async setProfilePicture(animalId: number, fileName: string): Promise<File | null> {
        const oldProfilePicture = await this.getProfilePicture(animalId);
        const newProfilePicture = await this.getImage(fileName);
        if (!newProfilePicture) throw new Error('New image not found');


        if (!oldProfilePicture) {
            newProfilePicture.type = "PROFILE-PICTURE";
            return this.save(newProfilePicture);
        }

        oldProfilePicture.type = "";
        this.save(oldProfilePicture);

        newProfilePicture.type = "PROFILE-PICTURE";
        return this.save(newProfilePicture);
    }

    /** Optional: fetch all files for an animal */
    async getFilesByAnimalId(animalId: number): Promise<File[]> {
        return this.find({
            where: { animalId: animalId },
        });
    }

    async getImage(fileName: string) {
        return this.findOne({
            where: { uuid: fileName }
        });
    }

    async getImages(animalId: number) {
        return this.find({
            where: { animalId: animalId }
        });
    }

    public async insertImageFilenamesIntoDB(
        files: Express.Multer.File[],
        animalId: number | string
    ) {
        animalId = Number(animalId);
        return Promise.all(
            files.map(file => {
                const f = this.create();
                f.animalId = animalId;
                f.uuid = file.filename.split('.')[0];
                return this.save(f);
            })
        );
    }
}
