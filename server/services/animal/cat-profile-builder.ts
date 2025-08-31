import ImageService from '@services/files/image-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { createProfile, Profile } from 'types/cat';
import TYPES from 'types/inversify-types';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class CatProfileBuilder {
  constructor(
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.ImageService)
    private imageService: ImageService,
  ) { }

  buildProfiles(animals: Animal[]): Promise<Profile[]> {
    return Promise.all(animals.map(animal => this.buildProfile(animal)));
  }

  private async buildProfile(animal: Animal): Promise<Profile | null> {
    const profile = createProfile();

    profile.animalId = animal.id;
    profile.mainInfo.name = animal.name;
    profile.title = animal.profileTitle;
    profile.description = animal.description;
    profile.mainInfo.microchip = animal.chipNumber;
    profile.mainInfo.microchipRegisteredInLLR = animal.chipRegisteredWithUs;
    profile.mainInfo.birthDate = animal.birthday;

    profile.characteristics = await this.characteristicsService.getCharacteristics(animal.id);

    profile.images = await this.imageService.fetchImagePathsByAnimalId(animal.id);
    const profilePicture = await this.imageService.fetchProfilePicture(animal.id);
    if (profilePicture) {
      profile.profilePictureFilename = `images/${profilePicture.uuid}.jpg`;
    } else {
      profile.profilePictureFilename = `missing64x64.png`;
    }

    return profile;
  }
}
