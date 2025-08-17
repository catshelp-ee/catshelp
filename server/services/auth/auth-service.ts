import AnimalService from '@services/animal/animal-service';
import GoogleSheetsService from '@services/google/google-sheets-service';
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
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.AnimalService) private animalService: AnimalService,
    @inject(TYPES.GoogleSheetsService)
    private googleSheetsService: GoogleSheetsService
  ) {
    this.client = new OAuth2Client();
    this.jwtSecret = process.env.JWT_SECRET!;
    this.tokenLength = process.env.JWT_TOKEN_EXPIRY!;

    if (!this.jwtSecret || !this.tokenLength) {
      throw new Error(
        'Missing required environment variables: JWT_SECRET or JWT_TOKEN_EXPIRY'
      );
    }
  }

  async authenticateAndSetupUser(
    email: string,
    res: Response
  ): Promise<User | null> {
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const token = this.generateJWT(user.id);
    CookieService.setAuthCookies(res, token);

    // Setup user context
    this.userService.setUser(user);
    this.animalService.setAnimals(user);

    // Initialize Google Sheets
    const cats = await this.animalService.getAnimals(user.id);
    await this.googleSheetsService.setInitRows(user.id, cats);

    return user;
  }

  async invalidateToken(token: string): Promise<void> {
    const decoded = this.decodeJWT(token);
    if (decoded) {
      await UserService.setTokenInvalid(token, decoded);
    }
  }

  async verifyAndRefreshToken(token: string, res: Response): Promise<boolean> {
    const decodedToken = this.verifyJWT(token);
    if (!decodedToken) {
      return false;
    }

    if (await UserService.isTokenInvalid(token)) {
      return false;
    }

    // Invalidate old token and create new one
    await UserService.setTokenInvalid(token, decodedToken);
    const newToken = this.generateJWT(decodedToken.id);
    CookieService.setAuthCookies(res, newToken);

    return true;
  }

  getCookieLength() {
    return this.cookieLength;
  }

  async verifyGoogleToken(
    credential: string,
    clientId: string
  ): Promise<string | null> {
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

  generateJWT(userId: string | number): string {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: this.tokenLength,
    });
  }

  verifyJWT(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  decodeJWT(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }
}
