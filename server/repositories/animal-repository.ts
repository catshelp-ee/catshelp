import { Animal } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import { ProfileHeader } from 'types/cat';

@injectable()
export default class AnimalRepository {

  public async getAnimalsByUserId(id: number | string): Promise<Animal[]> {
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

  public getAnimalByIdWithRescue(id: number | string) {
    return prisma.animal.findFirst({
      where: {
        id: Number(id)
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


  public async createAnimalWithRescue(data: CreateAnimalData): Promise<CreateAnimalResult> {
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

  public async getAnimalByAnimalRescueId(animalRescueId: number): Promise<Animal> {
    const animal = await prisma.animal.findFirst({
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

  public async updateEditProfile(data: ProfileHeader): Promise<Animal> {
    const newRow = await prisma.animal.update({
      where: {
        id: Number(data.animalId),
      },
      data: {
        profileTitle: data.title,
        description: data.description,
      },
    });
    return newRow;
  }

  public async saveOrUpdateAnimal(data, tx?): Promise<Animal> {
    const orm = tx || prisma;
    const newRow = await orm.animal.upsert({
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
        description: data.description,
      },
      create: {
        name: data.name,
        birthday: data.birthday,
        chipNumber: data.chipNumber,
        chipRegisteredWithUs: data.chipRegisteredWithUs,
        profileTitle: data.profileTitle,
        status: data.status,
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
