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
        Schema::create('reading_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('day_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('instruction');
            $table->text('passage');
            $table->string('question');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_items');
    }
};
