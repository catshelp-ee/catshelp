import AnimalCharacteristicRepository from '@repositories/animal-characteristic-repository';
import { inject, injectable } from 'inversify';
import { prisma } from 'server/prisma';
import {
  CharacteristicsInfo,
  createCharacteristicsInfo,
  MultiselectFields,
  Profile,
  SelectFields,
  TextFields
} from 'types/cat';
import TYPES from 'types/inversify-types';
import { PrismaTransactionClient } from 'types/prisma';

@injectable()
export default class CharacteristicsService {
  constructor(
    @inject(TYPES.AnimalCharacteristicRepository)
    private animalCharacteristicRepository: AnimalCharacteristicRepository
  ) { }
  public async getCharacteristics(animalId: number): Promise<CharacteristicsInfo> {
    const characteristics = await prisma.animalCharacteristic.findMany({
      where: { animalId },
    });

    const characteristicsInfo = createCharacteristicsInfo();

    const characteristicsMap = {
      "BEHAVIOUR_TRAITS": characteristics.find(c => c.type === "BEHAVIOUR_TRAITS"),
      "LIKES": characteristics.find(c => c.type === "LIKES"),
      "PERSONALITY": characteristics.find(c => c.type === "PERSONALITY"),

      "ATTITUDE_TOWARDS_CATS": characteristics.find(c => c.type === "ATTITUDE_TOWARDS_CATS"),
      "ATTITUDE_TOWARDS_CHILDREN": characteristics.find(c => c.type === "ATTITUDE_TOWARDS_CHILDREN"),
      "ATTITUDE_TOWARDS_DOGS": characteristics.find(c => c.type === "ATTITUDE_TOWARDS_DOGS"),
      "COAT_COLOUR": characteristics.find(c => c.type === "COAT_COLOUR"),
      "COAT_LENGTH": characteristics.find(c => c.type === "COAT_LENGTH"),
      "SUITABILITY_FOR_INDOOR_OR_OUTDOOR": characteristics.find(c => c.type === "SUITABILITY_FOR_INDOOR_OR_OUTDOOR"),

      "ADDITIONAL_NOTES": characteristics.find(c => c.type === "ADDITIONAL_NOTES"),
      "CHRONIC_CONDITIONS": characteristics.find(c => c.type === "CHRONIC_CONDITIONS"),
      "DESCRIPTION": characteristics.find(c => c.type === "DESCRIPTION"),
      "FOSTER_STAY_DURATION": characteristics.find(c => c.type === "FOSTER_STAY_DURATION"),
      "RESCUE_STORY": characteristics.find(c => c.type === "RESCUE_STORY"),
      "SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY": characteristics.find(c => c.type === "SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY"),
      "GENDER": characteristics.find(c => c.type === "GENDER"),
      "SPAYED_OR_NEUTERED": characteristics.find(c => c.type === "SPAYED_OR_NEUTERED"),
    }

    characteristicsInfo.multiselectFields.behaviorTraits = characteristicsMap["BEHAVIOUR_TRAITS"]?.value?.split(",") ?? [];
    characteristicsInfo.multiselectFields.likes = characteristicsMap["LIKES"]?.value?.split(",") ?? [];
    characteristicsInfo.multiselectFields.personality = characteristicsMap["PERSONALITY"]?.value?.split(",") ?? [];

    characteristicsInfo.selectFields.attitudeTowardsCats = characteristicsMap["ATTITUDE_TOWARDS_CATS"]?.value ?? "";
    characteristicsInfo.selectFields.attitudeTowardsChildren = characteristicsMap["ATTITUDE_TOWARDS_CHILDREN"]?.value ?? "";
    characteristicsInfo.selectFields.attitudeTowardsDogs = characteristicsMap["ATTITUDE_TOWARDS_DOGS"]?.value ?? "";
    characteristicsInfo.selectFields.coatColour = characteristicsMap["COAT_COLOUR"]?.value ?? "";
    characteristicsInfo.selectFields.coatLength = characteristicsMap["COAT_LENGTH"]?.value ?? "";
    characteristicsInfo.selectFields.suitabilityForIndoorOrOutdoor = characteristicsMap["SUITABILITY_FOR_INDOOR_OR_OUTDOOR"]?.value ?? "";

    characteristicsInfo.textFields.additionalNotes = characteristicsMap["ADDITIONAL_NOTES"]?.value ?? "";
    characteristicsInfo.textFields.chronicConditions = characteristicsMap["CHRONIC_CONDITIONS"]?.value ?? "";
    characteristicsInfo.textFields.description = characteristicsMap["DESCRIPTION"]?.value ?? "";
    characteristicsInfo.textFields.fosterStayDuration = characteristicsMap["FOSTER_STAY_DURATION"]?.value ?? "";
    characteristicsInfo.textFields.rescueStory = characteristicsMap["RESCUE_STORY"]?.value ?? "";
    characteristicsInfo.textFields.specialRequirementsForNewFamily = characteristicsMap["SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY"]?.value ?? "";
    characteristicsInfo.textFields.gender = characteristicsMap["GENDER"]?.value ?? "";
    characteristicsInfo.textFields.spayedOrNeutered = characteristicsMap["SPAYED_OR_NEUTERED"]?.value ?? "";

    return characteristicsInfo;
  }

  public async updateCharacteristics(updatedAnimalData: Profile, tx: PrismaTransactionClient): Promise<void> {
    const { animalId, characteristics } = updatedAnimalData;

    await this.updateMultiselectFields(tx, animalId, characteristics.multiselectFields);
    await this.updateSelectFields(tx, animalId, characteristics.selectFields);
    await this.updateTextFields(tx, animalId, characteristics.textFields);
  }

  private async updateMultiselectFields(tx: PrismaTransactionClient, animalId: number, multiselectFields: MultiselectFields): Promise<void> {
    await Promise.all([
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "BEHAVIOUR_TRAITS", value: multiselectFields.behaviorTraits }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "LIKES", value: multiselectFields.likes }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "PERSONALITY", value: multiselectFields.personality }, tx),
    ]);
  }

  private async updateSelectFields(tx: PrismaTransactionClient, animalId: number, selectFields: SelectFields): Promise<void> {
    await Promise.all([
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "ATTITUDE_TOWARDS_CATS", value: selectFields.attitudeTowardsCats }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "ATTITUDE_TOWARDS_CHILDREN", value: selectFields.attitudeTowardsChildren }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "ATTITUDE_TOWARDS_DOGS", value: selectFields.attitudeTowardsDogs }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "COAT_COLOUR", value: selectFields.coatColour }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "COAT_LENGTH", value: selectFields.coatLength }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "SUITABILITY_FOR_INDOOR_OR_OUTDOOR", value: selectFields.suitabilityForIndoorOrOutdoor }, tx),
    ]);
  }
  private async updateTextFields(tx: PrismaTransactionClient, animalId: number, textFields: TextFields): Promise<void> {
    const promises = [
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "ADDITIONAL_NOTES", value: textFields.additionalNotes }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "CHRONIC_CONDITIONS", value: textFields.chronicConditions }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "DESCRIPTION", value: textFields.description }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "FOSTER_STAY_DURATION", value: textFields.fosterStayDuration }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "GENDER", value: textFields.gender }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "SPAYED_OR_NEUTERED", value: textFields.spayedOrNeutered }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "RESCUE_STORY", value: textFields.rescueStory }, tx),
      this.animalCharacteristicRepository.saveOrUpdateCharacteristic({ animalId, type: "SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY", value: textFields.specialRequirementsForNewFamily }, tx),
    ];

    await Promise.all(promises);
  }
}