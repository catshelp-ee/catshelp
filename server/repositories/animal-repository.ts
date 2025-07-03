import { Animal } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';

@injectable()
export default class AnimalRepository {
  async getCatsByUserEmail(email: string): Promise<Animal[]> {
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        fosterHome: {
          include: {
            fosterAnimals: {
              include: { animal: true },
            },
          },
        },
      },
    });

    if (!user?.fosterHome?.fosterAnimals) {
      return [];
    }

    return user.fosterHome.fosterAnimals
      .map(link => link.animal)
      .filter(Boolean);
  }

  async createAnimalWithRescue(
    data: CreateAnimalData
  ): Promise<CreateAnimalResult> {
    return await prisma.$transaction(async tx => {
      const animal = await tx.animal.create({ data: {} });

      const animalRescue = await tx.animalRescue.create({
        data: {
          rescueDate: new Date().toISOString().split('T')[0],
          state: data.state,
          address: data.location,
          locationNotes: data.notes,
        },
      });

      await tx.animalToAnimalRescue.create({
        data: {
          animalId: animal.id,
          animalRescueId: animalRescue.id,
        },
      });

      return { animal, animalRescue };
    });
  }
  /*
  async updateRescueInfo(
    tx: PrismaTransactionClient, 
    animalId: number, 
    catData: any
  ): Promise<void> {
    const relation = await tx.animalToAnimalRescue.findFirst({
      where: { animalId },
    });

    if (!relation) {
      throw new Error(`AnimalRescue relation missing for cat ID: ${animalId}`);
    }

    await tx.animalRescue.update({
      where: { id: relation.animalRescueId },
      data: {
        rescueDate: moment(catData.foundDate, "DD.MM.YYYY").toDate(),
        address: catData.foundLoc,
      },
    });
  }*/
}
