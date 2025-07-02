import { Request, Response } from 'express';
import AuthService from '@services/auth/auth-service';
import CookieService  from '@services/auth/cookie-service';
import UserService from "@services/user/user-service";
import EmailService from '@services/auth/email-service';
import { GoogleLoginRequest, EmailLoginRequest, VerifyRequest } from 'types/auth-types';
import { User } from 'generated/prisma';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export default class LoginController {
    emailService: EmailService;

    constructor(
        @inject(TYPES.AuthService) private authService: AuthService,
        @inject(TYPES.UserService) private userService: UserService,
    ){
        this.emailService = new EmailService();
    }

    async googleLogin(req: Request<{}, {}, GoogleLoginRequest>, res: Response): Promise<Response> {
        try {
            const { credential, clientId } = req.body;

            if (!credential || !clientId) {
                return res.status(400).json({ error: 'Missing credential or clientId' });
            }

            const email = await this.authService.verifyGoogleToken(credential, clientId);
            if (!email) {
                return res.status(400).json({ error: 'Invalid Google token' });
            }

            const user = await this.authenticateUser(email, res);
            if (!user) {
                return res.sendStatus(401);
            }
            
            this.userService.setUser(user);
            return res.sendStatus(200);
        } catch (error) {
            console.error('Google login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async emailLogin(req: Request<{}, {}, EmailLoginRequest>, res: Response): Promise<Response> {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.sendStatus(401);
            }

            await this.emailService.sendRequest(user.id, user.email);
            return res.sendStatus(200);
        } catch (error) {
            console.error('Email login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.cookies?.jwt;

            if (!token) {
                return res.sendStatus(200);
            }

            const decoded = this.authService.decodeJWT(token);
            if (decoded) {
                await UserService.setTokenInvalid(token, decoded);
            }

            CookieService.clearAuthCookies(res);
            return res.sendStatus(200);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear cookies even if token invalidation fails
            CookieService.clearAuthCookies(res);
            return res.sendStatus(200);
        }
    }

    async verify(req: Request<{}, {}, {}, VerifyRequest>, res: Response): Promise<Response> {
        try {
            const { token } = req.query;

            if (!token || typeof token !== 'string') {
                return res.sendStatus(401);
            }

            const decodedToken = this.authService.verifyJWT(token);
            if (!decodedToken) {
                return res.sendStatus(401);
            }

            if (await UserService.isTokenInvalid(token)) {
                return res.sendStatus(401);
            }

            // Invalidate the old token
            await UserService.setTokenInvalid(token, decodedToken);

            // Generate new token
            const newToken = this.authService.generateJWT(decodedToken.id);
            CookieService.setAuthCookies(res, newToken);

            return res.redirect("/dashboard");
        } catch (error) {
            console.error('Token verification error:', error);
            return res.sendStatus(401);
        }
    }

    private async authenticateUser(email: string, res: Response): Promise<User | null> {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const token = this.authService.generateJWT(user.id.toString());
        CookieService.setAuthCookies(res, token);

        return user;
    }
}