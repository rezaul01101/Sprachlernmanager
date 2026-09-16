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
        Schema::table('speaking_items', function (Blueprint $table) {
            // Each entry is {german, english, pronounce} — a scripted
            // back-and-forth conversation plus its related vocab, replacing
            // the old single target sentence + cycling AI reply lines.
            $table->json('dialogue')->nullable()->after('day_id');
            $table->json('words')->nullable()->after('dialogue');
            $table->dropColumn('target_sentence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('speaking_items', function (Blueprint $table) {
            $table->text('target_sentence')->default('');
            $table->dropColumn(['dialogue', 'words']);
        });
    }
};
