import { Head } from '@inertiajs/react';
import { HeatmapGrid } from '@/components/learn/heatmap-grid';
import { ProgressBar } from '@/components/learn/progress-bar';
import { StatChip } from '@/components/learn/stat-chip';
import { HEATMAP_CELLS, HEATMAP_DAY_INITIALS } from '@/data/learn/heatmap';
import { STATS } from '@/data/learn/stats';
import type { LearnLevel } from '@/types/learn';

export default function LearnProgress({ levels }: { levels: LearnLevel[] }) {
    return (
        <>
            <Head title="Fortschritt" />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="flex gap-3">
                    <StatChip label="Streak" value={STATS.streak} />
                    <StatChip label="Wörter" value={STATS.words} />
                    <StatChip
                        label="Genauigkeit"
                        value={`${STATS.accuracy}%`}
                    />
                </div>

                <div className="space-y-3">
                    <h2 className="font-semibold">Niveau-Fortschritt</h2>
                    {levels.map((level) => {
                        const pct =
                            level.days_count > 0
                                ? (level.done_days / level.days_count) * 100
                                : 0;

                        return (
                            <div key={level.code} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                        {level.title}
                                    </span>
                                    <span className="text-muted-foreground font-mono text-xs">
                                        {Math.round(pct)}%
                                    </span>
                                </div>
                                <ProgressBar value={pct} />
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    <h2 className="font-semibold">Letzte 4 Wochen</h2>
                    <HeatmapGrid
                        cells={HEATMAP_CELLS}
                        dayInitials={HEATMAP_DAY_INITIALS}
                    />
                </div>
            </div>
        </>
    );
}
