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
        $characteristics = $animal->characteristics()->get();
        $mappedCharacteristics = [];
        foreach ($characteristics as $characteristic) {
            $mappedCharacteristics[$characteristic->type] = $characteristic->value;
        }

        return new self(
            bold: $mappedCharacteristics['bold'] ?? false,
            shy: $mappedCharacteristics['shy'] ?? false,
            active: $mappedCharacteristics['active'] ?? false,
            veryActive: $mappedCharacteristics['veryActive'] ?? false,
            calm: $mappedCharacteristics['calm'] ?? false,
            friendly: $mappedCharacteristics['friendly'] ?? false,
            grumpy: $mappedCharacteristics['grumpy'] ?? false,
            vocal: $mappedCharacteristics['vocal'] ?? false,
            dislikesTouching: $mappedCharacteristics['dislikesTouching'] ?? false,
            sociable: $mappedCharacteristics['sociable'] ?? false,
            aloof: $mappedCharacteristics['aloof'] ?? false,
            goodAppetite: $mappedCharacteristics['goodAppetite'] ?? false,
            curious: $mappedCharacteristics['curious'] ?? false,
            playful: $mappedCharacteristics['playful'] ?? false,
            stressed: $mappedCharacteristics['stressed'] ?? false,
            sensitive: $mappedCharacteristics['sensitive'] ?? false,
            peaceful: $mappedCharacteristics['peaceful'] ?? false,
            selfish: $mappedCharacteristics['selfish'] ?? false,
            hisses: $mappedCharacteristics['hisses'] ?? false,
            beingOnLap: $mappedCharacteristics['beingOnLap'] ?? false,
            sleepsCuddling: $mappedCharacteristics['sleepsCuddling'] ?? false,
            likesPetting: $mappedCharacteristics['likesPetting'] ?? false,
            likesAttention: $mappedCharacteristics['likesAttention'] ?? false,
            likesPlayingWithPeople: $mappedCharacteristics['likesPlayingWithPeople'] ?? false,
            likesPlayingAlone: $mappedCharacteristics['likesPlayingAlone'] ?? false,
            usesLitterbox: $mappedCharacteristics['usesLitterbox'] ?? false,
            usesScratchingpost: $mappedCharacteristics['usesScratchingpost'] ?? false,
            selectiveWithFood: $mappedCharacteristics['selectiveWithFood'] ?? false,
            adaptable: $mappedCharacteristics['adaptable'] ?? false,
            scratchesFurniture: $mappedCharacteristics['scratchesFurniture'] ?? false,
            trusting: $mappedCharacteristics['trusting'] ?? false,
            description: $mappedCharacteristics['description'] ?? '',
            attitudeTowardsCats: $mappedCharacteristics['attitudeTowardsCats'] ?? '',
            attitudeTowardsDogs: $mappedCharacteristics['attitudeTowardsDogs'] ?? '',
            attitudeTowardsChildren: $mappedCharacteristics['attitudeTowardsChildren'] ?? '',
            suitabilityForIndoorOrOutdoor: $mappedCharacteristics['suitabilityForIndoorOrOutdoor'] ?? '',
        );
    }
}