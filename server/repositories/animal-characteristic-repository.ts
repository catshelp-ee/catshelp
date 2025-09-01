import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class AnimalCharacteristicRepository {

    public async saveOrUpdateCharacteristic(data, tx?) {
        const orm = tx || prisma;
        const newRow = await orm.animalCharacteristic.upsert({
            where: {
                characteristicOfType: {
                    animalId: data.animalId,
                    type: data.type
                }
            },
            update: {
                value: data.name
            },
            create: {
                animalId: data.animalId,
                type: data.type,
                value: data.name
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