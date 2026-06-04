<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        Schema::table('animal_rescues', function (Blueprint $table) {
            $table->unsignedInteger('animal_id')->nullable()->after('rank_nr');
            $table->index('animal_id', 'animal_rescues_animal_id_key');
        });

        DB::statement('UPDATE animal_rescues JOIN animals_to_animal_rescues ON animal_rescues.id = animals_to_animal_rescues.animal_rescue_id SET animal_rescues.animal_id = animals_to_animal_rescues.animal_id');

        Schema::table('animal_rescues', function (Blueprint $table) {
            $table->foreign('animal_id', 'animal_rescues_animal_id_fkey')->references('id')->on('animals');
        });

        Schema::dropIfExists('animals_to_animal_rescues');
        Schema::dropIfExists('cache');

        Schema::table('treatments', function (Blueprint $table) {
            $table->tinyInteger('confirmed')->nullable()->after('active');
            $table->dateTime('confirmation_date', 3)->nullable()->after('confirmed');
            $table->dateTime('visit_date', 3)->nullable()->after('confirmation_date');
            $table->dateTime('next_visit_date', 3)->nullable()->after('visit_date');
            $table->unsignedInteger('animal_id')->nullable()->after('next_visit_date');
            $table->index('animal_id', 'treatments_animal_id_idx');
            $table->foreign('animal_id', 'treatments_animal_id_fkey')->references('id')->on('animals');
        });

        Schema::table('treatments', function (Blueprint $table) {
            $table->dropForeign('treatments_treatmentHistoryId_fkey');
            $table->dropColumn('treatmentHistoryId');
            $table->dropColumn('treatmentName');
            $table->string('treatment_name', 191)->after('id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['blacklisted', 'blacklisted_reason']);
        });

        Schema::dropIfExists('treatment_history');
        */
    }

    public function down(): void {}
};
