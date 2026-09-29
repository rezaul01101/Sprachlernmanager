import { Head, Link } from '@inertiajs/react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { dashboard } from '@/routes';
import learn from '@/routes/learn';
import type { GrammarSummary } from '@/types/learn';

export default function LearnGrammarIndex({
    grammars,
}: {
    grammars: GrammarSummary[];
}) {
    return (
        <>
            <Head title="Grammar" />

            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <div className="space-y-1">
                    <Link
                        href={dashboard()}
                        className="text-muted-foreground inline-flex items-center gap-1 text-sm"
                    >
                        <ChevronLeft className="size-4" />
                        Home
                    </Link>
                    <h1 className="text-xl font-bold">Grammar</h1>
                    <p className="text-muted-foreground text-sm">
                        Tap a topic to read the explanation
                    </p>
                </div>

                {grammars.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        No grammar topics yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {grammars.map((grammar) => (
                            <Link
                                key={grammar.id}
                                href={learn.grammar.show(grammar.id)}
                                className="bg-card hover:bg-muted overflow-hidden rounded-xl border transition-colors"
                            >
                                {grammar.image_url ? (
                                    <img
                                        src={grammar.image_url}
                                        alt=""
                                        className="aspect-[4/3] w-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-muted text-muted-foreground flex aspect-[4/3] w-full items-center justify-center">
                                        <BookOpen className="size-8" />
                                    </div>
                                )}
                                <div className="p-3 text-sm font-semibold">
                                    {grammar.title}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
