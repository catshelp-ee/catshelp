import AuthService from '@services/auth/auth-service';
import CookieService from '@services/auth/cookie-service';
import UserService from '@services/user/user-service';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class AuthorizationMiddleware {
  constructor(
    @inject(TYPES.UserService)
    private userService: UserService,
    @inject(TYPES.AuthService)
    private authService: AuthService
  ) {
    this.authenticate = this.authenticate.bind(this);
  }

  async canViewPage(token) {
    const user = await this.userService.getUser(Number(token.id));
    if (!user) {
      return false;
    }
    return true;
  }

  refreshToken(decodedToken, res) {
    delete decodedToken.iat;
    delete decodedToken.exp;
    delete decodedToken.nbf;
    delete decodedToken.jti;

    const newToken = this.authService.generateJWT(decodedToken.id);

    CookieService.setAuthCookies(res, newToken);
  }

  tokenNeedsRefresh(decodedToken) {
    const tokenExpTime = new Date(decodedToken.exp * 1000);
    const difInMilliseconds = new Date().getTime() - tokenExpTime.getTime();
    const refreshTime = 120000; //2 min
    return difInMilliseconds < refreshTime;
  }

  async authenticate(req, res, next) {
    let decodedToken;
    try {
      decodedToken = this.authService.decodeJWT(req.cookies.jwt);
    } catch (e) {
      res.cookie('jwt', '');
      res.cookie('catshelp', '');
      console.error(e);
      return res.sendStatus(401);
    }

    if (!decodedToken || (await UserService.isTokenInvalid(req.cookies.jwt))) {
      res.cookie('jwt', '');
      res.cookie('catshelp', '');
      return res.sendStatus(401);
    }

    if (!(await this.canViewPage(decodedToken))) {
      return res.sendStatus(401);
    }

    if (this.tokenNeedsRefresh(decodedToken)) {
      this.refreshToken(decodedToken, res);
    }

    next();
  }
}
