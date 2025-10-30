import { CookieService } from '@auth/cookie.service';
import { RevokedTokenRepository } from '@auth/revoked-token.repository';
import { JWTPayload } from '@catshelp/types/src';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@server/src/user/entities/user.entity';
import { UserRepository } from '@server/src/user/user.repository';
import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';


@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly revokedTokenRepository: RevokedTokenRepository,
  ) {
  }

  private async getUser(userId: number | string): Promise<User | null> {
    userId = Number(userId);

    // Try cache first
    const cached = await this.cacheManager.get<User>(`users:${userId}`);
    if (cached) {
      return cached;
    }

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      return null;
    }

    await this.cacheManager.set(`users:${userId}`, user);

    return user;
  }

  private generateJWT(userId: string | number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_LENGTH,
    } as SignOptions);
  }

  private refreshToken(decodedToken, res: any) {
    delete decodedToken.iat;
    delete decodedToken.exp;
    delete decodedToken.nbf;
    delete decodedToken.jti;

    const newToken = this.generateJWT(decodedToken.id);
    CookieService.setAuthCookies(res, newToken);
  }

  private tokenNeedsRefresh(decodedToken): boolean {
    const tokenExpTime = new Date(decodedToken.exp * 1000);
    const difInMilliseconds = new Date().getTime() - tokenExpTime.getTime();
    const refreshTime = 120000; // 2 minutes
    return difInMilliseconds < refreshTime;
  }


  public decodeJWT(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public or not
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const jwt = request.cookies?.jwt;

    if (!jwt) throw new UnauthorizedException();

    let decodedToken;
    try {
      decodedToken = this.decodeJWT(jwt);
    } catch (e) {
      response.cookie('jwt', '');
      response.cookie('catshelp', '');
      throw new UnauthorizedException();
    }

    let tokenInvalid: boolean;

    if (!jwt) {
      tokenInvalid = true;
    }
    else {
      const count = await this.revokedTokenRepository.count({
        where: { token: jwt }
      });
      tokenInvalid = count > 0;
    }

    if (!decodedToken || tokenInvalid) {
      response.cookie('jwt', '');
      response.cookie('catshelp', '');
      throw new UnauthorizedException();
    }

    const user = await this.getUser(decodedToken.id);
    if (!user) throw new UnauthorizedException();

    request.user = user;

    if (this.tokenNeedsRefresh(decodedToken)) {
      this.refreshToken(decodedToken, response);
    }

    return true;
  }
}
