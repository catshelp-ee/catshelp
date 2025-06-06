import GoogleService from "./google-service.ts";
import db from "@models/index.cjs";
import moment from "moment";
import { getUserCats } from "./user-service.ts";
import { Cat, defaultCat, descriptors } from "@customTypes/Cat.ts";
import process from "node:process";

class AnimalService {
  private googleService: GoogleService;
  private now;

  constructor(googleService: GoogleService) {
    this.googleService = googleService;
    this.now = moment();
  }

  private checkSheets(){
    if(!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) 
      throw new Error("Missing CATS_SHEETS_ID or CATS_TABLE_NAME from env")
  }

  public async getCatProfilesByOwner(owner: any) {
    if (!owner) {
      throw new Error("Owner is undefined or null");
    }

    this.checkSheets();

    const sheetData = await this.googleService.getSheetData(
      process.env.CATS_SHEETS_ID!,
      process.env.CATS_TABLE_NAME!
    );

    if (!sheetData.data.sheets || sheetData.data.sheets.length === 0)
      throw new Error("No sheet found");

    const rows = sheetData.data.sheets[0].data;

    if (!rows || rows.length === 0)
      throw new Error("No rows in sheet");

    const columnMap = this.createColumnMap(rows[0]);

    const catProfiles: Cat[] = [];

    const cats = await getUserCats(owner.email);

    // Sheets
    for (const grid of rows) {
      for (const row of grid.rowData || []) {
        const values = row.values;
        if (!values) {
          continue;
        }

        const fosterhome = values[columnMap["_HOIUKODU/ KLIINIKU NIMI"]];
        if (!fosterhome || fosterhome.formattedValue !== owner.name) {
          continue;
        }

        const catName = values[columnMap["KASSI NIMI"]].formattedValue;

        const cat = cats.find((cat) => cat.name === catName);
        if (!cat) continue;

        const catProfile = await this.buildCatProfile(
          values,
          columnMap,
          cat,
          owner.name
        );
        catProfiles.push(catProfile);
      }
    }

    return catProfiles;
  }

