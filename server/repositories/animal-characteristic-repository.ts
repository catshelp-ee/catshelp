import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class AnimalCharacteristicRepository {

    public async saveOrUpdateCharacteristic(data) {
        const newRow = await prisma.animalCharacteristic.upsert({
            where: {
                characteristicOfType: {
                    animalId: data.animalId,
                    type: data.type
                }
            },
            update: {
                name: data.name
            },
            create: {
                animalId: data.animalId,
                type: data.type,
                name: data.name
            },
        });
        return newRow;
    }

    public async deleteCharacteristic(data) {
        await prisma.animalCharacteristic.deleteMany({
            where: {
                animalId: data.animalId,
                type: data.type
            }
        });
    }

    public async deleteAllCharacteristicsByAnimalId(animalId) {
        await prisma.animalCharacteristic.deleteMany({
            where: {
                animalId: animalId
            }
        });
    }
}