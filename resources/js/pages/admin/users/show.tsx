import { Head, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import users from '@/routes/admin/users';
import type { BreadcrumbItem } from '@/types/navigation';

type User = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    tokens_count: number;
    created_at: string;
};

export default function UserShow({ user }: { user: User }) {
    const onRevokeTokens = () => {
        if (
            confirm(
                `Revoke all active sessions for ${user.name}? They will need to log in again on every device.`,
            )
        ) {
            router.post(
                users.revokeTokens.url(user.id),
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title={user.name} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading title={user.name} description={user.email} />

                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-muted-foreground">Role</dt>
                        <dd>
                            <Badge
                                variant={
                                    user.is_admin ? 'default' : 'secondary'
                                }
                            >
                                {user.is_admin ? 'Admin' : 'Learner'}
                            </Badge>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Registered</dt>
                        <dd>
                            {new Date(user.created_at).toLocaleDateString()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Active tokens</dt>
                        <dd>{user.tokens_count}</dd>
                    </div>
                </dl>

                <Button
                    variant="destructive"
                    onClick={onRevokeTokens}
                    disabled={user.tokens_count === 0}
                >
                    Revoke all tokens
                </Button>
            </div>
        </>
    );
}

UserShow.layout = (props: { user: User }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Learners', href: users.index() },
        { title: props.user.name, href: users.show(props.user.id) },
    ] satisfies BreadcrumbItem[],
});
