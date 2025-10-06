import { User } from '@database/models/user';
import CatProfileBuilder from '@services/animal/cat-profile-builder';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class ProfileService {
  constructor(
    @inject(TYPES.CatProfileBuilder)
    private catProfileBuilder: CatProfileBuilder,
  ) { }

  async getCatProfilesByOwner(owner: User, cats: Animal[]): Promise<Profile[]> {
    if (!owner) {
      throw new Error('Owner is required');
    }

    if (cats.length === 0) {
      return [];
    }

    return this.catProfileBuilder.buildProfilesFromSheet(owner, cats);
  }
}
