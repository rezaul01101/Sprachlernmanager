import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoPlaceholderCard } from '@/components/learn/video-placeholder-card';
import { YoutubeEmbed } from '@/components/learn/youtube-embed';
import { Button } from '@/components/ui/button';
import { getYoutubeEmbedUrl } from '@/lib/learn/get-youtube-embed-url';
import type { ListeningItem } from '@/types/learn';

export function ListeningItemsPlayer({
    items,
    onComplete,
}: {
    items: ListeningItem[];
    onComplete: () => void;
}) {
    const [index, setIndex] = useState(0);

    if (items.length === 0) {
        return (
            <div className="text-muted-foreground text-sm">
                Für diesen Tag ist noch kein Hörmaterial verfügbar.
            </div>
        );
    }

    const current = items[index];
    const embedUrl = getYoutubeEmbedUrl(current.video_url);
    const hasScript = Boolean(current.script?.trim());
    const hasWords = current.words.length > 0;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-mono text-sm">
                    Video {index + 1} / {items.length}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => setIndex((i) => Math.max(0, i - 1))}
                        aria-label="Vorheriges Video"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={index === items.length - 1}
                        onClick={() =>
                            setIndex((i) => Math.min(items.length - 1, i + 1))
                        }
                        aria-label="Nächstes Video"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {embedUrl ? (
                <YoutubeEmbed embedUrl={embedUrl} />
            ) : (
                <VideoPlaceholderCard label={current.title} />
            )}

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{current.title}</span>
                <span className="text-muted-foreground font-mono text-xs">
                    {current.duration_label}
                </span>
            </div>

            {(hasScript || hasWords) && (
                <div className="grid gap-5 sm:grid-cols-2">
                    {hasScript && (
                        <div>
                            <div className="mb-2 text-sm font-semibold">
                                Transkript
                            </div>
                            <p className="text-sm leading-relaxed">
                                {current.script}
                            </p>
                        </div>
                    )}
                    {hasWords && (
                        <div className="space-y-2">
                            {current.words.map((word, index) => (
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
                </div>
            )}

            <Button size="lg" className="w-full" onClick={onComplete}>
                Abschnitt abschließen
            </Button>
        </div>
    );
}
