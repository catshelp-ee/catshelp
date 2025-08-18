import AnimalService from '@services/animal/animal-service';
import AuthService from '@services/auth/auth-service';
import ProfileService from '@services/profile/profile-service';
import UserService from '@services/user/user-service';
import { handleControllerError } from '@utils/error-handler';
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
    private animalService: AnimalService
  ) { }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const decodedToken = this.authService.decodeJWT(req.cookies.jwt);
      const user = await this.userService.getUser(decodedToken.id);
      if (!user) {
        res.status(401).json({ error: 'Invalid authentication' });
        return;
      }

      const cats = await this.animalService.getAnimals(user.id);
      const profiles = await this.profileService.getCatProfilesByOwner(
        user,
        cats
      );
      res.status(200).json({ profiles: profiles });
    } catch (error) {
      handleControllerError(error, res, 'Failed to fetch profile');
    }
  }
}
