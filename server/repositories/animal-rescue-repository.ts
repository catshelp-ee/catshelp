import { AnimalRescue } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class AnimalRescueRepository {
  public async getAnimalRescueByAnimalId(animalID: number): Promise<AnimalRescue> {
    const rescue = prisma.animalRescue.findFirst({
      where: {
        animalsToRescue: {
          some: {
            id: animalID,
          },
        },
      },
    });
    return rescue;
  }

  public async getAnimalRescueByRankNr(rankNr: string): Promise<AnimalRescue> {
    const rescue = prisma.animalRescue.findFirst({
      where: {
        rankNr: rankNr
      },
    });
    return rescue;
  }

  public async saveOrUpdateAnimalRescue(data, tx?): Promise<AnimalRescue> {
    const orm = tx || prisma;
    const newRow = await orm.animalRescue.upsert({
      where: {
        rankNr: data.rankNr
      },
      update: {
        rescueDate: data.rescueDate,
        state: data.state,
        address: data.address,
        locationNotes: data.locationNotes
      },
      create: {
        rescueDate: data.rescueDate,
        state: data.state,
        address: data.address,
        locationNotes: data.locationNotes,
        rankNr: data.rankNr
      },
    });
    return newRow;
  }

  public async saveOrUpdateAnimalToAnimalRescue(data) {
    const newRow = await prisma.animalToAnimalRescue.upsert({
      where: {
        animalToAnimalRescue: {
          animalId: data.animalId,
          animalRescueId: data.animalRescueId
        }
      },
      update: {},
      create: {
        animalRescueId: data.animalRescueId,
        animalId: data.animalId
      },
    });
    return newRow;
  }

  public async deleteAnimalRescueById(id) {
    await prisma.animalRescue.deleteMany({
      where: {
        id: id
      }
    });
  }

  public async deleteAnimalToAnimalRescueByRescueId(animalRescueId) {
    await prisma.animalToAnimalRescue.deleteMany({
      where: {
        animalRescueId: animalRescueId
      }
    });
  }
}
