import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AuthorizationGuard } from './middleware/authorization.guard';


@Module({
    imports: [
        AuthModule,
        UserModule,
    ],
    controllers: [
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthorizationGuard,
        }
    ],
    exports: [],
})
export class CommonModule { }
