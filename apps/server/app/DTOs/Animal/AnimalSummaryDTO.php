<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalSummaryDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $profilePicture,
    ) {}

    public static function fromModel(Animal $animal, string $profilePicture): self
    {
        return new self(
            id: $animal->id,
            name: $animal->name,
            profilePicture: $profilePicture,
        );
    }
}