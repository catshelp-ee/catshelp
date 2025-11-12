import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly client: OAuth2Client) {
  }

  getAuth() {
    return this.client;
  }
}
