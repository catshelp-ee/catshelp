<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schedule::command('tokens:prune-revoked')->daily();
        //Schedule::command('users:sync-from-sheets')->daily();
        Schedule::command('animals:sync-from-sheets')->everyTenMinutes();
    }
}
