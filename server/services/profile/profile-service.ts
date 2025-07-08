import AnimalService from '@services/animal/animal-service';
import CatProfileBuilder from '@services/animal/cat-profile-builder';
import NodeCacheService from '@services/cache/cache-service';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Cat } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class ProfileService {
  constructor(
    @inject(TYPES.CatProfileBuilder)
    private catProfileBuilder: CatProfileBuilder,
    @inject(TYPES.AnimalService) private animalService: AnimalService,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
  ) {}

  getProfiles(userID: number | string) {
    return this.nodeCacheService.get<Cat[]>(`profiles:${userID}`);
  }

  setProfiles(userID: number | string, profiles: Cat[]) {
    this.nodeCacheService.set(`profiles:${userID}`, profiles);
  }

  async getCatProfilesByOwner(owner: User): Promise<Cat[]> {
    if (!owner) {
      throw new Error('Owner is required');
    }

    let profiles = await this.getProfiles(owner.id);

    if (!profiles) {
      const cats = await this.animalService.getAnimals(owner.id);
      if (cats.length === 0) {
        return [];
      }

      profiles = await this.catProfileBuilder.buildProfilesFromSheet(
        owner,
        cats
      );
      this.setProfiles(owner.id, profiles);
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
