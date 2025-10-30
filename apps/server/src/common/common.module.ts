import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RevokedTokenRepository } from '../auth/revoked-token.repository';
import { UserModule } from '../user/user.module';


@Module({
    imports: [
        AuthModule,
        UserModule,
    ],
    controllers: [
    ],
    providers: [
        RevokedTokenRepository
    ],
    exports: [RevokedTokenRepository],
})
export class CommonModule {
    constructor() {
        console.log("CommonModule");
    }
}
