import { Head, Link } from '@inertiajs/react';
import { BookMarked, BookOpen, Headphones, Mic, Settings } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import listening from '@/routes/admin/levels/listening';
import reading from '@/routes/admin/levels/reading';
import speaking from '@/routes/admin/levels/speaking';
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
    focus_text: string;
    is_published: boolean;
    vocab_cards_count: number;
    listening_item_exists: boolean;
    reading_item_exists: boolean;
    speaking_item_exists: boolean;
};

export default function DayShow({ level, day }: { level: Level; day: Day }) {
    const modules = [
        {
            key: 'vocab',
            label: 'Vocab',
            icon: BookMarked,
            href: vocab.edit([level.id, day.id]),
            status:
                day.vocab_cards_count > 0
                    ? `${day.vocab_cards_count} card${day.vocab_cards_count === 1 ? '' : 's'}`
                    : 'No cards yet',
            filled: day.vocab_cards_count > 0,
        },
        {
            key: 'listen',
            label: 'Hören',
            icon: Headphones,
            href: listening.edit([level.id, day.id]),
            status: day.listening_item_exists ? 'Added' : 'Not added',
            filled: day.listening_item_exists,
        },
        {
            key: 'read',
            label: 'Lesen',
            icon: BookOpen,
            href: reading.edit([level.id, day.id]),
            status: day.reading_item_exists ? 'Added' : 'Not added',
            filled: day.reading_item_exists,
        },
        {
            key: 'speak',
            label: 'Sprechen',
            icon: Mic,
            href: speaking.edit([level.id, day.id]),
            status: day.speaking_item_exists ? 'Added' : 'Not added',
            filled: day.speaking_item_exists,
        },
    ] as const;

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`${level.code} — Day ${day.day_number}`}
                        description={day.focus_text}
                    />
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={day.is_published ? 'default' : 'secondary'}
                        >
                            {day.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Button asChild variant="outline">
                            <Link href={days.edit([level.id, day.id])}>
                                <Settings className="size-4" />
                                Day settings
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {modules.map((module) => {
                        const Icon = module.icon;

                        return (
                            <Link key={module.key} href={module.href}>
                                <Card
                                    className={`hover:border-primary aspect-square items-center justify-center gap-3 p-5 text-center transition-colors ${
                                        module.filled
                                            ? 'border-primary/50 bg-primary/5'
                                            : ''
                                    }`}
                                >
                                    <Icon className="size-8" />
                                    <div className="font-medium">
                                        {module.label}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {module.status}
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

DayShow.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
    ] satisfies BreadcrumbItem[],
});
