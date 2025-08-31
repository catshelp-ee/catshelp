import AnimalRepository from '@repositories/animal-repository';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { prisma } from 'server/prisma';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';
import { PrismaTransactionClient } from 'types/prisma';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class AnimalService {
  constructor(
    @inject(TYPES.AnimalRepository)
    private animalRepository: AnimalRepository,
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
  ) { }

  getAnimalsByUserId(id: number | string): Promise<Animal[]> {
    return this.animalRepository.getAnimalsByUserId(id);
  }

  async createAnimal(data: CreateAnimalData): Promise<CreateAnimalResult> {
    data.date = new Date();
    const animal = await this.animalRepository.createAnimalWithRescue(data);
    data.rankNr = animal.animalRescue.rankNr;
    this.googleSheetsService.addDataToSheet(data);
    return animal;
  }

  async updateAnimalRescueTable(tx: PrismaTransactionClient, updatedAnimalData: Profile) {
    const relation = await tx.animalToAnimalRescue.findFirst({
      where: { animalId: updatedAnimalData.animalId },
    });

    if (!relation?.animalRescueId) {
      throw new Error(`AnimalRescue relation missing for cat ID: ${updatedAnimalData.animalId}`);
    }

    await tx.animalRescue.update({
      where: { id: relation.animalRescueId },
      data: {
        rescueDate: updatedAnimalData.animalRescueInfo.rescueDate,
        address: updatedAnimalData.animalRescueInfo.rescueLocation,
      },
    });
  }

  async updateAnimalTable(tx: PrismaTransactionClient, updatedAnimalData: Profile) {
    const data = {
      profileTitle: updatedAnimalData.title || null,
      description: updatedAnimalData.description || null,
      name: updatedAnimalData.mainInfo.name,
      birthday:
        moment(updatedAnimalData.mainInfo.birthDate, 'YYYYMMDD').toDate() ||
        null,
      chipNumber: updatedAnimalData.mainInfo.microchip || null,
      chipRegisteredWithUs: updatedAnimalData.mainInfo.microchipRegisteredInLLR,
    };

    await tx.animal.update({
      where: { id: updatedAnimalData.animalId },
      data: data,
    });
  }

  async updateAnimal(updatedAnimalData: Profile) {
    await prisma.$transaction(async tx => {
      await this.characteristicsService.updateCharacteristics(tx, updatedAnimalData);
      await this.updateAnimalTable(tx, updatedAnimalData);
      await this.updateAnimalRescueTable(tx, updatedAnimalData);
    });

    await this.googleSheetsService.updateSheetCells(updatedAnimalData);
  }
}
