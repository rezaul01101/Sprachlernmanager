import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { SpeakButton } from '@/components/learn/speak-button';
import { REFERENCE_SECTIONS } from '@/data/learn/reference';
import { dashboard } from '@/routes';
import type { ReferenceTopic } from '@/types/learn';

export default function LearnReference({ topic }: { topic: ReferenceTopic }) {
    const section = REFERENCE_SECTIONS[topic];

    return (
        <>
            <Head title={section.title} />

            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <div className="space-y-1">
                    <Link
                        href={dashboard()}
                        className="text-muted-foreground inline-flex items-center gap-1 text-sm"
                    >
                        <ChevronLeft className="size-4" />
                        Home
                    </Link>
                    <h1 className="text-xl font-bold">{section.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        {section.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {section.entries.map((entry) => (
                        <div
                            key={entry.display}
                            className="bg-card flex flex-col items-center gap-1 rounded-xl border p-3 text-center"
                        >
                            <div className="font-semibold">{entry.display}</div>
                            <div className="text-muted-foreground font-mono text-xs">
                                {entry.pronounce}
                            </div>
                            {entry.meaning && (
                                <div className="text-primary text-xs">
                                    {entry.meaning}
                                </div>
                            )}
                            <SpeakButton
                                text={entry.spoken}
                                className="mt-1 size-8"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
