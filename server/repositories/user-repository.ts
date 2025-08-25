import { User } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class UserRepository {
  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  getUserById(id: number): Promise<User> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async saveOrUpdateUser(data) {
    const newRow = await prisma.user.upsert({
      where: {
        fullName: data.fullName,
      },
      update: {},
      create: {
        fullName: data.fullName,
      },
    });
    return newRow;
  }
}
