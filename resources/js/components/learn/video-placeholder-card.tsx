import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLAYING_VISUAL_DURATION_MS = 1200;

export function VideoPlaceholderCard({ label }: { label: string }) {
    const [playing, setPlaying] = useState(false);

    const onClick = () => {
        if (playing) return;
        setPlaying(true);
        setTimeout(() => setPlaying(false), PLAYING_VISUAL_DURATION_MS);
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
                'bg-primary flex aspect-video w-full items-center justify-center rounded-xl transition-opacity',
                playing && 'opacity-65',
            )}
        >
            <div className="flex size-14 items-center justify-center rounded-full bg-white/25">
                <Play className="size-6 fill-white text-white" />
            </div>
        </button>
    );
}
