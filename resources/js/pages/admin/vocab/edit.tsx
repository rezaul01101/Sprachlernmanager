import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import vocab from '@/routes/admin/levels/vocab';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
};

type Day = {
    id: number;
    day_number: number;
};

export default function VocabEdit({
    level,
    day,
    cards,
}: {
    level: Level;
    day: Day;
    cards: VocabCardForm[];
}) {
    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Vocab`} />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Vocab`}
                    description={`${level.code} · ${cards.length} card${cards.length === 1 ? '' : 's'}`}
                />

                <VocabCardsEditor level={level} day={day} cards={cards} />
            </div>
        </>
    );
}

VocabEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
        { title: 'Vocab', href: vocab.edit([props.level.id, props.day.id]) },
    ] satisfies BreadcrumbItem[],
});
