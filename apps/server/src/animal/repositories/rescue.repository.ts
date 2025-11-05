import { Rescue } from '@animal/entities/rescue.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class RescueRepository extends BaseRepository<Rescue> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(Rescue, dataSource, request);
    }

    async getAnimalRescueByAnimalId(animalId: number): Promise<Rescue | null> {
        return this.findOne({
            where: {
                animal: { id: animalId },
            },
            relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animal'],
        });
    }

    async getAnimalRescueByRankNr(rankNr: string): Promise<Rescue | null> {
        return this.findOne({ where: { rankNr } });
    }

    async saveOrUpdateAnimalRescue(data: Partial<Rescue>): Promise<Rescue> {
        const existing = await this.findOne({ where: { rankNr: data.rankNr } });

        if (existing) {
            Object.assign(existing, data);
            return this.save(existing);
        }

        const newRescue = this.create(data);
        return this.save(newRescue);
    }

    async deleteAnimalRescueById(id: number) {
        return this.delete({ id });
    }

}
