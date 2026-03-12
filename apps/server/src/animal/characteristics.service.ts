import {Profile} from '@catshelp/types';
import { Injectable } from '@nestjs/common';
import { Characteristic } from './entities/characteristic.entity';
import { CharacteristicRepository } from './repositories/characteristic.repository';

@Injectable()
export class CharacteristicsService {
    constructor(
        private readonly characteristicRepository: CharacteristicRepository,
    ) { }

    async getCharacteristics(animalId: number): Promise<Characteristic[]> {
        return await this.characteristicRepository.getAll(animalId);
    }

    async updateCharacteristics(updatedAnimalData: Profile): Promise<void> {
        const { animalId, personalityInfo } = updatedAnimalData;
        /* TODO
        await Promise.all([
            this.saveOrUpdateCharacteristic(animalId, 'BEHAVIOUR_TRAITS', personalityInfo.behaviorTraits),
            this.saveOrUpdateCharacteristic(animalId, 'LIKES', personalityInfo.likes),
            this.saveOrUpdateCharacteristic(animalId, 'PERSONALITY', personalityInfo.personality),
            
            
            this.saveOrUpdateCharacteristic(animalId, 'ATTITUDE_TOWARDS_CATS', personalityInfo.attitudeTowardsCats),
            this.saveOrUpdateCharacteristic(animalId, 'ATTITUDE_TOWARDS_CHILDREN', personalityInfo.attitudeTowardsChildren),
            this.saveOrUpdateCharacteristic(animalId, 'ATTITUDE_TOWARDS_DOGS', personalityInfo.attitudeTowardsDogs),
            this.saveOrUpdateCharacteristic(animalId, 'COAT_COLOUR', personalityInfo.coatColour),
            this.saveOrUpdateCharacteristic(animalId, 'COAT_LENGTH', personalityInfo.coatLength),
            this.saveOrUpdateCharacteristic(animalId, 'SUITABILITY_FOR_INDOOR_OR_OUTDOOR', personalityInfo.suitabilityForIndoorOrOutdoor),
            
            
            this.saveOrUpdateCharacteristic(animalId, 'ADDITIONAL_NOTES', personalityInfo.additionalNotes),
            this.saveOrUpdateCharacteristic(animalId, 'CHRONIC_CONDITIONS', personalityInfo.chronicConditions),
            this.saveOrUpdateCharacteristic(animalId, 'DESCRIPTION', personalityInfo.description),
            this.saveOrUpdateCharacteristic(animalId, 'FOSTER_STAY_DURATION', personalityInfo.fosterStayDuration),
            this.saveOrUpdateCharacteristic(animalId, 'GENDER', personalityInfo.gender),
            this.saveOrUpdateCharacteristic(animalId, 'SPAYED_OR_NEUTERED', personalityInfo.spayedOrNeutered),
            this.saveOrUpdateCharacteristic(animalId, 'RESCUE_STORY', personalityInfo.rescueStory),
            this.saveOrUpdateCharacteristic(animalId, 'SPECIAL_REQUIREMENTS_FOR_NEW_FAMILY', personalityInfo.specialRequirementsForNewFamily),
        ]);
        */
    }

    private async saveOrUpdateCharacteristic(animalId: number, type: string, value: string | string[]) {
        const val = Array.isArray(value) ? value.join(',') : value ?? '';

        let characteristic = await this.characteristicRepository.get(animalId, type);

        if (characteristic) {
            characteristic.value = val;
            return this.characteristicRepository.save(characteristic);
        }

        characteristic = this.characteristicRepository.create({ animalId, type, value: val });
        return this.characteristicRepository.save(characteristic);
    }
}
