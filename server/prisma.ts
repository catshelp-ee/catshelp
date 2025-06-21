import { PrismaClient } from "../generated/prisma";

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
