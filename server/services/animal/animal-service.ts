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

  async updateAnimalRescueTable(
    tx: PrismaTransactionClient,
    updatedAnimalData: Profile
  ) {
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

  async updateAnimalTable(
    tx: PrismaTransactionClient,
    updatedAnimalData: Profile
  ) {
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

  private isEmptyObject(obj: any): boolean {
    return (
      obj &&
      Object.prototype.toString.call(obj) === '[object Object]' &&
      Object.keys(obj).length === 0
    );
  }

  private isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  private mergeObjects(updated, original) {
    if (!updated) return original;
    if (!original) return updated;

    const merged = { ...original };

    for (const key in updated) {
      const updatedValue = updated[key];

      if (!updatedValue || this.isEmptyObject(updatedValue)) {
        continue;
      }

      if (this.isPlainObject(updatedValue) && this.isPlainObject(merged[key])) {
        merged[key] = this.mergeObjects(updatedValue, merged[key]);
      } else {
        merged[key] = updatedValue;
      }
    }

    return merged;
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
