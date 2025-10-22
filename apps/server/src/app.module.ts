import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CronModule } from '@cron/cron.module';
import { CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AnimalModule } from './animal/animal.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileModule } from './file/file.module';
import { GoogleModule } from './google/google.module';
import { NotificationModule } from './notification/notification.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AppDataSource } from './data-source';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransactionInterceptor
        }
    ],
    imports: [
        CacheModule.register({
            ttl: 300, // default TTL in seconds
            max: 100, // max items in in-memory cache
        }),
        ConfigModule.forRoot({
            envFilePath: [join(__dirname, '/../.env')],
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...AppDataSource.options,
                autoLoadEntities: true, // optional
            }),
        }),
        AdminModule,
        AnimalModule,
        AuthModule,
        CronModule,
        DashboardModule,
        FileModule,
        GoogleModule,
        NotificationModule,
        ProfileModule,
        UserModule,
        CommonModule,
    ],
})
export class AppModule { }
