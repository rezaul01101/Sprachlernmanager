import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import type { BreadcrumbItem } from '@/types/navigation';

type LevelRow = {
    id: number;
    code: string;
    title: string;
    sort_order: number;
    is_published: boolean;
    days_count: number;
};

export default function LevelsIndex({
    levels: levelRows,
}: {
    levels: LevelRow[];
}) {
    const moveLevel = (
        event: React.MouseEvent,
        index: number,
        direction: -1 | 1,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        const reordered = [...levelRows];
        const target = index + direction;
        if (target < 0 || target >= reordered.length) return;
        [reordered[index], reordered[target]] = [
            reordered[target],
            reordered[index],
        ];
        router.post(
            levels.reorder.url(),
            { ids: reordered.map((level) => level.id) },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Levels" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Levels"
                        description="Choose a level to manage its content."
                    />
                    <Button asChild>
                        <Link href={levels.create()}>New level</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {levelRows.map((level, index) => (
                        <Link
                            key={level.id}
                            href={days.index(level.id)}
                            className="block"
                        >
                            <Card className="group hover:border-primary relative aspect-square justify-between overflow-hidden p-5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <Badge
                                        variant={
                                            level.is_published
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {level.is_published
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
                                                levels.edit(level.id).url,
                                            );
                                        }}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                </div>

                                <div>
                                    <div className="text-4xl font-bold tracking-tight">
                                        {level.code}
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        {level.title}
                                    </div>
                                    <div className="text-muted-foreground mt-1 text-xs">
                                        {level.days_count} days
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={index === 0}
                                        onClick={(event) =>
                                            moveLevel(event, index, -1)
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={
                                            index === levelRows.length - 1
                                        }
                                        onClick={(event) =>
                                            moveLevel(event, index, 1)
                                        }
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {levelRows.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No levels yet.
                    </p>
                )}
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Levels', href: levels.index() },
];

LevelsIndex.layout = {
    breadcrumbs,
};
