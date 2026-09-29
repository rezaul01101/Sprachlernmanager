import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { richTextClasses } from '@/components/rich-text-editor';
import learn from '@/routes/learn';
import type { GrammarDetail } from '@/types/learn';

export default function LearnGrammarShow({
    grammar,
}: {
    grammar: GrammarDetail;
}) {
    return (
        <>
            <Head title={grammar.title} />

            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <Link
                    href={learn.grammar.index()}
                    className="text-muted-foreground inline-flex items-center gap-1 text-sm"
                >
                    <ChevronLeft className="size-4" />
                    Grammar
                </Link>

                {grammar.image_url && (
                    <img
                        src={grammar.image_url}
                        alt=""
                        className="max-h-72 w-full rounded-xl border object-cover"
                    />
                )}

                <h1 className="text-2xl font-bold">{grammar.title}</h1>

                {grammar.description ? (
                    // Server-side sanitised to the editor's tag allowlist.
                    <div
                        className={richTextClasses}
                        dangerouslySetInnerHTML={{
                            __html: grammar.description,
                        }}
                    />
                ) : (
                    <p className="text-muted-foreground text-sm">
                        No details yet.
                    </p>
                )}
            </div>
        </>
    );
}
