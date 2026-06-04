<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        Schema::table('animals', function (Blueprint $table) {
            $table->text('requirements_for_new_family')->nullable()->after('description');
            $table->text('additional_notes')->nullable()->after('requirements_for_new_family');
        });
        */
    }

    public function down(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            $table->dropColumn(['requirements_for_new_family', 'additional_notes']);
        });
    }
};
