import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import { User } from '@server/src/user/entities/user.entity';
import { FosterHome } from '@user/entities/foster-home.entity';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class FosterHomeRepository extends BaseRepository<FosterHome> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(FosterHome, dataSource, request);
    }

    public get(userId: number | string) {
        userId = Number(userId);
        return this.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }
    
    /** Find existing foster home by userId or create a new one */
    async saveOrUpdateFosterHome(userId: number): Promise<FosterHome> {
        let fosterHome = await this.findOne({
            where: { userId: userId }
        });

        if (!fosterHome) {
            fosterHome = this.create({ user: { id: userId } });
            await this.save(fosterHome);
        }

        return fosterHome;
    }

}
