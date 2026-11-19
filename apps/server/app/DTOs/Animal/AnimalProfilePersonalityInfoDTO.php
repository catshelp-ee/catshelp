<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalProfilePersonalityInfoDTO
{
    public function __construct(
        public bool $bold,
        public bool $shy,
        public bool $active,
        public bool $veryActive,
        public bool $calm,
        public bool $friendly,
        public bool $grumpy,
        public bool $vocal,
        public bool $dislikesTouching,
        public bool $sociable,
        public bool $aloof,
        public bool $goodAppetite,
        public bool $curious,
        public bool $playful,
        public bool $stressed,
        public bool $sensitive,
        public bool $peaceful,
        public bool $selfish,
        public bool $hisses,
        public bool $beingOnLap,
        public bool $sleepsCuddling,
        public bool $likesPetting,
        public bool $likesAttention,
        public bool $likesPlayingWithPeople,
        public bool $likesPlayingAlone,
        public bool $usesLitterbox,
        public bool $usesScratchingpost,
        public bool $selectiveWithFood,
        public bool $adaptable,
        public bool $scratchesFurniture,
        public bool $trusting,
        public string $description,
        public string $attitudeTowardsCats,
        public string $attitudeTowardsDogs,
        public string $attitudeTowardsChildren,
        public string $suitabilityForIndoorOrOutdoor,
    ) {}

    public static function fromModel(Animal $animal): self
    {
        $values = [];

        foreach (Animal::PERSONALITY_FLAGS as $key => $column) {
            $values[$key] = (bool) $animal->{$column};
        }

        foreach (Animal::PERSONALITY_OPTIONS as $key => $column) {
            $values[$key] = $animal->{$column} ?? '';
        }

        return new self(
            ...$values,
            description: '',
        );
    }
}
