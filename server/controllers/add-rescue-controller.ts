import AnimalService from '@services/animal/animal-service';
import GoogleDriveService from '@services/google/google-drive-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class AddRescueController {
  constructor(
    @inject(TYPES.AnimalService) private animalService: AnimalService,
    @inject(TYPES.GoogleDriveService)
    private googleDriveService: GoogleDriveService
  ) {}

  async postAnimal(req: Request, res: Response): Promise<Response> {
    try {
      /*const validationResult = validateCreateAnimal(req.body);
        if (!validationResult.success) {
        res.status(400).json({
            error: 'Invalid input data',
            details: validationResult.errors,
        });
        return;
        }
        */

      //const result = await animalService.createAnimal(validationResult.data);
      const animal = await this.animalService.createAnimal(req.body);

      const date = animal.animalRescue.rescueDate;
      const year = date.getFullYear() % 100;
      const month =
        date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
      const animalID = `${year}'${month} nr ${animal.animalRescue.rankNr}`;
      const driveID = (
        await this.googleDriveService.createDriveFolder(animalID)
      ).data.id;
      return res.status(201).json(driveID);
    } catch (error) {
      handleControllerError(error, res, 'Failed to create animal');
    }
  }
}
