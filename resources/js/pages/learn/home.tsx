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
    const firstName = auth.user?.name?.trim().split(' ')[0] || 'Learner';

    if (!currentLevel || !currentDayNumber || !progress || !completionSummary) {
        return (
            <>
                <Head title="Home" />
                <div className="mx-auto max-w-2xl space-y-4 p-4 text-center">
                    <h1 className="text-2xl font-bold">
                        Welcome, {firstName}!
                    </h1>
                    <p className="text-muted-foreground">
                        No levels available yet. Check back soon.
                    </p>
                    <Button asChild>
                        <Link href={learn.lessons.index()}>View lessons</Link>
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
                        🔥 {STATS.streak} days
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Welcome,{' '}
                            <span className="text-primary">{firstName}!</span>{' '}
                            👋
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Let's practice German today.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Today's practice</h2>
                        <div className="bg-muted text-primary rounded-full px-2.5 py-1 font-mono text-xs font-bold">
                            {currentLevel.code} · Day {currentDayNumber}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <PracticeCard
                            icon={BookMarked}
                            title="Vocabulary"
                            subtitle="Learn new words"
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
                            title="Listening"
                            subtitle="Audio or video"
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
                            title="Reading"
                            subtitle="Understand a short text"
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
                            title="Speaking"
                            subtitle="Repeat & dialogue"
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
