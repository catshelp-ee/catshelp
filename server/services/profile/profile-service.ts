import CatProfileBuilder from '@services/animal/cat-profile-builder';
import NodeCacheService from '@services/cache/cache-service';
import { Animal, User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class ProfileService {
  constructor(
    @inject(TYPES.CatProfileBuilder)
    private catProfileBuilder: CatProfileBuilder,
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
  ) {}

  getProfiles(userID: number | string) {
    return this.nodeCacheService.get<Profile[]>(`profiles:${userID}`);
  }

  setProfiles(userID: number | string, profiles: Profile[]) {
    this.nodeCacheService.set(`profiles:${userID}`, profiles);
  }

  async getCatProfilesByOwner(owner: User, cats: Animal[]): Promise<Profile[]> {
    if (!owner) {
      throw new Error('Owner is required');
    }

    return this.catProfileBuilder.buildProfiles(owner, cats);
  }
}
