<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalProfileMainInfoDTO
{
    public function __construct(
        public ?string $name,
        public string $rankNr,
        public ?\DateTime $birthDate,
        public ?\DateTime $rescueDate,
        public string $gender,
        public string $coatColor,
        public string $coatLength,
        public string $location,
        public string $microchip,
        public string $fosterStayDuration,
        public string $chronicConditions,
        public string $description,
        public string $rescueStory,
        public string $status,
        public bool $chipRegisteredWithUs,
        public string $specialRequirementsForNewFamily,
        public string $additionalNotes,
        public string $spayedOrNeutered,
    ) {}

    public static function fromModel(Animal $animal): self
    {
        $animalRescue = $animal->rescues()->first();

        return new self(
            name: $animal->name,
            rankNr: $animalRescue?->rank_nr ?? '',
            birthDate: $animal->birthday,
            rescueDate: $animalRescue?->rescue_date ?? null,
            gender: $animal->gender ?? '',
            coatColor: $animal->coat_color ?? '',
            coatLength: $animal->coat_length ?? '',
            location: $animalRescue?->address ?? '',
            microchip: $animal->chip_number ?? '',
            fosterStayDuration: $animal->time_in_care ?? '',
            chronicConditions: $animal->chronic_conditions ?? '',
            description: $animal->description ?? '',
            rescueStory: $animalRescue?->location_notes ?? '',
            status: $animal->status ?? '',
            chipRegisteredWithUs: $animal->chip_registered_with_us ?? false,
            specialRequirementsForNewFamily: $animal->requirements_for_new_family ?? '',
            additionalNotes: $animal->additional_notes ?? '',
            spayedOrNeutered: $animal->spayed_neutered ?? '',
        );
    }
}