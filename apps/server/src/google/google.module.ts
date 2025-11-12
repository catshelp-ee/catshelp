import { Animal } from '@animal/entities/animal.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { GoogleAuthService } from './google-auth.service';
import { GoogleDriveService } from './google-drive.service';
import { GoogleSheetsService } from './google-sheets.service';

@Module({
    imports: [TypeOrmModule.forFeature([Animal])],
    controllers: [],
    providers: [
        {
            provide: 'OAUTH2_CLIENT',
            useFactory: async () => {
                const isProd = process.env.NODE_ENV === 'production';
                const keyFilePath = isProd
                    ? process.env.PROD_CREDENTIALS_PATH
                    : 'credentials.json';
                const auth = new google.auth.GoogleAuth({
                    keyFile: keyFilePath,
                    scopes: [
                        'https://www.googleapis.com/auth/drive',
                        'https://www.googleapis.com/auth/drive.file',
                    ],
                });
                const client = (await auth.getClient()) as OAuth2Client;
                return client;
            },
        },
        {
            provide: GoogleAuthService,
            useFactory: (client: OAuth2Client) => {
                return new GoogleAuthService(client);
            },
            inject: ['OAUTH2_CLIENT'],
        },
        {
            provide: GoogleDriveService,
            useFactory: (client: OAuth2Client) => {
                return new GoogleDriveService(client);
            },
            inject: ['OAUTH2_CLIENT'],
        },
        GoogleSheetsService,
        AnimalRepository,
        OAuth2Client
    ],
    exports: [
        GoogleAuthService,
        GoogleDriveService,
        GoogleSheetsService,
        OAuth2Client,
    ],
})
export class GoogleModule { }
