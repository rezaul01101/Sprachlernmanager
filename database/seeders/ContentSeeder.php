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

            $day->listeningItems()->createMany([
                [
                    'type' => 'video',
                    'title' => 'Beim Bürgeramt – Anmeldung',
                    'duration_label' => '02:14',
                    'words' => [
                        ['word' => 'der Ausweis', 'pronounce' => 'dehr OWS-vice', 'meaning' => 'ID card'],
                        ['word' => 'anmelden', 'pronounce' => 'AN-mel-den', 'meaning' => 'to register'],
                    ],
                    'sort_order' => 1,
                ],
                [
                    'type' => 'video',
                    'title' => 'Beim Bürgeramt – Der Termin',
                    'duration_label' => '01:45',
                    'words' => [
                        ['word' => 'der Termin', 'pronounce' => 'dehr tehr-MEEN', 'meaning' => 'appointment'],
                        ['word' => 'die Miete', 'pronounce' => 'dee MEE-teh', 'meaning' => 'rent'],
                    ],
                    'sort_order' => 2,
                ],
            ]);

            $day->readingItem()->create([
                'instruction' => 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
                'passage' => 'Frau Keller wohnt seit drei Monaten in Berlin. Sie hat einen Termin beim Bürgeramt, weil sie ihren Wohnsitz anmelden muss. Sie bringt ihren Ausweis und die Meldebescheinigung mit. Der Termin dauert nur fünfzehn Minuten, und danach bekommt sie eine Bestätigung.',
                'words' => [
                    ['word' => 'der Wohnsitz', 'pronounce' => 'dehr VOHN-zits', 'meaning' => 'residence'],
                    ['word' => 'die Meldebescheinigung', 'pronounce' => 'dee MEL-deh-beh-shy-ni-gung', 'meaning' => 'registration certificate'],
                ],
            ]);

            $day->speakingItem()->create([
                'dialogue' => [
                    ['german' => 'Guten Tag! Wie kann ich Ihnen helfen?', 'english' => 'Good day! How can I help you?', 'pronounce' => 'গুটেন টাক! ভি কান ইশ ইনেন হেলফেন?'],
                    ['german' => 'Ich möchte meinen Wohnsitz anmelden.', 'english' => 'I would like to register my residence.', 'pronounce' => 'ইশ ম্যোশটে মাইনেন ভোনজিটস আনমেলডেন।'],
                    ['german' => 'Verstehe. Haben Sie schon einen Termin vereinbart?', 'english' => 'I see. Have you already arranged an appointment?', 'pronounce' => 'ফেয়াস্টেহে। হাবেন জি শোন আইনেন টারমিন ফেয়াইনবার্ট?'],
                    ['german' => 'Nein, das ist mein erster Besuch hier.', 'english' => 'No, this is my first visit here.', 'pronounce' => 'নাইন, ডাস ইস্ট মাইন এয়ারস্টার বেজুখ হির।'],
                    ['german' => 'Gut, bringen Sie bitte Ihren Ausweis mit.', 'english' => 'Good, please bring your ID card with you.', 'pronounce' => 'গুট, ব্রিঙেন জি বিটে ইরেন আউসভাইস মিট।'],
                    ['german' => 'Vielen Dank, das war alles. Einen schönen Tag noch!', 'english' => 'Thank you, that was all. Have a nice day!', 'pronounce' => 'ফিলেন ডাংক, ডাস ভার আলেস। আইনেন শ্যোনেন টাক নখ!'],
                ],
                'words' => [
                    ['german' => 'der Wohnsitz', 'english' => 'residence', 'pronounce' => 'ডেয়া ভোনজিটস'],
                    ['german' => 'anmelden', 'english' => 'to register', 'pronounce' => 'আনমেলডেন'],
                    ['german' => 'der Termin', 'english' => 'appointment', 'pronounce' => 'ডেয়া টারমিন'],
                    ['german' => 'der Ausweis', 'english' => 'ID card', 'pronounce' => 'ডেয়া আউসভাইস'],
                ],
            ]);
        }
    }
}
