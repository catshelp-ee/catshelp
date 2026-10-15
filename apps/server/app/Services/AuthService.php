<?php

namespace App\Services;

use App\Models\EmailToken;
use App\Models\RevokedToken;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthService
{
    public const JWT_COOKIE_NAME = 'jwt';
    public const CATSHELP_COOKIE_NAME = 'catshelp';
    private const TTL_MINUTES = 24 * 60; // 24 hours
    private const EMAIL_TOKEN_TTL_MINUTES = 15;
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

    public static function attachTokenCookie(JsonResponse|RedirectResponse $response, string $token): JsonResponse|RedirectResponse
    {
        return $response->withCookie(cookie(
            name: self::JWT_COOKIE_NAME,
            value: $token,
            minutes: self::TTL_MINUTES,
            path: '/',
            secure: app()->isProduction(),
            httpOnly: true,
            sameSite: 'strict',
        ))->withCookie(cookie(
            name: self::CATSHELP_COOKIE_NAME,
            value: 'true',
            minutes: self::TTL_MINUTES,
            httpOnly: false,
        ));
    }

    public static function logout(Request $request): void
    {
        $token = $request->cookie(self::JWT_COOKIE_NAME);

        if ($token) {
            $payload = self::decodeToken($token);

            RevokedToken::create([
                'token' => $token,
                'expires_at' => $payload ? now()->createFromTimestamp($payload->exp) : now(),
            ]);
        }
    }

    public static function loginWithEmail(string $email): void
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            throw new \Exception('Invalid email');
        }

        $token = Str::random(64);

        EmailToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addMinutes(self::EMAIL_TOKEN_TTL_MINUTES),
        ]);

        EmailService::sendMagicLink($user, $token);
    }

    public static function verifyEmailToken(string $token): ?User
    {
        $emailToken = EmailToken::where('token', $token)->first();

        if (!$emailToken || $emailToken->expires_at->isPast()) {
            return null;
        }

        $user = $emailToken->user;
        $emailToken->delete();

        return $user;
    }
}
