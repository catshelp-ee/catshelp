import {Profile} from '@catshelp/types';
import { Injectable } from '@nestjs/common';
import { Characteristic } from './entities/characteristic.entity';
import { CharacteristicRepository } from './repositories/characteristic.repository';
import { AnimalProfileDto } from '@user/dtos/animal-profile.dto';

@Injectable()
export class CharacteristicsService {
    constructor(
        private readonly characteristicRepository: CharacteristicRepository,
    ) { }

    async getCharacteristics(animalId: number): Promise<Characteristic[]> {
        return await this.characteristicRepository.getAll(animalId);
    }

    async updateCharacteristics(updatedAnimalData: AnimalProfileDto): Promise<void> {
        const personalityInfo = updatedAnimalData.personalityInfo;
        const mainInfo = updatedAnimalData.mainInfo;
        const animalId = updatedAnimalData.animalId;
        
        await Promise.all([
            this.saveOrUpdateCharacteristic(animalId, 'bold', personalityInfo.bold),
            this.saveOrUpdateCharacteristic(animalId, 'shy', personalityInfo.shy),
            this.saveOrUpdateCharacteristic(animalId, 'active', personalityInfo.active),
            this.saveOrUpdateCharacteristic(animalId, 'veryActive', personalityInfo.veryActive),
            this.saveOrUpdateCharacteristic(animalId, 'calm', personalityInfo.calm),
            this.saveOrUpdateCharacteristic(animalId, 'friendly', personalityInfo.friendly),
            this.saveOrUpdateCharacteristic(animalId, 'grumpy', personalityInfo.grumpy),
            this.saveOrUpdateCharacteristic(animalId, 'vocal', personalityInfo.vocal),
            this.saveOrUpdateCharacteristic(animalId, 'dislikesTouching', personalityInfo.dislikesTouching),
            this.saveOrUpdateCharacteristic(animalId, 'sociable', personalityInfo.sociable),
            this.saveOrUpdateCharacteristic(animalId, 'aloof', personalityInfo.aloof),
            this.saveOrUpdateCharacteristic(animalId, 'goodAppetite', personalityInfo.goodAppetite),
            this.saveOrUpdateCharacteristic(animalId, 'curious', personalityInfo.curious),
            this.saveOrUpdateCharacteristic(animalId, 'playful', personalityInfo.playful),
            this.saveOrUpdateCharacteristic(animalId, 'stressed', personalityInfo.stressed),
            this.saveOrUpdateCharacteristic(animalId, 'sensitive', personalityInfo.sensitive),
            this.saveOrUpdateCharacteristic(animalId, 'peaceful', personalityInfo.peaceful),
            this.saveOrUpdateCharacteristic(animalId, 'selfish', personalityInfo.selfish),
            this.saveOrUpdateCharacteristic(animalId, 'hisses', personalityInfo.hisses),
            this.saveOrUpdateCharacteristic(animalId, 'sleepsCuddling', personalityInfo.sleepsCuddling),
            this.saveOrUpdateCharacteristic(animalId, 'likesPetting', personalityInfo.likesPetting),
            this.saveOrUpdateCharacteristic(animalId, 'likesAttention', personalityInfo.likesAttention),
            this.saveOrUpdateCharacteristic(animalId, 'likesPlayingWithPeople', personalityInfo.likesPlayingWithPeople),
            this.saveOrUpdateCharacteristic(animalId, 'likesPlayingAlone', personalityInfo.likesPlayingAlone),
            this.saveOrUpdateCharacteristic(animalId, 'usesLitterbox', personalityInfo.usesLitterbox),
            this.saveOrUpdateCharacteristic(animalId, 'usesScratchingpost', personalityInfo.usesScratchingpost),
            this.saveOrUpdateCharacteristic(animalId, 'selectiveWithFood', personalityInfo.selectiveWithFood),
            this.saveOrUpdateCharacteristic(animalId, 'adaptable', personalityInfo.adaptable),
            this.saveOrUpdateCharacteristic(animalId, 'scratchesFurniture', personalityInfo.scratchesFurniture),
            this.saveOrUpdateCharacteristic(animalId, 'trusting', personalityInfo.trusting),
            this.saveOrUpdateCharacteristic(animalId, 'attitudeTowardsCats', personalityInfo.attitudeTowardsCats),
            this.saveOrUpdateCharacteristic(animalId, 'attitudeTowardsDogs', personalityInfo.attitudeTowardsDogs),
            this.saveOrUpdateCharacteristic(animalId, 'attitudeTowardsChildren', personalityInfo.attitudeTowardsChildren),
            this.saveOrUpdateCharacteristic(animalId, 'suitabilityForIndoorOrOutdoor', personalityInfo.suitabilityForIndoorOrOutdoor),
            

            this.saveOrUpdateCharacteristic(animalId, 'coatColour', mainInfo.coatColour),
            this.saveOrUpdateCharacteristic(animalId, 'coatLength', mainInfo.coatLength),
            this.saveOrUpdateCharacteristic(animalId, 'gender', mainInfo.gender),
            this.saveOrUpdateCharacteristic(animalId, 'spayedOrNeutered', mainInfo.spayedOrNeutered),
        ]);
        
    }

    private async saveOrUpdateCharacteristic(animalId: number, type: string, value: string | string[] | boolean) {
        let val = '';

        if (typeof value === 'boolean') {
            val = value ? 'true' : 'false';
        } else if (Array.isArray(value)) {
            val = value.join(',');
        }

        let characteristic = await this.characteristicRepository.get(animalId, type);

        if (characteristic) {
            characteristic.value = val;
            return this.characteristicRepository.save(characteristic);
        }

        if (val === '') {
            return;
        }
        
        characteristic = this.characteristicRepository.create({ animalId, type, value: val });
        return this.characteristicRepository.save(characteristic);
    }
}
