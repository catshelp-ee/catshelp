import { File } from '@file/file.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { DataSource, Equal, Or } from 'typeorm';

import { BaseRepository } from '../common/base.repository';

import { FileDto } from './dto/file.dto';

@Injectable({ scope: Scope.REQUEST })
export class FileRepository extends BaseRepository<File> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(File, dataSource, request);
    }

    /** Optional: fetch all files for an animal */
    async getFilesByAnimalId(animalId: number): Promise<File[]> {
        return this.find({
            where: { animalId: animalId },
        });
    }

    async getImage(fileName: string) {
        return this.findOne({
            where: { uuid: fileName },
        });
    }

    async getImages(animalId: number) {
        return this.find({
            animalId: Equal(animalId),
            type: Or(Equal('image'), Equal('profile')),
        });
    }

    async saveFiles(files: FileDto[]): Promise<void> {
        await Promise.all(
            files.map(async (dto) => {
                const file = this.create();
                file.id = dto.id ?? 0;
                file.animalId = dto.animalId ?? 0;
                file.uuid = dto.uuid ?? '';
                file.extension = dto.extension ?? '';
                file.type = dto.type ?? '';
                await this.save(file);
            }),
        );
    }

    public async deleteFiles(fileIds: number[]): Promise<void> {
        await this.delete(fileIds);
    }

    //TODO eemaldada
    public async insertImageFilenamesIntoDB(
        files: Express.Multer.File[],
        animalId: number | string,
    ) {
        animalId = Number(animalId);
        return Promise.all(
            files.map((file) => {
                const f = this.create();
                f.animalId = animalId;
                f.uuid = file.filename.split('.')[0];
                return this.save(f);
            }),
        );
    }
}
