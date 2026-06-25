<?php

namespace App\Console\Commands;

use App\Console\TransactionalCommand;
use App\Models\Animal;
use App\Models\AnimalCharacteristic;
use App\Models\AnimalRescue;
use App\Models\FosterHome;
use App\Models\Treatment;
use App\Models\User;
use Carbon\Carbon;
use Google\Client;
use Google\Service\Sheets;
use Illuminate\Support\Facades\Storage;

class SyncAnimalsFromSheets extends TransactionalCommand
{
    protected $signature = 'animals:sync-from-sheets';
    protected $description = 'Sync animal data from Google Sheets';

    private const PREVIOUS_DATA_FILE = 'sheets/previous_animals_data.json';

    private const TREATMENT_COLUMNS = [
        'COMPLEX_VACCINE'      => 'KOMPLEKSVAKTSIIN_(nt_Feligen_CRP,_Versifel_CVR,_Nobivac_Tricat_Trio)',
        'RABIES_VACCINE'       => 'MARUTAUDI_VAKTSIIN_(nt_Feligen_R,_Biocan_R,_Versiguard,_Rabisin_Multi,_Rabisin_R,_Rabigen_Mono,_Purevax_RCP)',
        'DEWORMING_MEDICATION' => 'USSIROHU/_TURJATILGA_KP',
    ];

    private const CHARACTERISTIC_COLUMNS = [
        'coatColour'       => 'KASSI_VÄRV',
        'coatLength'       => 'KASSI_KARVA_PIKKUS',
        'gender'           => 'SUGU',
        'spayedOrNeutered' => 'LÕIGATUD',
    ];

    public function handle(): int
    {
        $spreadsheetId = config('services.google_sheets.cats.spreadsheet_id');
        $range         = config('services.google_sheets.cats.range');

        if (!$spreadsheetId || !$range) {
            $this->warn('CATS_SHEET_ID or CATS_SHEET_RANGE not set. Skipping sync.');
            return self::SUCCESS;
        }

        $rawRows = $this->fetchRows($spreadsheetId, $range);

        if ($rawRows === null) {
            $this->error('Could not fetch sheet data.');
            return self::FAILURE;
        }

        $current  = $this->formatRows($rawRows);
        $previous = $this->loadPreviousData();

        [$toUpdate, $toDelete] = $this->diff($current, $previous);

        foreach ($toUpdate as $row) {
            $this->syncRow($row);
        }

        foreach ($toDelete as $rankNr) {
            $this->deleteByRankNr($rankNr);
        }

        $this->savePreviousData($current);
        $this->info('Synced: ' . count($toUpdate) . ' updated, ' . count($toDelete) . ' deleted.');

        return self::SUCCESS;
    }

    // --- Sheet fetching & formatting ---

    private function fetchRows(string $spreadsheetId, string $range): ?array
    {
        $client = new Client();
        $client->setApplicationName('catshelp');
        $client->setAuthConfig(config('services.google_sheets.credentials_path'));
        $client->addScope(Sheets::SPREADSHEETS_READONLY);

        $sheets   = new Sheets($client);
        $response = $sheets->spreadsheets_values->get($spreadsheetId, $range);

        return $response->getValues();
    }

    private function formatRows(array $rawRows): array
    {
        if (count($rawRows) < 2) {
            return [];
        }

        $headers = $this->normalizeHeaders($rawRows[0]);
        $result  = [];

        foreach (array_slice($rawRows, 1) as $rawRow) {
            $row = [];
            foreach ($headers as $i => $header) {
                $row[$header] = $rawRow[$i] ?? '';
            }
            $row['_hash'] = hash('sha256', json_encode($row));
            $result[]     = $row;
        }

        return $result;
    }

    private function normalizeHeaders(array $headerRow): array
    {
        return array_map(function (string $header) {
            if (str_contains($header, 'PÄÄSTETUD JÄRJEKORRA NR')) {
                return 'jarjekorraNr';
            }
            return str_replace(' ', '_', $header);
        }, $headerRow);
    }

    // --- Change detection ---

