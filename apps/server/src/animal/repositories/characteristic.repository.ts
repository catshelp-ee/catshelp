import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { Characteristic } from '../entities/characteristic.entity';

@Injectable({ scope: Scope.REQUEST })
export class CharacteristicRepository extends BaseRepository<Characteristic> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(Characteristic, dataSource, request);
    }

    public get(animalId: string | number, type: string) {
        animalId = Number(animalId);
        return this.findOne({ where: { animalId, type } });
    }

    public getAll(animalId: string | number) {
        animalId = Number(animalId);
        return this.find({ where: { animalId } });
    }

    public async saveOrUpdateCharacteristic(data: { animalId: number; type: string; value: string }) {
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

    public async deleteCharacteristic(data: { animalId: number; type: string }) {
        return this.delete({
            animalId: data.animalId,
            type: data.type,
        });
    }

    public async deleteAllCharacteristicsByAnimalId(animalId: number) {
        return this.delete({
            animalId,
        });
    }
}
