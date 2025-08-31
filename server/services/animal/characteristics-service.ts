import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import {
  CharacteristicsInfo,
  createCharacteristicsInfo,
  MultiselectFields,
  Profile,
  SelectFields,
  TextFields
} from 'types/cat';
import { PrismaTransactionClient } from 'types/prisma';

@injectable()
export default class CharacteristicsService {
  async getCharacteristics(animalId: number): Promise<CharacteristicsInfo> {
    const characteristics = await prisma.animalCharacteristic.findMany({
      where: { animalId },
    });

    const characteristicsInfo = createCharacteristicsInfo();


    characteristicsInfo.multiselectFields.behaviorTraits = characteristics.find(c => c.type === "BEHAVIOUR_TRAITS")?.value?.split(",") ?? [];
    characteristicsInfo.multiselectFields.likes = characteristics.find(c => c.type === "LIKES")?.value?.split(",") ?? [];
    characteristicsInfo.multiselectFields.personality = characteristics.find(c => c.type === "PERSONALITY")?.value?.split(",") ?? [];

    characteristicsInfo.selectFields.attitudeTowardsCats = characteristics.find(c => c.type === "ATTITUDE_TOWARDS_CATS")?.value ?? "";
    characteristicsInfo.selectFields.attitudeTowardsChildren = characteristics.find(c => c.type === "ATTITUDE_TOWARDS_CHILDREN")?.value ?? "";
    characteristicsInfo.selectFields.attitudeTowardsDogs = characteristics.find(c => c.type === "ATTITUDE_TOWARDS_DOGS")?.value ?? "";
    characteristicsInfo.selectFields.coatColour = characteristics.find(c => c.type === "COAT_COLOUR")?.value ?? "";
    characteristicsInfo.selectFields.coatLength = characteristics.find(c => c.type === "COAT_LENGTH")?.value ?? "";
    characteristicsInfo.selectFields.suitabilityForIndoorOrOutdoor = characteristics.find(c => c.type === "SUITABILITY_FOR_INDOOR_OR_OUTDOOR")?.value ?? "";

    characteristicsInfo.textFields.additionalNotes = characteristics.find(c => c.type === "ADDITIONAL_NOTES")?.value ?? "";
    characteristicsInfo.textFields.chronicConditions = characteristics.find(c => c.type === "CHRONIC_CONDITIONS")?.value ?? "";
    characteristicsInfo.textFields.description = characteristics.find(c => c.type === "DESCRIPTION")?.value ?? "";
    characteristicsInfo.textFields.fosterStayDuration = characteristics.find(c => c.type === "FOSTER_STAY_DURATION")?.value ?? "";
    characteristicsInfo.textFields.rescueStory = characteristics.find(c => c.type === "RESCUE_STORY")?.value ?? "";
    characteristicsInfo.textFields.specialRequirementsForNewFamily = characteristics.find(c => c.type === "SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY")?.value ?? "";
    characteristicsInfo.textFields.gender = characteristics.find(c => c.type === "GENDER")?.value ?? "";
    characteristicsInfo.textFields.spayedOrNeutered = characteristics.find(c => c.type === "SPAYED_OR_NEUTERED")?.value ?? "";

    return characteristicsInfo;
  }

  async updateCharacteristics(tx: PrismaTransactionClient, updatedAnimalData: Profile): Promise<void> {
    const { animalId, characteristics } = updatedAnimalData;

    // Handle multiselect fields
    await this.updateMultiselectFields(tx, animalId, characteristics.multiselectFields);

    // Handle select fields
    await this.updateSelectFields(tx, animalId, characteristics.selectFields);

    // Handle text fields (including special gender processing)
    await this.updateTextFields(tx, animalId, characteristics.textFields);
  }

  private async updateMultiselectFields(tx: PrismaTransactionClient, animalId: number, multiselectFields: MultiselectFields): Promise<void> {
    await Promise.all([
      this.updateCharacteristic(tx, animalId, "BEHAVIOUR_TRAITS", multiselectFields.behaviorTraits),
      this.updateCharacteristic(tx, animalId, "LIKES", multiselectFields.likes),
      this.updateCharacteristic(tx, animalId, "PERSONALITY", multiselectFields.personality)
    ]);
  }

  private async updateSelectFields(tx: PrismaTransactionClient, animalId: number, selectFields: SelectFields): Promise<void> {
    await Promise.all([
      this.updateCharacteristic(tx, animalId, "ATTITUDE_TOWARDS_CATS", selectFields.attitudeTowardsCats),
      this.updateCharacteristic(tx, animalId, "ATTITUDE_TOWARDS_CHILDREN", selectFields.attitudeTowardsChildren),
      this.updateCharacteristic(tx, animalId, "ATTITUDE_TOWARDS_DOGS", selectFields.attitudeTowardsDogs),
      this.updateCharacteristic(tx, animalId, "COAT_COLOUR", selectFields.coatColour),
      this.updateCharacteristic(tx, animalId, "COAT_LENGTH", selectFields.coatLength),
      this.updateCharacteristic(tx, animalId, "SUITABILITY_FOR_INDOOR_OR_OUTDOOR", selectFields.suitabilityForIndoorOrOutdoor),
    ]);
  }

  private async updateTextFields(tx: PrismaTransactionClient, animalId: number, textFields: TextFields): Promise<void> {
    const promises = [
      this.updateCharacteristic(tx, animalId, "ADDITIONAL_NOTES", textFields.additionalNotes),
      this.updateCharacteristic(tx, animalId, "CHRONIC_CONDITIONS", textFields.chronicConditions),
      this.updateCharacteristic(tx, animalId, "DESCRIPTION", textFields.description),
      this.updateCharacteristic(tx, animalId, "FOSTER_STAY_DURATION", textFields.fosterStayDuration),
      this.updateCharacteristic(tx, animalId, "GENDER", textFields.gender),
      this.updateCharacteristic(tx, animalId, "SPAYED_OR_NEUTERED", textFields.spayedOrNeutered),
      this.updateCharacteristic(tx, animalId, "RESCUE_STORY", textFields.rescueStory),
      this.updateCharacteristic(tx, animalId, "SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY", textFields.specialRequirementsForNewFamily),
    ];

    await Promise.all(promises);
  }

  private async updateCharacteristic(tx: PrismaTransactionClient, animalId: number, type: string, values: string[] | string) {
    if (!values) {
      return;
    }

    await tx.animalCharacteristic.upsert({
      where: {
        characteristicOfType: { animalId, type }
      },
      update: {
        value: values.toString(),
      },
      create: {
        animalId,
        type,
        value: values.toString(),
      },
    });
  }
}