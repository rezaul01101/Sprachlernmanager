import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import speaking from '@/routes/admin/levels/speaking';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
    title: string;
};

type Day = {
    id: number;
    day_number: number;
    speaking_item_exists: boolean;
};

export default function SpeakingIndex({
    level,
    days,
}: {
    level: Level;
    days: Day[];
}) {
    return (
        <>
            <Head title={`${level.code} — Sprechen`} />

            <div className="space-y-6 p-4">
                <Heading
                    title={`${level.code} — Sprechen`}
                    description="Choose a day to manage its speaking exercise."
                />

                <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
                    {days.map((day) => (
                        <Link
                            key={day.id}
                            href={speaking.edit([level.id, day.id])}
                            className={`hover:border-primary flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border text-sm font-medium transition-colors ${
                                day.speaking_item_exists
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-input'
                            }`}
                        >
                            <span>{day.day_number}</span>
                            <span className="text-muted-foreground text-[10px]">
                                {day.speaking_item_exists ? 'Set' : '—'}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

SpeakingIndex.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        { title: 'Sprechen', href: speaking.index(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
