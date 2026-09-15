import { Head, router } from '@inertiajs/react';
import { ListeningItemsPlayer } from '@/components/learn/listening-items-player';
import { VocabReferencePanel } from '@/components/learn/vocab-reference-panel';
import learn from '@/routes/learn';
import type { LearnDay, ListeningItem, VocabCard } from '@/types/learn';

type Level = { code: string };

export default function LessonsListening({
    level,
    day,
    listeningItems,
    vocabCards,
}: {
    level: Level;
    day: LearnDay;
    listeningItems: ListeningItem[];
    vocabCards: VocabCard[];
}) {
    const hasVocab = vocabCards.length > 0;

    const onComplete = () => {
        router.post(learn.lessons.complete.url([level.code, day.day_number]), {
            skill: 'hoeren',
        });
    };

    return (
        <>
            <Head title={`Hören — Tag ${day.day_number}`} />

            <div className="mx-auto max-w-2xl space-y-5 p-4">
                <ListeningItemsPlayer
                    items={listeningItems}
                    onComplete={onComplete}
                />

                {hasVocab && <VocabReferencePanel cards={vocabCards} />}
            </div>
        </>
    );
}
