import { Animal } from '@animal/entities/animal.entity';
import { Characteristic } from '@animal/entities/characteristic.entity';
import { Rescue } from '@animal/entities/rescue.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { FosterHomeRepository } from '@animal/repositories/foster-home.repository';
import { RescueRepository } from '@animal/repositories/rescue.repository';
import { EmailService } from '@auth/email.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '@notification/notification.service';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { AnimalModule } from '../animal/animal.module';
import { AnimalToFosterHome } from '../animal/entities/animalToFosterhome.entity';
import { Treatment } from '../animal/entities/treatment.entity';
import { AnimalToFosterHomeRepository } from '../animal/repositories/animal-to-fosterhome.repository';
import { CharacteristicRepository } from '../animal/repositories/characteristic.repository';
import { TreatmentRepository } from '../animal/repositories/treatment.repository';
import { GoogleModule } from '../google/google.module';
import { CronService } from './cron.service';
import { DeleteExpiredTokensJob } from './jobs/delete-expired-tokens-job';
import { SyncSheetDataToDBJob } from './jobs/sync-sheets-to-db-job';
import { SyncUserDataToDBJob } from './jobs/sync-users-to-db-job';
import { TodoNotificationJob } from './jobs/todo-notification-job';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        TypeOrmModule.forFeature([Rescue]),
        TypeOrmModule.forFeature([Characteristic]),
        TypeOrmModule.forFeature([FosterHome]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([AnimalToFosterHome]),
        TypeOrmModule.forFeature([Treatment]),
        AnimalModule,
        GoogleModule,
    ],
    controllers: [],
    providers: [
        SyncSheetDataToDBJob,
        SyncUserDataToDBJob,
        TodoNotificationJob,
        DeleteExpiredTokensJob,
        RescueRepository,
        TreatmentRepository,
        AnimalRepository,
        FosterHomeRepository,
        CharacteristicRepository,
        AnimalToFosterHomeRepository,
        UserRepository,
        NotificationService,
        EmailService,
        CronService
    ],
    exports: [
        SyncSheetDataToDBJob,
        SyncUserDataToDBJob
    ],
})
export class CronModule { }
