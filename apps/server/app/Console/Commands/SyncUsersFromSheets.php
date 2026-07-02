<?php

namespace App\Console\Commands;

use App\Console\TransactionalCommand;
use App\Models\User;
use Google\Client;
use Google\Service\Sheets;

class SyncUsersFromSheets extends TransactionalCommand
{
    protected $signature = 'users:sync-from-sheets';
    protected $description = 'Sync user data from Google Sheets';

    public function handle(): int
    {
        $spreadsheetId = config('services.google_sheets.hoiukodud.spreadsheet_id');
        $range = config('services.google_sheets.hoiukodud.range');

        if (!$spreadsheetId || !$range) {
            $this->warn('HOIUKODUDE_SHEET_ID or HOIKUODUDE_SHEET_RANGE not set. Skipping sync.');
            return self::SUCCESS;
        }

        $rows = $this->fetchRows($spreadsheetId, $range);

        if ($rows === null) {
            $this->error('Could not fetch sheet data.');
            return self::FAILURE;
        }

        $users = [];
        foreach (array_slice($rows, 1) as $row) {
            $email = $row[9] ?? null;
            if (!$email) {
                continue;
            }

            $users[] = [
                'email'         => $email,
                'full_name'     => trim(($row[2] ?? '') . ' ' . ($row[3] ?? '')),
                'identity_code' => $row[4] ?? null,
            ];
        }

        // Upsert users based on email, updating full_name and identity_code if email already exists
        User::upsert($users, ['email'], ['full_name', 'identity_code']);

        $this->info("Synced " . count($users) . " user(s) from Google Sheets.");

        return self::SUCCESS;
    }

    private function fetchRows(string $spreadsheetId, string $range): ?array
    {
        $client = new Client();
        $client->setApplicationName('catshelp');
        $client->setAuthConfig(config('services.google_sheets.credentials_path'));
        $client->addScope(Sheets::SPREADSHEETS_READONLY);

        $sheets = new Sheets($client);
        $response = $sheets->spreadsheets_values->get($spreadsheetId, $range);

        return $response->getValues();
    }
}
