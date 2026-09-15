import { cn } from '@/lib/utils';

type Cell = { intensity: 0 | 1 | 2 | 3 | 4 };

const INTENSITY_CLASSES: Record<Cell['intensity'], string> = {
    0: 'bg-muted',
    1: 'bg-primary/20',
    2: 'bg-primary/40',
    3: 'bg-primary/70',
    4: 'bg-primary',
};

export function HeatmapGrid({
    cells,
    dayInitials,
}: {
    cells: Cell[];
    dayInitials: string[];
}) {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1.5">
                {dayInitials.map((initial, index) => (
                    <div
                        key={index}
                        className="text-muted-foreground text-center text-xs"
                    >
                        {initial}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {cells.map((cell, index) => (
                    <div
                        key={index}
                        className={cn(
                            'aspect-square rounded-md',
                            INTENSITY_CLASSES[cell.intensity],
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
