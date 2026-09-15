import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Play } from 'lucide-react';
import { useSimulatedPlayback } from '@/hooks/use-simulated-playback';
import { getMatchLabel } from '@/lib/learn/get-match-label';
import { cn } from '@/lib/utils';

const RECORD_DURATION_MS = 1800;

export function SpeakingNachsprechenPane({
    targetSentence,
}: {
    targetSentence: string;
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

    return (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
            <div className="max-w-sm text-lg font-semibold">
                {targetSentence}
            </div>

            <button
                type="button"
                onClick={onPressAudio}
                aria-label="Beispiel anhören"
                className={cn(
                    'border-primary text-primary flex size-11 items-center justify-center rounded-full border-2 transition-opacity',
                    isPlaying && 'opacity-60',
                )}
            >
                <Play className="size-5" />
            </button>

            <button
                type="button"
                onClick={onPressRecord}
                aria-label="Aufnehmen"
                className={cn(
                    'bg-destructive flex size-[88px] items-center justify-center rounded-full text-white',
                    isRecording && 'animate-pulse',
                )}
            >
                <Mic className="size-8" />
            </button>

            {matchResult && (
                <div className="w-full max-w-xs space-y-2">
                    <div className="text-primary font-mono text-3xl font-bold">
                        {matchResult.percent}%
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                        <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${matchResult.percent}%` }}
                        />
                    </div>
                    <div className="text-muted-foreground text-sm">
                        {matchResult.label}
                    </div>
                </div>
            )}
        </div>
    );
}
