import { AnimalService } from '@animal/animal.service';
import { FileRepository } from '@file/file.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '@notification/notification.service';
import { AnimalModule } from '../animal/animal.module';
import { Animal } from '../animal/entities/animal.entity';
import { AnimalRepository } from '../animal/repositories/animal.repository';
import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { GoogleModule } from '../google/google.module';
import { UserModule } from '../user/user.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        TypeOrmModule.forFeature([Animal]),
        AnimalModule,
        GoogleModule,
        UserModule,
        AuthModule,
    ],
    controllers: [DashboardController],
    providers: [
        DashboardService,
        AnimalService,
        NotificationService,
        FileRepository,
        AnimalRepository,
        RevokedTokenRepository,
    ],
    exports: [DashboardService],
})
export class DashboardModule { }
