import { Head, router } from '@inertiajs/react';
import { SpeakingDialoguePane } from '@/components/learn/speaking-dialogue-pane';
import { Button } from '@/components/ui/button';
import learn from '@/routes/learn';
import type { LearnDay, SpeakingItem } from '@/types/learn';

type Level = { code: string };

export default function LessonsSpeaking({
    level,
    day,
    speakingItem,
}: {
    level: Level;
    day: LearnDay;
    speakingItem: SpeakingItem;
}) {
    const onComplete = () => {
        router.post(learn.lessons.complete.url([level.code, day.day_number]), {
            skill: 'sprechen',
        });
    };

    const hasWords = speakingItem.words.length > 0;

    return (
        <>
            <Head title={`Sprechen — Tag ${day.day_number}`} />

            <div className="mx-auto flex max-w-2xl flex-col gap-5 p-4">
                <SpeakingDialoguePane dialogue={speakingItem.dialogue} />

                {hasWords && (
                    <div className="space-y-2">
                        <div className="text-sm font-semibold">Wortschatz</div>
                        {speakingItem.words.map((word, index) => (
                            <div
                                key={index}
                                className="bg-card space-y-1 rounded-lg border p-3"
                            >
                                <div className="text-sm font-semibold">
                                    {word.german}
                                    {word.pronounce && (
                                        <span className="text-muted-foreground ml-1 text-xs font-normal">
                                            ({word.pronounce})
                                        </span>
                                    )}
                                </div>
                                <div className="text-primary text-xs">
                                    {word.english}
                                </div>
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
