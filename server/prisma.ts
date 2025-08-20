import { PrismaClient } from '../generated/prisma';

/**
 * Prisma Client Extension for Custom Logic
 * This file extends the base Prisma client with custom query logic,
 * specifically for generating unique rank numbers for animal rescues based on date.
 */

const basePrisma = new PrismaClient();

export const prisma = basePrisma.$extends({
  name: 'animalRescueRankNrExtension',
  query: {
    animalRescue: {
      async create({ args, query }) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const lastRescue = await basePrisma.animalRescue.findFirst({
          orderBy: { id: 'desc' },
        });


        let newRankNr: number;

        if (
          !lastRescue ||
          new Date(lastRescue.rescueDate).getMonth() !== currentMonth ||
          new Date(lastRescue.rescueDate).getFullYear() !== currentYear
        ) {
          newRankNr = 1;
        } else {
          let lastRank = lastRescue.rankNr;
          let lastRankString = lastRank.substring(lastRank.indexOf('nr 0') + 4);
          newRankNr = Number(lastRankString) + 1;
        }

        // Inject the computed rankNr into the create data
        const year = currentDate.getFullYear() % 100;
        const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth();
        args.data.rankNr = `${year}'${month} nr ${newRankNr}`;

        return query(args);
      },
    },
  },
});
