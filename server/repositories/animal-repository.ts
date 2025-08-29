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

  getAnimalByIdWithRescue(id: number) {
    return prisma.animal.findFirst({
      where: {
        id
      },
      include: {
        animalsToRescue: {
          include: {
            animalRescue: true
          }
        }
      }
    })
  }

  async getAnimalsByUserId(id: number | string): Promise<Animal[]> {
    id = Number(id);
    const user = await prisma.user.findFirst({
      where: { id },
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

  static async getAllAnimals(): Promise<Animal[]> {
    return await prisma.animal.findMany();
  }

  async createAnimalWithRescue(
    data: CreateAnimalData
  ): Promise<CreateAnimalResult> {
    return await prisma.$transaction(async tx => {
      const animal = await tx.animal.create({ data: {} });

      const animalRescue = await tx.animalRescue.create({
        data: {
          rescueDate: data.date,
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

  public getAnimalByAnimalRescueId(animalRescueId: number): Promise<Animal> {
    const animal = prisma.animal.findFirst({
      where: {
        animalsToRescue: {
          some: {
            animalRescueId: animalRescueId,
          },
        },
      },
    });
    return animal;
  }

  public async saveOrUpdateAnimal(data): Promise<Animal> {
    const newRow = await prisma.animal.upsert({
      where: {
        id: data.id || 0,
      },
      update: {
        name: data.name,
        birthday: data.birthday,
        chipNumber: data.chipNumber,
        chipRegisteredWithUs: data.chipRegisteredWithUs,
        profileTitle: data.profileTitle,
        status: data.status,
        driveId: data.driveId,
        description: data.description,
      },
      create: {
        name: data.name,
        birthday: data.birthday,
        chipNumber: data.chipNumber,
        chipRegisteredWithUs: data.chipRegisteredWithUs,
        profileTitle: data.profileTitle,
        status: data.status,
        driveId: data.driveId,
        description: data.description,
      },
    });
    return newRow;
  }

  public async deleteAnimalById(id) {
    await prisma.animal.deleteMany({
      where: {
        id: id,
      },
    });
  }
}
