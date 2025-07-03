import { Cat, CharacteristicsResult, defaultCat } from "types/cat";
import { Row, SheetRow } from "types/google-sheets";
import TYPES from "types/inversify-types";
import { Animal, User } from "generated/prisma";
import CharacteristicsService  from "./characteristics-service";
import ImageService from "@services/files/image-service";
import {calculateAge, parseDate, isFutureDate} from "@utils/date-utils";
import { inject, injectable } from "inversify";
import GoogleSheetsService from "@services/google/google-sheets-service";

@injectable()
export default class CatProfileBuilder {
  constructor(
    @inject(TYPES.CharacteristicsService) private characteristicsService: CharacteristicsService,
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.GoogleSheetsService) private googleSheetsService: GoogleSheetsService,
  ) {}

  async buildProfilesFromSheet(
    owner: User,
    animals: Animal[]
  ): Promise<Cat[]> {
    const profilePromises = this.googleSheetsService.rows.map(row => {
      return this.buildSingleProfile(row, animals, owner);
    });

    return Promise.all(profilePromises);
  }

  private async buildSingleProfile(
    row: Row, 
    animals: Animal[],
    owner: User
  ): Promise<Cat | null> {
    const catName = row[this.googleSheetsService.headers["KASSI NIMI"]]?.formattedValue;
    const cat = animals.find(animal => animal.name === catName);
    if (!cat) return null;

    const characteristics = await this.characteristicsService.getCharacteristics(cat.id);
    const baseData = this.extractBaseData(row, this.googleSheetsService.headers, cat);
    const appearance = this.extractAppearance(row, this.googleSheetsService.headers);
    const procedures = this.extractProcedures(row, this.googleSheetsService.headers);
    
    const profile = this.buildCatProfile(
      baseData, 
      characteristics, 
      appearance, 
      procedures
    );

    await this.imageService.processImages(profile, row, owner.fullName);

    return profile;
  }

  private extractBaseData(values: Row, cat: Animal): Cat {
    return {
      ...defaultCat,
      title: cat.profileTitle,
      chipNr: cat.chipNumber,
      driveId: cat.driveId,
      llr: cat.chipRegisteredWithUs,
      name: values[this.googleSheetsService.headers["KASSI NIMI"]]?.formattedValue || cat.name,
      birthDate: parseDate(values[this.googleSheetsService.headers["SÜNNIAEG"]]?.formattedValue) || cat.birthday,
      currentLoc: values[this.googleSheetsService.headers["ASUKOHT"]]?.formattedValue,
      foundLoc: values[this.googleSheetsService.headers["LEIDMISKOHT"]]?.formattedValue,
      rescueDate: parseDate(values[this.googleSheetsService.headers["PÄÄSTMISKP/ SÜNNIKP"]]?.formattedValue),
      wormMedName: values[this.googleSheetsService.headers["Ussirohu/ turjatilga nimi"]]?.formattedValue,
      wormMedDate: parseDate(values[this.googleSheetsService.headers["USSIROHU/ TURJATILGA KP"]]?.formattedValue),
      vaccDate: parseDate(values[this.googleSheetsService.headers["KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)"]]?.formattedValue),
      vaccEndDate: parseDate(values[this.googleSheetsService.headers["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue),
      rabiesVaccDate: parseDate(values[this.googleSheetsService.headers["MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)"]]?.formattedValue),
      rabiesVaccEndDate: parseDate(values[this.googleSheetsService.headers["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue),
    };
  }

  private extractAppearance(values: Row, columnMap: Record<string, number>): string[] {
    const appearance = [];
    const coatColor = values[columnMap["KASSI VÄRV"]]?.formattedValue;
    const coatLength = values[columnMap["KASSI KARVA PIKKUS"]]?.formattedValue;
    
    if (coatColor) appearance.push(coatColor);
    if (coatLength) appearance.push(coatLength);
    
    return appearance;
  }

  private extractProcedures(values: Row, columnMap: Record<string, number>): string[] {
    const procedures = [];
    
    if (values[columnMap["ASUKOHT"]]?.formattedValue === "JAH") {
      procedures.push("Lõigatud");
    }
    
    if (this.isFutureDate(values[columnMap["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue)) {
      procedures.push("Kompleksvaktsiin");
    }
    
    if (this.isFutureDate(values[columnMap["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue)) {
      procedures.push("Marutaudi vaktsiin");
    }
    
    if (values[columnMap["USSIROHU/ TURJATILGA KP"]]?.formattedValue) {
      procedures.push("Ussirohi");
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
      appearance: appearance.join(", ") || defaultCat.appearance,
      procedures: procedures.join(", ") || defaultCat.procedures,
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
      descriptionOfCharacter: characteristics.others.descriptionOfCharacter || defaultCat.descriptionOfCharacter,
      treatOtherCats: characteristics.others.treatOtherCats || defaultCat.treatOtherCats,
      treatDogs: characteristics.others.treatDogs || defaultCat.treatDogs,
      treatChildren: characteristics.others.treatChildren || defaultCat.treatChildren,
      outdoorsIndoors: characteristics.others.outdoorsIndoors || defaultCat.outdoorsIndoors,
      images: []
    };
  }

  private buildGenderLabel(characteristics: CharacteristicsResult): string {
    const { cut, gender } = characteristics.others;
    
    if (gender === "emane") {
      return cut ? "Steriliseeritud emane" : "Steriliseerimata emane";
    }
    if (gender === "isane") {
      return cut ? "Kastreeritud isane" : "Kastreerimata isane";
    }
    
    return "";
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
    if (!dateString) return false;
    return isFutureDate(dateString);
  }
}
