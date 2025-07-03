import CatProfileBuilder from "@services/animal/cat-profile-builder";
import CharacteristicsService from "@services/animal/characteristics-service";
import GoogleSheetsService from "@services/google/google-sheets-service";
import { inject, injectable } from "inversify";
import AnimalRepository from "server/repositories/animal-repository";
import TYPES from "types/inversify-types";
import { User } from "generated/prisma";
import { Cat } from "types/cat";
import AnimalService from "@services/animal/animal-service";
import NodeCacheService from "@services/cache/cache-service";

@injectable()
export default class ProfileService{
    constructor(
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository,
    @inject(TYPES.CharacteristicsService) private characteristicsService: CharacteristicsService,
    @inject(TYPES.CatProfileBuilder) private catProfileBuilder: CatProfileBuilder,
    @inject(TYPES.GoogleSheetsService) private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.AnimalService) private animalService: AnimalService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService

    ){}
    
  async getCatProfilesByOwner(owner: User): Promise<Cat[]> {
    if (!owner) {
      throw new Error("Owner is required");
    }

    let profiles = await this.nodeCacheService.get<Cat[]>(`profiles:${owner.id}`);

    if (!profiles) {
      const cats = await this.animalService.getUserCats(owner.email);
      if (cats.length === 0) return [];

      profiles = await this.catProfileBuilder.buildProfilesFromSheet(
        owner,
        cats,
      );
      this.nodeCacheService.set(`profiles:${owner.id}`, profiles);
    }
    return profiles;
  }

  /*async updateCatProfile(catData: any, cat: Animal): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this.characteristicsService.updateCharacteristics(tx, cat.id, catData);
      await this.animalRepository.updateRescueInfo(tx, cat.id, catData);
    });

    await this.googleSheetsService.updateCatInSheet(catData);
  }
    -*/
}
