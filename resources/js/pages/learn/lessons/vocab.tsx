import { Head, router } from '@inertiajs/react';
import { VocabFlashcardDeck } from '@/components/learn/vocab-flashcard-deck';
import learn from '@/routes/learn';
import type { LearnDay, VocabCard } from '@/types/learn';

type Level = { code: string };

export default function LessonsVocab({
    level,
    day,
    vocabCards,
}: {
    level: Level;
    day: LearnDay;
    vocabCards: VocabCard[];
}) {
    const onFinish = () => {
        router.post(learn.lessons.complete.url([level.code, day.day_number]), {
            skill: 'wortschatz',
        });
    };

    return (
        <>
            <Head title={`Wortschatz — Tag ${day.day_number}`} />

            <div className="mx-auto max-w-2xl p-4">
                <VocabFlashcardDeck cards={vocabCards} onFinish={onFinish} />
            </div>
        </>
    );
}
