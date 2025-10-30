import { File } from '@file/file.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/base.repository';

@Injectable({ scope: Scope.REQUEST })
export class FileRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    /** Get the first file associated with an animal (profile picture) */
    async getProfilePicture(animalId: number): Promise<File | null> {
        return this.getRepository(File).findOne({
            where: { animal: { id: animalId } },
            relations: ['animal'],
        });
    }

    /** Optional: fetch all files for an animal */
    async getFilesByAnimalId(animalId: number): Promise<File[]> {
        return this.getRepository(File).find({
            where: { animal: { id: animalId } },
            relations: ['animal'],
        });
    }

    async getImages(animalId: number) {
        return this.getRepository(File).find({
            where: {
                animal: { id: animalId }
            },
        });
    }

    public fetchProfilePicture(animalID: number) {
        return this.getRepository(File).findOne({
            where: {
                animal: {
                    id: animalID
                }
            }
        })
    }

    public async insertImageFilenamesIntoDB(
        files: Express.Multer.File[],
        animalId: number | string
    ) {
        animalId = Number(animalId);
        const fileRepository = this.getRepository(File);
        return Promise.all(
            files.map(file =>
                fileRepository.save({
                    animal: { id: animalId },
                    uuid: file.filename.split('.')[0],
                })
            )
        );
    }
}
