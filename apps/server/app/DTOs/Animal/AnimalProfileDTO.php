<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalProfileDTO
{
    public function __construct(
        
        public int $animalId,
        /** @var AnimalProfileImageDTO[] */
        public array $images,
        public string $listingTitle,
        public string $listingDescription,
        public AnimalProfileMainInfoDTO $mainInfo,
        public AnimalProfilePersonalityInfoDTO $personalityInfo,
    ) {}

    public static function fromModel(Animal $animal, array $images = []): self
    {
        return new self(
            animalId: $animal->id,
            images: $images,
            listingTitle: $animal->listing_title ?? '',
            listingDescription: $animal->listing_description ?? '',
            mainInfo: AnimalProfileMainInfoDTO::fromModel($animal),
            personalityInfo: AnimalProfilePersonalityInfoDTO::fromModel($animal),
        );
    }
}