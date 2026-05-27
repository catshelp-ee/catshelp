import { AnimalSummaryDto } from '@animal/dto/animal-summary.dto';
import { AnimalTodoDto } from '@animal/dto/animal-todo.dto';
import { FileService } from '@file/file.service';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '@notification/notification.service';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { CharacteristicsService } from './characteristics.service';
import { AnimalRescueDto } from './dto/create-animal.dto';
import { Animal } from './entities/animal.entity';
import { AnimalToFosterHome } from './entities/animalToFosterhome.entity';
import { Characteristic } from './entities/characteristic.entity';
import { RescueResult } from './interfaces/rescue-result';
import { AnimalToFosterHomeRepository } from './repositories/animal-to-fosterhome.repository';
import { AnimalRepository } from './repositories/animal.repository';
import { FosterHomeRepository } from './repositories/foster-home.repository';
import { RescueRepository } from './repositories/rescue.repository';
import { AnimalProfileDto, ImageDto } from '@user/dtos/animal-profile.dto';
import { saveBase64ImageToDisk, getImageFromDisk, deleteImageFromDisk } from '@common/utils/disk-utils';
import { FileDto } from '@file/dto/file.dto';

@Injectable()
export class AnimalService {
    constructor(
        private readonly animalRepository: AnimalRepository,
        private readonly userRepository: UserRepository,
        private readonly fosterhomeRepository: FosterHomeRepository,
        private readonly rescueRepository: RescueRepository,
        private readonly googleSheetsService: GoogleSheetsService,
        private readonly characteristicsService: CharacteristicsService,
        private readonly animalToFosterhomeRepository: AnimalToFosterHomeRepository,
        private readonly fileService: FileService,
        private readonly notificationService: NotificationService,
    ) {}

