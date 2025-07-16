export interface GoogleLoginRequest {
    credential: string;
    clientId: string;
}

export interface EmailLoginRequest {
    email: string;
}

export interface VerifyRequest {
    token?: string;
}

export interface JWTPayload {
    id: string;
    exp?: number;
    iat?: number;
}

export interface User {
    id: number;
    email: string;
}
