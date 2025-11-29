import { Treatment } from '@animal/entities/treatment.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import moment from 'moment';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TreatmentRepository extends BaseRepository<Treatment> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(Treatment, dataSource, request);
    }

    public async saveOrUpdate(animalId: number, data: { COMPLEX_VACCINE: string, RABIES_VACCINE: string, DEWORMING_MEDICATION: string }, treatments: { [k: string]: Treatment; }) {
        for (const [key, value] of Object.entries(data)) {

            const visitDate = moment(value, 'DD.MM.YYYY');

            if (key in treatments) {
                const existingTreatment = treatments[key];

                existingTreatment.visitDate = visitDate.toDate();
                existingTreatment.nextVisitDate = visitDate.add(1, 'y').toDate();
                await this.save(existingTreatment);
                continue;
            }

            const treatmentData: Partial<Treatment> = {
                treatmentName: key,
                visitDate: visitDate.toDate(),
                nextVisitDate: visitDate.add(1, 'y').toDate(),
                animalId
            }

            const newTreatment = this.create(treatmentData);
            await this.save(newTreatment);
        }
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
