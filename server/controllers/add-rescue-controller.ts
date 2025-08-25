import AnimalService from '@services/animal/animal-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class AddRescueController {
  constructor(
    @inject(TYPES.AnimalService)
    private animalService: AnimalService
  ) {}

  async postAnimal(req: Request, res: Response): Promise<Response> {
    try {
      const newAnimal = await this.animalService.createAnimal(req.body);

      return res.status(201).json(newAnimal.animal.id);
    } catch (error) {
      handleControllerError(error, res, 'Failed to create animal');
    }
  }
}
