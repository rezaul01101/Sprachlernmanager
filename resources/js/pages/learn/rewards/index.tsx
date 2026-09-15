import { Head } from '@inertiajs/react';
import { Check, Lock } from 'lucide-react';
import { StatChip } from '@/components/learn/stat-chip';
import { STATS } from '@/data/learn/stats';
import { getLevelVisualState } from '@/lib/learn/level-visual-state';
import type { LearnLevel } from '@/types/learn';

export default function LearnRewards({ levels }: { levels: LearnLevel[] }) {
    return (
        <>
            <Head title="Belohnung" />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="flex gap-3">
                    <StatChip label="Streak" value={STATS.streak} />
                    <StatChip label="Wörter" value={STATS.words} />
                    <StatChip
                        label="Genauigkeit"
                        value={`${STATS.accuracy}%`}
                    />
                </div>

                <h2 className="font-semibold">Niveau-Abzeichen</h2>

                <div className="space-y-3">
                    {levels.map((level) => {
                        const visual = getLevelVisualState(level);

                        return (
                            <div
                                key={level.code}
                                className="bg-card flex items-center gap-4 rounded-xl border p-4"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-white">
                                    {visual.badge === 'check' && (
                                        <Check className="size-4 text-emerald-600" />
                                    )}
                                    {visual.badge === 'percent' && (
                                        <span className="text-primary font-mono text-[11px] font-bold">
                                            {visual.percent}%
                                        </span>
                                    )}
                                    {visual.badge === 'lock' && (
                                        <Lock className="text-muted-foreground size-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">
                                        {level.title}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {level.status === 'done'
                                            ? `Niveau ${level.code} abgeschlossen`
                                            : level.status === 'current'
                                              ? `Niveau ${level.code} in Arbeit`
                                              : `Niveau ${level.code} gesperrt`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
