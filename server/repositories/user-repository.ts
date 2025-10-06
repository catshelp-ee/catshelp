import { injectable } from 'inversify';
import { AppDataSource } from '@database/data-source';

@injectable()
export default class UserRepository {

    public async saveOrUpdateUser(data) {
        const newRow = await AppDataSource.createQueryBuilder()
            .insert()
            .into("users")
            .values({
                fullName: data.fullName,
                email: data.email,
                identityCode: data.identityCode
            })
            .orUpdate(["email", "identity_code"], ["full_name"], {
                skipUpdateIfNoValuesChanged: true,
            })
            .execute();
            return newRow;
    }

    public async getUserById(id: number) {
        return await AppDataSource.getRepository("users")
            .createQueryBuilder("user")
            .where("user.id = :id", { id: id })
            .getOne();
    }

    public async getUserByEmail(email: string) {
        return await AppDataSource.getRepository("users")
            .createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne();
    }
}
