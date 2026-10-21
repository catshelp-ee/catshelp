<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->string('token')->unique();
            $table->dateTime('expires_at', 3);
            $table->dateTime('created_at', 3)->useCurrent();
            $table->foreign('user_id', 'email_tokens_user_id_fkey')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_tokens');
    }
};
