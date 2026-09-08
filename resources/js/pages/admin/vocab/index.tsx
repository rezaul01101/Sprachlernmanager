import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import vocab from '@/routes/admin/levels/vocab';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
    title: string;
};

type Day = {
    id: number;
    day_number: number;
    vocab_cards_count: number;
};

export default function VocabIndex({
    level,
    days,
}: {
    level: Level;
    days: Day[];
}) {
    return (
        <>
            <Head title={`${level.code} — Vocab`} />

            <div className="space-y-6 p-4">
                <Heading
                    title={`${level.code} — Vocab`}
                    description="Choose a day to manage its vocabulary deck."
                />

                <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
                    {days.map((day) => (
                        <Link
                            key={day.id}
                            href={vocab.edit([level.id, day.id])}
                            className={`hover:border-primary flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border text-sm font-medium transition-colors ${
                                day.vocab_cards_count > 0
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-input'
                            }`}
                        >
                            <span>{day.day_number}</span>
                            <span className="text-muted-foreground text-[10px]">
                                {day.vocab_cards_count > 0
                                    ? `${day.vocab_cards_count} cards`
                                    : '—'}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

VocabIndex.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: levels.show(props.level.id) },
        { title: 'Vocab', href: vocab.index(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
