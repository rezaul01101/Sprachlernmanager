import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import levels from '@/routes/admin/levels';
import { dashboard } from '@/routes';
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
    const moveLevel = (index: number, direction: -1 | 1) => {
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
                        description="Manage the CEFR levels learners progress through."
                    />
                    <Button asChild>
                        <Link href={levels.create()}>New level</Link>
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {levelRows.map((level, index) => (
                            <TableRow key={level.id}>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6"
                                            disabled={index === 0}
                                            onClick={() => moveLevel(index, -1)}
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6"
                                            disabled={
                                                index === levelRows.length - 1
                                            }
                                            onClick={() => moveLevel(index, 1)}
                                        >
                                            ↓
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {level.code}
                                </TableCell>
                                <TableCell>{level.title}</TableCell>
                                <TableCell>{level.days_count}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                    >
                                        <Link
                                            href={levels.days.index(level.id)}
                                        >
                                            Days
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={levels.edit(level.id)}>
                                            Edit
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {levelRows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground text-center"
                                >
                                    No levels yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
