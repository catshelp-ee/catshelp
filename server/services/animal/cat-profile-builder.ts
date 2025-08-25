import ImageService from '@services/files/image-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { Animal } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { CharacteristicsResult, createProfile, Profile } from 'types/cat';
import TYPES from 'types/inversify-types';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class CatProfileBuilder {
  constructor(
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.ImageService)
    private imageService: ImageService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {}

  async buildProfiles(animals: Animal[]): Promise<Profile[]> {
    const profiles = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];

      profiles.push(this.buildProfile(animal));
    }
    return Promise.all(profiles);
  }

  private async buildProfile(animal: Animal): Promise<Profile | null> {
    const profile = createProfile();

    this.mapBaseData(profile, animal);

    const characteristics =
      await this.characteristicsService.getCharacteristics(animal.id);

    profile.images = await this.imageService.fetchImagePathsByAnimalId(
      animal.id
    );
    const profilePicture = await this.imageService.fetchProfilePicture(
      animal.id
    );
    if (profilePicture) {
      profile.profilePictureFilename = `images/${profilePicture.uuid}.jpg`;
    } else {
      profile.profilePictureFilename = `missing64x64.png`;
    }
    this.mapCharacteristicsToProfile(profile, characteristics);

    return profile;
  }

  private mapBaseData(profile: Profile, animal: Animal) {
    profile.animalId = animal.id;
    profile.mainInfo.name = animal.name;
    profile.mainInfo.birthDate = animal.birthday;
    profile.mainInfo.microchip = animal.chipNumber;
    profile.mainInfo.microchipRegisteredInLLR = animal.chipRegisteredWithUs;
    profile.description = animal.description;
    profile.title = animal.profileTitle;
  }

  private mapCharacteristicsToProfile(
    profile: Profile,
    characteristics: CharacteristicsResult
  ): void {
    const { textFields, selectFields, multiselectFields } =
      profile.characteristics;
    const { others, multiSelectArrays } = characteristics;

    // Text fields mapping
    const textFieldsMap = {
      gender: others.gender,
      fosterStayDuration: others.fosterStayDuration,
      specialRequirementsForNewFamily: others.specialRequirementsForNewFamily,
      additionalNotes: others.additionalNotes,
      chronicConditions: others.chronicConditions,
      rescueStory: others.rescueStory,
      description: others.description,
    };

    // Select fields mapping
    const selectFieldsMap = {
      coatColour: others.coatColour,
      coatLength: others.coatLength,
      attitudeTowardsCats: others.attitudeTowardsCats,
      attitudeTowardsDogs: others.attitudeTowardsDogs,
      attitudeTowardsChildren: others.attitudeTowardsChildren,
      suitabilityForIndoorOrOutdoor: others.suitabilityForIndoorOrOutdoor,
    };

    // Multiselect fields mapping
    const multiselectFieldsMap = {
      behaviorTraits: multiSelectArrays.personality,
      likes: multiSelectArrays.likes,
      personality: multiSelectArrays.behaviorTraits,
    };

    // Apply text fields (only if current value is empty)
    Object.entries(textFieldsMap).forEach(([key, value]) => {
      if (textFields[key] === '') {
        textFields[key] = value || '';
      }
    });

    // Apply select fields (always override)
    Object.entries(selectFieldsMap).forEach(([key, value]) => {
      selectFields[key] = value || '';
    });

    // Apply multiselect fields (always override)
    Object.entries(multiselectFieldsMap).forEach(([key, value]) => {
      multiselectFields[key] = value || [];
    });
  }
}
