import { AnimalService } from '@animal/animal.service';
import { ProfileBuilder } from '@animal/profile-builder.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from '../animal/animal.module';
import { Animal } from '../animal/entities/animal.entity';
import { AnimalRepository } from '../animal/repositories/animal.repository';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { FileModule } from '../file/file.module';
import { GoogleModule } from '../google/google.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { ProfileController } from './profile.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        TypeOrmModule.forFeature([User]),
        AnimalModule,
        GoogleModule,
        FileModule,
        CommonModule,
        UserModule,
        AuthModule,
    ],
    controllers: [ProfileController],
    providers: [
        AnimalService,
        ProfileBuilder,
        AnimalRepository,
        UserRepository,
    ],
    exports: [],
})
export class ProfileModule { }
