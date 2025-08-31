import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class RevokedTokenRepository {

    public async saveOrUpdateRevokedToken(data) {
        const newRow = await prisma.revokedToken.upsert({
            where: {
                token: data.token,
            },
            update: {},
            create: {
                token: data.token,
                expiresAt: data.expiresAt,
            },
        });
        return newRow;
    }

    public async getRevokedTokenCountByToken(token) {
        const count = await prisma.revokedToken.count({
            where: {
                token: token,
            },
        });
        return count;
    }
}