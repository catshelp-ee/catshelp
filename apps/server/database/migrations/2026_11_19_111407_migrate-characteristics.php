<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Text columns: animals column => animal_characteristics.type values to read from (first match wins).
     * Values are normalised to UPPER_SNAKE_CASE.
     */
    private const TEXT_MAP = [
        'coat_color'                        => ['coatColour'],
        'coat_length'                       => ['coatLength'],
        'gender'                            => ['gender'],
        'spayed_neutered'                   => ['spayedOrNeutered', 'spayed_or_neutered'],
        'attitude_towards_cats'             => ['attitudeTowardsCats'],
        'attitude_towards_dogs'             => ['attitudeTowardsDogs'],
        'attitude_towards_children'         => ['attitudeTowardsChildren'],
        'suitability_for_indoor_or_outdoor' => ['suitabilityForIndoorOrOutdoor'],
    ];

    /**
     * Boolean columns: animals column => animal_characteristics.type.
     */
    private const BOOLEAN_MAP = [
        'bold'                      => 'bold',
        'shy'                       => 'shy',
        'active'                    => 'active',
        'very_active'               => 'veryActive',
        'calm'                      => 'calm',
        'friendly'                  => 'friendly',
        'grumpy'                    => 'grumpy',
        'vocal'                     => 'vocal',
        'dislikes_touching'         => 'dislikesTouching',
        'sociable'                  => 'sociable',
        'aloof'                     => 'aloof',
        'good_appetite'             => 'goodAppetite',
        'curious'                   => 'curious',
        'playful'                   => 'playful',
        'stressed'                  => 'stressed',
        'sensitive'                 => 'sensitive',
        'peaceful'                  => 'peaceful',
        'selfish'                   => 'selfish',
        'hisses'                    => 'hisses',
        'being_on_lap'              => 'beingOnLap',
        'sleeps_cuddling'           => 'sleepsCuddling',
        'likes_petting'             => 'likesPetting',
        'likes_attention'           => 'likesAttention',
        'likes_playing_with_people' => 'likesPlayingWithPeople',
        'likes_playing_alone'       => 'likesPlayingAlone',
        'uses_litterbox'            => 'usesLitterbox',
        'uses_scratchingpost'       => 'usesScratchingpost',
        'selective_with_food'       => 'selectiveWithFood',
        'adaptable'                 => 'adaptable',
        'scratches_furniture'       => 'scratchesFurniture',
        'trusting'                  => 'trusting',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (self::TEXT_MAP as $column => $types) {
            // Iterate in reverse so the first listed type is applied last and takes precedence.
            foreach (array_reverse($types) as $type) {
                $rows = DB::table('animal_characteristics')
                    ->where('type', $type)
                    ->get(['animal_id', 'value']);

                foreach ($rows as $row) {
                    $value = $this->normalize($row->value);
                    if ($value === null) {
                        continue;
                    }

                    DB::table('animals')->where('id', $row->animal_id)->update([$column => $value]);
                }
            }
        }

        foreach (self::BOOLEAN_MAP as $column => $type) {
            DB::update(
                "UPDATE animals
                 JOIN animal_characteristics ac
                   ON ac.animal_id = animals.id
                  AND ac.type = ?
                 SET animals.{$column} = CASE
                     WHEN LOWER(TRIM(ac.value)) IN ('1', 'true', 'jah', 'yes') THEN 1
                     ELSE 0
                 END",
                [$type]
            );
        }
    }

    /**
     * UPPER_SNAKE_CASE: camelCase words (as saved by the old frontend, e.g. "lovesNeedsCat"),
     * dashes and spaces are separated with underscores. Empty values become null.
     */
    private function normalize(?string $value): ?string
    {
        $value = trim($value ?? '');
        if ($value === '') {
            return null;
        }

        $value = preg_replace('/(\p{Ll})(\p{Lu})/u', '$1_$2', $value);

        return mb_strtoupper(str_replace(['-', ' '], '_', $value));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('animals')->update([
            ...array_fill_keys(array_keys(self::TEXT_MAP), null),
            ...array_fill_keys(array_keys(self::BOOLEAN_MAP), false),
        ]);
    }
};
