<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('todos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('animal_id');
            $table->string('type');
            $table->dateTime('due_date', 3);
            $table->dateTime('completed_date', 3)->nullable();
            $table->unique(['animal_id', 'type'], 'todos_animal_id_type_key');
            $table->foreign('animal_id', 'animal_characteristics_animal_id_fkey')->references('id')->on('animals')->onUpdate('cascade')->onDelete('restrict');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
