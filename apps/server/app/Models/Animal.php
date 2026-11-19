<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    public $timestamps = false;

    /**
     * Personality yes/no traits: API (camelCase) key => column.
     */
    public const PERSONALITY_FLAGS = [
        'bold'                   => 'bold',
        'shy'                    => 'shy',
        'active'                 => 'active',
        'veryActive'             => 'very_active',
        'calm'                   => 'calm',
        'friendly'               => 'friendly',
        'grumpy'                 => 'grumpy',
        'vocal'                  => 'vocal',
        'dislikesTouching'       => 'dislikes_touching',
        'sociable'               => 'sociable',
        'aloof'                  => 'aloof',
        'goodAppetite'           => 'good_appetite',
        'curious'                => 'curious',
        'playful'                => 'playful',
        'stressed'               => 'stressed',
        'sensitive'              => 'sensitive',
        'peaceful'               => 'peaceful',
        'selfish'                => 'selfish',
        'hisses'                 => 'hisses',
        'beingOnLap'             => 'being_on_lap',
        'sleepsCuddling'         => 'sleeps_cuddling',
        'likesPetting'           => 'likes_petting',
        'likesAttention'         => 'likes_attention',
        'likesPlayingWithPeople' => 'likes_playing_with_people',
        'likesPlayingAlone'      => 'likes_playing_alone',
        'usesLitterbox'          => 'uses_litterbox',
        'usesScratchingpost'     => 'uses_scratchingpost',
        'selectiveWithFood'      => 'selective_with_food',
        'adaptable'              => 'adaptable',
        'scratchesFurniture'     => 'scratches_furniture',
        'trusting'               => 'trusting',
    ];

    /**
     * Personality option fields: API (camelCase) key => column. Stored as UPPER_SNAKE_CASE.
     */
    public const PERSONALITY_OPTIONS = [
        'attitudeTowardsCats'           => 'attitude_towards_cats',
        'attitudeTowardsDogs'           => 'attitude_towards_dogs',
        'attitudeTowardsChildren'       => 'attitude_towards_children',
        'suitabilityForIndoorOrOutdoor' => 'suitability_for_indoor_or_outdoor',
    ];

    protected $fillable = [
        'name',
        'birthday',
        'profile_title',
        'status',
        'chip_number',
        'chip_registered_with_us',
        'description',
        'requirements_for_new_family',
        'additional_notes',
        'chronic_conditions',
        'listing_title',
        'listing_description',
        'coat_color',
        'coat_length',
        'gender',
        'spayed_neutered',
        'time_in_care',
        'attitude_towards_cats',
        'attitude_towards_dogs',
        'attitude_towards_children',
        'suitability_for_indoor_or_outdoor',
        ...self::PERSONALITY_FLAGS,
    ];

    protected function casts(): array
    {
        return [
            'birthday' => 'datetime',
            'chip_registered_with_us' => 'boolean',
            ...array_fill_keys(self::PERSONALITY_FLAGS, 'boolean'),
        ];
    }

    /**
     * Normalise an option value to UPPER_SNAKE_CASE (camelCase words, dashes and spaces are split with underscores).
     * Empty values become null.
     */
    public static function normalizeOption(?string $value): ?string
    {
        $value = trim($value ?? '');
        if ($value === '') {
            return null;
        }

        $value = preg_replace('/(\p{Ll})(\p{Lu})/u', '$1_$2', $value);

        return mb_strtoupper(str_replace(['-', ' '], '_', $value));
    }

    public function rescues()
    {
        return $this->hasMany(AnimalRescue::class);
    }

    public function fosterHomes()
    {
        return $this->belongsToMany(FosterHome::class, 'animals_to_foster_homes')
            ->withPivot('foster_home_end_date');
    }

    public function characteristics()
    {
        return $this->hasMany(AnimalCharacteristic::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function todos()
    {
        return $this->hasMany(Todo::class);
    }

    public function profileFile()
    {
        return $this->hasOne(File::class, 'profile_animal_id');
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }
}