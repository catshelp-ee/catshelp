import { Animal } from '@animal/entities/animal.entity';
import { AvatarData } from '@animal/interfaces/avatar';
import { FileRepository } from '@file/file.repository';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { getRootPath } from '../main';

@Injectable()
export class DashboardService {
    constructor(
    ) { }

    public async getAvatars(animals: Animal[]): Promise<AvatarData[]> {
        const data: AvatarData[] = [];
        for (let index = 0; index < animals.length; index++) {
            const animal = animals[index];

            data.push({
                name: animal.name,
                id: animal.id
            });
        }

        return data;
    }
}
