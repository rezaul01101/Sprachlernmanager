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
        Schema::table('reading_items', function (Blueprint $table) {
            // Related vocab for the passage/article — an item can reference
            // several words, not just one multiple-choice question.
            $table->json('words')->nullable()->after('passage');
            $table->dropColumn('question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reading_items', function (Blueprint $table) {
            $table->string('question')->default('')->after('passage');
            $table->dropColumn('words');
        });
    }
};
