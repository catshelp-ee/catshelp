import AnimalRepository from '@repositories/animal-repository';
import AnimalRescueRepository from '@repositories/animal-rescue-repository';
import FosterHomeRepository from '@repositories/foster-home-repository';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { Animal, User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { prisma } from 'server/prisma';
import { CreateAnimalData, CreateAnimalResult } from 'types/animal';
import { Profile, ProfileHeader } from 'types/cat';
import TYPES from 'types/inversify-types';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class AnimalService {
  constructor(
    @inject(TYPES.AnimalRepository)
    private animalRepository: AnimalRepository,
    @inject(TYPES.AnimalRescueRepository)
    private animalRescueRepository: AnimalRescueRepository,
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService,
    @inject(TYPES.FosterHomeRepository)
    private fosterHomeRepository: FosterHomeRepository,
  ) { }

  getAnimalsByUserId(id: number | string): Promise<Animal[]> {
    return this.animalRepository.getAnimalsByUserId(id);
  }

  public getAnimalById(id: number | string) {
    return this.animalRepository.getAnimalByIdWithRescue(Number(id));
  }

  public async createAnimal(data: CreateAnimalData, user: User): Promise<CreateAnimalResult> {
    data.date = new Date();
    const animal = await this.animalRepository.createAnimalWithRescue(data);
    data.rankNr = animal.animalRescue.rankNr;

    const fosterHome = await this.fosterHomeRepository.saveOrUpdateFosterHome({ userId: user.id });
    const animalToFosterHomeData = {
      animalId: animal.animal.id,
      fosterHomeId: fosterHome.id
    }
    await this.fosterHomeRepository.saveOrUpdateAnimalToFosterHome(animalToFosterHomeData);

    this.googleSheetsService.addDataToSheet(data, user);
    return animal;
  }

  async updateAnimal(updatedAnimalData: ProfileHeader) {
    await this.animalRepository.updateEditProfile(updatedAnimalData);
  }

  async updateAnimalAdmin(updatedAnimalData: Profile) {
    const animalWithRescue = await this.animalRepository.getAnimalByIdWithRescue(updatedAnimalData.animalId);

    const animalData = {
      id: updatedAnimalData.animalId,
      name: updatedAnimalData.mainInfo.name,
      birthday: updatedAnimalData.mainInfo.birthDate,
      chipNumber: updatedAnimalData.mainInfo.microchip,
      chipRegisteredWithUs: updatedAnimalData.mainInfo.microchipRegisteredInLLR,
      profileTitle: updatedAnimalData.title,
      status: animalWithRescue.status,
      description: updatedAnimalData.description,
    };

    const animalRescue = animalWithRescue.animalsToRescue.at(animalWithRescue.animalsToRescue.length - 1).animalRescue

    const animalRescueData = {
      rankNr: animalRescue.rankNr,
      rescueDate: updatedAnimalData.animalRescueInfo.rescueDate,
      locationNotes: updatedAnimalData.animalRescueInfo.rescueLocation,
      state: animalRescue.state,
      address: animalRescue.address
    };
    await prisma.$transaction(async tx => {
      await this.animalRepository.saveOrUpdateAnimal(animalData, tx);
      await this.animalRescueRepository.saveOrUpdateAnimalRescue(animalRescueData, tx);
      await this.characteristicsService.updateCharacteristics(updatedAnimalData, tx);
    });

    this.googleSheetsService.updateSheetCells(updatedAnimalData).then(() => { }, (error) => {
      console.error("Error saving data to sheets: " + error);
    });
  }
}
