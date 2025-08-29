import ImageService from '@services/files/image-service';
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

    const characteristics = await this.characteristicsService.getCharacteristics(animal.id);

    this.mapCharacteristicsToProfile(profile, characteristics);

    profile.images = await this.imageService.fetchImagePathsByAnimalId(animal.id);
    const profilePicture = await this.imageService.fetchProfilePicture(animal.id);
    if (profilePicture) {
      profile.profilePictureFilename = `images/${profilePicture.uuid}.jpg`;
    } else {
      profile.profilePictureFilename = `missing64x64.png`;
    }

    return profile;
  }

  private mapCharacteristicsToProfile(profile: Profile, characteristics: CharacteristicsResult): void {
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

    profile.images = [];
  }
}
