import NodeCacheService from '@services/cache/cache-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import ProfileService from '@services/profile/profile-service';
import UserService from '@services/user/user-service';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { prisma } from 'server/prisma';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';
import { PrismaTransactionClient } from 'types/prisma';
import AnimalRepository from '../../repositories/animal-repository';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class AnimalService {
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.ProfileService) private profileService: ProfileService
  ) {}

  async createAnimal(data: CreateAnimalData): Promise<CreateAnimalResult> {
    data.date = new Date();
    const animal = await this.animalRepository.createAnimalWithRescue(data);
    data.rankNr = animal.animalRescue.rankNr;
    this.googleSheetsService.addDataToSheet(data);
    return animal;
  }

  async updateAnimalRescueTable(
    tx: PrismaTransactionClient,
    animalID: number,
    updatedAnimalData: Profile
  ) {
    const relation = await tx.animalToAnimalRescue.findFirst({
      where: { animalId: animalID },
    });

    if (!relation?.animalRescueId) {
      throw new Error(`AnimalRescue relation missing for cat ID: ${animalID}`);
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
    animalID: number,
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
      where: { id: animalID },
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

  async updateAnimal(updatedAnimalData: Profile, userID: number | string) {
    const animalRows = await this.googleSheetsService.getRows(userID);
    const animal = animalRows.find(
      animalRow => animalRow.row.catName === updatedAnimalData.mainInfo.name
    );

    await prisma.$transaction(async tx => {
      await this.characteristicsService.updateCharacteristics(
        tx,
        animal.id,
        updatedAnimalData
      );
      await this.updateAnimalTable(tx, animal.id, updatedAnimalData);
      await this.updateAnimalRescueTable(tx, animal.id, updatedAnimalData);
    });

    await this.googleSheetsService.updateSheetCells(
      updatedAnimalData,
      animal.index,
      animal
    );

    const user = await this.userService.getUser(userID);

    await this.setAnimals(user);
    const profiles = await this.profileService.getProfiles(userID);
    const index = profiles.findIndex(
      profile => profile.mainInfo.name === animal.row.catName
    );

    profiles[index] = this.mergeObjects(updatedAnimalData, profiles[index]);
    await this.profileService.setProfiles(userID, profiles);

    const animalIndex = animalRows.findIndex(
      animalRow => animalRow.row.catName === updatedAnimalData.mainInfo.name
    );
    animalRows[animalIndex] = animal;
    await this.googleSheetsService.setRows(userID, animalRows);
  }
}
