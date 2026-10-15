<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
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

    public function loginEmail(Request $request): JsonResponse
    {
        $email = $request->input('email');

        if (!$email) {
            return response()->json(['message' => 'Email is required'], 400);
        }

        try {
            AuthService::loginWithEmail($email);
            return response()->json(['message' => 'Email sent']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        AuthService::logout($request);

        return response()->json(['message' => 'Logged out'])
            ->withoutCookie(AuthService::JWT_COOKIE_NAME)->withoutCookie(AuthService::CATSHELP_COOKIE_NAME);
    }

    public function verifyEmailToken(Request $request): RedirectResponse
    {
        $token = $request->query('token');
        $frontendUrl = config('services.frontend_url');

        if (!$token) {
            return redirect($frontendUrl.'/login?error=missing_token');
        }

        $user = AuthService::verifyEmailToken($token);

        if (!$user) {
            return redirect($frontendUrl.'/login?error=invalid_token');
        }

        $jwt = AuthService::generateToken($user);

        return AuthService::attachTokenCookie(redirect($frontendUrl), $jwt);
    }
}
