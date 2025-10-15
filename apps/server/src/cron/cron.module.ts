import { Animal } from '@animal/entities/animal.entity';
import { Characteristic } from '@animal/entities/characteristic.entity';
import { Rescue } from '@animal/entities/rescue.entity';
import { AnimalRepository } from '@animal/repositories/animal.repository';
import { FosterHomeRepository } from '@animal/repositories/foster-home.repository';
import { RescueRepository } from '@animal/repositories/rescue.repository';
import { EmailService } from '@auth/email.service';
import { GoogleSheetsService } from '@google/google-sheets.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '@notification/notification.service';
import { FosterHome } from '@user/entities/foster-home.entity';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/user.repository';
import { AnimalModule } from '../animal/animal.module';
import { GoogleAuthService } from '../google/google-auth.service';
import { GoogleModule } from '../google/google.module';
import { CronController } from './cron.controller';
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
        AnimalModule,
        GoogleModule,
    ],
    controllers: [CronController],
    providers: [
        SyncSheetDataToDBJob,
        SyncUserDataToDBJob,
        TodoNotificationJob,
        DeleteExpiredTokensJob,
        GoogleSheetsService,
        GoogleAuthService,
        RescueRepository,
        AnimalRepository,
        FosterHomeRepository,
        UserRepository,
        NotificationService,
        EmailService,
    ],
    exports: [],
})
export class CronModule { }
