import { Head } from '@inertiajs/react';
import { LevelTile } from '@/components/learn/level-tile';
import learn from '@/routes/learn';
import type { LearnLevel } from '@/types/learn';

export default function LessonsIndex({ levels }: { levels: LearnLevel[] }) {
    const rows: LearnLevel[][] = [];
    for (let i = 0; i < levels.length; i += 2) {
        rows.push(levels.slice(i, i + 2));
    }

    return (
        <>
            <Head title="Lektionen" />

            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <p className="text-muted-foreground text-sm">
                    Wählen Sie Ihr Niveau
                </p>

                <div className="space-y-4">
                    {rows.map((row) => (
                        <div
                            key={row.map((level) => level.code).join('-')}
                            className="flex gap-4"
                        >
                            {row.map((level) => (
                                <LevelTile
                                    key={level.code}
                                    level={level}
                                    href={learn.lessons.roadmap.url(level.code)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
