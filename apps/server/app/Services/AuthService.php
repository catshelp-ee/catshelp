<?php

namespace App\Services;

use App\Models\RevokedToken;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthService
{
    private const COOKIE_NAME = 'jwt';
    private const TTL_MINUTES = 24 * 60; // 24 hours
    private const ALGORITHM = 'HS256';

    public static function loginWithGoogle(string $credential, string $clientId): ?User
    {
        $client = new \Google\Client(['client_id' => $clientId]);
        $payload = $client->verifyIdToken($credential);

        if (!$payload) {
            return null;
        }

        $user = User::where('email', $payload['email'])->first();

        return $user;
    }

    public static function generateToken(User $user): string
    {
        return JWT::encode([
            'sub' => $user->id,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + (self::TTL_MINUTES * 60),
        ], config('app.key'), self::ALGORITHM);
    }

    public static function decodeToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key(config('app.key'), self::ALGORITHM));
        } catch (\Throwable) {
            return null;
        }
    }

    public static function attachTokenCookie(JsonResponse $response, string $token): JsonResponse
    {
        return $response->withCookie(cookie(
            name: self::COOKIE_NAME,
            value: $token,
            minutes: self::TTL_MINUTES,
            path: '/',
            secure: app()->isProduction(),
            httpOnly: true,
            sameSite: 'strict',
        ))->withCookie(cookie(
            name: 'catshelp',
            value: 'true',
            minutes: self::TTL_MINUTES,
            httpOnly: false,
        ));
    }

    public static function logout(Request $request): void
    {
        $token = $request->cookie(self::COOKIE_NAME);

        if ($token) {
            $payload = self::decodeToken($token);

            RevokedToken::create([
                'token' => $token,
                'expires_at' => $payload ? now()->createFromTimestamp($payload->exp) : now(),
            ]);
        }
    }

    public static function loginWithEmail() {
        //TODO
    }

    public static function verifyEmailToken() {
        //TODO
    }
}
