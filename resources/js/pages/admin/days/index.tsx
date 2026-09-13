import { Head, Link, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
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
};

export default function DaysIndex({
    level,
    days: dayRows,
}: {
    level: Level;
    days: Day[];
}) {
    return (
        <>
            <Head title={`${level.code} days`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`${level.code} — Days`}
                        description={level.title}
                    />
                    <Button asChild>
                        <Link href={days.create(level.id)}>New day</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {dayRows.map((day) => (
                        <Link
                            key={day.id}
                            href={days.show([level.id, day.id])}
                            className="block"
                        >
                            <Card className="group hover:border-primary relative aspect-square justify-between overflow-hidden p-4 transition-colors">
                                <div className="flex items-start justify-between">
                                    <Badge
                                        variant={
                                            day.is_published
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {day.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 opacity-0 group-hover:opacity-100"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            router.visit(
                                                days.edit([level.id, day.id])
                                                    .url,
                                            );
                                        }}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                </div>

                                <div>
                                    <div className="text-3xl font-bold tracking-tight">
                                        {day.day_number}
                                    </div>
                                    <div className="text-muted-foreground line-clamp-2 text-sm">
                                        {day.focus_text}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {dayRows.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No days yet.
                    </p>
                )}
            </div>
        </>
    );
}

DaysIndex.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
