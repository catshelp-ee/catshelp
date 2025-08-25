import ImageService from '@services/files/image-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { parseDate } from '@utils/date-utils';
import { Animal, User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { CharacteristicsResult, createProfile, Profile } from 'types/cat';
import { CatSheetsHeaders } from 'types/google-sheets';
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
  ) { }

  async buildProfilesFromSheet(
    owner: User,
    animals: Animal[]
  ): Promise<Profile[]> {
    const profilePromises = (
      await this.googleSheetsService.getRows(owner.id)
    ).map(row => {
      return this.buildSingleProfile(row.row, animals, owner);
    });

    return Promise.all(profilePromises);
  }

  private async buildSingleProfile(
    row: CatSheetsHeaders,
    animals: Animal[],
    owner: User
  ): Promise<Profile | null> {
    const cat = animals.find(animal => animal.name === row.catName);
    if (!cat) {
      return null;
    }

    const characteristics =
      await this.characteristicsService.getCharacteristics(cat.id);
    const profile = this.extractBaseData(row, cat);

    this.buildCatProfile(profile, characteristics);

    profile.images = await this.imageService.fetchImagePathsByAnimalId(cat.id);
    const profilePicture = await this.imageService.fetchProfilePicture(cat.id);
    if (profilePicture) {
      profile.profilePictureFilename = `images/${profilePicture.uuid}.jpg`;
    } else {
      profile.profilePictureFilename = `missing64x64.png`;
    }

    return profile;
  }

  private processGender(values: CatSheetsHeaders) {
    const isMale = values.gender.toLowerCase() === 'isane';
    const isSterilized = values.spayedOrNeutered === 'JAH';

    if (isMale) {
      return isSterilized ? 'Kastreeritud isane' : 'Kastreerimata isane';
    } else {
      return isSterilized ? 'Steriliseeritud emane' : 'Steriliseerimata emane';
    }
  }

  private extractBaseData(values: CatSheetsHeaders, cat: Animal): Profile {
    const profile = createProfile();
    profile.animalId = cat.id;
    profile.title = cat.profileTitle;
    profile.description = cat.description;
    profile.mainInfo.microchip = cat.chipNumber;
    profile.mainInfo.microchipRegisteredInLLR = cat.chipRegisteredWithUs;
    profile.mainInfo.name = values.catName || cat.name;
    profile.mainInfo.birthDate = parseDate(values.birthDate) || cat.birthday;
    profile.mainInfo.location = values.location;
    profile.animalRescueInfo.rescueLocation = values.findingLocation;
    profile.animalRescueInfo.rescueDate = parseDate(values.rescueOrBirthDate);
    profile.vaccineInfo.dewormingOrFleaTreatmentName =
      values.dewormingOrFleaTreatmentName;
    profile.vaccineInfo.dewormingOrFleaTreatmentDate = parseDate(
      values.dewormingOrFleaTreatmentDate
    );
    profile.vaccineInfo.complexVaccine = parseDate(values.complexVaccine);
    profile.vaccineInfo.nextComplexVaccineDate = parseDate(
      values.nextVaccineDate
    );
    profile.vaccineInfo.rabiesVaccine = parseDate(values.rabiesVaccine);
    profile.vaccineInfo.nextRabiesVaccineDate = parseDate(
      values.nextRabiesDate
    );

    if (values.spayedOrNeutered && values.gender) {
      profile.characteristics.textFields.gender = this.processGender(values);
    }

    return profile;
  }

  private buildCatProfile(
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

    profile.images = [];
  }
}
