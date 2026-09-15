import type { LearnLevel } from '@/types/learn';

export type LevelVisualState =
    | { badge: 'check' }
    | { badge: 'percent'; percent: number }
    | { badge: 'lock' };

export function getLevelVisualState(level: LearnLevel): LevelVisualState {
    if (level.status === 'done') {
        return { badge: 'check' };
    }

    if (level.status === 'current') {
        return {
            badge: 'percent',
            percent:
                level.days_count > 0
                    ? Math.round((level.done_days / level.days_count) * 100)
                    : 0,
        };
    }

    return { badge: 'lock' };
}
