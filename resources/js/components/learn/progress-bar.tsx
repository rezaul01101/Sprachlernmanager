import { cn } from '@/lib/utils';

export function ProgressBar({
    value,
    className,
}: {
    value: number;
    className?: string;
}) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
                'bg-muted h-2 w-full overflow-hidden rounded-full',
                className,
            )}
        >
            <div
                className={cn(
                    'h-full rounded-full transition-all',
                    clamped >= 100 ? 'bg-emerald-600' : 'bg-primary',
                )}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
