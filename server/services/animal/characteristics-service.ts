//import { descriptors } from "types/cat";
//import { PrismaTransactionClient } from "types/prisma";
import { injectable } from "inversify";
import { prisma } from "server/prisma";
import { CharacteristicsResult } from "types/cat";


@injectable()
export default class CharacteristicsService {
  async getCharacteristics(animalId: number): Promise<CharacteristicsResult> {
    const characteristics = await prisma.animalCharacteristic.findMany({
      where: { animalId },
    });

    const character: string[] = [];
    const likes: string[] = [];
    const cat: string[] = [];
    const others: Record<string, string> = {};

    characteristics.forEach(({ type, name }) => {
      switch (type) {
        case "characteristics":
          character.push(name);
          break;
        case "likes":
          likes.push(name);
          break;
        case "cat":
          cat.push(name);
          break;
        default:
          others[type] = name;
      }
    });

    return {
      character,
      likes,
      cat,
      others,
    };
  }

  /*
  async updateCharacteristics(
    tx: PrismaTransactionClient,
    animalId: number,
    catData: any
  ): Promise<void> {
    for (const [characteristic, values] of Object.entries(descriptors)) {
      const currentValues = await tx.animalCharacteristic.findMany({
        where: { animalId, type: characteristic },
      });

      const newValues = catData[characteristic];

      if (this.isArrayCharacteristic(characteristic)) {
        await this.updateArrayCharacteristic(tx, animalId, characteristic, newValues);
      } else {
        await this.updateSingleCharacteristic(tx, animalId, characteristic, newValues, currentValues);
      }
    }
  }

  private isArrayCharacteristic(characteristic: string): boolean {
    return ["characteristics", "cat", "likes"].includes(characteristic);
  }

  private async updateArrayCharacteristic(
    tx: PrismaTransactionClient,
    animalId: number,
    type: string,
    values: string
  ): Promise<void> {
    // Delete existing
    await tx.animalCharacteristic.deleteMany({
      where: { animalId, type },
    });

    // Insert new
    if (values) {
      const insertData = values.split(",").map(val => ({
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
    */
}