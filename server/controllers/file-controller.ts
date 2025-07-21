import ImageService from '@services/files/image-service';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class FileController {
  constructor(@inject(TYPES.ImageService) private imageService: ImageService) {}

  private normalizeFiles(
    files: Express.Request['files']
  ): Express.Multer.File[] {
    if (!files) return [];

    if (Array.isArray(files)) {
      return files;
    }

    return Object.values(files).flat();
  }

  async addPicture(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ error: 'No files provided' });
        return;
      }

      await this.imageService.insertImagesIntoDB(
        this.normalizeFiles(req.files),
        Number(req.body.userID)
      );

      res.sendStatus(200);
    } catch (error) {
      handleControllerError(error, res, 'Failed to upload pictures');
    }
  }
}