    private function loadPreviousData(): array
    {
        if (!Storage::exists(self::PREVIOUS_DATA_FILE)) {
            return [];
        }
        return json_decode(Storage::get(self::PREVIOUS_DATA_FILE), true) ?? [];
    }

    private function savePreviousData(array $data): void
    {
        Storage::put(self::PREVIOUS_DATA_FILE, json_encode($data));
    }

    private function diff(array $current, array $previous): array
    {
        $previousHashes = array_column($previous, '_hash', 'jarjekorraNr');
        $currentRankNrs = array_column($current, 'jarjekorraNr');

        $toUpdate = array_values(array_filter($current, function (array $row) use ($previousHashes) {
            $rankNr = $row['jarjekorraNr'] ?? '';
            return $rankNr && ($previousHashes[$rankNr] ?? null) !== $row['_hash'];
        }));

        $toDelete = array_diff(array_keys($previousHashes), $currentRankNrs);

        return [$toUpdate, array_values($toDelete)];
    }

    // --- DB sync ---

    private function syncRow(array $row): void
    {
        $rankNr = $row['jarjekorraNr'] ?? '';
        if (!$rankNr) {
            return;
        }

        $rescue = AnimalRescue::firstOrNew(['rank_nr' => $rankNr]);
        $animal = ($rescue->exists ? $rescue->animal : null) ?? new Animal();

        $animal->fill([
            'name'                    => $row['KASSI_NIMI'] ?? null,
            'birthday'                => $this->parseDate($row['SÜNNIAEG'] ?? null),
            'chip_number'             => ($row['KIIP'] ?? '') ?: null,
            'chip_registered_with_us' => ($row['KIIP_LLR-is_MTÜ_nimel-_täidab_registreerija'] ?? '') === 'Jah',
        ])->save();

        $rescue->fill([
            'animal_id'   => $animal->id,
            'address'     => $row['LEIDMISKOHT'] ?? null,
            'rescue_date' => $this->parseDate($row['PÄÄSTMISKP/_SÜNNIKP'] ?? null),
        ])->save();

        $fosterHomeName = $row['_HOIUKODU/_KLIINIKU_NIMI'] ?? '';
        if ($fosterHomeName) {
            $user       = User::firstOrCreate(['full_name' => $fosterHomeName]);
            $fosterHome = FosterHome::firstOrCreate(['user_id' => $user->id]);
            $animal->fosterHomes()->syncWithoutDetaching([$fosterHome->id]);
        }

        foreach (self::CHARACTERISTIC_COLUMNS as $type => $column) {
            $value = $row[$column] ?? '';
            if ($value) {
                AnimalCharacteristic::updateOrCreate(
                    ['animal_id' => $animal->id, 'type' => $type],
                    ['value' => $value]
                );
            } else {
                AnimalCharacteristic::where(['animal_id' => $animal->id, 'type' => $type])->delete();
            }
        }

        foreach (self::TREATMENT_COLUMNS as $treatmentName => $column) {
            $dateStr   = $row[$column] ?? '';
            $visitDate = $dateStr ? $this->parseDate($dateStr) : now()->subYear();
            //Sometimes $dateStr is an invalid string
            $visitDate = $visitDate ?? now()->subYear();

            Treatment::updateOrCreate(
                ['animal_id' => $animal->id, 'treatment_name' => $treatmentName],
                [
                    'visit_date'      => $visitDate,
                    'next_visit_date' => $visitDate->copy()->addYear(),
                    'active'          => true,
                ]
            );
        }
    }

    private function deleteByRankNr(string $rankNr): void
    {
        $rescue = AnimalRescue::where('rank_nr', $rankNr)->first();
        if (!$rescue) {
            return;
        }

        $animal = $rescue->animal;
        if ($animal) {
            AnimalCharacteristic::where('animal_id', $animal->id)->delete();
            Treatment::where('animal_id', $animal->id)->delete();
            $animal->fosterHomes()->detach();
            $animal->delete();
        }

        $rescue->delete();
    }

    private function parseDate(?string $date): ?Carbon
    {
        if (!$date) {
            return null;
        }
        try {
            return Carbon::createFromFormat('d.m.Y', $date);
        } catch (\Exception) {
            return null;
        }
    }
}
