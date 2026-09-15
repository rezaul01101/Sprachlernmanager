import { Link } from '@inertiajs/react';
import { Check, Lock } from 'lucide-react';
import { getLevelVisualState } from '@/lib/learn/level-visual-state';
import { cn } from '@/lib/utils';
import type { LearnLevel } from '@/types/learn';

export function LevelTile({
    level,
    href,
}: {
    level: LearnLevel;
    href: string;
}) {
    const visual = getLevelVisualState(level);

    return (
        <Link
            href={href}
            className={cn(
                'relative flex aspect-square flex-1 flex-col justify-end rounded-2xl p-4 transition-colors',
                level.status === 'done' && 'bg-emerald-600 text-white',
                level.status === 'current' &&
                    'border-primary text-primary bg-card border-2',
                level.status === 'locked' && 'bg-muted text-muted-foreground',
            )}
        >
            <div className="absolute top-3 right-3">
                {visual.badge === 'check' && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-white">
                        <Check className="size-3.5 text-emerald-600" />
                    </div>
                )}
                {visual.badge === 'percent' && (
                    <div className="text-primary rounded-full bg-white px-2 py-0.5 font-mono text-xs font-bold">
                        {visual.percent}%
                    </div>
                )}
                {visual.badge === 'lock' && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-white">
                        <Lock className="text-muted-foreground size-3.5" />
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold">{level.code}</div>
            <div className="mt-0.5 text-sm font-medium opacity-90">
                {level.title}
            </div>
        </Link>
    );
}
