import AnimalService from '@services/animal/animal-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ProfileHeader } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class AnimalController {
  constructor(
    @inject(TYPES.AnimalService)
    private animalService: AnimalService
  ) { }


  public async updateAnimal(req: Request<object, object, ProfileHeader>, res: Response): Promise<Response> {
    const updateAnimalData = req.body;
    await this.animalService.updateAnimal(updateAnimalData);
    return res.sendStatus(204);
  }
}
