import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class FosterHomeRepository {

    public async saveOrUpdateFosterHome(data) {
        const newRow = await prisma.fosterHome.upsert({
            where: {
                userId: data.userId
            },
            update: {},
            create: {
                userId: data.userId
            },
        });
        return newRow;
    }

    public async saveOrUpdateAnimalToFosterHome(data) {
        const newRow = await prisma.animalToFosterHome.upsert({
            where: {
                animalToFosterHome: {
                    animalId: data.animalId,
                    fosterHomeId: data.fosterHomeId
                }
            },
            update: {},
            create: {
                animalId: data.animalId,
                fosterHomeId: data.fosterHomeId
            },
        });
        return newRow;
    }
}