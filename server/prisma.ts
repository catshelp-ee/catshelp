import { PrismaClient } from "../generated/prisma";

/**
 * Prisma Client Extension for Custom Logic
 * This file extends the base Prisma client with custom query logic,
 * specifically for generating unique rank numbers for animal rescues based on date.
 */

const basePrisma = new PrismaClient();

export const prisma = basePrisma.$extends({
  name: "animalRescueRankNrExtension",
  query: {
    animalRescue: {
      async create({ args, query }) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const lastRescue = await basePrisma.animalRescue.findFirst({
          orderBy: { id: "desc" },
        });

        let newRankNr: number;

        if (
          !lastRescue ||
          new Date(lastRescue.rescueDate).getMonth() !== currentMonth ||
          new Date(lastRescue.rescueDate).getFullYear() !== currentYear
        ) {
          const yearPart = currentYear % 1000;
          const monthPart = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
          newRankNr = Number(`${yearPart}${monthPart}1`);
        } else {
          newRankNr = lastRescue.rankNr + 1;
        }

        // Inject the computed rankNr into the create data
        args.data.rankNr = newRankNr;

        return query(args);
      },
    },
  },
});
