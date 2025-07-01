import { Response } from 'express';
import { injectable } from 'inversify';

const COOKIE_SETTINGS = {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    NAMES: {
        AUTH: 'catshelp',
        JWT: 'jwt'
    }
};

export default class CookieService {
    static setAuthCookies(res: Response, token: string): void {
        const isProduction = process.env.VITE_ENVIRONMENT !== 'TEST';
        
        res.cookie(COOKIE_SETTINGS.NAMES.AUTH, 'true', {
            maxAge: COOKIE_SETTINGS.MAX_AGE,
            httpOnly: false,
        });
        
        res.cookie(COOKIE_SETTINGS.NAMES.JWT, token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict",
            maxAge: COOKIE_SETTINGS.MAX_AGE,
        });
    }

    static clearAuthCookies(res: Response): void {
        res.clearCookie(COOKIE_SETTINGS.NAMES.JWT);
        res.clearCookie(COOKIE_SETTINGS.NAMES.AUTH);
    }
}