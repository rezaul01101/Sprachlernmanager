import { Head, Link, usePage } from '@inertiajs/react';
import { BookMarked, BookOpen, Headphones, Mic } from 'lucide-react';
import { PracticeCard } from '@/components/learn/practice-card';
import { Button } from '@/components/ui/button';
import { STATS } from '@/data/learn/stats';
import learn from '@/routes/learn';
import type { CompletionSummary, DayProgress, LearnLevel } from '@/types/learn';

export default function LearnHome({
    currentLevel,
    currentDayNumber,
    progress,
    completionSummary,
}: {
    currentLevel: LearnLevel | null;
    currentDayNumber: number | null;
    progress: DayProgress | null;
    completionSummary: CompletionSummary | null;
}) {
    const { auth } = usePage().props;
    const firstName = auth.user?.name?.trim().split(' ')[0] || 'Lerner';

    if (!currentLevel || !currentDayNumber || !progress || !completionSummary) {
        return (
            <>
                <Head title="Home" />
                <div className="mx-auto max-w-2xl space-y-4 p-4 text-center">
                    <h1 className="text-2xl font-bold">
                        Willkommen, {firstName}!
                    </h1>
                    <p className="text-muted-foreground">
                        Es sind noch keine Niveaus verfügbar. Schau bald wieder
                        vorbei.
                    </p>
                    <Button asChild>
                        <Link href={learn.lessons.index()}>
                            Lektionen ansehen
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    const hasContent = (skill: keyof DayProgress) =>
        completionSummary.requiredSkills.includes(skill);

    return (
        <>
            <Head title="Home" />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="space-y-3 rounded-2xl border p-5">
                    <div className="bg-foreground text-background inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                        🔥 {STATS.streak} Tage
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Willkommen,{' '}
                            <span className="text-primary">{firstName}!</span>{' '}
                            👋
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Lass uns heute Deutsch üben.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Heutige Übung</h2>
                        <div className="bg-muted text-primary rounded-full px-2.5 py-1 font-mono text-xs font-bold">
                            {currentLevel.code} · Tag {currentDayNumber}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <PracticeCard
                            icon={BookMarked}
                            title="Wortschatz"
                            subtitle="Neue Wörter lernen"
                            done={progress.wortschatz}
                            href={
                                hasContent('wortschatz')
                                    ? learn.lessons.vocab.url([
                                          currentLevel.code,
                                          currentDayNumber,
                                      ])
                                    : undefined
                            }
                        />
                        <PracticeCard
                            icon={Headphones}
                            title="Hören"
                            subtitle="Audio oder Video"
                            done={progress.hoeren}
                            href={
                                hasContent('hoeren')
                                    ? learn.lessons.listening.url([
                                          currentLevel.code,
                                          currentDayNumber,
                                      ])
                                    : undefined
                            }
                        />
                        <PracticeCard
                            icon={BookOpen}
                            title="Lesen"
                            subtitle="Kurztext verstehen"
                            done={progress.lesen}
                            href={
                                hasContent('lesen')
                                    ? learn.lessons.reading.url([
                                          currentLevel.code,
                                          currentDayNumber,
                                      ])
                                    : undefined
                            }
                        />
                        <PracticeCard
                            icon={Mic}
                            title="Sprechen"
                            subtitle="Nachsprechen & Dialog"
                            done={progress.sprechen}
                            href={
                                hasContent('sprechen')
                                    ? learn.lessons.speaking.url([
                                          currentLevel.code,
                                          currentDayNumber,
                                      ])
                                    : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
