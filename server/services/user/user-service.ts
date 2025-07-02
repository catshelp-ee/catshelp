import { prisma } from "../../prisma";
import { inject, injectable } from "inversify";
import { User } from "generated/prisma";
import TYPES from "types/inversify-types";
import NodeCacheService from "@services/cache/cache-service";

@injectable()
export default class UserService{
  constructor(
    @inject(TYPES.NodeCacheService) private nodeCacheService: NodeCacheService
  ){}

  getUser(userID: number | string){
    try{
      return this.nodeCacheService.get<User>(`user:${userID}`);
    } catch {
      throw new Error("Error fetching user from cache");
    }
  }

  setUser(user: User){
    try{
      this.nodeCacheService.set(`user:${user.id}`, user);
    } catch {
      throw new Error("Error caching user")
    }
  }

  static async getUserByEmail(email) {
    if (!email) {
      return null;
    }
    
    const user = await prisma.user.findFirst({
      where: {email: email},
    });

    if (user == null) {
      return null;
    }

    return user;
  }

  static async setTokenInvalid(token, decodedToken) {
    if (!token) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    const existing = await prisma.revokedToken.findFirst({
      where: {
        token: token,
        expiresAt: date,
      },
    });

    const result = existing ?? await prisma.revokedToken.create({
      data: {
        token: token,
        expiresAt: date,
      },
    });

  }

  static async isTokenInvalid(token) {
    if (!token) {
      return true;
    }

    const [items, count] = await prisma.$transaction([
      prisma.revokedToken.findMany({
        where: {
          token: token,
        },
      }),
      prisma.revokedToken.count({
        where: {
          token: token,
        },
      }),
    ]);

    return count > 0;
  }
}
