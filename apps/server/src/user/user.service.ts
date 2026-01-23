import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import {AnimalService} from "@animal/animal.service";
import {AnimalSummaryDto} from "@animal/dto/animal-summary.dto";
import {AnimalProfileDto} from "@user/dtos/animal-profile.dto";

@Injectable()
export class UserService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly userRepository: UserRepository,
        private readonly revokedTokenRepository: RevokedTokenRepository,
        private readonly animalService: AnimalService,
    ) { }

    public async getProfiles(animalId: number | string): Promise<AnimalProfileDto | null> {
        const animal = await this.animalService.getAnimalById(animalId);

        if (!animal){
            throw new Error("No animal found");
        }

        return this.animalService.buildProfile(animal);
    }

    public async getAnimals(id: string): Promise<AnimalSummaryDto[]> {
        const animals = await this.animalService.getAnimalsByUserId(id);
        return this.animalService.getAnimalSummaries(animals);
    }

    public async getUser(userId: number | string): Promise<User> {
        userId = Number(userId);

        // Try cache first
        const cached = await this.cacheManager.get<User>(`users:${userId}`);
        if (cached) {
            return cached;
        }

        const user = await this.getUserById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        await this.cacheManager.set(`users:${userId}`, user);
        return user;
    }

    public async getUsers(): Promise<User[]> {
        return this.userRepository.getUsers()
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getUserByEmail(email);
    }

    public async getUserById(id: number): Promise<User | null> {
        return this.userRepository.getUserById(id);
    }

    public async setTokenInvalid(token: string, decodedToken: any) {
        const expiresAt = new Date(0);
        expiresAt.setUTCSeconds(decodedToken.exp);

        await this.revokedTokenRepository.save({
            token,
            expiresAt,
        });
    }

    public async isTokenInvalid(token: string): Promise<boolean> {
        if (!token) {
            return true;
        }
        const count = await this.revokedTokenRepository.count({
            where: { token }
        });
        return count > 0;
    }
}
