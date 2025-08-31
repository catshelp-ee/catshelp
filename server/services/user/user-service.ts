import NodeCacheService from '@services/cache/cache-service';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import { prisma } from '../../prisma';
import UserRepository from '@repositories/user-repository';
import RevokedTokenRepository from '@repositories/revoked-token-repository';

@injectable()
export default class UserService {
  constructor(
    @inject(TYPES.NodeCacheService)
    private nodeCacheService: NodeCacheService,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository,
    @inject(TYPES.RevokedTokenRepository)
    private revokedTokenRepository: RevokedTokenRepository,
  ) { }

  public async getUser(userId: number | string): Promise<User> {
    userId = Number(userId);
    let user = await this.nodeCacheService.get<User>(`users:${userId}`);
    if (user) {
      return user;
    }
    user = await this.getUserById(userId);
    this.setUserInCache(userId, user);
    return user;
  }

  private setUserInCache(userId: number, user: User): void {
    const fiveMinutesInSeconds = 300;
    this.nodeCacheService.set(`users:${userId}`, user, fiveMinutesInSeconds);
  }

  public getUserByEmail(email: string): Promise<User> {
    if (!email) {
      return null;
    }

    return this.userRepository.getUserByEmail(email);
  }

  public getUserById(id: number): Promise<User> {
    if (!id) {
      return null;
    }

    return this.userRepository.getUserById(id);
  }

  public async setTokenInvalid(token, decodedToken) {
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    const data = {
      token: token,
      expiresAt: date
    }

    await this.revokedTokenRepository.saveOrUpdateRevokedToken(data);
  }

  public async isTokenInvalid(token) {
    if (!token) {
      return true;
    }
    const count = await this.revokedTokenRepository.getRevokedTokenCountByToken(token);
    return count > 0;
  }
}
