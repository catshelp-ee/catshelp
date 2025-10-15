import { AuthService } from '@auth/auth.service';
import { CookieService } from '@auth/cookie.service';
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@user/user.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) { }

  private refreshToken(decodedToken, res: any) {
    delete decodedToken.iat;
    delete decodedToken.exp;
    delete decodedToken.nbf;
    delete decodedToken.jti;

    const newToken = this.authService.generateJWT(decodedToken.id);
    CookieService.setAuthCookies(res, newToken);
  }

  private tokenNeedsRefresh(decodedToken): boolean {
    const tokenExpTime = new Date(decodedToken.exp * 1000);
    const difInMilliseconds = new Date().getTime() - tokenExpTime.getTime();
    const refreshTime = 120000; // 2 minutes
    return difInMilliseconds < refreshTime;
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
      decodedToken = this.authService.decodeJWT(jwt);
    } catch (e) {
      response.cookie('jwt', '');
      response.cookie('catshelp', '');
      throw new UnauthorizedException();
    }

    const tokenInvalid = await this.userService.isTokenInvalid(jwt);
    if (!decodedToken || tokenInvalid) {
      response.cookie('jwt', '');
      response.cookie('catshelp', '');
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(decodedToken.id);
    if (!user) throw new UnauthorizedException();

    request.user = user;

    if (this.tokenNeedsRefresh(decodedToken)) {
      this.refreshToken(decodedToken, response);
    }

    return true;
  }
}
