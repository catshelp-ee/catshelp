<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class DatabaseTransactionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        DB::beginTransaction();

        try {
            $response = $next($request);

            if ($response->getStatusCode() >= 400) {
                DB::rollBack();
            } else {
                DB::commit();
            }

            return $response;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}