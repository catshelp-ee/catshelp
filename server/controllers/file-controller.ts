import ImageService from '@services/files/image-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import AnimalRepository from 'server/repositories/animal-repository';
import TYPES from 'types/inversify-types';

@injectable()
export default class FileController {
  constructor(
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.AnimalRepository) private animalRepository: AnimalRepository
  ) {}

  async addPicture(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ error: 'No files provided' });
        return;
      }
      let animal;
      if (req.body.userEmail) {
        const animals = await this.animalRepository.getCatsByUserEmail(
          req.body.userEmail
        );

        animal = animals.find(animal => animal.name === req.body.animalName);
      } else {
        // If email is null, then a new animal has been submitted/created and thus the animals name is the rank nr
        animal = this.animalRepository.getCatByRankNr(req.body.animalName);
      }

      await this.imageService.insertImageFilenamesIntoDB(req.files, animal.id);
      res.sendStatus(200);
    } catch (error) {
      handleControllerError(error, res, 'Failed to upload pictures');
    }
  }
}
