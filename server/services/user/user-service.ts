import NodeCacheService from '@services/cache/cache-service';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import { prisma } from '../../prisma';

@injectable()
export default class UserService {
  constructor(
    @inject(TYPES.NodeCacheService)
    private nodeCacheService: NodeCacheService
  ) { }

  getUser(userID: number | string) {
    try {
      return this.nodeCacheService.get<User>(`user:${userID}`);
    } catch {
      throw new Error('Error fetching user from cache');
    }
  }

  setUser(user: User) {
    try {
      this.nodeCacheService.set(`user:${user.id}`, user);
    } catch {
      throw new Error('Error caching user');
    }
  }

  static async getUserByEmail(email) {
    if (!email) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user == null) {
      return null;
    }

    return user;
  }

  static async getUserById(id: number): Promise<User> {
    if (!id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user == null) {
      return null;
    }

    return user;
  }

  static async setTokenInvalid(token, decodedToken) {
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    try {
      await prisma.revokedToken.upsert({
        where: {
          token: token,
        },
        update: {},
        create: {
          token: token,
          expiresAt: date,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  static async isTokenInvalid(token) {
    if (!token) {
      return true;
    }

    const count = await prisma.revokedToken.count({
      where: {
        token: token,
      },
    });
    return count > 0;
  }
}
