import { Head, Link } from '@inertiajs/react';
import { BookMarked, BookOpen, Headphones, Mic } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import vocab from '@/routes/admin/levels/vocab';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
    title: string;
    description: string | null;
    is_published: boolean;
};

export default function LevelShow({ level }: { level: Level }) {
    const skills = [
        {
            key: 'vocab',
            label: 'Vocab',
            icon: BookMarked,
            href: vocab.index(level.id),
            enabled: true,
        },
        {
            key: 'listen',
            label: 'Hören',
            icon: Headphones,
            href: null,
            enabled: false,
        },
        {
            key: 'read',
            label: 'Lesen',
            icon: BookOpen,
            href: null,
            enabled: false,
        },
        {
            key: 'speak',
            label: 'Sprechen',
            icon: Mic,
            href: null,
            enabled: false,
        },
    ] as const;

    return (
        <>
            <Head title={level.code} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`${level.code} — ${level.title}`}
                        description={level.description ?? undefined}
                    />
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                level.is_published ? 'default' : 'secondary'
                            }
                        >
                            {level.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Button asChild variant="outline">
                            <Link href={levels.edit(level.id)}>Edit level</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {skills.map((skill) => {
                        const Icon = skill.icon;
                        const content = (
                            <Card
                                className={`aspect-square items-center justify-center gap-3 p-5 text-center transition-colors ${
                                    skill.enabled
                                        ? 'hover:border-primary'
                                        : 'opacity-50'
                                }`}
                            >
                                <Icon className="size-8" />
                                <div className="font-medium">{skill.label}</div>
                                {!skill.enabled && (
                                    <Badge variant="secondary">
                                        Bald verfügbar
                                    </Badge>
                                )}
                            </Card>
                        );

                        return skill.enabled && skill.href ? (
                            <Link key={skill.key} href={skill.href}>
                                {content}
                            </Link>
                        ) : (
                            <div key={skill.key}>{content}</div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

LevelShow.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: levels.show(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
