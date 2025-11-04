import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { Characteristic } from '../entities/characteristic.entity';

@Injectable({ scope: Scope.REQUEST })
export class CharacteristicRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    public get(animalId: string | number, type: string) {
        animalId = Number(animalId);
        return this.getRepository(Characteristic).findOne({ where: { animalId, type } });
    }

    public getAll(animalId: string | number) {
        animalId = Number(animalId);
        return this.getRepository(Characteristic).find({ where: { animalId } });
    }

    public save(characteristic: Partial<Characteristic>) {
        return this.getRepository(Characteristic).save(characteristic);
    }

    public create(data: Partial<Characteristic>) {
        return this.getRepository(Characteristic).create(data);
    }

    public async saveOrUpdateCharacteristic(data: { animalId: number; type: string; value: string }) {
        const existing = await this.getRepository(Characteristic).findOne({
            where: {
                animalId: data.animalId,
                type: data.type,
            },
        });

        if (existing) {
            existing.value = data.value;
            return this.getRepository(Characteristic).save(existing);
        }

        const newChar = this.getRepository(Characteristic).create({
            animalId: data.animalId,
            type: data.type,
            value: data.value,
        });
        return this.getRepository(Characteristic).save(newChar);
    }

    public async deleteCharacteristic(data: { animalId: number; type: string }) {
        return this.getRepository(Characteristic).delete({
            animalId: data.animalId,
            type: data.type,
        });
    }

    public async deleteAllCharacteristicsByAnimalId(animalId: number) {
        return this.getRepository(Characteristic).delete({
            animalId,
        });
    }
}
