import { Animal } from "generated/prisma";
import AnimalRepository from "../../repositories/animal-repository";
import { injectable, inject } from "inversify";
import TYPES from "types/inversify-types";

@injectable()
export default class AnimalService {
  private animals: Animal[];
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
  ) {
  }

  async getUserCats(email: string): Promise<Animal[]> {
    if (!email) return [];
    if (!this.animals) {
      this.animals = await this.animalRepository.getCatsByUserEmail(email);
    }
    return this.animals;
  }

  async createAnimal(data: CreateAnimalData): Promise<CreateAnimalResult> {
    return await this.animalRepository.createAnimalWithRescue(data);
  }
}