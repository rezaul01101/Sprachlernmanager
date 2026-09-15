import { useCallback, useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VocabCard } from '@/types/learn';

export function VocabFlashcardDeck({
    cards,
    onFinish,
}: {
    cards: VocabCard[];
    onFinish: () => void;
}) {
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [learnedCount, setLearnedCount] = useState(0);
    const [laterCount, setLaterCount] = useState(0);

    const isDeckComplete = index >= cards.length;
    const current = cards[index];

    const advance = useCallback((bucket: 'learned' | 'later') => {
        if (bucket === 'learned') {
            setLearnedCount((c) => c + 1);
        } else {
            setLaterCount((c) => c + 1);
        }
        setRevealed(false);
        setIndex((i) => i + 1);
    }, []);

    useEffect(() => {
        if (isDeckComplete) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'ArrowRight') advance('learned');
            if (event.key === 'ArrowLeft') advance('later');
            if (event.key === ' ') {
                event.preventDefault();
                setRevealed((r) => !r);
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [advance, isDeckComplete]);

    if (cards.length === 0) {
        return (
            <div className="text-muted-foreground text-sm">
                Für diesen Tag sind noch keine Vokabeln verfügbar.
            </div>
        );
    }

    if (isDeckComplete) {
        return (
            <div className="flex flex-col items-center gap-6 py-16 text-center">
                <div className="text-2xl font-bold">Geschafft!</div>
                <div className="text-muted-foreground">
                    {learnedCount} gelernt · {laterCount} zur Wiederholung
                </div>
                <Button onClick={onFinish} size="lg">
                    Fertig
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-muted-foreground font-mono text-sm">
                {cards.length - index} Karten übrig
            </div>

            <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="bg-card flex aspect-[4/3] w-full max-w-sm flex-col items-center justify-center gap-1 rounded-2xl border p-8 text-center shadow-sm"
            >
                <div className="text-2xl font-bold">{current.word}</div>
                {current.pronounce && (
                    <div className="text-muted-foreground text-sm">
                        {current.pronounce}
                    </div>
                )}
                {current.tag && (
                    <div className="text-muted-foreground text-xs tracking-wide uppercase">
                        {current.tag}
                    </div>
                )}
                {revealed ? (
                    <div className="mt-4 space-y-1">
                        <div className="text-primary text-lg font-medium">
                            {current.translation_en}
                        </div>
                        {current.translation_bn && (
                            <div className="text-muted-foreground text-sm">
                                {current.translation_bn}
                            </div>
                        )}
                        {current.example && (
                            <div className="text-muted-foreground mt-2 text-sm italic">
                                “{current.example}”
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-muted-foreground mt-4 text-sm">
                        Zum Aufdecken tippen
                    </div>
                )}
            </button>

            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={() => advance('later')}
                    aria-label="Später"
                    className="border-destructive text-destructive bg-card flex size-14 items-center justify-center rounded-full border-2"
                >
                    <X className="size-6" />
                </button>
                <button
                    type="button"
                    onClick={() => advance('learned')}
                    aria-label="Gelernt"
                    className="bg-card flex size-14 items-center justify-center rounded-full border-2 border-emerald-600 text-emerald-600"
                >
                    <Check className="size-6" />
                </button>
            </div>
        </div>
    );
}
