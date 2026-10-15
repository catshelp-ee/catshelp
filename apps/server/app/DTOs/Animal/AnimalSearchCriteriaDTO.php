<?php

namespace App\DTOs\Animal;

readonly class AnimalSearchCriteriaDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $chipNumber = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            chipNumber: $data['chipNumber'] ?? null,
        );
    }
}
