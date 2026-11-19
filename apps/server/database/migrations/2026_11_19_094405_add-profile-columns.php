<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TEXT_COLUMNS = [
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
    ];

    private const BOOLEAN_COLUMNS = [
        'bold',
        'shy',
        'active',
        'very_active',
        'calm',
        'friendly',
        'grumpy',
        'vocal',
        'dislikes_touching',
        'sociable',
        'aloof',
        'good_appetite',
        'curious',
        'playful',
        'stressed',
        'sensitive',
        'peaceful',
        'selfish',
        'hisses',
        'being_on_lap',
        'sleeps_cuddling',
        'likes_petting',
        'likes_attention',
        'likes_playing_with_people',
        'likes_playing_alone',
        'uses_litterbox',
        'uses_scratchingpost',
        'selective_with_food',
        'adaptable',
        'scratches_furniture',
        'trusting',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            $after = 'chronic_conditions';

            foreach (self::TEXT_COLUMNS as $column) {
                $table->text($column)->nullable()->after($after);
                $after = $column;
            }

            foreach (self::BOOLEAN_COLUMNS as $column) {
                $table->boolean($column)->default(false)->after($after);
                $after = $column;
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            $table->dropColumn([...self::TEXT_COLUMNS, ...self::BOOLEAN_COLUMNS]);
        });
    }
};
