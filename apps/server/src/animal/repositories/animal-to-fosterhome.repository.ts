import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { AnimalToFosterHome } from '../entities/animalToFosterhome.entity';

@Injectable({ scope: Scope.REQUEST })
export class AnimalToFosterHomeRepository extends BaseRepository<AnimalToFosterHome> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(AnimalToFosterHome, dataSource, request);
    }

        /** Save or update animal */
    public async saveOrUpdate(data: Partial<AnimalToFosterHome>): Promise<AnimalToFosterHome> {
        const animalToFosterhome = await this.findOne({where: data});

        if (animalToFosterhome){
            Object.assign(animalToFosterhome, data);
            return this.save(animalToFosterhome);
        }

        const newRecord = this.create(data);
        return this.save(newRecord);
    }
    
}
