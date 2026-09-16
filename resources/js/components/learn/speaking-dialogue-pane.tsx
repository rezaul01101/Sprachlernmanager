import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Play } from 'lucide-react';
import { useSimulatedPlayback } from '@/hooks/use-simulated-playback';
import { getMatchLabel } from '@/lib/learn/get-match-label';
import { cn } from '@/lib/utils';
import type { SpeakingDialogueLine } from '@/types/learn';

const RECORD_DURATION_MS = 1800;

function DialogueLineCard({
    line,
    index,
}: {
    line: SpeakingDialogueLine;
    index: number;
}) {
    const { isPlaying, onPressAudio } = useSimulatedPlayback(900);
    const [isRecording, setIsRecording] = useState(false);
    const [matchResult, setMatchResult] = useState<{
        percent: number;
        label: string;
    } | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        },
        [],
    );

    const onPressRecord = useCallback(() => {
        if (isRecording) return;
        setMatchResult(null);
        setIsRecording(true);

        timeoutRef.current = setTimeout(() => {
            setIsRecording(false);
            const percent = 87;
            setMatchResult({ percent, label: getMatchLabel(percent) });
        }, RECORD_DURATION_MS);
    }, [isRecording]);

    const isEven = index % 2 === 0;

    return (
        <div className={cn('flex', isEven ? 'justify-start' : 'justify-end')}>
            <div
                className={cn(
                    'max-w-[85%] space-y-1.5 rounded-2xl border p-3',
                    isEven ? 'bg-muted' : 'bg-primary/5',
                )}
            >
                <div className="text-sm font-semibold">{line.german}</div>
                <div className="text-muted-foreground text-xs">
                    {line.english}
                </div>
                {line.pronounce && (
                    <div className="text-primary text-xs">{line.pronounce}</div>
                )}

                <div className="flex items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onPressAudio}
                        aria-label="Anhören"
                        className={cn(
                            'border-primary text-primary flex size-8 items-center justify-center rounded-full border-2 transition-opacity',
                            isPlaying && 'opacity-60',
                        )}
                    >
                        <Play className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={onPressRecord}
                        aria-label="Aufnehmen"
                        className={cn(
                            'bg-destructive flex size-8 items-center justify-center rounded-full text-white',
                            isRecording && 'animate-pulse',
                        )}
                    >
                        <Mic className="size-3.5" />
                    </button>
                    {matchResult && (
                        <span className="text-muted-foreground text-xs">
                            {matchResult.percent}% — {matchResult.label}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function SpeakingDialoguePane({
    dialogue,
}: {
    dialogue: SpeakingDialogueLine[];
}) {
    return (
        <div className="space-y-3">
            {dialogue.map((line, index) => (
                <DialogueLineCard key={index} line={line} index={index} />
            ))}
        </div>
    );
}
