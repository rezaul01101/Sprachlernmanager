import { useCallback, useEffect, useRef, useState } from 'react';

export function useTextToSpeech(text: string, lang = 'de-DE') {
    const [isPlaying, setIsPlaying] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const isSupported =
        typeof window !== 'undefined' && 'speechSynthesis' in window;

    const onPressAudio = useCallback(() => {
        if (!isSupported) return;

        window.speechSynthesis.cancel();

        if (isPlaying) {
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isPlaying, isSupported, lang, text]);

    useEffect(
        () => () => {
            if (isSupported) window.speechSynthesis.cancel();
        },
        [isSupported],
    );

    return { isPlaying, onPressAudio, isSupported };
}
