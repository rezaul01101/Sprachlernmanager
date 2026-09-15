import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type DayCellState = 'done' | 'current' | 'locked';

export function DayCell({
    day,
    state,
    href,
}: {
    day: number;
    state: DayCellState;
    href?: string;
}) {
    const cell = (
        <div
            className={cn(
                'flex size-12 items-center justify-center rounded-lg font-mono text-sm font-bold',
                state === 'done' && 'bg-emerald-600 text-white',
                state === 'current' &&
                    'border-primary text-primary bg-card border-2',
                state === 'locked' && 'bg-muted text-muted-foreground',
            )}
        >
            {day}
        </div>
    );

    if (state === 'locked' || !href) {
        return cell;
    }

    return <Link href={href}>{cell}</Link>;
}
