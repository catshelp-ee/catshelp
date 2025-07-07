import GoogleSheetsService from '@services/google/google-sheets-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import TYPES from 'types/inversify-types';
import AnimalRepository from '../../repositories/animal-repository';

@injectable()
export default class AnimalService {
  private animals: Animal[];
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {}

  async getUserCats(email: string): Promise<Animal[]> {
    if (!email) {
      return [];
    }
    if (!this.animals) {
      this.animals = await this.animalRepository.getCatsByUserEmail(email);
    }
    return this.animals;
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

  async updatePet(updatedCats: any) {}
}
