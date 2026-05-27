import { FileService } from '@file/file.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';

import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/file.repository';
import { GoogleModule } from '../google/google.module';
import { UserModule } from '../user/user.module';

import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { CharacteristicsService } from './characteristics.service';
import { Animal } from './entities/animal.entity';
import { AnimalToFosterHome } from './entities/animalToFosterhome.entity';
import { Characteristic } from './entities/characteristic.entity';
import { Rescue } from './entities/rescue.entity';
import { AnimalToFosterHomeRepository } from './repositories/animal-to-fosterhome.repository';
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
        TypeOrmModule.forFeature([Characteristic]),
        TypeOrmModule.forFeature([AnimalToFosterHome]),
        FileModule,
        NotificationModule,
        GoogleModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AnimalController],
    providers: [
        AnimalService,
        CharacteristicsService,
        CharacteristicRepository,
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
export class AnimalModule {}
