import { Head, router } from '@inertiajs/react';
import { McQuestion } from '@/components/learn/mc-question';
import { VideoPlaceholderCard } from '@/components/learn/video-placeholder-card';
import { VocabReferencePanel } from '@/components/learn/vocab-reference-panel';
import { YoutubeEmbed } from '@/components/learn/youtube-embed';
import { Button } from '@/components/ui/button';
import { getYoutubeEmbedUrl } from '@/lib/learn/get-youtube-embed-url';
import learn from '@/routes/learn';
import type { LearnDay, ListeningItem, VocabCard } from '@/types/learn';

type Level = { code: string };

export default function LessonsListening({
    level,
    day,
    listeningItem,
    vocabCards,
}: {
    level: Level;
    day: LearnDay;
    listeningItem: ListeningItem;
    vocabCards: VocabCard[];
}) {
    const embedUrl = getYoutubeEmbedUrl(listeningItem.video_url);
    const hasScript = Boolean(listeningItem.script?.trim());
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
                {embedUrl ? (
                    <YoutubeEmbed embedUrl={embedUrl} />
                ) : (
                    <VideoPlaceholderCard label={listeningItem.title} />
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {listeningItem.title}
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                        {listeningItem.duration_label}
                    </span>
                </div>

                {(hasScript || hasVocab) && (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {hasScript && (
                            <div>
                                <div className="mb-2 text-sm font-semibold">
                                    Transkript
                                </div>
                                <p className="text-sm leading-relaxed">
                                    {listeningItem.script}
                                </p>
                            </div>
                        )}
                        {hasVocab && <VocabReferencePanel cards={vocabCards} />}
                    </div>
                )}

                <McQuestion
                    question={listeningItem.question}
                    options={listeningItem.options}
                />

                <Button size="lg" className="w-full" onClick={onComplete}>
                    Abschnitt abschließen
                </Button>
            </div>
        </>
    );
}
