import { Head } from '@inertiajs/react';
import { Check, Lock } from 'lucide-react';
import { StatChip } from '@/components/learn/stat-chip';
import { STATS } from '@/data/learn/stats';
import { getLevelVisualState } from '@/lib/learn/level-visual-state';
import type { LearnLevel } from '@/types/learn';

export default function LearnRewards({ levels }: { levels: LearnLevel[] }) {
    return (
        <>
            <Head title="Rewards" />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="flex gap-3">
                    <StatChip label="Streak" value={STATS.streak} />
                    <StatChip label="Words" value={STATS.words} />
                    <StatChip label="Accuracy" value={`${STATS.accuracy}%`} />
                </div>

                <h2 className="font-semibold">Level badges</h2>

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
                                            ? `Level ${level.code} completed`
                                            : level.status === 'current'
                                              ? `Level ${level.code} in progress`
                                              : `Level ${level.code} locked`}
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
