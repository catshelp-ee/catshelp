import { FileService } from '@file/file.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { FileModule } from '../file/file.module';
import { GoogleModule } from '../google/google.module';
import { UserModule } from '../user/user.module';
import { AnimalController } from './animal.controller';
import { AddRescueController } from './add-rescue.controller';
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
import { Characteristic } from './entities/characteristic.entity';
import { AnimalToFosterHomeRepository } from './repositories/animal-to-fosterhome.repository';
import { AnimalToFosterHome } from './entities/animalToFosterhome.entity';
import { FileRepository } from '../file/file.repository';


@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([FosterHome]),
        TypeOrmModule.forFeature([Rescue]),
        TypeOrmModule.forFeature([Characteristic]),
        TypeOrmModule.forFeature([AnimalToFosterHome]),
        FileModule,
        GoogleModule,
        UserModule,
        AuthModule,
    ],
    controllers: [
        AnimalController,
        AddRescueController
    ],
    providers: [
        AnimalService,
        CharacteristicsService,
        CharacteristicRepository,
        ProfileBuilder,
        FileService,
        AnimalRepository,
        UserRepository,
        FosterHomeRepository,
        RescueRepository,
        TreatmentRepository,
        RevokedTokenRepository,
        AnimalToFosterHomeRepository,
        FileRepository,
    ],
    exports: [
        ProfileBuilder,
        AnimalService,
        CharacteristicsService,
        CharacteristicRepository,
        FosterHomeRepository,
        RescueRepository,
        TreatmentRepository,
        AnimalToFosterHomeRepository,
        FileRepository,
    ],
})
export class AnimalModule { }
