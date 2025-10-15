import { File } from '@file/file.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FileRepository extends Repository<File> {
    constructor(private dataSource: DataSource) {
        super(File, dataSource.createEntityManager());
    }

    /** Get the first file associated with an animal (profile picture) */
    async getProfilePicture(animalId: number): Promise<File | null> {
        return this.findOne({
            where: { animal: { id: animalId } },
            relations: ['animal'],
        });
    }

    /** Optional: fetch all files for an animal */
    async getFilesByAnimalId(animalId: number): Promise<File[]> {
        return this.find({
            where: { animal: { id: animalId } },
            relations: ['animal'],
        });
    }

    async getImages(animalId: number) {
        return this.find({
            where: {
                animal: { id: animalId }
            },
        });
    }
}
