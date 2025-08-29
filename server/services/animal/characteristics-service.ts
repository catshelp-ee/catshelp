import { injectable } from 'inversify';
import { prisma } from 'server/prisma';
import {
  CharacteristicsInfo,
  CharacteristicsResult,
  createCharacteristicsInfo,
  MultiselectFields,
  Profile,
  SelectFields,
  TextFields,
} from 'types/cat';
import { PrismaTransactionClient } from 'types/prisma';

@injectable()
export default class CharacteristicsService {
  private readonly characteristicsInfo: CharacteristicsInfo;

  constructor() {
    this.characteristicsInfo = createCharacteristicsInfo();
  }

  async getCharacteristics(animalId: number): Promise<CharacteristicsResult> {
    const characteristics = await prisma.animalCharacteristic.findMany({
      where: { animalId },
    });

    const multiSelectArrays: Record<string, string[]> = {};
    const others: Record<string, string> = {};

    for (const { type, name } of characteristics) {
      if (type in this.characteristicsInfo.multiselectFields) {
        if (!multiSelectArrays[type]) {
          multiSelectArrays[type] = [];
        }
        multiSelectArrays[type].push(name);
      } else {
        others[type] = name;
      }
    }

    return {
      multiSelectArrays,
      others,
    };
  }

  async updateCharacteristics(
    tx: PrismaTransactionClient,
    updatedAnimalData: Profile
  ): Promise<void> {
    const { animalId, characteristics } = updatedAnimalData;

    // Handle multiselect fields
    await this.updateMultiselectFields(tx, animalId, characteristics.multiselectFields);

    // Handle select fields
    await this.updateSelectFields(tx, animalId, characteristics.selectFields);

    // Handle text fields (including special gender processing)
    await this.updateTextFields(tx, animalId, characteristics.textFields);
  }

  private async updateMultiselectFields(
    tx: PrismaTransactionClient,
    animalId: number,
    multiselectFields: MultiselectFields
  ): Promise<void> {
    for (const [type, values] of Object.entries(multiselectFields)) {
      await this.updateArrayCharacteristic(tx, animalId, type, values);
    }
  }

  private async updateSelectFields(
    tx: PrismaTransactionClient,
    animalId: number,
    selectFields: SelectFields
  ): Promise<void> {
    for (const [type, value] of Object.entries(selectFields)) {
      await this.updateSingleCharacteristic(tx, animalId, type, value);
    }
  }

  private async updateTextFields(
    tx: PrismaTransactionClient,
    animalId: number,
    textFields: TextFields
  ): Promise<void> {
    for (const [type, value] of Object.entries(textFields)) {
      if (type === 'gender') {
        await this.handleGenderField(tx, animalId, value);
      } else {
        await this.updateSingleCharacteristic(tx, animalId, type, value);
      }
    }
  }

  private async handleGenderField(
    tx: PrismaTransactionClient,
    animalId: number,
    genderValue: string
  ): Promise<void> {
    const genderParts = genderValue.split(' ');

    if (genderParts.length >= 2) {
      const [spayedOrNeutered, gender] = genderParts;

      await Promise.all([
        this.updateSingleCharacteristic(tx, animalId, 'spayedOrNeutered', spayedOrNeutered),
        this.updateSingleCharacteristic(tx, animalId, 'gender', gender),
      ]);
    } else {
      // If gender doesn't have the expected format, just update as-is
      await this.updateSingleCharacteristic(tx, animalId, 'gender', genderValue);
    }
  }

  private async updateArrayCharacteristic(
    tx: PrismaTransactionClient,
    animalId: number,
    type: string,
    values: string[]
  ): Promise<void> {
    // Delete existing characteristics of this type
    await tx.animalCharacteristic.deleteMany({
      where: { animalId, type },
    });

    // Insert new values if any exist
    if (values && values.length > 0) {
      const insertData = values
        .filter(val => val && val.trim()) // Filter out empty/null values
        .map(val => ({
          animalId,
          type,
          name: val.trim(),
        }));

      if (insertData.length > 0) {
        await tx.animalCharacteristic.createMany({ data: insertData });
      }
    }
  }

  private async updateSingleCharacteristic(
    tx: PrismaTransactionClient,
    animalId: number,
    type: string,
    value: string
  ): Promise<void> {
    if (!value || !value.trim()) {
      // If value is empty, delete existing characteristic
      await tx.animalCharacteristic.deleteMany({
        where: { animalId, type },
      });
      return;
    }

    const trimmedValue = value.trim();
    const existing = await tx.animalCharacteristic.findFirst({
      where: { animalId, type },
    });

    if (existing) {
      await tx.animalCharacteristic.update({
        where: { id: existing.id },
        data: { name: trimmedValue },
      });
    } else {
      await tx.animalCharacteristic.create({
        data: { animalId, type, name: trimmedValue },
      });
    }
  }
}