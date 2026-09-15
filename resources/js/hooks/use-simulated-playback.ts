import { useCallback, useEffect, useRef, useState } from 'react';

export function useSimulatedPlayback(durationMs = 900) {
    const [isPlaying, setIsPlaying] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onPressAudio = useCallback(() => {
        if (isPlaying) return;
        setIsPlaying(true);
        timeoutRef.current = setTimeout(() => setIsPlaying(false), durationMs);
    }, [isPlaying, durationMs]);

    useEffect(
        () => () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        },
        [],
    );

    return { isPlaying, onPressAudio };
}
