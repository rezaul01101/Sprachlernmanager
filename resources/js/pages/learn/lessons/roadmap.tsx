import { Head } from '@inertiajs/react';
import { DayCell, type DayCellState } from '@/components/learn/day-cell';
import { getLevelVisualState } from '@/lib/learn/level-visual-state';
import learn from '@/routes/learn';
import type { LearnLevel } from '@/types/learn';

export default function LessonsRoadmap({ level }: { level: LearnLevel }) {
    const visual = getLevelVisualState(level);
    const isLevelLocked = level.status === 'locked';

    const getDayState = (day: number): DayCellState => {
        if (isLevelLocked) return 'locked';
        if (day <= level.done_days) return 'done';
        if (day === level.done_days + 1) return 'current';
        return 'locked';
    };

    return (
        <>
            <Head title={level.title} />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full border bg-white">
                        {visual.badge === 'percent' ? (
                            <span className="text-primary font-mono text-xs font-bold">
                                {visual.percent}%
                            </span>
                        ) : visual.badge === 'check' ? (
                            <span className="font-mono text-xs font-bold text-emerald-600">
                                ✓
                            </span>
                        ) : (
                            <span className="text-muted-foreground text-xs">
                                🔒
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="text-xl font-bold">{level.title}</div>
                        <div className="text-muted-foreground text-sm">
                            {isLevelLocked
                                ? 'Gesperrt'
                                : `${level.done_days} von ${level.days_count} Tagen abgeschlossen`}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {Array.from(
                        { length: level.days_count },
                        (_, i) => i + 1,
                    ).map((day) => {
                        const state = getDayState(day);

                        return (
                            <DayCell
                                key={day}
                                day={day}
                                state={state}
                                href={
                                    state === 'locked'
                                        ? undefined
                                        : learn.lessons.day.url([
                                              level.code,
                                              day,
                                          ])
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
