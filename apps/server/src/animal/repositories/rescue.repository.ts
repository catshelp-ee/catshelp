import { Rescue } from '@animal/entities/rescue.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class RescueRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  public save(rescue: Partial<Rescue>) {
    return this.getRepository(Rescue).save(rescue);
  }

  async getAnimalRescueByAnimalId(animalId: number): Promise<Rescue | null> {
    return this.getRepository(Rescue).findOne({
      where: {
        animal: { id: animalId },
      },
      relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animal'],
    });
  }

  async getAnimalRescueByRankNr(rankNr: string): Promise<Rescue | null> {
    return this.getRepository(Rescue).findOne({ where: { rankNr } });
  }

  async saveOrUpdateAnimalRescue(data: {
    rankNr: string;
    rescueDate: Date;
    address: string;
  }): Promise<Rescue> {
    const existing = await this.getRepository(Rescue).findOne({ where: { rankNr: data.rankNr } });

    if (existing) {
      Object.assign(existing, data);
      return this.getRepository(Rescue).save(existing);
    }

    const newRescue = this.getRepository(Rescue).create(data);
    return this.getRepository(Rescue).save(newRescue);
  }


  async deleteAnimalRescueById(id: number) {
    return this.getRepository(Rescue).delete({ id });
  }

}
