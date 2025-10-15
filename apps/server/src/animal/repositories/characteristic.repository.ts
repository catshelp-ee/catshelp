import { Characteristic } from '@animal/entities/characteristic.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CharacteristicRepository extends Repository<Characteristic> {
    constructor(private dataSource: DataSource) {
        super(Characteristic, dataSource.createEntityManager());
    }

    async saveOrUpdateCharacteristic(data: { animalId: number; type: string; value: string }) {
        const existing = await this.findOne({
            where: {
                animalId: data.animalId,
                type: data.type,
            },
        });

        if (existing) {
            existing.value = data.value;
            return this.save(existing);
        }

        const newChar = this.create({
            animalId: data.animalId,
            type: data.type,
            value: data.value,
        });
        return this.save(newChar);
    }

    async deleteCharacteristic(data: { animalId: number; type: string }) {
        return this.delete({
            animalId: data.animalId,
            type: data.type,
        });
    }

    async deleteAllCharacteristicsByAnimalId(animalId: number) {
        return this.delete({
            animalId,
        });
    }
}
