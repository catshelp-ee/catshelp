<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('full_name')->nullable()->unique();
            $table->string('email')->nullable();
            $table->string('identity_code')->nullable();
            $table->string('citizenship')->nullable();
            $table->boolean('blacklisted')->default(false);
            $table->string('blacklisted_reason')->nullable();
            $table->dateTime('created_at', 3)->useCurrent();
            $table->string('role')->nullable();
        });

        Schema::create('animals', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->dateTime('birthday', 3)->nullable();
            $table->string('profile_title')->nullable();
            $table->string('status')->nullable();
            $table->string('chip_number')->nullable();
            $table->boolean('chip_registered_with_us')->default(false);
            $table->text('description')->nullable();
        });

        Schema::create('animal_rescues', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('rescue_date', 3)->nullable();
            $table->string('state')->nullable();
            $table->string('address')->nullable();
            $table->string('location_notes')->nullable();
            $table->string('rank_nr')->nullable()->unique();
        });

        Schema::create('animals_to_animal_rescues', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_rescue_id');
            $table->unsignedInteger('animal_id');
            $table->unique(['animal_id', 'animal_rescue_id'], 'animals_to_animal_rescues_animal_id_animal_rescue_id_key');
            $table->index('animal_rescue_id', 'animals_to_animal_rescues_animal_rescue_id_fkey');
            $table->foreign('animal_id', 'animals_to_animal_rescues_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('animal_rescue_id', 'animals_to_animal_rescues_animal_rescue_id_fkey')->references('id')->on('animal_rescues')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::create('foster_homes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('location')->nullable();
            $table->unsignedInteger('user_id')->unique();
            $table->dateTime('start_date', 3)->nullable();
            $table->dateTime('end_date', 3)->nullable();
            $table->unsignedInteger('catshelp_mentor_id')->nullable();
            $table->foreign('user_id', 'foster_homes_user_id_fkey')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::create('animals_to_foster_homes', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_id');
            $table->unsignedInteger('foster_home_id');
            $table->dateTime('foster_home_end_date', 3)->nullable();
            $table->unique(['animal_id', 'foster_home_id'], 'animals_to_foster_homes_animal_id_foster_home_id_key');
            $table->index('foster_home_id', 'animals_to_foster_homes_foster_home_id_fkey');
            $table->foreign('animal_id', 'animals_to_foster_homes_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('foster_home_id', 'animals_to_foster_homes_foster_home_id_fkey')->references('id')->on('foster_homes')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::create('animal_characteristics', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_id');
            $table->string('type')->nullable();
            $table->string('value')->nullable();
            $table->unique(['animal_id', 'type'], 'animal_characteristics_animal_id_type_key');
            $table->foreign('animal_id', 'animal_characteristics_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key_name')->primary();
            $table->text('value');
        });

        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_id');
            $table->unsignedInteger('profile_animal_id')->nullable()->unique();
            $table->string('uuid');
            $table->index('animal_id', 'files_animal_id_fkey');
            $table->foreign('animal_id', 'files_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('profile_animal_id', 'files_profile_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('set null');
        });

        Schema::create('revoked_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->string('token')->unique();
            $table->dateTime('expires_at', 3);
        });

        Schema::create('treatment_history', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_id');
            $table->dateTime('confirmation_date', 3)->nullable();
            $table->boolean('confirmed');
            $table->dateTime('visit_date', 3)->nullable();
            $table->dateTime('next_visit_date', 3)->nullable();
            $table->index('animal_id', 'treatment_history_animal_id_fkey');
            $table->foreign('animal_id', 'treatment_history_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::create('treatments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('treatmentName');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('treatmentHistoryId')->unique();
            $table->foreign('treatmentHistoryId', 'treatments_treatmentHistoryId_fkey')->references('id')->on('treatment_history')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatments');
        Schema::dropIfExists('treatment_history');
        Schema::dropIfExists('revoked_tokens');
        Schema::dropIfExists('files');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('animal_characteristics');
        Schema::dropIfExists('animals_to_foster_homes');
        Schema::dropIfExists('foster_homes');
        Schema::dropIfExists('animals_to_animal_rescues');
        Schema::dropIfExists('animal_rescues');
        Schema::dropIfExists('animals');
        Schema::dropIfExists('users');
    }
};
