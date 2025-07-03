import { animalService } from '@services/animal/animal-service';
import { handleControllerError } from '@utils/error-handler';
import {
  validateCreateAnimal,
  validateUpdatePet,
} from '@validators/animal-validators';
import { Request, Response } from 'express';

export async function postAnimal(req: Request, res: Response): Promise<void> {
  try {
    const validationResult = validateCreateAnimal(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid input data',
        details: validationResult.errors,
      });
      return;
    }

    const result = await animalService.createAnimal(validationResult.data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    handleControllerError(error, res, 'Failed to create animal');
  }
}

export async function updatePet(req: Request, res: Response): Promise<void> {
  try {
    const validationResult = validateUpdatePet(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid input data',
        details: validationResult.errors,
      });
      return;
    }

    await animalService.updatePet(validationResult.data);
    res.status(200).json({ success: true, message: 'uuendatud edukalt' });
  } catch (error) {
    handleControllerError(error, res, 'Failed to update pet');
  }
}
