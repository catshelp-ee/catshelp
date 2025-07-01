import moment from "moment";
import { Cat, defaultCat } from "@types/Cat";
import { Animal, User } from "generated/prisma";
import { SheetData, SheetRow } from "@types/google-sheets";
import CharacteristicsService  from "./characteristics-service";
import ImageService from "@services/files/image-service";
import {calculateAge, parseDate, isFutureDate} from "@utils/date-utils";
import { inject, injectable } from "inversify";
import TYPES from "@types/inversify-types";
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
    row: any, 
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

    await this.imageService.processImages(profile, row, this.googleSheetsService.headers, owner.fullName);

    return profile;
  }

  private extractBaseData(values: any[], columnMap: Record<string, number>, cat: Animal) {
    return {
      name: values[columnMap["KASSI NIMI"]]?.formattedValue || "",
      birthDate: values[columnMap["SÜNNIAEG"]]?.formattedValue,
      currentLoc: values[columnMap["ASUKOHT"]]?.formattedValue,
      foundLoc: values[columnMap["LEIDMISKOHT"]]?.formattedValue,
      rescueDate: values[columnMap["PÄÄSTMISKP/ SÜNNIKP"]]?.formattedValue,
      wormMedName: values[columnMap["Ussirohu/ turjatilga nimi"]]?.formattedValue,
      wormMedDate: values[columnMap["USSIROHU/ TURJATILGA KP"]]?.formattedValue,
      vaccDate: values[columnMap["KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)"]]?.formattedValue,
      vaccEndDate: values[columnMap["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue,
      rabiesVaccDate: values[columnMap["MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)"]]?.formattedValue,
      rabiesVaccEndDate: values[columnMap["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue,
      cat
    };
  }

  private extractAppearance(values: any[], columnMap: Record<string, number>): string[] {
    const appearance = [];
    const coatColor = values[columnMap["KASSI VÄRV"]]?.formattedValue;
    const coatLength = values[columnMap["KASSI KARVA PIKKUS"]]?.formattedValue;
    
    if (coatColor) appearance.push(coatColor);
    if (coatLength) appearance.push(coatLength);
    
    return appearance;
  }

  private extractProcedures(values: any[], columnMap: Record<string, number>): string[] {
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
    baseData: any, 
    characteristics: any, 
    appearance: string[], 
    procedures: string[]
  ): Cat {
    const genderLabel = this.buildGenderLabel(characteristics);
    const age = calculateAge(baseData.birthDate);

    return {
      ...defaultCat,
      title: baseData.cat.profileTitle || defaultCat.title,
      description: baseData.cat.description || defaultCat.description,
      name: baseData.name || defaultCat.name,
      birthDate: parseDate(baseData.birthDate) || defaultCat.birthDate,
      chipNr: baseData.cat.chipNumber || defaultCat.chipNr,
      llr: baseData.cat.chipRegisteredWithUs || defaultCat.llr,
      gender: characteristics.gender || defaultCat.gender,
      genderLabel: genderLabel || defaultCat.genderLabel,
      appearance: appearance.length > 0 ? appearance : defaultCat.appearance,
      currentLoc: baseData.currentLoc || defaultCat.currentLoc,
      age: age || defaultCat.age,
      procedures: procedures.join(", ") || defaultCat.procedures,
      foundLoc: baseData.foundLoc || defaultCat.foundLoc,
      rescueDate: parseDate(baseData.rescueDate) || defaultCat.rescueDate,
      wormMedName: baseData.wormMedName || defaultCat.wormMedName,
      wormMedDate: parseDate(baseData.wormMedDate) || defaultCat.wormMedDate,
      vacc: parseDate(baseData.vaccDate) || defaultCat.vacc,
      vaccEnd: parseDate(baseData.vaccEndDate) || defaultCat.vaccEnd,
      rabiesVacc: parseDate(baseData.rabiesVaccDate) || defaultCat.rabiesVacc,
      rabiesVaccEnd: parseDate(baseData.rabiesVaccEndDate) || defaultCat.rabiesVaccEnd,
      driveId: baseData.cat.driveId || defaultCat.driveId,
      // Characteristics
      coatColour: characteristics.coatColour || defaultCat.coatColour,
      duration: characteristics.duration || defaultCat.duration,
      coatLength: characteristics.coatLength || defaultCat.coatLength,
      wishes: characteristics.wishes || defaultCat.wishes,
      other: characteristics.other || defaultCat.other,
      cut: characteristics.cut || defaultCat.cut,
      issues: characteristics.issues || defaultCat.issues,
      history: characteristics.history || defaultCat.history,
      characteristics: characteristics.character || defaultCat.characteristics,
      likes: characteristics.likes || defaultCat.likes,
      cat: characteristics.cat || defaultCat.cat,
      descriptionOfCharacter: characteristics.descriptionOfCharacter || defaultCat.descriptionOfCharacter,
      treatOtherCats: characteristics.treatOtherCats || defaultCat.treatOtherCats,
      treatDogs: characteristics.treatDogs || defaultCat.treatDogs,
      treatChildren: characteristics.treatChildren || defaultCat.treatChildren,
      outdoorsIndoors: characteristics.outdoorsIndoors || defaultCat.outdoorsIndoors,
      images: []
    };
  }

  private buildGenderLabel(characteristics: any): string {
    const { cut, gender } = characteristics;
    
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
