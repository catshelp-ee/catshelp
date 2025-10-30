import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly userRepository: UserRepository,
        private readonly revokedTokenRepository: RevokedTokenRepository,
    ) { }

    public async getUser(userId: number | string): Promise<User | null> {
        userId = Number(userId);

        // Try cache first
        const cached = await this.cacheManager.get<User>(`users:${userId}`);
        if (cached) {
            return cached;
        }

        const user = await this.getUserById(userId);

        if (!user) {
            return null;
        }

        await this.cacheManager.set(`users:${userId}`, user);

        return user;
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
        if (!token) return true;
        const count = await this.revokedTokenRepository.count({
            where: { token }
        });
        return count > 0;
    }
}
