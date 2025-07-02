import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { OAuth2Client } from "google-auth-library";
import { JWTPayload } from "types/auth-types";
import { injectable } from "inversify";

@injectable()
export default class AuthService {
  private readonly client: OAuth2Client;
  private readonly jwtSecret: string;
  private readonly tokenLength: string;

  constructor(
  ) {
    this.client = new OAuth2Client();
    this.jwtSecret = process.env.JWT_SECRET!;
    this.tokenLength = process.env.TOKEN_LENGTH!;

    if (!this.jwtSecret || !this.tokenLength) {
      throw new Error(
        "Missing required environment variables: JWT_SECRET or TOKEN_LENGTH"
      );
    }
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
      console.error("Google token verification failed:", error);
      return null;
    }
  }

  generateJWT(userId: string): string {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: this.tokenLength,
    });
  }

  verifyJWT(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  }

  decodeJWT(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error("JWT decode failed:", error);
      return null;
    }
  }
}
