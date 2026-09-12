<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

/**
 * Seeds vocab/listening/reading/speaking content for A1's first three days,
 * reusing the exact sample content the mobile app used to hardcode
 * (appv1/data/vocab.ts, data/listen.ts, data/read.ts, data/speak.ts) so
 * local dev/testing has real, correct data across all four skills instead
 * of vocab-only days.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $level = Level::where('code', 'A1')->first();

        if (! $level) {
            return;
        }

        foreach ([1, 2, 3] as $dayNumber) {
            $day = $level->days()->where('day_number', $dayNumber)->first();

            if (! $day || $day->vocabCards()->exists()) {
                continue;
            }

            $day->vocabCards()->createMany([
                [
                    'word' => 'der Ausweis',
                    'tag' => 'Substantiv · m.',
                    'translation_en' => 'ID card',
                    'translation_bn' => 'আইডি কার্ড',
                    'example' => '„Bitte zeigen Sie Ihren Ausweis am Schalter."',
                    'sort_order' => 1,
                ],
                [
                    'word' => 'anmelden',
                    'tag' => 'Verb',
                    'translation_en' => 'to register',
                    'translation_bn' => 'নিবন্ধন করা',
                    'example' => '„Ich muss meinen Wohnsitz anmelden."',
                    'sort_order' => 2,
                ],
                [
                    'word' => 'die Miete',
                    'tag' => 'Substantiv · f.',
                    'translation_en' => 'rent',
                    'translation_bn' => 'ভাড়া',
                    'example' => '„Die Miete muss bis zum 3. bezahlt werden."',
                    'sort_order' => 3,
                ],
                [
                    'word' => 'der Termin',
                    'tag' => 'Substantiv · m.',
                    'translation_en' => 'appointment',
                    'translation_bn' => 'নিয়মিত সময়',
                    'example' => '„Haben Sie einen Termin beim Bürgeramt?"',
                    'sort_order' => 4,
                ],
                [
                    'word' => 'verstehen',
                    'tag' => 'Verb',
                    'translation_en' => 'to understand',
                    'translation_bn' => 'বুঝতে পারা',
                    'example' => '„Ich verstehe die Frage nicht ganz."',
                    'sort_order' => 5,
                ],
            ]);

            $listening = $day->listeningItem()->create([
                'type' => 'video',
                'title' => 'Beim Bürgeramt',
                'duration_label' => '02:14',
                'question' => 'Was muss die Person beim Bürgeramt mitbringen?',
            ]);

            $listening->options()->createMany([
                ['text' => 'Nur den Ausweis', 'is_correct' => false, 'explanation' => 'Im Video wird auch die Meldebescheinigung erwähnt.', 'sort_order' => 1],
                ['text' => 'Ausweis und Meldebescheinigung', 'is_correct' => true, 'explanation' => 'Richtig — beide Dokumente werden im Video verlangt.', 'sort_order' => 2],
                ['text' => 'Gar keine Dokumente', 'is_correct' => false, 'explanation' => 'Das Bürgeramt verlangt immer Dokumente.', 'sort_order' => 3],
            ]);

            $reading = $day->readingItem()->create([
                'instruction' => 'Lesen Sie den Text und beantworten Sie die Frage.',
                'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin. Sie hat einen Termin beim Bürgeramt, weil sie ihren Wohnsitz anmelden muss. Sie bringt ihren Ausweis und die Meldebescheinigung mit. Der Termin dauert nur fünfzehn Minuten, und danach bekommt sie eine Bestätigung.',
                'question' => 'Warum geht Frau Keller zum Bürgeramt?',
            ]);

            $reading->options()->createMany([
                ['text' => 'Um ihren Wohnsitz anzumelden', 'is_correct' => true, 'explanation' => 'Richtig — das ist der Grund für ihren Termin.', 'sort_order' => 1],
                ['text' => 'Um einen neuen Ausweis zu beantragen', 'is_correct' => false, 'explanation' => 'Der Text erwähnt keinen neuen Ausweis.', 'sort_order' => 2],
                ['text' => 'Um die Miete zu bezahlen', 'is_correct' => false, 'explanation' => 'Die Miete wird im Text nicht erwähnt.', 'sort_order' => 3],
            ]);

            $speaking = $day->speakingItem()->create([
                'target_sentence' => 'Ich möchte meinen Wohnsitz anmelden.',
            ]);

            $speaking->aiLines()->createMany([
                ['text' => 'Guten Tag! Wie kann ich Ihnen helfen?', 'sort_order' => 1],
                ['text' => 'Verstehe. Haben Sie schon einen Termin vereinbart?', 'sort_order' => 2],
                ['text' => 'Gut, bringen Sie bitte Ihren Ausweis mit.', 'sort_order' => 3],
                ['text' => 'Vielen Dank, das war alles. Einen schönen Tag noch!', 'sort_order' => 4],
            ]);
        }
    }
}
