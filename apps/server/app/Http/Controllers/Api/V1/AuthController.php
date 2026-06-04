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

    public function logout(Request $request): JsonResponse
    {
        AuthService::logout($request);

        //TODO get cookie names from auth service
        return response()->json(['message' => 'Logged out'])
            ->withoutCookie('jwt')->withoutCookie('catshelp');
    }
}
