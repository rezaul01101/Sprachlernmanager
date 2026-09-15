import { Link } from '@inertiajs/react';
import {
    Award,
    GraduationCap,
    Home as HomeIcon,
    TrendingUp,
    User as UserIcon,
    Video,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import learn from '@/routes/learn';
import type { NavItem } from '@/types';

const bottomNavItems: (NavItem & { matchStartsWith?: boolean })[] = [
    { title: 'Home', href: dashboard(), icon: HomeIcon },
    {
        title: 'Lektionen',
        href: learn.lessons.index(),
        icon: GraduationCap,
        matchStartsWith: true,
    },
    { title: 'Videos', href: learn.videos(), icon: Video },
    { title: 'Belohnung', href: learn.rewards(), icon: Award },
    { title: 'Fortschritt', href: learn.progress(), icon: TrendingUp },
    { title: 'Profil', href: learn.profile(), icon: UserIcon },
];

export function LearnBottomNav() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <nav
            className="bg-background/95 border-sidebar-border/80 supports-[backdrop-filter]:bg-background/80 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="mx-auto grid max-w-2xl grid-cols-6">
                {bottomNavItems.map((item) => {
                    const active = isCurrentUrl(
                        item.href,
                        undefined,
                        item.matchStartsWith,
                    );

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            title={item.title}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                                active
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {item.icon && (
                                <item.icon
                                    className="size-5"
                                    strokeWidth={active ? 2.5 : 2}
                                />
                            )}
                            <span className="max-w-full truncate px-0.5 leading-none">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
