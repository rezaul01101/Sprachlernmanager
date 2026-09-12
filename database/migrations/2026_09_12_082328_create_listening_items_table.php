<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listening_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('day_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('type', ['audio', 'video']);
            $table->string('title');
            $table->string('duration_label');
            $table->string('question');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listening_items');
    }
};
