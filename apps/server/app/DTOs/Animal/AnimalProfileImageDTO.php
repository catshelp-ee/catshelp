<?php

namespace App\DTOs\Animal;

readonly class AnimalProfileImageDTO
{
    public function __construct(
        
        public int $id,
        public string $data,
        public string $type,
    ) {}

    public static function fromModel(array $data): self
    {
        return new self(
            id: $data['id'],
            data: $data['data'],
            type: $data['type'],
        );
    }
}