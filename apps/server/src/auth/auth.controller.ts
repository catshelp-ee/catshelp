import type {
    EmailLoginRequest,
    GoogleLoginRequest,
    VerifyRequest,
} from '@catshelp/types';
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import type { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { EmailService } from './email.service';


@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
    ) { }

    @Post('login-google')
    async googleLogin(
        @Body() body: GoogleLoginRequest,
        @Res() res: Response,
    ): Promise<void> {
        const { credential, clientId } = body;

        if (!credential || !clientId) {
            throw new HttpException(
                { error: 'Missing credential or clientId' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const email = await this.authService.verifyGoogleToken(credential, clientId);
        if (!email) {
            throw new HttpException({ error: 'Invalid Google token' }, HttpStatus.BAD_REQUEST);
        }

        const user = await this.authService.authenticateUser(email, res);
        if (!user) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        res.json({ id: user.id });
    }

    @Post('login-email')
    async emailLogin(
        @Body() body: EmailLoginRequest,
        @Res() res: Response,
    ): Promise<void> {
        const { email } = body;

        if (!email) {
            throw new HttpException({ error: 'Email is required' }, HttpStatus.BAD_REQUEST);
        }

        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        await this.emailService.sendRequest(user.id, user.email);
        res.sendStatus(HttpStatus.OK);
    }

    @Post('logout')
    async logout(@Res() res: Response): Promise<void> {
        try {
            const token = res.req.cookies?.jwt;

            if (token) {
                await this.authService.invalidateToken(token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            CookieService.clearAuthCookies(res);
            res.sendStatus(HttpStatus.OK);
        }
    }

    @Get('verify')
    async verify(@Query() query: VerifyRequest, @Res() res: Response): Promise<void> {
        const { token } = query;

        if (!token || typeof token !== 'string') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const isValid = await this.authService.verifyAndRefreshToken(token, res);
        if (!isValid) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        res.redirect('/users');
    }
}
