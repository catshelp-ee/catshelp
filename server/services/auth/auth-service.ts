import UserService from '@services/user/user-service';
import { OAuth2Client } from 'google-auth-library';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload, User } from 'types/auth-types';
import TYPES from 'types/inversify-types';
import CookieService from './cookie-service';

@injectable()
export default class AuthService {
  private readonly client: OAuth2Client;
  private readonly jwtSecret: string;
  private readonly tokenLength: string;
  private readonly cookieLength = 24 * 60 * 60 * 1000;

  constructor(
    @inject(TYPES.UserService)
    private userService: UserService,
  ) {
    this.client = new OAuth2Client();
    this.jwtSecret = process.env.JWT_SECRET!;
    this.tokenLength = process.env.TOKEN_LENGTH!;

    if (!this.jwtSecret || !this.tokenLength) {
      throw new Error(
        'Missing required environment variables: JWT_SECRET or TOKEN_LENGTH'
      );
    }
  }

  public async authenticateUser(email: string, res: Response): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const token = this.generateJWT(user.id);
    CookieService.setAuthCookies(res, token);
    return user;
  }

  public async invalidateToken(token: string): Promise<void> {
    const decoded = this.decodeJWT(token);
    if (decoded) {
      await this.userService.setTokenInvalid(token, decoded);
    }
  }

  public async verifyAndRefreshToken(token: string, res: Response): Promise<boolean> {
    const decodedToken = this.verifyJWT(token);
    if (!decodedToken) {
      return false;
    }

    if (await this.userService.isTokenInvalid(token)) {
      return false;
    }

    // Invalidate old token and create new one
    await this.userService.setTokenInvalid(token, decodedToken);
    const newToken = this.generateJWT(decodedToken.id);
    CookieService.setAuthCookies(res, newToken);

    return true;
  }

  public async verifyGoogleToken(credential: string, clientId: string): Promise<string | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      return payload?.email || null;
    } catch (error) {
      console.error('Google token verification failed:', error);
      return null;
    }
  }

  public generateJWT(userId: string | number): string {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: this.tokenLength,
    });
  }

  private verifyJWT(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  public decodeJWT(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }
}
