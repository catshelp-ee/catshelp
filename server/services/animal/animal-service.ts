import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import AnimalRepository from '../../repositories/animal-repository';

@injectable()
export default class AnimalService {
  private animals: Animal[];
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository
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
    return await this.animalRepository.createAnimalWithRescue(data);
  }
}
