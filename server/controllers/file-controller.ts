import ImageService from '@services/files/image-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class FileController {
  constructor(
    @inject(TYPES.ImageService)
    private imageService: ImageService
  ) { }

  public async addPicture(req: Request, res: Response): Promise<void> {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ error: 'No files provided' });
      return;
    }

    const paths = await this.imageService.insertImageFilenamesIntoDB(
      req.files,
      req.body.animalId
    );

    res.send(paths);
  }
}
