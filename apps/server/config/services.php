<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URI'),
    ],

    'google_sheets' => [
        'credentials_path' => env('GOOGLE_SHEETS_CREDENTIALS_PATH'),
        'hoiukodud' => [
            'spreadsheet_id' => env('HOIUKODUDE_SHEET_ID'),
            'range'          => env('HOIKUODUDE_SHEET_RANGE'),
        ],
        'cats' => [
            'spreadsheet_id' => env('CATS_SHEET_ID'),
            'range'          => env('CATS_SHEET_RANGE'),
        ],
    ],
];
