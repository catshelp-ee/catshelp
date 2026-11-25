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
        Schedule::command('command:tokens:prune-revoked')->daily();
        Schedule::command('command:animals:sync-from-sheets')->everyTenMinutes();
        Schedule::command('command:todos:create-from-treatments')->daily();
    }
}
