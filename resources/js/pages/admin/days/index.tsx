import { Head, Link } from '@inertiajs/react';
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

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Focus</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dayRows.map((day) => (
                            <TableRow key={day.id}>
                                <TableCell className="font-medium">
                                    {day.day_number}
                                </TableCell>
                                <TableCell className="max-w-md truncate">
                                    {day.focus_text}
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={days.edit([level.id, day.id])}
                                        >
                                            Edit
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {dayRows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-muted-foreground text-center"
                                >
                                    No days yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
