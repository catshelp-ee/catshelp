import { createProfile, Profile } from '@catshelp/types';
import { FileService } from '@file/file.service';
import { Injectable } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { Animal } from './entities/animal.entity';
import { AnimalProfileDto } from "@user/dtos/animal-profile.dto";

@Injectable()
export class ProfileBuilder {
    constructor(
        private readonly characteristicsService: CharacteristicsService,
        private readonly fileService: FileService,
    ) { }

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
        profile.images = await this.fileService.fetchImagePathsByAnimalId(animal.id);
        const profilePicture = await this.fileService.fetchProfilePicture(animal.id);

        profile.profilePictureFilename = profilePicture ? `images/${profilePicture.uuid}.jpg` : "";

        return profile;
    }
}
