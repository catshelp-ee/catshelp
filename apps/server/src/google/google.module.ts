import { Animal } from '@animal/entities/animal.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthService } from './google-auth.service';
import { GoogleDriveService } from './google-drive.service';
import { GoogleSheetsService } from './google-sheets.service';

@Module({
    imports: [TypeOrmModule.forFeature([Animal])],
    controllers: [],
    providers: [
        GoogleAuthService,
        GoogleDriveService,
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
