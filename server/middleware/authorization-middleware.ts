import UserService from "@services/user/user-service";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import TYPES from "types/inversify-types";

@injectable()
export default class AuthorizationMiddleware {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ){
    this.authenticate = this.authenticate.bind(this);
  }

  async canViewPage(token) {
    const user = await this.userService.getUser(token.id);
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

    const token = jwt.sign(decodedToken, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_LENGTH,
    });

    const cookieLength = 24 * 60 * 60 * 1000;

    res.cookie("catshelp", 'true', {
      maxAge: cookieLength,
      httpOnly: false,
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.VITE_ENVIRONMENT !== 'TEST',
      sameSite: "Strict",
      maxAge: cookieLength,
    });
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
      decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    } catch (e) {
      res.cookie("jwt", "");
      res.cookie("catshelp", "");
      console.error(e);
      return res.sendStatus(401);
    }

    if (!decodedToken || await UserService.isTokenInvalid(req.cookies.jwt)) {
      res.cookie("jwt", "");
      res.cookie("catshelp", "");
      return res.sendStatus(401);
    }

    if (!await this.canViewPage(decodedToken)) {
      return res.sendStatus(401);
    }


    if (this.tokenNeedsRefresh(decodedToken)) {
      this.refreshToken(decodedToken, res);
    }

    next();
  }
}
