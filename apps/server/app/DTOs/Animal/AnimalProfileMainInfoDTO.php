<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalProfileMainInfoDTO
{
    public function __construct(
        public string $name,
        public string $rankNr,
        public ?\DateTime $birthDate,
        public ?\DateTime $rescueDate,
        public string $gender,
        public string $coatColour,
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
        $characteristics = $animal->characteristics()->get();
        $mappedCharacteristics = [];
        foreach ($characteristics as $characteristic) {
            $mappedCharacteristics[$characteristic->type] = $characteristic->value;
        }
        $animalRescue = $animal->rescues()->first();

        return new self(
            name: $animal->name,
            rankNr: $animalRescue?->rank_nr ?? '',
            birthDate: $animal->birthday,
            rescueDate: $animalRescue?->rescue_date ?? null,
            gender: $mappedCharacteristics['gender'] ?? '',
            coatColour: $mappedCharacteristics['coatColour'] ?? '',
            coatLength: $mappedCharacteristics['coatLength'] ?? '',
            location: $animalRescue?->address ?? '',
            microchip: $animal->microchip ?? '',
            fosterStayDuration: 'TODO', //TODO calculate foster stay duration
            chronicConditions: $animal->chronic_conditions ?? '',
            description: $animal->description ?? '',
            rescueStory: $animalRescue?->location_notes ?? '',
            status: $animal->status ?? '',
            chipRegisteredWithUs: $animal->chip_registered_with_us ?? false,
            specialRequirementsForNewFamily: $animal->requirements_for_new_family ?? '',
            additionalNotes: $animal->additional_notes ?? '',
            spayedOrNeutered: $mappedCharacteristics['spayed_or_neutered'] ?? '',
        );
    }
}