import { FileService } from '@file/file.service';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { FileModule } from '../file/file.module';
import { GoogleModule } from '../google/google.module';
import { UserModule } from '../user/user.module';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { CharacteristicsService } from './characteristics.service';
import { Animal } from './entities/animal.entity';
import { Rescue } from './entities/rescue.entity';
import { ProfileBuilder } from './profile-builder.service';
import { AnimalRepository } from './repositories/animal.repository';
import { CharacteristicRepository } from './repositories/characteristic.repository';
import { FosterHomeRepository } from './repositories/foster-home.repository';
import { RescueRepository } from './repositories/rescue.repository';
import { TreatmentRepository } from './repositories/treatment.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([FosterHome]),
        TypeOrmModule.forFeature([Rescue]),
        FileModule,
        GoogleModule,
        CommonModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AnimalController],
    providers: [
        AnimalService,
        CharacteristicsService,
        CharacteristicRepository,
        ProfileBuilder,
        GoogleSheetsService,
        FileService,
        AnimalRepository,
        UserRepository,
        FosterHomeRepository,
        RescueRepository,
        TreatmentRepository,
    ],
    exports: [
        ProfileBuilder,
        AnimalService,
        CharacteristicsService,
        CharacteristicRepository,
        FosterHomeRepository,
        RescueRepository,
        TreatmentRepository,
    ],
})
export class AnimalModule { }