  public async updateCatProfile(catData: any, cat: any) {
    const mappedColumnNames = {
      name: "KIISU NIMI",
      chipNr: "KIIP",
      llr: "KIIP LLR-is MTÜ nimel- täidab registreerija",
      birthData: "SÜNNIAEG",
      gender: "SUGU",
      coatColour: "KASSI VÄRV",
      coatLength: "KASSI KARVA PIKKUS",
      foundLoc: "LEIDMISKOHT",
      vacc: "KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)",
      vaccEnd: "JÄRGMISE VAKTSIINI AEG",
      rabiesVacc:
        "MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)",
      rabiesVaccEnd: "JÄRGMINE MARUTAUDI AEG",
      wormMedName: "Ussirohu/ turjatilga nimi",
      cut: "LÕIGATUD",
    };

    this.processGenderData(catData);
    const t = await db.sequelize.transaction();

    try {
      await db.Animal.update(
        { /* fields */ },
        { where: { id: cat.id }, transaction: t }
      );

      await Promise.all(
        Object.keys(descriptors).map(async (characteristic) => {
          const characteristics = await db.AnimalCharacteristic.findAll({
            where: { animalId: cat.id, type: characteristic },
            transaction: t,
          });

          if (["characteristics", "cat", "likes"].includes(characteristic)) {
            for (const row of characteristics) {
              await row.destroy({ transaction: t });
            }
            for (const val of catData[characteristic].split(",")) {
              await db.AnimalCharacteristic.create(
                {
                  animalId: cat.id,
                  type: characteristic,
                  name: val.trim(),
                },
                { transaction: t }
              );
            }
          } else {
            if (characteristics.length === 0) {
              await db.AnimalCharacteristic.create(
                {
                  animalId: cat.id,
                  type: characteristic,
                  name: catData[characteristic],
                },
                { transaction: t }
              );
            } else {
              await characteristics[0].update(
                { name: catData[characteristic] },
                { transaction: t }
              );
            }
          }
        })
      );

      const AnimalToAnimalRescue = await db.AnimalToAnimalRescue.findOne({
        where: { animalId: cat.id },
        transaction: t,
      });

      if (!AnimalToAnimalRescue) {
        throw new Error(`AnimalRescue relation missing for cat ID: ${cat.id}`);
      }

      const AnimalRescue = await db.AnimalRescue.findByPk(
        AnimalToAnimalRescue.animalRescueId,
        { transaction: t }
      );

      if (!AnimalRescue) {
        throw new Error(
          `AnimalRescue with ID ${AnimalToAnimalRescue.animalRescueId} not found`
        );
      }

      await AnimalRescue.update(
        {
          rescueDate: moment(catData.foundDate, "DD.MM.YYYY").toDate(),
          address: catData.foundLoc,
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      console.error("Failed to update cat:", err);
      throw err; // or throw a custom error
    }

    this.checkSheets();

    await this.googleService.updateSheetCells(
      process.env.CATS_SHEETS_ID!,
      process.env.CATS_TABLE_NAME!,
      mappedColumnNames,
      catData
    );
  }

  private createColumnMap(row: any): { [key: string]: number } {
    const columnMap: { [key: string]: number } = {};
    row.rowData[0].values.forEach((col, idx) => {
      if (col.formattedValue) {
        columnMap[col.formattedValue] = idx;
      }
    });
    return columnMap;
  }

  private processGenderData(catData: any) {
    if (!catData.gender) {
      return;
    }
    const [cut, gender] = catData.gender.split(" ");
    catData.gender = gender;
    catData.cut = "false";
    if (cut === "Steriliseeritud" || cut === "Kastreeritud") {
      catData.cut = "true";
    }
  }

  // TODO: find out why if you remove the field 'images: []' it sends all the images regardless
  // of if the selected profile. Also images start compounding on reload, as in on 1st load x images
  // reload 2*x images, 3rd reload 3*x images etc...
  private async buildCatProfile(
    values: any[], // never empty, otherwise an error is thrown beforehand
    columnMap: { [key: string]: number }, // also never empty
    animal: any,
    ownerName: string
  ) {
    const catName = values[columnMap["KASSI NIMI"]]?.formattedValue || "";
    const imageLink = values[columnMap["PILT"]]?.hyperlink || "";

    const appearance = this.getCatAppearance(values, columnMap);
    const procedures = this.getCatProcedures(columnMap, values);

    const characteristics = await this.getCharacteristics(animal.id);

    const orDefault = (value, fallback) => value ?? fallback;
    const orDefaultDate = (value, fallback) => {
      if (!value || isNaN(value.getTime())) {
        return fallback;
      }
      return value;
    };

    let genderLabel = "";
    if (!characteristics?.cut && characteristics?.gender === "emane") {
      genderLabel = "Steriliseerimata emane";
    } else if (characteristics?.cut && characteristics?.gender === "emane") {
      genderLabel = "Steriliseeritud emane";
    } else if (!characteristics?.cut && characteristics?.gender === "isane") {
      genderLabel = "Kastreerimata isane";
    } else if (characteristics?.cut && characteristics?.gender === "isane") {
      genderLabel = "Kastreeritud isane";
    }

    const birthDate = moment(
      values[columnMap["SÜNNIAEG"]]?.formattedValue,
      "DD.MM.YYYY"
    );

    let age = "";
    if (birthDate){
      const years = this.now.diff(birthDate, "years");
      const months = this.now.diff(
        birthDate.clone().add(years, "years"),
        "months"
      );

      if (years === 0) {
        age = `${months} kuud`;
      } else {
        age = `${years} aastat ja ${months} kuud`;
      }
    }
    const catProfile: Cat = {
      ...defaultCat,
      title: orDefault(animal.profileTitle, defaultCat.title),
      description: orDefault(animal.description, defaultCat.description),
      name: orDefault(catName, defaultCat.name),
      birthDate: orDefaultDate(animal.birthday, defaultCat.birthDate),
      chipNr: orDefault(animal.chipNumber, defaultCat.chipNr),
      llr: orDefault(animal.chipRegisteredWithUs, defaultCat.llr),
      gender: orDefault(characteristics.gender as string, defaultCat.gender),
      genderLabel: orDefault(genderLabel, defaultCat.genderLabel),
      appearence: orDefault(appearance, defaultCat.appearance),
      currentLoc: orDefault(
        values[columnMap["ASUKOHT"]]?.formattedValue,
        defaultCat.currentLoc
      ),
      coatColour: orDefault(
        characteristics.coatColour as string,
        defaultCat.coatColour
      ),
      duration: orDefault(
        characteristics.duration as string,
        defaultCat.duration
      ),
      coatLength: orDefault(
        characteristics.coatLength as string,
        defaultCat.coatLength
      ),
      wishes: orDefault(characteristics.wishes as string, defaultCat.wishes),
      other: orDefault(characteristics.other as string, defaultCat.other),
      cut: orDefault(characteristics.cut as string, defaultCat.cut),
      wormMedName: orDefault(
        values[columnMap["Ussirohu/ turjatilga nimi"]]?.formattedValue,
        defaultCat.wormMedName
      ),
      wormMedDate: orDefaultDate(
        moment(
          values[columnMap["USSIROHU/ TURJATILGA KP"]]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.wormMedDate
      ),
      age: orDefault(age, defaultCat.age),
      procedures: orDefault(procedures.join(", "), defaultCat.procedures),
      issues: orDefault(characteristics.issues as string, defaultCat.issues),
      rescueDate: orDefaultDate(
        moment(
          values[columnMap["PÄÄSTMISKP/ SÜNNIKP"]]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.rescueDate
      ),
      foundLoc: orDefault(
        values[columnMap["LEIDMISKOHT"]]?.formattedValue,
        defaultCat.foundLoc
      ),
      history: orDefault(characteristics.history as string, defaultCat.history),
      characteristics: orDefault(
        characteristics.character as string[],
        defaultCat.characteristics
      ),
      likes: orDefault(characteristics.likes as string[], defaultCat.likes),
      cat: orDefault(characteristics.cat as string[], defaultCat.cat),
      descriptionOfCharacter: orDefault(
        characteristics.descriptionOfCharacter as string,
        defaultCat.descriptionOfCharacter
      ),
      treatOtherCats: orDefault(
        characteristics.treatOtherCats as string,
        defaultCat.treatOtherCats
      ),
      treatDogs: orDefault(
        characteristics.treatDogs as string,
        defaultCat.treatDogs
      ),
      treatChildren: orDefault(
        characteristics.treatChildren as string,
        defaultCat.treatChildren
      ),
      outdoorsIndoors: orDefault(
        characteristics.outdoorsIndoors as string,
        defaultCat.outdoorsIndoors
      ),
      vacc: orDefaultDate(
        moment(
          values[
            columnMap[
              "KOMPLEKSVAKTSIIN (nt Feligen CRP, Versifel CVR, Nobivac Tricat Trio)"
            ]
          ]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.vacc
      ),
      vaccEnd: orDefaultDate(
        moment(
          values[columnMap["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.vaccEnd
      ),
      rabiesVacc: orDefaultDate(
        moment(
          values[
            columnMap[
              "MARUTAUDI VAKTSIIN (nt Feligen R, Biocan R, Versiguard, Rabisin Multi, Rabisin R, Rabigen Mono, Purevax RCP)"
            ]
          ]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.rabiesVacc
      ),
      rabiesVaccEnd: orDefaultDate(
        moment(
          values[columnMap["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue,
          "DD.MM.YYYY"
        ).toDate(),
        defaultCat.rabiesVaccEnd
      ),
      driveId: orDefault(animal.driveId, defaultCat.driveId),
      images: [],
    };

    await this.processCatImage(catProfile, imageLink, ownerName);

    return catProfile;
  }

  private getCatAppearance(
    values: any[],
    columnMap: { [key: string]: number }
  ): string {
    return (
      values[columnMap["KASSI VÄRV"]]?.formattedValue +
        ", " +
        values[columnMap["KASSI KARVA PIKKUS"]]?.formattedValue || ""
    );
  }

  private async getCharacteristics(animalId: number) {
    const characteristics = await db.AnimalCharacteristic.findAll({
      where: { animalId },
    });

    const character: string[] = [];
    const likes: string[] = [];
    const cat: string[] = [];

    const characteristicsObject: Record<string, string | string[]> = {};
    characteristics.forEach((characteristic) => {
      if (characteristic.type == "characteristics")
        character.push(characteristic.name);
      else if (characteristic.type == "likes") likes.push(characteristic.name);
      else if (characteristic.type == "cat") cat.push(characteristic.name);
      else characteristicsObject[characteristic.type] = characteristic.name;
    });
    characteristicsObject.character = character;
    characteristicsObject.likes = likes;
    characteristicsObject.cat = cat;
    return characteristicsObject;
  }

  private getCatProcedures(columnMap: any, values: any): string[] {
    const procedures: string[] = [];

    if (values[columnMap["ASUKOHT"]]?.formattedValue === "JAH") {
      procedures.push("Lõigatud");
    }

    this.checkVaccinationProcedures(columnMap, values, procedures);
    this.checkRabiesVaccination(columnMap, values, procedures);
    this.checkWormTreatment(values, columnMap, procedures);

    return procedures;
  }

  private checkVaccinationProcedures(
    columnMap: any,
    values: any,
    procedures: string[]
  ) {
    const vaccEndDate =
      values[columnMap["JÄRGMISE VAKTSIINI AEG"]]?.formattedValue;
    if (vaccEndDate && this.isFutureDate(vaccEndDate)) {
      procedures.push("Kompleksvaktsiin");
    }
  }

  private checkRabiesVaccination(
    columnMap: any,
    values: any,
    procedures: string[]
  ) {
    const rabiesVaccEndDate =
      values[columnMap["JÄRGMINE MARUTAUDI AEG"]]?.formattedValue;
    if (rabiesVaccEndDate && this.isFutureDate(rabiesVaccEndDate)) {
      procedures.push("Marutaudi vaktsiin");
    }
  }

  private checkWormTreatment(
    values: any,
    columnMap: any,
    procedures: string[]
  ) {
    if (values[columnMap["USSIROHU/ TURJATILGA KP"]]?.formattedValue !== "") {
      procedures.push("Ussirohi");
    }
  }

  private isFutureDate(dateString: string): boolean {
    const formattedDate = dateString.replaceAll(".", "-");
    return moment(new Date()).isBefore(moment(formattedDate, "DD-MM-YYYY"));
  }

  private async processCatImage(
    catProfile: any,
    imageLink: string,
    ownerName: string
  ) {
    if (!this.isValidHyperlink(imageLink)) {
      console.warn(
        `Skipping image for ${catProfile.name} due to invalid or missing image link.`
      );
      return;
    }

    const fileId = this.extractFileId(imageLink);
    if (!fileId) {
      console.warn(`Unable to extract fileId from imageLink: ${imageLink}`);
      return;
    }

    const destinationPath = `./public/Temp/${ownerName}/${catProfile.name}.png`;
    await this.googleService.downloadImage(fileId, destinationPath);
    catProfile.images.push(`Temp/${ownerName}/${catProfile.name}.png`);
    await this.googleService.downloadImages(
      catProfile.driveId,
      ownerName,
      catProfile
    );
  }

  private isValidHyperlink(link: string): boolean {
    try {
      new URL(link);
      return true;
    } catch (_error) {
      console.warn(`Imagelink invalid, skip link: ${link}`);
      return false;
    }
  }

  private extractFileId(link: string): string | null {
    const match = link.match(/\/file\/d\/(.+?)\//);
    return match ? match[1] : null;
  }
}

export default AnimalService;
