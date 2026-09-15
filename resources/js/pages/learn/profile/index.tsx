import { Head, Link, router, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { StatChip } from '@/components/learn/stat-chip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { STATS } from '@/data/learn/stats';
import { useInitials } from '@/hooks/use-initials';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

export default function LearnProfile() {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    return (
        <>
            <Head title="Profil" />

            <div className="mx-auto max-w-md space-y-6 p-4">
                <div className="flex flex-col items-center gap-1">
                    <Avatar className="mb-2 size-20">
                        <AvatarImage
                            src={auth.user?.avatar}
                            alt={auth.user?.name}
                        />
                        <AvatarFallback className="text-lg">
                            {getInitials(auth.user?.name ?? '')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-lg font-semibold">
                        {auth.user?.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                        {auth.user?.email}
                    </div>
                </div>

                <div className="flex gap-3">
                    <StatChip label="Streak" value={STATS.streak} />
                    <StatChip label="Wörter" value={STATS.words} />
                    <StatChip
                        label="Genauigkeit"
                        value={`${STATS.accuracy}%`}
                    />
                </div>

                <div className="space-y-2">
                    <Link
                        href={edit()}
                        className="bg-card flex items-center gap-3 rounded-xl border p-4 text-sm font-medium"
                    >
                        <Settings className="size-5" />
                        Einstellungen
                    </Link>

                    <Link
                        href={logout()}
                        as="button"
                        onClick={() => router.flushAll()}
                        className="text-destructive bg-card w-full rounded-xl border p-4 text-left text-sm font-medium"
                    >
                        Abmelden
                    </Link>
                </div>
            </div>
        </>
    );
}
