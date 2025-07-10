import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import {
  CharacteristicsInfo,
  CharacteristicsResult,
  createCharacteristicsInfo,
  Profile,
} from 'types/cat';
import { PrismaTransactionClient } from 'types/prisma';

@injectable()
export default class CharacteristicsService {
  characteristicsInfo: CharacteristicsInfo;
  constructor() {
    this.characteristicsInfo = createCharacteristicsInfo();
  }

  async getCharacteristics(animalId: number): Promise<CharacteristicsResult> {
    const characteristics = await prisma.animalCharacteristic.findMany({
      where: { animalId },
    });
    const multiSelectArrays: Record<string, string[]> = {};
    const others: Record<string, string> = {};

    characteristics.forEach(({ type, name }) => {
      if (type in this.characteristicsInfo.multiselectFields) {
        if (!multiSelectArrays[type]) {
          multiSelectArrays[type] = []; // initialize array if not present
        }

        multiSelectArrays[type].push(name);
        return;
      }
      others[type] = name;
    });

    return {
      multiSelectArrays,
      others,
    };
  }

  async updateCharacteristics(
    tx: PrismaTransactionClient,
    animalID: number,
    updatedAnimalData: Profile
  ): Promise<void> {
    for (const [key, value] of Object.entries(
      updatedAnimalData.characteristics.multiselectFields
    )) {
      await this.updateArrayCharacteristic(tx, animalID, key, value);
    }

    for (const [key, value] of Object.entries(
      updatedAnimalData.characteristics.selectFields
    )) {
      const currentValues = await tx.animalCharacteristic.findMany({
        where: { animalId: animalID, type: key },
      });
      await this.updateSingleCharacteristic(
        tx,
        animalID,
        key,
        value,
        currentValues
      );
    }

    for (const [key, value] of Object.entries(
      updatedAnimalData.characteristics.textFields
    )) {
      const currentValues = await tx.animalCharacteristic.findMany({
        where: { animalId: animalID, type: key },
      });
      await this.updateSingleCharacteristic(
        tx,
        animalID,
        key,
        value,
        currentValues
      );

      if (key === 'gender') {
        const gender = (value as string).split(' '); // Fix: should use value, not key

        await this.updateSingleCharacteristic(
          tx,
          animalID,
          'spayedOrNeutered',
          gender[0],
          currentValues
        );

        await this.updateSingleCharacteristic(
          tx,
          animalID,
          'gender',
          gender[1],
          currentValues
        );
        continue;
      }
    }
  }

  private async updateArrayCharacteristic(
    tx: PrismaTransactionClient,
    animalId: number,
    type: string,
    values: string[]
  ): Promise<void> {
    // Delete existing
    await tx.animalCharacteristic.deleteMany({
      where: { animalId, type },
    });

    // Insert new
    if (values) {
      const insertData = values.map(val => ({
        animalId,
        type,
        name: val.trim(),
      }));

      await tx.animalCharacteristic.createMany({ data: insertData });
    }
  }

  private async updateSingleCharacteristic(
    tx: PrismaTransactionClient,
    animalId: number,
    type: string,
    value: string,
    existing: any[]
  ): Promise<void> {
    if (!value) {
      return;
    }
    if (existing.length === 0) {
      await tx.animalCharacteristic.create({
        data: { animalId, type, name: value },
      });
    } else {
      await tx.animalCharacteristic.update({
        where: { id: existing[0].id },
        data: { name: value },
      });
    }
  }
}
