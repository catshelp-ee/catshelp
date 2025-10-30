import { Treatment } from '@animal/entities/treatment.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TreatmentRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  /** Get the full treatment history for an animal, including treatment details */
  async getTreatements(animalId: number): Promise<Treatment[]> {
    return this.getRepository(Treatment).find({
      where: { animal: { id: animalId } },
      relations: ['treatment'],
    });
  }
}
