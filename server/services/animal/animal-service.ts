import { prisma } from "server/prisma";
import { User, Animal } from "generated/prisma";
import { Cat } from "@types/Cat";
import CatProfileBuilder from "./cat-profile-builder";
import AnimalRepository from "../../repositories/animal-repository";
import CharacteristicsService from "./characteristics-service";
import GoogleSheetsService from "@services/google/google-sheets-service";
import { injectable, inject } from "inversify";
import TYPES from "@types/inversify-types";

@injectable()
export default class AnimalService {
  private animals: Animal[];
  private profiles: any;
  constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.CharacteristicsService) private characteristicsService: CharacteristicsService,
    @inject(TYPES.CatProfileBuilder) private catProfileBuilder: CatProfileBuilder,
    @inject(TYPES.GoogleSheetsService) private googleSheetsService: GoogleSheetsService,
  ) {
  }

  async getUserCats(email: string): Promise<Animal[]> {
    if (!email) return [];
    if (!this.animals) {
      this.animals = await this.animalRepository.getCatsByUserEmail(email);
    }
    return this.animals;
  }

  async getCatProfilesByOwner(owner: User): Promise<Cat[]> {
    if (!this.profiles) {
      if (!owner) {
        throw new Error("Owner is required");
      }

      const cats = await this.getUserCats(owner.email);
      if (cats.length === 0) return [];

      this.profiles = await this.catProfileBuilder.buildProfilesFromSheet(
        owner,
        cats,
      );
    }
    return this.profiles;
  }

  async updateCatProfile(catData: any, cat: Animal): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this.characteristicsService.updateCharacteristics(tx, cat.id, catData);
      await this.animalRepository.updateRescueInfo(tx, cat.id, catData);
    });

    await this.googleSheetsService.updateCatInSheet(catData);
  }

  async createAnimal(data: CreateAnimalData): Promise<CreateAnimalResult> {
    return await this.animalRepository.createAnimalWithRescue(data);
  }
}