<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalSummaryDTO
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    public static function fromModel(Animal $animal): self
    {
        return new self(
            id: $animal->id,
            name: $animal->name,
        );
    }
}