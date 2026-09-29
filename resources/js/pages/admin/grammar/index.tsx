import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import { richTextClasses } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import grammars from '@/routes/admin/grammars';
import type { BreadcrumbItem } from '@/types/navigation';

type GrammarRow = {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
};

export default function GrammarIndex({
    grammars: rows,
}: {
    grammars: GrammarRow[];
}) {
    return (
        <>
            <Head title="Grammar" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Grammar"
                        description="Grammar topics and explanations."
                    />
                    <Button asChild>
                        <Link href={grammars.create()}>New grammar</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {rows.map((grammar) => (
                        <Card key={grammar.id} className="gap-2 p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="text-lg font-semibold">
                                    {grammar.title}
                                </h2>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 shrink-0"
                                >
                                    <Link
                                        href={grammars.edit(grammar.id)}
                                        aria-label={`Edit ${grammar.title}`}
                                    >
                                        <Pencil className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                            {grammar.image_url && (
                                <img
                                    src={grammar.image_url}
                                    alt=""
                                    className="h-32 w-full rounded-lg object-cover"
                                />
                            )}
                            {grammar.description && (
                                // Server-side sanitised to the editor's tag allowlist.
                                <div
                                    className={`text-muted-foreground line-clamp-6 text-sm ${richTextClasses}`}
                                    dangerouslySetInnerHTML={{
                                        __html: grammar.description,
                                    }}
                                />
                            )}
                        </Card>
                    ))}
                </div>

                {rows.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No grammar topics yet.
                    </p>
                )}
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Grammar', href: grammars.index() },
];

GrammarIndex.layout = {
    breadcrumbs,
};
