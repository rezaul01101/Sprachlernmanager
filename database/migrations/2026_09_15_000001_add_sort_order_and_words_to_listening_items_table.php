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
        // MySQL won't drop a unique index while it still backs the day_id
        // foreign key, so the FK has to come down first and get rebuilt
        // afterwards on a plain (non-unique) index.
        Schema::table('listening_items', function (Blueprint $table) {
            $table->dropForeign(['day_id']);
            $table->dropUnique(['day_id']);
        });

        Schema::table('listening_items', function (Blueprint $table) {
            $table->foreign('day_id')->references('id')->on('days')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(1)->after('day_id');
            // Each entry is {word, pronounce, meaning} — a video can reference
            // several related vocab words, not just one.
            $table->json('words')->nullable()->after('duration_label');
            $table->dropColumn('question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listening_items', function (Blueprint $table) {
            $table->dropForeign(['day_id']);
            $table->string('question')->default('')->after('duration_label');
            $table->dropColumn(['sort_order', 'words']);
        });

        Schema::table('listening_items', function (Blueprint $table) {
            $table->unique('day_id');
            $table->foreign('day_id')->references('id')->on('days')->cascadeOnDelete();
        });
    }
};
