import { RevokedToken } from '@auth/revoked-token.entity';
import { CacheModule } from '@nestjs/cache-manager';
import {forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import {UsersController} from "@user/users.controller";
import {AnimalModule} from "@animal/animal.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RevokedToken]),
        CacheModule.register({
            ttl: 5, // seconds (optional)
            max: 100, // max items in cache (optional)
        }),
        forwardRef(() => AnimalModule),
    ],
    controllers: [
        UserController,
        UsersController
    ],
    providers: [
        UserService,
        UserRepository,
        CacheModule,
        RevokedTokenRepository,
        UserRepository,
        AuthService,
    ],
    exports: [
        UserService,
        UserRepository,
        CacheModule,
    ],
})
export class UserModule { }
