import { SyncUserDataToDBJob } from '@cron/jobs/sync-users-to-db-job';
import { GoogleModule } from '@google/google.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [
        GoogleModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AdminController],
    providers: [
        AdminService,
        SyncUserDataToDBJob,
        UserRepository,
        RevokedTokenRepository
    ],
    exports: [AdminService],
})
export class AdminModule { }
