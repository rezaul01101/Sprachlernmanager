import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import reading from '@/routes/admin/levels/reading';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
    title: string;
};

type Day = {
    id: number;
    day_number: number;
    reading_item_exists: boolean;
};

export default function ReadingIndex({
    level,
    days,
}: {
    level: Level;
    days: Day[];
}) {
    return (
        <>
            <Head title={`${level.code} — Lesen`} />

            <div className="space-y-6 p-4">
                <Heading
                    title={`${level.code} — Lesen`}
                    description="Choose a day to manage its reading exercise."
                />

                <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
                    {days.map((day) => (
                        <Link
                            key={day.id}
                            href={reading.edit([level.id, day.id])}
                            className={`hover:border-primary flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border text-sm font-medium transition-colors ${
                                day.reading_item_exists
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-input'
                            }`}
                        >
                            <span>{day.day_number}</span>
                            <span className="text-muted-foreground text-[10px]">
                                {day.reading_item_exists ? 'Set' : '—'}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

ReadingIndex.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        { title: 'Lesen', href: reading.index(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
