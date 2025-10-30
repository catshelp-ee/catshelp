import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@server/src/common/base.repository';
import { User } from '@server/src/user/entities/user.entity';
import { FosterHome } from '@user/entities/foster-home.entity';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class FosterHomeRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    public get(userId: number | string) {
        userId = Number(userId);
        return this.getRepository(FosterHome).findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    public create(data) {
        return this.getRepository(FosterHome).create({
            user: { id: data.userId } as User
        })
    }

    public save(fosterhome: Partial<FosterHome>) {
        return this.getRepository(FosterHome).save(fosterhome);
    }

    /** Find existing foster home by userId or create a new one */
    async saveOrUpdateFosterHome(userId: number): Promise<FosterHome> {
        let fosterHome = await this.getRepository(FosterHome).findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!fosterHome) {
            fosterHome = this.getRepository(FosterHome).create({ user: { id: userId } });
            await this.getRepository(FosterHome).save(fosterHome);
        }

        return fosterHome;
    }

}
