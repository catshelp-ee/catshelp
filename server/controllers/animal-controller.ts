import AnimalService from '@services/animal/animal-service';
import AuthService from '@services/auth/auth-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { formFields } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class AnimalController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.AnimalService) private animalService: AnimalService
  ) {}

  async updateAnimal(
    req: Request<object, object, formFields>,
    res: Response
  ): Promise<Response> {
    try {
      /*const validationResult = validateUpdatePet(req.body);
        if (!validationResult.success) {
        res.status(400).json({
            error: 'Invalid input data',
            details: validationResult.errors,
        });
        return;
        }*/

      const updateAnimalData = req.body;
      const userID = this.authService.decodeJWT(req.cookies.jwt).id;
      await this.animalService.updateAnimal(updateAnimalData, userID);
      return res.sendStatus(204);
    } catch (error) {
      handleControllerError(error, res, 'Failed to update pet');
    }
  }
}
