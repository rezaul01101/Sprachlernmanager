<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Focus topics cycled across seeded days, mirroring the mobile app's
     * mock content (appv1/data/day-focus.ts) so local dev data looks real.
     *
     * @var list<string>
     */
    private const FOCUS_TOPICS = [
        'Begrüßungen, das Verb „sein", Zahlen 1–10',
        'Familie vorstellen, Possessivpronomen, Wortschatz Zuhause',
        'Einkaufen, Mengenangaben, Höflichkeitsformen',
        'Uhrzeiten, Tagesablauf, trennbare Verben',
        'Wegbeschreibung, Präpositionen, öffentliche Verkehrsmittel',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['code' => 'A1', 'title' => 'Grundlagen', 'days' => 40],
            ['code' => 'A2', 'title' => 'Alltag', 'days' => 45],
            ['code' => 'B1', 'title' => 'Mittelstufe', 'days' => 50],
            ['code' => 'B2', 'title' => 'Fortgeschritten', 'days' => 55],
        ];

        foreach ($levels as $index => $definition) {
            $level = Level::create([
                'code' => $definition['code'],
                'title' => $definition['title'],
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);

            for ($day = 1; $day <= $definition['days']; $day++) {
                $level->days()->create([
                    'day_number' => $day,
                    'focus_text' => self::FOCUS_TOPICS[($day - 1) % count(self::FOCUS_TOPICS)],
                    'is_published' => true,
                ]);
            }
        }
    }
}
