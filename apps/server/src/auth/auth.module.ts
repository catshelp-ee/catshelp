import { AnimalModule } from '@animal/animal.module';
import { AnimalService } from '@animal/animal.service';
import { Animal } from '@animal/entities/animal.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { GoogleModule } from '@google/google.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/user.repository';
import { UserService } from '@user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { EmailService } from './email.service';
import { RevokedToken } from './revoked-token.entity';
import { RevokedTokenRepository } from './revoked-token.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([RevokedToken]),
        forwardRef(() => AnimalModule),
        GoogleModule,
        UserModule,
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AnimalService,
        AuthService,
        CookieService,
        EmailService,
        UserService,
        UserRepository,
        AnimalRepository,
        RevokedTokenRepository
    ],
    exports: [
        AuthService,
        CookieService,
        EmailService,
        RevokedTokenRepository,
    ],
})
export class AuthModule { }
