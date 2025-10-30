import {
  CharacteristicsInfo,
  createCharacteristicsInfo,
  MultiselectFields,
  Profile,
  SelectFields,
  TextFields
} from '@catshelp/types';
import { Injectable } from '@nestjs/common';
import { Characteristic } from './entities/characteristic.entity';
import { CharacteristicRepository } from './repositories/characteristic.repository';

@Injectable()
export class CharacteristicsService {
  constructor(
    private readonly characteristicRepository: CharacteristicRepository,
  ) { }

  async getCharacteristics(animalId: number): Promise<CharacteristicsInfo> {
    const characteristics = await this.characteristicRepository.getAll(animalId);

    const characteristicsInfo = createCharacteristicsInfo();
    const characteristicsMap: Record<string, Characteristic> = {};

    for (const characteristic of characteristics) {
      characteristicsMap[characteristic.type] = characteristic;
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

  async updateCharacteristics(updatedAnimalData: Profile): Promise<void> {
    const { animalId, characteristics } = updatedAnimalData;

    await Promise.all([
      this.updateMultiselectFields(animalId, characteristics.multiselectFields),
      this.updateSelectFields(animalId, characteristics.selectFields),
      this.updateTextFields(animalId, characteristics.textFields),
    ]);
  }

  private async updateMultiselectFields(
    animalId: number,
    multiselectFields: MultiselectFields,
  ) {
    await Promise.all([
      this.saveOrUpdateCharacteristic(animalId, 'BEHAVIOUR_TRAITS', multiselectFields.behaviorTraits),
      this.saveOrUpdateCharacteristic(animalId, 'LIKES', multiselectFields.likes),
      this.saveOrUpdateCharacteristic(animalId, 'PERSONALITY', multiselectFields.personality),
    ]);
  }

  private async updateSelectFields(
    animalId: number,
    selectFields: SelectFields,
  ) {
    const updates = [
      ['ATTITUDE_TOWARDS_CATS', selectFields.attitudeTowardsCats],
      ['ATTITUDE_TOWARDS_CHILDREN', selectFields.attitudeTowardsChildren],
      ['ATTITUDE_TOWARDS_DOGS', selectFields.attitudeTowardsDogs],
      ['COAT_COLOUR', selectFields.coatColour],
      ['COAT_LENGTH', selectFields.coatLength],
      ['SUITABILITY_FOR_INDOOR_OR_OUTDOOR', selectFields.suitabilityForIndoorOrOutdoor],
    ];
    await Promise.all(
      updates.map(([type, value]) => this.saveOrUpdateCharacteristic(animalId, type, value)),
    );
  }

  private async updateTextFields(
    animalId: number,
    textFields: TextFields,
  ) {
    const updates = [
      ['ADDITIONAL_NOTES', textFields.additionalNotes],
      ['CHRONIC_CONDITIONS', textFields.chronicConditions],
      ['DESCRIPTION', textFields.description],
      ['FOSTER_STAY_DURATION', textFields.fosterStayDuration],
      ['GENDER', textFields.gender],
      ['SPAYED_OR_NEUTERED', textFields.spayedOrNeutered],
      ['RESCUE_STORY', textFields.rescueStory],
      ['SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY', textFields.specialRequirementsForNewFamily],
    ];
    await Promise.all(
      updates.map(([type, value]) => this.saveOrUpdateCharacteristic(animalId, type, value)),
    );
  }

  private async saveOrUpdateCharacteristic(
    animalId: number,
    type: string,
    value: string | string[],
  ) {
    const val = Array.isArray(value) ? value.join(',') : value ?? '';

    const characteristic = await this.characteristicRepository.get(animalId, type);

    if (characteristic) {
      characteristic.value = val;
      return this.characteristicRepository.save(characteristic);
    } else {
      const characteristic = this.characteristicRepository.create({ animalId, type, value: val });
      return this.characteristicRepository.save(characteristic);
    }
  }
}
