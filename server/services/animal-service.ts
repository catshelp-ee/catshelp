import GoogleService from "./google-service.ts";
import db from "../../models/index.cjs";
import moment from "moment";

class AnimalService {
  private googleService: GoogleService;

  constructor(googleService: GoogleService) {
    this.googleService = googleService;
  }

  public async getCatProfilesByOwner(ownerName: string) {
    const sheetData = await this.googleService.getSheetData(
      process.env.CATS_SHEETS_ID,
      "HOIUKODUDES"
    );

    const rows = sheetData.data.sheets![0].data || [];
    const columnMap = this.createColumnMap(rows[0]);

    const catProfiles: any[] = [];

    for (const grid of rows) {
      for (const row of grid.rowData || []) {
        const values = row.values;
        if (!values) continue;

        const fosterhome = values[columnMap["_HOIUKODU/ KLIINIKU NIMI"]];
        if (fosterhome?.formattedValue !== ownerName) continue;

        const catProfile = await this.buildCatProfile(values, columnMap);
        catProfiles.push(catProfile);
      }
    }
    return catProfiles;
  }

  public async updateCatProfile(catData: any) {
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

    await this.googleService.updateSheetCells(
      process.env.CATS_SHEETS_ID,
      "HOIUKODUDES",
      mappedColumnNames,
      catData
    );
  }

  private createColumnMap(row: any): { [key: string]: number } {
    const columnMap: { [key: string]: number } = {};
    row?.rowData?.[0]?.values?.forEach((col, idx) => {
      if (col.formattedValue) {
        columnMap[col.formattedValue] = idx;
      }
    });
    return columnMap;
  }

  private processGenderData(catData: any) {
    const [cut, gender] = catData.gender.split(" ");
    catData.gender = gender;
    catData.cut = "EI";
    if (cut === "Steriliseeritud" || cut === "Kastreeritud") {
      catData.cut = "JAH";
    }
  }

  private async buildCatProfile(
    values: any[],
    columnMap: { [key: string]: number }
  ) {
    const catName = values[columnMap["KASSI NIMI"]]?.formattedValue || "";
    const imageLink = values[columnMap["PILT"]]?.hyperlink || "";

    const appearance = this.getCatAppearance(values, columnMap);
    const procedures = this.getCatProcedures(columnMap, values);

    const animal = await db.Animal.findByPk(3);
    const characteristics = await this.getCharacteristics(animal.id);

    const catProfile = {
      title: animal.profileTitle || "",
      description: animal.description || "",
      name: catName,
      age: values[columnMap["SÜNNIAEG"]]?.formattedValue || "",
      appearance,
      procedures: procedures.join(", "),
      issues: characteristics.issues || "",
      rescueDate:
        values[columnMap["PÄÄSTMISKP/ SÜNNIKP"]]?.formattedValue || "",
      history: characteristics.history || "",
      characteristics: characteristics.characteristics || "",
      likes: characteristics.likes || "",
      descriptionOfCharacter: characteristics.descriptionOfCharacter || "",
      treatOtherCats: characteristics.treatOtherCats || "",
      treatDogs: characteristics.treatDogs || "",
      treatChildren: characteristics.treatChildren || "",
      outdoorsIndoors: characteristics.outdoorsIndoors || "",
      images: [],
    };

    await this.processCatImage(catProfile, imageLink, catName);

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

    const characteristicsObject: Record<string, string> = {};
    characteristics.forEach((characteristic) => {
      characteristicsObject[characteristic.type] = characteristic.name;
    });

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
    catName: string
  ) {
    if (!this.isValidHyperlink(imageLink)) {
      console.warn(
        `Skipping image for ${catName} due to invalid or missing image link.`
      );
      return;
    }

    const fileId = this.extractFileId(imageLink);
    if (!fileId) {
      console.warn(`Unable to extract fileId from imageLink: ${imageLink}`);
      return;
    }

    const destinationPath = `./public/Cats/${catName}.png`;
    const success = await this.googleService.downloadImage(
      fileId,
      destinationPath
    );
    if (success) {
      catProfile.images.push(`Cats/${catName}.png`);
    }
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
