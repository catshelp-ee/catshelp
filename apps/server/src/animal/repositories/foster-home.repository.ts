import { Animal } from '@animal/entities/animal.entity';
import { Injectable } from '@nestjs/common';
import { FosterHome } from '@user/entities/foster-home.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FosterHomeRepository extends Repository<FosterHome> {
    constructor(private dataSource: DataSource) {
        super(FosterHome, dataSource.createEntityManager());
    }

    /** Find existing foster home by userId or create a new one */
    async saveOrUpdateFosterHome(userId: number): Promise<FosterHome> {
        let fosterHome = await this.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!fosterHome) {
            fosterHome = this.create({ user: { id: userId } });
            await this.save(fosterHome);
        }

        return fosterHome;
    }

    /** Link an animal to a foster home (upsert behavior) */
    async saveOrUpdateAnimalToFosterHome(animalId: number, fosterHomeId: number): Promise<void> {
        const fosterHome = await this.findOne({
            where: { id: fosterHomeId },
            relations: ['animals'],
        });
        if (!fosterHome) throw new Error('Foster home not found');

        // Check if the animal is already linked
        const alreadyLinked = fosterHome.animals?.some(a => a.id === animalId);
        if (!alreadyLinked) {
            const animal = this.dataSource.manager.getRepository(Animal).create({ id: animalId });
            fosterHome.animals = [...(fosterHome.animals || []), animal];
            await this.save(fosterHome);
        }
    }
}
