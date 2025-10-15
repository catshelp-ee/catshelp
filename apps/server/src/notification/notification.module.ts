import { EmailService } from '@auth/email.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';
import { Animal } from '../animal/entities/animal.entity';
import { Treatment } from '../animal/entities/treatment.entity';
import { AnimalRepository } from '../animal/repositories/animal.repository';
import { TreatmentRepository } from '../animal/repositories/treatment.repository';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { GoogleModule } from '../google/google.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Treatment]),
        TypeOrmModule.forFeature([Animal]),
        AnimalModule,
        GoogleModule,
        CommonModule,
        UserModule,
        AuthModule,
    ],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        EmailService,
        TreatmentRepository,
        AnimalService,
        AnimalRepository,
    ],
    exports: [NotificationService],
})
export class NotificationModule { }
