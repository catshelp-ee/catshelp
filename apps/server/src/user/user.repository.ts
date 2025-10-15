import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /** Get all users */
  async getAllUsers(): Promise<User[]> {
    return this.find();
  }

  /** Save or update a user by fullName */
  async saveOrUpdateUser(data: Partial<User>): Promise<User> {
    let user = await this.findOne({ where: { fullName: data.fullName } });

    if (user) {
      // Update existing user if needed
      user.identityCode = data.identityCode ?? user.identityCode;
      user.email = data.email ?? user.email;
      return this.save(user);
    }

    // Create new user
    user = this.create({
      fullName: data.fullName,
      identityCode: data.identityCode ?? '',
      email: data.email ?? '',
    });

    return this.save(user);
  }

  /** Find a user by ID */
  async getUserById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  /** Find a user by email */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}
