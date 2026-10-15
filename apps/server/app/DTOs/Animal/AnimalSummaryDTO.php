<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalSummaryDTO
{
    public function __construct(
        public int $id,
        public ?string $name,
        public ?string $profilePicture,
        public ?string $status,
        public ?string $rescueNumber,
        public ?string $birthDate,
        public ?string $fosterHome,
        public ?string $location,
        public ?string $gender,
        public ?bool $sterilised,
        public ?bool $medicalOngoing,
        public ?int $overdueCount,
        public ?int $dueSoonCount,
        public ?string $complexVaccineDate,
        public ?bool $published,
    ) {}

    public static function fromModel(Animal $animal): self
    {
        $profileFile = $animal->files->firstWhere('type', 'profile');
        $imageData = $profileFile ? "/api/animals/{$animal->id}/profile-image" : '';

        $fosterHome = $animal->fosterHomes->first();

        return new self(
            id: $animal->id,
            name: $animal->name,
            profilePicture: $imageData,
            status: $animal->status,
            rescueNumber: $animal->rescues->first()?->rank_nr,
            birthDate: $animal->birthday?->format('Y-m-d'),
            fosterHome: $fosterHome?->user?->full_name,
            location: $fosterHome?->location,
            gender: self::formatGender($animal->characteristics->firstWhere('type', 'gender')?->value),
            sterilised: strtoupper($animal->characteristics->firstWhere('type', 'spayedOrNeutered')?->value ?? '') === 'JAH',
            medicalOngoing: false,
            overdueCount: $animal->todos()->where('due_date', '<', now())->count(),
            dueSoonCount: $animal->todos()->whereBetween('due_date', [now(), now()->addDays(7)])->count(),
            complexVaccineDate: $animal->treatments->firstWhere('treatment_name', 'COMPLEX_VACCINE')?->next_visit_date?->format('Y-m-d'),
            published: false
        );
    }

    public static function formatGender(?string $gender): string
    {
        return match (strtoupper($gender ?? '')) {
            'ISANE' => 'Male',
            'EMANE' => 'Female',
            default => 'Unknown',
        };
    }

}
