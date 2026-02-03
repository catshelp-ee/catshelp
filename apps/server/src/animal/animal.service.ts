import { createProfile, Profile } from '@catshelp/types';
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
import { AnimalToFosterHome } from './entities/animalToFosterhome.entity';
import { AnimalToFosterHomeRepository } from './repositories/animal-to-fosterhome.repository';
import { FileService } from '@file/file.service';
import { NotificationService } from '@notification/notification.service';
import { AnimalSummaryDto } from '@animal/dto/animal-summary.dto';
import { AnimalTodoDto } from '@animal/dto/animal-todo.dto';
import { AnimalProfileDto } from '@user/dtos/animal-profile.dto';
import { UpdateProfilePictureDTO } from './dto/update-profile-picture-dto';
import { FileRepository } from '../file/file.repository';
import { getRootPath } from '@server/src/main';
import { join } from 'path';

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
        private readonly animalToFosterhomeRepository: AnimalToFosterHomeRepository,
        private readonly fileService: FileService,
        private readonly notificationService: NotificationService,
        private readonly fileRepository: FileRepository,
    ) { }

    async getAnimalsByUserId(id: number | string): Promise<Animal[]> {
        return this.userRepository.getAnimalsByUserId(id);
    }

    public getAnimalById(id: number | string) {
        return this.animalRepository.getAnimalById(id);
    }

    async saveOrUpdateFosterHome(data: { userId: number }): Promise<FosterHome> {
        return this.fosterhomeRepository.saveOrUpdateFosterHome(data.userId);
    }

    public async getNotifications(animals): Promise<AnimalTodoDto[]> {
        return this.notificationService.processNotifications(animals);
    }

    public async createAnimal(data: AnimalRescueDto, user: User): Promise<RescueResult> {
        data.date = new Date();
        const animal = await this.animalRepository.saveOrUpdateAnimal({});

        const rescueData = {
            rescueDate: data.date,
            state: data.state,
            address: data.location,
            locationNotes: data.notes,
            animal: animal,
        };
        const rescue = await this.rescueRepository.saveOrUpdateAnimalRescue(rescueData);
        data.rankNr = rescue.rankNr;

        const fosterHome = await this.saveOrUpdateFosterHome({
            userId: user.id,
        });

        const animalToFosterHomeData: Partial<AnimalToFosterHome> = {
            animal: animal,
            fosterHomeId: fosterHome.id
        }
        await this.animalToFosterhomeRepository.saveOrUpdate(animalToFosterHomeData);
        this.googleSheetsService.addDataToSheet(data, user);
        return { animal, rescue };
    }

    async updateAnimal(updatedAnimalData: UpdateAnimalDto) {
        const animal = await this.animalRepository.getAnimalById(updatedAnimalData.animalId);
        if (!animal) throw new Error('Animal not found');

        animal.profileTitle = updatedAnimalData.title;
        animal.description = updatedAnimalData.description;

        return this.animalRepository.save(animal);
    }


    async setAsProfilePicture(updatedProfilePictureDTO: UpdateProfilePictureDTO) {
        const animal = await this.animalRepository.getAnimalById(updatedProfilePictureDTO.animalId);
        if (!animal){
            throw new Error('Animal not found');
        }

        return await this.fileRepository.setProfilePicture(animal.id, updatedProfilePictureDTO.fileName);
    }

    async updateAnimalAdmin(updatedAnimalData: Profile) {
        const animalWithRescue = (await this.animalRepository.getAnimalByIdWithRescue(updatedAnimalData.animalId))!

        const animal = new Animal();
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

        await this.animalRepository.saveOrUpdateAnimal(animalData);
        await this.rescueRepository.saveOrUpdateAnimalRescue(animalRescueData);
        await this.characteristicsService.updateCharacteristics(updatedAnimalData);
        const savedAnimalWithRescue = (await this.animalRepository.getAnimalByIdWithRescue(updatedAnimalData.animalId))!;
        const animalRescueSequenceNumber = savedAnimalWithRescue.animalRescue.rankNr

        this.googleSheetsService.updateSheetCells(updatedAnimalData, animalRescueSequenceNumber).then(() => { }, (error) => {
            console.error("Error saving data to sheets: " + error);
        });
    }

    public async getImages(animalId: number) {
        return this.fileService.fetchImagePathsByAnimalId(animalId);
    }

    private async getDefaultProfilePicture() {
        return '/missing64x64.png';
    }

    public async getProfilePicture(id: number | string) {
        try {
            const file = await this.fileRepository.getProfilePicture(id);
            return join('/images', `${file?.uuid}.jpg`);
        } catch (error) {
            return this.getDefaultProfilePicture();
        }
    }

    public async getAnimalSummaries(animals: Animal[]): Promise<AnimalSummaryDto[]> {
        const data: AnimalSummaryDto[] = [];
        for (let index = 0; index < animals.length; index++) {
            const animal = animals[index];

            data.push({
                id: animal.id,
                name: animal.name,
                pathToProfilePicture: await this.getProfilePicture(animal.id)
            } as AnimalSummaryDto);
        }

        return data;
    }

    public async buildProfile(animal: Animal): Promise<AnimalProfileDto | null> {
        const profile = createProfile();

        profile.animalId = animal.id;
        profile.mainInfo.name = animal.name;
        profile.title = animal.profileTitle;
        profile.description = animal.description;
        profile.mainInfo.microchip = animal.chipNumber;
        profile.mainInfo.microchipRegisteredInLLR = animal.chipRegisteredWithUs;
        profile.mainInfo.birthDate = animal.birthday;

        // Get characteristics using service (can be transactional if service uses @Transactional or EntityManager)
        profile.characteristics = await this.characteristicsService.getCharacteristics(animal.id);

        // Fetch images
        profile.images = await this.getImages(animal.id);
        profile.profilePictureFilename = await this.getProfilePicture(animal.id);

        return profile;
    }
}
