import { prisma } from "server/prisma";

export type PrismaTransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];