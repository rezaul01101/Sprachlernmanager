import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    done: boolean;
    href?: string;
};

export function PracticeCard({
    icon: Icon,
    title,
    subtitle,
    done,
    href,
}: Props) {
    const body = (
        <div
            className={cn(
                'bg-card flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors',
                href ? 'hover:border-primary/50' : 'opacity-60',
            )}
        >
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-primary size-5" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-muted-foreground text-xs">{subtitle}</div>
            </div>
            <div
                className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                    done
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-muted-foreground/30',
                )}
            >
                {done && <Check className="size-3.5 text-white" />}
            </div>
        </div>
    );

    if (!href) {
        return <div className="cursor-not-allowed">{body}</div>;
    }

    return (
        <Link href={href} className="block">
            {body}
        </Link>
    );
}
