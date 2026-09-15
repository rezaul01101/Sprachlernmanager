import { Head, router } from '@inertiajs/react';
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

                <p className="text-base leading-relaxed">
                    {readingItem.passage}
                </p>

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
                        <div className="text-sm font-semibold">
                            Wortschatz
                        </div>
                        {readingItem.words.map((word, index) => (
                            <div
                                key={index}
                                className="bg-card space-y-1 rounded-lg border p-3"
                            >
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
