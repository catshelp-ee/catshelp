import { injectable } from 'inversify';
import { prisma } from 'server/prisma';

import { AppDataSource } from '@database/data-source';

@injectable()
export default class UserRepository {

  public async saveOrUpdateUser(data) {
    const newRow = await prisma.user.upsert({
      where: {
        fullName: data.fullName
      },
      update: {},
      create: {
        fullName: data.fullName,
        identityCode: data.identityCode || "",
        email: data.email || ""
      },
    });
    return newRow;
  }

  public async getUserById(id: number) {
    return await AppDataSource.getRepository("users")
      .createQueryBuilder("user")
      .where("user.id = :id", { id : id })
      .getOne();
  }

  public async getUserByEmail(email: string) {
    return await AppDataSource.getRepository("users")
      .createQueryBuilder("user")
      .where("user.email = :email", { email : email })
      .getOne();
  }
}
