import { Head, router } from '@inertiajs/react';
import { SpeakButton } from '@/components/learn/speak-button';
import { Button } from '@/components/ui/button';
import learn from '@/routes/learn';
import type { LearnDay, ReadingItem } from '@/types/learn';

type Level = { code: string };

export default function LessonsReading({
    level,
    day,
    readingItem,
}: {
    level: Level;
    day: LearnDay;
    readingItem: ReadingItem;
}) {
    const [germanText, englishText] = readingItem.passage.split(
        '[English Translation]',
    );

    const onComplete = () => {
        router.post(learn.lessons.complete.url([level.code, day.day_number]), {
            skill: 'lesen',
        });
    };

    const hasWords = readingItem.words.length > 0;

    return (
        <>
            <Head title={`Lesen — Tag ${day.day_number}`} />

            <div className="mx-auto max-w-2xl space-y-5 p-4">
                <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
                    <div className="text-primary mb-1 text-xs font-semibold">
                        Aufgabe
                    </div>
                    <p className="text-sm">{readingItem.instruction}</p>
                </div>

                <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-line">{germanText.trim()}</p>
                    <SpeakButton text={germanText.trim()} />
                </div>

                {englishText && (
                    <p className="mt-4">
                        <strong>[English Translation]</strong>{' '}
                        {englishText.trim()}
                    </p>
                )}

                {readingItem.article_url && (
                    <a
                        href={readingItem.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm underline underline-offset-4"
                    >
                        Artikel öffnen
                    </a>
                )}

                {hasWords && (
                    <div className="space-y-2">
                        <div className="text-sm font-semibold">Wortschatz</div>
                        {readingItem.words.map((word, index) => (
                            <div
                                key={index}
                                className="bg-card flex items-center justify-between gap-3 rounded-lg border p-3"
                            >
                                <div>
                                    <div className="text-sm font-semibold">
                                        {word.word}
                                        {word.pronounce && (
                                            <span className="text-muted-foreground ml-1 text-xs font-normal">
                                                ({word.pronounce})
                                            </span>
                                        )}
                                    </div>
                                    {word.meaning && (
                                        <div className="text-primary text-xs">
                                            {word.meaning}
                                        </div>
                                    )}
                                </div>
                                <SpeakButton text={word.word} />
                            </div>
                        ))}
                    </div>
                )}

                <Button size="lg" className="w-full" onClick={onComplete}>
                    Abschnitt abschließen
                </Button>
            </div>
        </>
    );
}
