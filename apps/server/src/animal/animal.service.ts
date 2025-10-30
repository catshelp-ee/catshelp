import { Profile } from '@catshelp/types';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Injectable } from '@nestjs/common';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { DataSource } from 'typeorm';
import { CharacteristicsService } from './characteristics.service';
import { AnimalRescueDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { RescueResult } from './interfaces/rescue-result';
import { AnimalRepository } from './repositories/animal.repository';
import { FosterHomeRepository } from './repositories/foster-home.repository';
import { RescueRepository } from './repositories/rescue.repository';

@Injectable()
export class AnimalService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly animalRepository: AnimalRepository,
    private readonly userRepository: UserRepository,
    private readonly fosterhomeRepository: FosterHomeRepository,
    private readonly rescueRepository: RescueRepository,
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly characteristicsService: CharacteristicsService,
  ) { }

  async getAnimalsByUserId(id: number): Promise<Animal[]> {
    return this.userRepository.getAnimalsByUserId(id);
  }

  public getAnimalById(id: number | string) {
    return this.animalRepository.getAnimalById(id);
  }

  async saveOrUpdateFosterHome(data: { userId: number }): Promise<FosterHome> {
    return this.fosterhomeRepository.saveOrUpdateFosterHome(data.userId);
  }

  public async createAnimal(
    data: AnimalRescueDto,
    user: User,
  ): Promise<RescueResult> {
    data.date = new Date();

    const animal = await this.animalRepository.createAnimalWithRescue(data);

    data.rankNr = animal.rescue.rankNr;

    await this.saveOrUpdateFosterHome({
      userId: user.id,
    });

    this.googleSheetsService.addDataToSheet(data, user);

    return animal;
  }

  async updateAnimal(updatedAnimalData: UpdateAnimalDto) {
    const animal = await this.animalRepository.getAnimalById(updatedAnimalData.animalId);
    if (!animal) throw new Error('Animal not found');

    animal.profileTitle = updatedAnimalData.title;
    animal.description = updatedAnimalData.description;

    return this.animalRepository.save(animal);
  }

  async updateAnimalAdmin(updatedAnimalData: Profile) {
    const animalWithRescue = (await this.animalRepository.getAnimalByIdWithRescue(updatedAnimalData.animalId))!

    const animalData = {
      id: updatedAnimalData.animalId,
      name: updatedAnimalData.mainInfo.name,
      birthday: updatedAnimalData.mainInfo.birthDate ?? undefined,
      chipNumber: updatedAnimalData.mainInfo.microchip,
      chipRegisteredWithUs: updatedAnimalData.mainInfo.microchipRegisteredInLLR,
      profileTitle: updatedAnimalData.title,
      status: animalWithRescue.status,
      description: updatedAnimalData.description,
    };


    const animalRescue = animalWithRescue.animalRescue;

    const animalRescueData = {
      rankNr: animalRescue.rankNr,
      rescueDate: updatedAnimalData.animalRescueInfo.rescueDate ?? undefined,
      locationNotes: updatedAnimalData.animalRescueInfo.rescueLocation,
      state: animalRescue.state,
      address: animalRescue.address
    };

    await this.animalRepository.save(animalData);
    await this.rescueRepository.save(animalRescueData);
    await this.characteristicsService.updateCharacteristics(updatedAnimalData);

    this.googleSheetsService.updateSheetCells(updatedAnimalData).then(() => { }, (error) => {
      console.error("Error saving data to sheets: " + error);
    });
  }
}
