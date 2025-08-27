// Now the refactored LoginController
// controllers/auth/login-controller.ts
import AuthService from '@services/auth/auth-service';
import CookieService from '@services/auth/cookie-service';
import EmailService from '@services/auth/email-service';
import UserService from '@services/user/user-service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  EmailLoginRequest,
  GoogleLoginRequest,
  VerifyRequest,
} from 'types/auth-types';
import TYPES from 'types/inversify-types';

@injectable()
export default class LoginController {
  private emailService: EmailService;

  constructor(
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.UserService)
    private userService: UserService
  ) {
    this.emailService = new EmailService();
  }

  public async googleLogin(req: Request<object, object, GoogleLoginRequest>, res: Response): Promise<Response> {

    const { credential, clientId } = req.body;

    if (!credential || !clientId) {
      return res
        .status(400)
        .json({ error: 'Missing credential or clientId' });
    }

    const email = await this.authService.verifyGoogleToken(
      credential,
      clientId
    );

    if (!email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const user = await this.authService.authenticateUser(email, res);
    if (!user) {
      return res.sendStatus(401);
    }

    return res.sendStatus(200);
  }

  async emailLogin(req: Request<object, object, EmailLoginRequest>, res: Response): Promise<Response> {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return res.sendStatus(401);
    }

    await this.emailService.sendRequest(user.id, user.email);
    return res.sendStatus(200);
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.cookies?.jwt;

      if (!token) {
        return res.sendStatus(200);
      }

      await this.authService.invalidateToken(token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      CookieService.clearAuthCookies(res);
      return res.sendStatus(200);
    }
  }

  public async verify(req: Request<object, object, object, VerifyRequest>, res: Response): Promise<Response> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.sendStatus(401);
      }

      const isValid = await this.authService.verifyAndRefreshToken(token, res);
      if (!isValid) {
        return res.sendStatus(401);
      }

      res.redirect('/dashboard');
      return res;
    } catch (error) {
      console.error('Token verification error:', error);
      return res.sendStatus(401);
    }
  }
}
