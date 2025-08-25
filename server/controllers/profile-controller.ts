import AnimalRepository from '@repositories/animal-repository';
import CatProfileBuilder from '@services/animal/cat-profile-builder';
import AuthService from '@services/auth/auth-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class ProfileController {
  constructor(
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.AnimalRepository)
    private animalRepository: AnimalRepository,
    @inject(TYPES.CatProfileBuilder)
    private catProfileBuilder: CatProfileBuilder
  ) {}

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const decodedToken = this.authService.decodeJWT(req.cookies.jwt);

      const animals = await this.animalRepository.getAnimalsByUserId(
        Number(decodedToken.id)
      );

      const profiles = await this.catProfileBuilder.buildProfiles(animals);
      return res.status(200).json({ profiles: profiles });
    } catch (error) {
      handleControllerError(error, res, 'Failed to fetch profile');
    }
  }
}
