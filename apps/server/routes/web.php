<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return file_get_contents(public_path('client/index.html'));
})->where('any', '^(?!api).*');

