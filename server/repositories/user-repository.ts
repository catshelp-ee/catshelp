import { User } from 'generated/prisma';
import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

@injectable()
export default class UserRepository {
  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }
}
