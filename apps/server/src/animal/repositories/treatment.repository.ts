import { Treatment } from '@animal/entities/treatment.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TreatmentRepository extends BaseRepository<Treatment> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(Treatment, dataSource, request);
    }

    public async saveOrUpdate(treatment: Partial<Treatment>) {
        if (treatment.id) {
            await this.save(treatment as Treatment);
            return;
        }

        const newTreatment = this.create(treatment);
        await this.save(newTreatment);
    }

    public async getActiveTreatments(animalId: number): Promise<Treatment[]> {
        return this.find({
            where: {
                animalId: animalId,
                active: true,
            }
        });
    }


    /** Get the full treatment history for an animal, including treatment details */
    async getTreatements(animalId: number): Promise<Treatment[]> {
        return this.find({
            where: { animalId: animalId }
        });
    }
}
