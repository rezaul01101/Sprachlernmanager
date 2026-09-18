import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { cn } from '@/lib/utils';

export function SpeakButton({
    text,
    lang = 'de-DE',
    className,
}: {
    text: string;
    lang?: string;
    className?: string;
}) {
    const { isPlaying, onPressAudio, isSupported } = useTextToSpeech(
        text,
        lang,
    );

    if (!isSupported) return null;

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onPressAudio}
            aria-label={isPlaying ? 'Stopp' : 'Vorlesen'}
            className={cn('shrink-0', className)}
        >
            {isPlaying ? (
                <VolumeX className="size-4" />
            ) : (
                <Volume2 className="size-4" />
            )}
        </Button>
    );
}
