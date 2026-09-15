import { Head } from '@inertiajs/react';
import { BookMarked } from 'lucide-react';
import Heading from '@/components/heading';
import ListeningItemsEditor, {
    type ListeningItemForm,
} from '@/components/listening-items-editor';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import listening from '@/routes/admin/levels/listening';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
};

type Day = {
    id: number;
    day_number: number;
};

export default function ListeningEdit({
    level,
    day,
    items,
    cards,
}: {
    level: Level;
    day: Day;
    items: ListeningItemForm[];
    cards: VocabCardForm[];
}) {
    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Hören`} />

            <div className="max-w-6xl space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title={`Day ${day.day_number} — Hören`}
                        description={`${level.code} · ${items.length} video${items.length === 1 ? '' : 's'}`}
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                title="Vocabulary"
                            >
                                <BookMarked className="size-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
                            <DialogHeader>
                                <DialogTitle>Vocabulary</DialogTitle>
                                <DialogDescription>
                                    This day's vocab cards — shared with the
                                    Vocab module.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-1">
                                <VocabCardsEditor
                                    level={level}
                                    day={day}
                                    cards={cards}
                                    saveLabel="Save vocab"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <ListeningItemsEditor level={level} day={day} items={items} />
            </div>
        </>
    );
}

ListeningEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
        {
            title: 'Hören',
            href: listening.edit([props.level.id, props.day.id]),
        },
    ] satisfies BreadcrumbItem[],
});
