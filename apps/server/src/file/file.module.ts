import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { UserModule } from '../user/user.module';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { GoogleModule } from '../google/google.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        GoogleModule
    ],
    controllers: [
        FileController,
    ],
    providers: [
        FileService,
        FileRepository,
        FileRepository,
        OAuth2Client,
        RevokedTokenRepository,
    ],
    exports: [
        FileService,
        FileRepository,
    ],
})
export class FileModule { }
