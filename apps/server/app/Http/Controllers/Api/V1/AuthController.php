<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function loginGoogle(Request $request): JsonResponse
    {
        $user = AuthService::loginWithGoogle(
            $request->input('credential'),
            $request->input('clientId'),
        );

        if (!$user) {
            return response()->json(['message' => 'Invalid Google credential'], 401);
        }

        $token = AuthService::generateToken($user);

        return AuthService::attachTokenCookie(
            response()->json($user->id),
            $token,
        );
    }

    public function loginEmail()
    {
        //TODO NOT IMPLEMENTED
    }

    public function logout(Request $request): JsonResponse
    {
        AuthService::logout($request);

        return response()->json(['message' => 'Logged out'])
            ->withoutCookie(AuthService::JWT_COOKIE_NAME)->withoutCookie(AuthService::CATSHELP_COOKIE_NAME);
    }

    public function verifyCookie()
    {
        //TODO NOT IMPLEMENTED
    }
}
