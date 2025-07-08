import NodeCacheService from '@services/cache/cache-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { Animal, User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import { formFields } from 'types/cat';
import TYPES from 'types/inversify-types';
import AnimalRepository from '../../repositories/animal-repository';

@injectable()
export default class AnimalService {
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
  ) {}

  getAnimals(userID: number | string): Promise<Animal[]> {
    return this.nodeCacheService.get(`animals:${userID}`);
  }

  async setAnimals(user: User): Promise<Animal[]> {
    if (!user) {
      return [];
    }
    this.nodeCacheService.set(
      `animals:${user.id}`,
      this.animalRepository.getCatsByUserEmail(user.email)
    );
  }

  async createAnimal(data: CreateAnimalData): Promise<CreateAnimalResult> {
    const animal = await this.animalRepository.createAnimalWithRescue(data);
    const date = animal.animalRescue.rescueDate;
    const year = date.getFullYear() % 100;
    const month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
    data.rankNr = `${year}'${month} nr ${animal.animalRescue.rankNr}`;
    this.googleSheetsService.addDataToSheet(data);
    return animal;
  }

  async updateAnimal(updateAnimalData: formFields, userID: number | string) {
    const animalRows = await this.googleSheetsService.getRows(userID);
    const animal = animalRows.find(
      animalRow => animalRow.row.catName === updateAnimalData.name
    );
    await this.googleSheetsService.updateSheetCells(
      updateAnimalData,
      animal.index
    );
  }
}
