<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalProfileDTO
{
    public function __construct(
        
        public int $animalId,
        /** @var AnimalProfileImageDTO[] */
        public array $images,
        public AnimalProfileMainInfoDTO $mainInfo,
        public AnimalProfilePersonalityInfoDTO $personalityInfo,
    ) {}

    public static function fromModel(Animal $animal, array $images = []): self
    {
        return new self(
            animalId: $animal->id,
            images: $images,
            mainInfo: AnimalProfileMainInfoDTO::fromModel($animal),
            personalityInfo: AnimalProfilePersonalityInfoDTO::fromModel($animal),
        );
    }
}