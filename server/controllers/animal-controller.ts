import AnimalService from '@services/animal/animal-service';
import AuthService from '@services/auth/auth-service';
import { parseDate } from '@utils/date-utils';
import { handleControllerError } from '@utils/error-handler';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Profile } from 'types/cat';
import TYPES from 'types/inversify-types';

@injectable()
export default class AnimalController {
  constructor(
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.AnimalService)
    private animalService: AnimalService
  ) { }

  private stringsToDates(animal: Profile) {
    animal.vaccineInfo.complexVaccine = parseDate(
      animal.vaccineInfo.complexVaccine
    );
    animal.vaccineInfo.nextComplexVaccineDate = parseDate(
      animal.vaccineInfo.nextComplexVaccineDate
    );
    animal.vaccineInfo.rabiesVaccine = parseDate(
      animal.vaccineInfo.rabiesVaccine
    );
    animal.vaccineInfo.nextRabiesVaccineDate = parseDate(
      animal.vaccineInfo.nextRabiesVaccineDate
    );
    animal.vaccineInfo.dewormingOrFleaTreatmentDate = parseDate(
      animal.vaccineInfo.dewormingOrFleaTreatmentDate
    );
    animal.mainInfo.birthDate = parseDate(animal.mainInfo.birthDate);
    animal.animalRescueInfo.rescueDate = parseDate(
      animal.animalRescueInfo.rescueDate
    );
  }

  private multiSelectsToArrays(animal: Profile) {
    Object.entries(animal.characteristics.multiselectFields).map(
      ([label, value]) => {
        if (value === '') {
          animal.characteristics.multiselectFields[label] = [];
          return;
        }
        animal.characteristics.multiselectFields[label] = value.split(',');
      }
    );
  }

  private toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  }

  async updateAnimal(
    req: Request<object, object, Profile>,
    res: Response
  ): Promise<Response> {
    try {
      const updateAnimalData = req.body;
      this.stringsToDates(updateAnimalData);
      this.multiSelectsToArrays(updateAnimalData);
      updateAnimalData.mainInfo.microchipRegisteredInLLR = this.toBoolean(updateAnimalData.mainInfo.microchipRegisteredInLLR);

      await this.animalService.updateAnimal(updateAnimalData);
      return res.sendStatus(204);
    } catch (error) {
      handleControllerError(error, res, 'Failed to update pet');
    }
  }
}
