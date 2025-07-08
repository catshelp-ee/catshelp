import ImageService from '@services/files/image-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
import { calculateAge, isFutureDate, parseDate } from '@utils/date-utils';
import { Animal, User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import { Cat, CharacteristicsResult, defaultCat } from 'types/cat';
import { CatSheetsHeaders, SheetRow } from 'types/google-sheets';
import TYPES from 'types/inversify-types';
import CharacteristicsService from './characteristics-service';

@injectable()
export default class CatProfileBuilder {
  constructor(
    @inject(TYPES.CharacteristicsService)
    private characteristicsService: CharacteristicsService,
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {}

  async buildProfilesFromSheet(owner: User, animals: Animal[]): Promise<Cat[]> {
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
  ): Promise<Cat | null> {
    const cat = animals.find(animal => animal.name === row.catName);
    if (!cat) {
      return null;
    }

    const characteristics =
      await this.characteristicsService.getCharacteristics(cat.id);
    const baseData = this.extractBaseData(row, cat);
    const appearance = this.extractAppearance(row);
    const procedures = this.extractProcedures(row);

    const profile = this.buildCatProfile(
      baseData,
      characteristics,
      appearance,
      procedures
    );

    await this.imageService.processImages(profile, row, owner.fullName);

    return profile;
  }

  private extractBaseData(values: CatSheetsHeaders, cat: Animal): Cat {
    return {
      ...defaultCat,
      title: cat.profileTitle,
      chipNr: cat.chipNumber,
      driveId: cat.driveId,
      llr: cat.chipRegisteredWithUs,
      name: values.catName || cat.name,
      birthDate: parseDate(values.birthDate) || cat.birthday,
      currentLoc: values.location,
      foundLoc: values.findingLocation,
      rescueDate: parseDate(values.rescueOrBirthDate),
      wormMedName: values.dewormingOrFleaTreatmentName,
      wormMedDate: parseDate(values.dewormingOrFleaTreatmentDate),
      vaccDate: parseDate(values.complexVaccine),
      vaccEndDate: parseDate(values.nextVaccineDate),
      rabiesVaccDate: parseDate(values.rabiesVaccine),
      rabiesVaccEndDate: parseDate(values.nextRabiesDate),
    };
  }

  private extractAppearance(values: CatSheetsHeaders): string[] {
    const appearance = [];
    const coatColor = values.catColor;
    const coatLength = values.furLength;

    if (coatColor) {
      appearance.push(coatColor);
    }

    if (coatLength) {
      appearance.push(coatLength);
    }

    return appearance;
  }

  private extractProcedures(values: CatSheetsHeaders): string[] {
    const procedures = [];

    if (values.spayedOrNeutered === 'JAH') {
      procedures.push('Lõigatud');
    }

    if (this.isFutureDate(values.nextVaccineDate)) {
      procedures.push('Kompleksvaktsiin');
    }

    if (this.isFutureDate(values.nextRabiesDate)) {
      procedures.push('Marutaudi vaktsiin');
    }

    if (values.dewormingOrFleaTreatmentDate) {
      procedures.push('Ussirohi');
    }

    return procedures;
  }

  private buildCatProfile(
    baseData: Cat,
    characteristics: CharacteristicsResult,
    appearance: string[],
    procedures: string[]
  ): Cat {
    const genderLabel = this.buildGenderLabel(characteristics);
    const age = calculateAge(baseData.birthDate);

    return {
      ...baseData,
      gender: characteristics.others.gender || defaultCat.gender,
      genderLabel: genderLabel || defaultCat.genderLabel,
      appearance: appearance.join(', ') || defaultCat.appearance,
      procedures: procedures.join(', ') || defaultCat.procedures,
      age: age || defaultCat.age,

      // Characteristics
      coatColour: characteristics.others.coatColour || defaultCat.coatColour,
      duration: characteristics.others.duration || defaultCat.duration,
      coatLength: characteristics.others.coatLength || defaultCat.coatLength,
      wishes: characteristics.others.wishes || defaultCat.wishes,
      other: characteristics.others.other || defaultCat.other,
      cut: characteristics.others.cut || defaultCat.cut,
      issues: characteristics.others.issues || defaultCat.issues,
      history: characteristics.others.history || defaultCat.history,
      characteristics: characteristics.character || defaultCat.characteristics,
      likes: characteristics.likes || defaultCat.likes,
      cat: characteristics.cat || defaultCat.cat,
      descriptionOfCharacter:
        characteristics.others.descriptionOfCharacter ||
        defaultCat.descriptionOfCharacter,
      treatOtherCats:
        characteristics.others.treatOtherCats || defaultCat.treatOtherCats,
      treatDogs: characteristics.others.treatDogs || defaultCat.treatDogs,
      treatChildren:
        characteristics.others.treatChildren || defaultCat.treatChildren,
      outdoorsIndoors:
        characteristics.others.outdoorsIndoors || defaultCat.outdoorsIndoors,
      images: [],
    };
  }

  private buildGenderLabel(characteristics: CharacteristicsResult): string {
    const { cut, gender } = characteristics.others;

    if (gender === 'emane') {
      return cut ? 'Steriliseeritud emane' : 'Steriliseerimata emane';
    }
    if (gender === 'isane') {
      return cut ? 'Kastreeritud isane' : 'Kastreerimata isane';
    }

    return '';
  }

  private createColumnMap(headerRow: SheetRow): Record<string, number> {
    const columnMap: Record<string, number> = {};
    headerRow.values.forEach((col, idx) => {
      if (col.formattedValue) {
        columnMap[col.formattedValue] = idx;
      }
    });
    return columnMap;
  }

  private isFutureDate(dateString: string): boolean {
    if (!dateString) {
      return false;
    }
    return isFutureDate(dateString);
  }
}
