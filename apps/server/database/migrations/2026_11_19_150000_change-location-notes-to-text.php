<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('animal_rescues', function (Blueprint $table) {
            $table->text('location_notes')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Truncate values that won't fit back into VARCHAR(255).
        DB::table('animal_rescues')
            ->whereRaw('CHAR_LENGTH(location_notes) > 255')
            ->update(['location_notes' => DB::raw('LEFT(location_notes, 255)')]);

        Schema::table('animal_rescues', function (Blueprint $table) {
            $table->string('location_notes')->nullable()->change();
        });
    }
};
