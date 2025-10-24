import { Injectable } from '@nestjs/common';
import { FosterHome } from '@user/entities/foster-home.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FosterHomeRepository extends Repository<FosterHome> {
    constructor(private dataSource: DataSource) {
        super(FosterHome, dataSource.createEntityManager());
    }

    /** Find existing foster home by userId or create a new one */
    async saveOrUpdateFosterHome(userId: number): Promise<FosterHome> {
        let fosterHome = await this.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!fosterHome) {
            fosterHome = this.create({ user: { id: userId } });
            await this.save(fosterHome);
        }

        return fosterHome;
    }

}
