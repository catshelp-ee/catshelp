import { Profile, PersonalityInfo, createPersonalityInfo } from '@catshelp/types';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Injectable } from '@nestjs/common';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { DataSource } from 'typeorm';
import { CharacteristicsService } from './characteristics.service';
import { AnimalRescueDto } from './dto/create-animal.dto';
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
import { Characteristic } from './entities/characteristic.entity';
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

    public async getProfile(animalId: number | string): Promise<AnimalProfileDto | null> {
        const animal = await this.animalRepository.getAnimalByIdWithRescue(Number(animalId));

        if (!animal){
            throw new Error("No animal found");
        }

        return this.buildProfile(animal);
    }

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

    async updateAnimal(updatedAnimalData: AnimalProfileDto) {
        const animal = await this.animalRepository.getAnimalById(updatedAnimalData.animalId);
        if (!animal) {
            throw new Error('Animal not found');
        }

        animal.name = updatedAnimalData.mainInfo.name;
        animal.birthday = updatedAnimalData.mainInfo.birthDate;
        animal.profileTitle = updatedAnimalData.mainInfo.name;
        animal.status = updatedAnimalData.mainInfo.status;
        animal.chipNumber = updatedAnimalData.mainInfo.microchip;
        animal.chipRegisteredWithUs = updatedAnimalData.mainInfo.chipRegisteredWithUs;
        animal.description = updatedAnimalData.mainInfo.description;
        animal.requirementsForNewFamily = updatedAnimalData.mainInfo.specialRequirementsForNewFamily;
        animal.additionalNotes = updatedAnimalData.mainInfo.additionalNotes;

        await this.characteristicsService.updateCharacteristics(updatedAnimalData);

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
            //chipRegisteredWithUs: updatedAnimalData.mainInfo.microchipRegisteredInLLR, TODO
            //profileTitle: updatedAnimalData.title, TODO kas on vaja
            status: animalWithRescue.status,
            description: updatedAnimalData.mainInfo.description,
        };

        const animalRescue = animalWithRescue.animalRescue;

        const animalRescueData = {
            rankNr: animalRescue.rankNr,
            rescueDate: updatedAnimalData.mainInfo.rescueDate ?? undefined,
            locationNotes: updatedAnimalData.mainInfo.rescueStory,
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

    private getDefaultProfilePicture() {
        return '/missing64x64.png';
    }

    public async getProfilePicture(id: number | string) {
        try {
            const file = await this.fileService.getProfilePicture(id);
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
        const profile = {} as AnimalProfileDto;
        const characteristicsMap = await this.getCharacteristicMap(animal.id);

        profile.animalId = animal.id;
        profile.mainInfo = this.createMainInfo(animal, characteristicsMap);        
        profile.personalityInfo = this.createPersonalityInfo(characteristicsMap);

        // Fetch images
        profile.images = await this.getImages(animal.id);

        return profile;
    }

    private async getCharacteristicMap(animalId): Promise<Record<string, Characteristic>> {
        const characteristics = await this.characteristicsService.getCharacteristics(animalId);
        const characteristicsMap: Record<string, Characteristic> = {};

        for (const characteristic of characteristics) {
            characteristicsMap[characteristic.type] = characteristic;
        }
        return characteristicsMap;
    }

    private createMainInfo(animal: Animal, characteristicsMap: Record<string, Characteristic>) {
        const mainInfo = {
            name: animal.name,
            rankNr: animal.animalRescue?.rankNr ?? '',
            birthDate: animal.birthday,
            rescueDate: animal.animalRescue?.rescueDate ?? '',
            gender: characteristicsMap['gender']?.value ?? '',
            coatColour: characteristicsMap['coatColour']?.value ?? '',
            coatLength: characteristicsMap['coatLength']?.value ?? '',
            location: 'TODO',
            microchip: animal.chipNumber,
            fosterStayDuration: 'TODO',
            chronicConditions: 'TODO',
            description: animal.description,
            rescueStory: animal.animalRescue?.locationNotes,
            status: animal.status,
            chipRegisteredWithUs: animal.chipRegisteredWithUs,
            specialRequirementsForNewFamily: animal.requirementsForNewFamily,
            additionalNotes: animal.additionalNotes,
            spayedOrNeutered: characteristicsMap['spayedOrNeutered']?.value ?? '',
        };
        return mainInfo;
    }

    private createPersonalityInfo(characteristicsMap: Record<string, Characteristic>) {
        const personalityInfo = {
            bold: characteristicsMap["bold"]?.value === 'true',
            shy: characteristicsMap["shy"]?.value === 'true',
            active: characteristicsMap["active"]?.value === 'true',
            veryActive: characteristicsMap["veryActive"]?.value === 'true',
            calm: characteristicsMap["calm"]?.value === 'true',
            friendly: characteristicsMap["friendly"]?.value === 'true',
            grumpy: characteristicsMap["grumpy"]?.value === 'true',
            vocal: characteristicsMap["vocal"]?.value === 'true',
            dislikesTouching: characteristicsMap["dislikesTouching"]?.value === 'true',
            sociable: characteristicsMap["sociable"]?.value === 'true',
            aloof: characteristicsMap["aloof"]?.value === 'true',
            goodAppetite: characteristicsMap["goodAppetite"]?.value === 'true',
            curious: characteristicsMap["curious"]?.value === 'true',
            playful: characteristicsMap["playful"]?.value === 'true',
            stressed: characteristicsMap["stressed"]?.value === 'true',
            sensitive: characteristicsMap["sensitive"]?.value === 'true',
            peaceful: characteristicsMap["peaceful"]?.value === 'true',
            selfish: characteristicsMap["selfish"]?.value === 'true',
            hisses: characteristicsMap["hisses"]?.value === 'true',
            beingOnLap: characteristicsMap["beingOnLap"]?.value === 'true',
            sleepsCuddling: characteristicsMap["sleepsCuddling"]?.value === 'true',
            likesPetting: characteristicsMap["likesPetting"]?.value === 'true',
            likesAttention: characteristicsMap["likesAttention"]?.value === 'true',
            likesPlayingWithPeople: characteristicsMap["likesPlayingWithPeople"]?.value === 'true',
            likesPlayingAlone: characteristicsMap["likesPlayingAlone"]?.value === 'true',
            usesLitterbox: characteristicsMap["usesLitterbox"]?.value === 'true',
            usesScratchingpost: characteristicsMap["usesScratchingpost"]?.value === 'true',
            selectiveWithFood: characteristicsMap["selectiveWithFood"]?.value === 'true',
            adaptable: characteristicsMap["adaptable"]?.value === 'true',
            scratchesFurniture: characteristicsMap["scratchesFurniture"]?.value === 'true',
            trusting: characteristicsMap["trusting"]?.value === 'true',
            description: characteristicsMap["description"]?.value ?? '',
            attitudeTowardsCats: characteristicsMap["attitudeTowardsCats"]?.value ?? '',
            attitudeTowardsDogs: characteristicsMap["attitudeTowardsDogs"]?.value ?? '',
            attitudeTowardsChildren: characteristicsMap["attitudeTowardsChildren"]?.value ?? '',
            suitabilityForIndoorOrOutdoor: characteristicsMap["suitabilityForIndoorOrOutdoor"]?.value ?? '',
        }
        return personalityInfo;
    }
}
