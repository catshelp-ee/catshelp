import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { injectable } from 'inversify';

@injectable()
export default class GoogleAuthService {
  private client: OAuth2Client;

  constructor(client: OAuth2Client) {
    this.client = client;
  }

  static async create() {
    const isProd = process.env.VITE_ENVIRONMENT === 'PROD';

    const keyFilePath = isProd
      ? process.env.GOOGLE_CREDENTIALS_PATH
      : 'credentials.json';

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    const client = (await auth.getClient()) as OAuth2Client;

    return new GoogleAuthService(client);
  }

  getAuth() {
    return this.client;
  }
}
