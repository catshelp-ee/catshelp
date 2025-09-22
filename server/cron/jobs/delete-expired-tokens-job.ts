import { prisma } from 'server/prisma';

export function deleteExpiredRevokedTokens() {
  //TODO
  prisma.revokedToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
