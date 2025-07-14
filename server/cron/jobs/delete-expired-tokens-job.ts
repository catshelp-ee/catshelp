import { prisma } from 'server/prisma';

export function deleteExpiredRevokedTokens() {
  prisma.revokedToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