    public async getProfile(
        animalId: number | string,
    ): Promise<AnimalProfileDto | null> {
        const animal = await this.animalRepository.getAnimalByIdWithRescue(
            Number(animalId),
        );

        if (!animal) {
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

    async saveOrUpdateFosterHome(data: {
        userId: number;
    }): Promise<FosterHome> {
        return this.fosterhomeRepository.saveOrUpdateFosterHome(data.userId);
    }

    public async getNotifications(animals): Promise<AnimalTodoDto[]> {
        return this.notificationService.processNotifications(animals);
    }

    public async createAnimal(
        data: AnimalRescueDto,
        user: User,
    ): Promise<RescueResult> {
        data.date = new Date();
        const animal = await this.animalRepository.saveOrUpdateAnimal({});

        const rescueData = {
            rescueDate: data.date,
            state: data.state,
            address: data.location,
            locationNotes: data.notes,
            animal: animal,
        };
        const rescue =
            await this.rescueRepository.saveOrUpdateAnimalRescue(rescueData);
        data.rankNr = rescue.rankNr;

        const fosterHome = await this.saveOrUpdateFosterHome({
            userId: user.id,
        });

        const animalToFosterHomeData: Partial<AnimalToFosterHome> = {
            animal: animal,
            fosterHomeId: fosterHome.id,
        };
        await this.animalToFosterhomeRepository.saveOrUpdate(
            animalToFosterHomeData,
        );
        this.googleSheetsService.addNewAnimalDataToSheet(data, user);
        return { animal, rescue };
    }

    async updateAnimal(updatedAnimalData: AnimalProfileDto) {
        const animal = await this.animalRepository.getAnimalById(
            updatedAnimalData.animalId,
        );
        if (!animal) {
            throw new Error('Animal not found');
        }

        animal.name = updatedAnimalData.mainInfo.name;
        animal.birthday = updatedAnimalData.mainInfo.birthDate;
        animal.profileTitle = updatedAnimalData.mainInfo.name;
        animal.status = updatedAnimalData.mainInfo.status;
        animal.chipNumber = updatedAnimalData.mainInfo.microchip;
        animal.chipRegisteredWithUs =
            updatedAnimalData.mainInfo.chipRegisteredWithUs;
        animal.description = updatedAnimalData.mainInfo.description;
        animal.requirementsForNewFamily =
            updatedAnimalData.mainInfo.specialRequirementsForNewFamily;
        animal.additionalNotes = updatedAnimalData.mainInfo.additionalNotes;
        animal.chronicConditions = updatedAnimalData.mainInfo.chronicConditions;
        const updatedAnimal = await this.animalRepository.save(animal);

        await this.characteristicsService.updateCharacteristics(
            updatedAnimalData,
        );

        const animalWithRescue =
            (await this.animalRepository.getAnimalByIdWithRescue(
                updatedAnimalData.animalId,
            ))!;
        const animalRescue = animalWithRescue.animalRescue;
        const animalRescueData = {
            rankNr: animalRescue.rankNr,
            rescueDate: updatedAnimalData.mainInfo.rescueDate ?? undefined,
            locationNotes: updatedAnimalData.mainInfo.rescueStory,
            state: animalRescue.state,
            address: animalRescue.address,
        };
        await this.rescueRepository.saveOrUpdateAnimalRescue(animalRescueData);
        await this.saveImages(updatedAnimalData);

        /*
        VAJAB VEEL TEGEMIST
        this.googleSheetsService.updateSheetCells(updatedAnimalData, animalRescue.rankNr).then(() => { }, (error) => {
            console.error("Error saving data to sheets: " + error);
        });
        */
        return updatedAnimal;
    }

    private async saveImages(updatedAnimalData: AnimalProfileDto): Promise<void> {
        const existingImages = await this.fileService.getImagesByAnimalId(updatedAnimalData.animalId);
        const existingImageIds = existingImages.map(image => image.id);
        const updatedImageIds = updatedAnimalData.images.map(image => image.id);

        await this.updateProfileImage(existingImages, updatedAnimalData.images);

        const newImages = updatedAnimalData.images.filter(image => {
            return existingImageIds.indexOf(image.id) === -1;
        });
        await this.saveNewImages(newImages, updatedAnimalData.animalId);

        const removedImages = existingImages.filter(image => {
            return updatedImageIds.indexOf(image.id!) === -1;
        });
        await this.deleteRemovedImages(removedImages);
    }

    private async saveNewImages(newImages: ImageDto[], animalId: number): Promise<void> {
        if (newImages && newImages.length > 0) {
            let newFiles: FileDto[] = [];
            for (const image of newImages) {
                const fileName = await saveBase64ImageToDisk(image.data);

                const fileData = {
                    uuid: fileName.replace('.jpg', ''),
                    extension: 'jpg',
                    type: image.type ?? 'image',
                    animalId: animalId,
                };
                newFiles.push(fileData);
            }
            await this.fileService.saveFiles(newFiles);
        }
    }

    private async updateProfileImage(existingImages: FileDto[], newImages: ImageDto[]) {
        const oldProfileImage = existingImages.find(image => image.type === 'profile');
        const newProfileImage = newImages.find(image => image.type === 'profile');
        if (oldProfileImage && (!newProfileImage || oldProfileImage.id !== newProfileImage.id)) {
            oldProfileImage.type = 'image';
            await this.fileService.saveFiles([oldProfileImage]);
        }

        if (newProfileImage && newProfileImage.id !== 0 && (!oldProfileImage || oldProfileImage.id !== newProfileImage.id)) {
            const newProfileImageFile = existingImages.find(image => image.id === newProfileImage.id);
            newProfileImageFile!.type = 'profile';
            await this.fileService.saveFiles([newProfileImageFile!]);
        }
    }

    private async deleteRemovedImages(removedImages: FileDto[]): Promise<void> {
        if (removedImages && removedImages.length > 0) {
            let filesToDelete: number[] = [];
            for (const image of removedImages) {
                filesToDelete.push(image.id!);
                await deleteImageFromDisk(image.uuid! + '.' + image.extension!);
            }
            await this.fileService.deleteFiles(filesToDelete);
        }
    }

    public async getImages(animalId: number): Promise<ImageDto[]> {
        const images = await this.fileService.getImagesByAnimalId(animalId);
        const result: ImageDto[] = [];
        for (const image of images) {
            const file = await getImageFromDisk(image.uuid + '.' + image.extension);
            const mimeType = 'image/' + image.extension;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const imageData = `data:${mimeType};base64,${buffer.toString('base64')}`;

            result.push({
                id: image.id ?? 0,
                data: imageData,
                type: image.type ?? 'image',
            });
        }
        return result;
    }

    public async getAnimalSummaries(animals: Animal[]): Promise<AnimalSummaryDto[]> {
        const data: AnimalSummaryDto[] = [];
        for (let index = 0; index < animals.length; index++) {
            const animal = animals[index];

            data.push({
                id: animal.id,
                name: animal.name
            } as AnimalSummaryDto);
        }

        return data;
    }

    public async buildProfile(
        animal: Animal,
    ): Promise<AnimalProfileDto | null> {
        const profile = {} as AnimalProfileDto;
        const characteristicsMap = await this.getCharacteristicMap(animal.id);

        profile.animalId = animal.id;
        profile.mainInfo = this.createMainInfo(animal, characteristicsMap);
        profile.personalityInfo = this.createPersonalityInfo(characteristicsMap);

        // Fetch images
        profile.images = await this.getImages(animal.id);

        return profile;
    }

    private async getCharacteristicMap(
        animalId,
    ): Promise<Record<string, Characteristic>> {
        const characteristics =
            await this.characteristicsService.getCharacteristics(animalId);
        const characteristicsMap: Record<string, Characteristic> = {};

        for (const characteristic of characteristics) {
            characteristicsMap[characteristic.type] = characteristic;
        }
        return characteristicsMap;
    }

    private createMainInfo(
        animal: Animal,
        characteristicsMap: Record<string, Characteristic>,
    ) {
        const mainInfo = {
            name: animal.name,
            rankNr: animal.animalRescue?.rankNr ?? '',
            birthDate: animal.birthday,
            rescueDate: animal.animalRescue?.rescueDate ?? '',
            gender: characteristicsMap['gender']?.value ?? '',
            coatColour: characteristicsMap['coatColour']?.value ?? '',
            coatLength: characteristicsMap['coatLength']?.value ?? '',
            location: animal.animalRescue?.address ?? '',
            microchip: animal.chipNumber,
            fosterStayDuration: 'TODO',
            chronicConditions: animal.chronicConditions,
            description: animal.description,
            rescueStory: animal.animalRescue?.locationNotes,
            status: animal.status,
            chipRegisteredWithUs: animal.chipRegisteredWithUs,
            specialRequirementsForNewFamily: animal.requirementsForNewFamily,
            additionalNotes: animal.additionalNotes,
            spayedOrNeutered:
                characteristicsMap['spayedOrNeutered']?.value ?? '',
        };
        return mainInfo;
    }

    private createPersonalityInfo(
        characteristicsMap: Record<string, Characteristic>,
    ) {
        const personalityInfo = {
            bold: characteristicsMap['bold']?.value === 'true',
            shy: characteristicsMap['shy']?.value === 'true',
            active: characteristicsMap['active']?.value === 'true',
            veryActive: characteristicsMap['veryActive']?.value === 'true',
            calm: characteristicsMap['calm']?.value === 'true',
            friendly: characteristicsMap['friendly']?.value === 'true',
            grumpy: characteristicsMap['grumpy']?.value === 'true',
            vocal: characteristicsMap['vocal']?.value === 'true',
            dislikesTouching:
                characteristicsMap['dislikesTouching']?.value === 'true',
            sociable: characteristicsMap['sociable']?.value === 'true',
            aloof: characteristicsMap['aloof']?.value === 'true',
            goodAppetite: characteristicsMap['goodAppetite']?.value === 'true',
            curious: characteristicsMap['curious']?.value === 'true',
            playful: characteristicsMap['playful']?.value === 'true',
            stressed: characteristicsMap['stressed']?.value === 'true',
            sensitive: characteristicsMap['sensitive']?.value === 'true',
            peaceful: characteristicsMap['peaceful']?.value === 'true',
            selfish: characteristicsMap['selfish']?.value === 'true',
            hisses: characteristicsMap['hisses']?.value === 'true',
            beingOnLap: characteristicsMap['beingOnLap']?.value === 'true',
            sleepsCuddling:
                characteristicsMap['sleepsCuddling']?.value === 'true',
            likesPetting: characteristicsMap['likesPetting']?.value === 'true',
            likesAttention:
                characteristicsMap['likesAttention']?.value === 'true',
            likesPlayingWithPeople:
                characteristicsMap['likesPlayingWithPeople']?.value === 'true',
            likesPlayingAlone:
                characteristicsMap['likesPlayingAlone']?.value === 'true',
            usesLitterbox:
                characteristicsMap['usesLitterbox']?.value === 'true',
            usesScratchingpost:
                characteristicsMap['usesScratchingpost']?.value === 'true',
            selectiveWithFood:
                characteristicsMap['selectiveWithFood']?.value === 'true',
            adaptable: characteristicsMap['adaptable']?.value === 'true',
            scratchesFurniture:
                characteristicsMap['scratchesFurniture']?.value === 'true',
            trusting: characteristicsMap['trusting']?.value === 'true',
            description: characteristicsMap['description']?.value ?? '',
            attitudeTowardsCats:
                characteristicsMap['attitudeTowardsCats']?.value ?? '',
            attitudeTowardsDogs:
                characteristicsMap['attitudeTowardsDogs']?.value ?? '',
            attitudeTowardsChildren:
                characteristicsMap['attitudeTowardsChildren']?.value ?? '',
            suitabilityForIndoorOrOutdoor:
                characteristicsMap['suitabilityForIndoorOrOutdoor']?.value ??
                '',
        };
        return personalityInfo;
    }
}
