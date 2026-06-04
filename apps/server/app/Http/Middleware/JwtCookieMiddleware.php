<?php

namespace App\Http\Middleware;

use App\Models\RevokedToken;
use App\Models\User;
use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class JwtCookieMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        //TODO add token refresh logic
        //TODO get cookie name from AuthService
        $token = $request->cookie('jwt');

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $payload = AuthService::decodeToken($token);

        if (!$payload) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        if (RevokedToken::where('token', $token)->exists()) {
            return response()->json(['message' => 'Token revoked'], 401);
        }

        $user = User::find($payload->sub);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 401);
        }

        Auth::setUser($user);

        return $next($request);
    }
}