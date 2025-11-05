import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { Animal } from '../animal/entities/animal.entity';
import { BaseRepository } from '../common/base.repository';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository<User> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(User, dataSource, request);
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

    async getAnimalsByUserId(id: number): Promise<Animal[]> {
        const user = await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.fosterHome', 'fosterHome')
            .leftJoinAndSelect('fosterHome.animalToFosterHome', 'animalToFosterHome')
            .leftJoinAndSelect('animalToFosterHome.animal', 'animal')
            .where('user.id = :id', { id })
            .getOne();

        if (!user?.fosterHome?.animalToFosterHome) {
            return [];
        }

        // Map over the OneToMany relation to extract animals
        return user.fosterHome.animalToFosterHome.map(rel => rel.animal).filter(Boolean);
    }
}
