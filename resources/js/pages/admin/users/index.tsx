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
import users from '@/routes/admin/users';
import type { BreadcrumbItem } from '@/types/navigation';

type UserRow = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    tokens_count: number;
    created_at: string;
};

export default function UsersIndex({ users: userRows }: { users: UserRow[] }) {
    return (
        <>
            <Head title="Learners" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Learners"
                    description="Registered accounts on the mobile app."
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Active tokens</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userRows.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.is_admin
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {user.is_admin ? 'Admin' : 'Learner'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.tokens_count}</TableCell>
                                <TableCell>
                                    {new Date(
                                        user.created_at,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={users.show(user.id)}>
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {userRows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground text-center"
                                >
                                    No users yet.
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
    { title: 'Learners', href: users.index() },
];

UsersIndex.layout = {
    breadcrumbs,
};
