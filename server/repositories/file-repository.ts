import { File } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class FileRepository {

    getProfilePicture(animalId: number): Promise<File> {
        return prisma.file.findFirst({
            where: {
                animalId
            }
        })
    }
}
