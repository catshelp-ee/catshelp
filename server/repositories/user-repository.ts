import { User } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class UserRepository {
  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  public async saveOrUpdateUser(data) {
    const newRow = await prisma.user.upsert({
      where: {
        fullName: data.fullName
      },
      update: {},
      create: {
        fullName: data.fullName
      },
    });
    return newRow;
  }

  public async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async getUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email: email },
    });
  }
}
