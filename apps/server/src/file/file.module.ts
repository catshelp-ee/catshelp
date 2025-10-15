import { GoogleDriveService } from '@google/google-drive.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { GoogleAuthService } from '../google/google-auth.service';
import { UserModule } from '../user/user.module';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        forwardRef(() => CommonModule),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [
        FileController,
    ],
    providers: [
        FileService,
        GoogleDriveService,
        FileRepository,
        GoogleAuthService,
        FileRepository,
        OAuth2Client,
    ],
    exports: [
        FileService,
        FileRepository,
    ],
})
export class FileModule { }
