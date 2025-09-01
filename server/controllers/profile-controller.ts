import AnimalService from '@services/animal/animal-service';
import CatProfileBuilder from '@services/animal/cat-profile-builder';
import AuthService from '@services/auth/auth-service';
import ProfileService from '@services/profile/profile-service';
import UserService from '@services/user/user-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class ProfileController {
  constructor(
    @inject(TYPES.ProfileService)
    private profileService: ProfileService,
    @inject(TYPES.UserService)
    private userService: UserService,
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.AnimalService)
    private animalService: AnimalService,
    @inject(TYPES.CatProfileBuilder)
    private catProfileBuilder: CatProfileBuilder
  ) { }

  public async getProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    const animals = await this.animalService.getAnimalsByUserId(user.id);
    const profiles = await this.catProfileBuilder.buildProfiles(animals);
    return res.status(200).json({ profiles: profiles });
  }
}
