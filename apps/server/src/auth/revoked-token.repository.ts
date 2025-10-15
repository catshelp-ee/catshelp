import { RevokedToken } from '@auth/revoked-token.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RevokedTokenRepository extends Repository<RevokedToken> {
    constructor(private dataSource: DataSource) {
        super(RevokedToken, dataSource.createEntityManager());
    }

    /** Insert a new revoked token or do nothing if it exists */
    async saveOrUpdateRevokedToken(token: string, expiresAt: Date): Promise<RevokedToken> {
        let revokedToken = await this.findOne({ where: { token } });

        if (!revokedToken) {
            revokedToken = this.create({ token, expiresAt });
            await this.save(revokedToken);
        }

        return revokedToken;
    }

    /** Count revoked tokens matching a specific token string */
    async getRevokedTokenCountByToken(token: string): Promise<number> {
        return this.count({ where: { token } });
    }

}
