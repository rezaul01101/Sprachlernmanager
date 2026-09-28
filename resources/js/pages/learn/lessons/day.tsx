import { Head, Link } from '@inertiajs/react';
import { BookMarked, BookOpen, Headphones, Mic } from 'lucide-react';
import { PracticeCard } from '@/components/learn/practice-card';
import { Button } from '@/components/ui/button';
import learn from '@/routes/learn';
import type { CompletionSummary, DayProgress, LearnDay } from '@/types/learn';

type Level = { id: number; code: string; title: string };

export default function LessonsDay({
    level,
    day,
    progress,
    completionSummary,
}: {
    level: Level;
    day: LearnDay;
    progress: DayProgress;
    completionSummary: CompletionSummary;
}) {
    const hasContent = (skill: keyof DayProgress) =>
        completionSummary.requiredSkills.includes(skill);

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number}`} />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
                    <span className="text-primary font-mono text-xs font-bold">
                        {level.code}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        Today's focus
                    </span>
                </div>

                <p className="text-base">{day.focus_text}</p>

                <p className="text-muted-foreground text-sm">
                    {completionSummary.doneCount} of{' '}
                    {completionSummary.requiredSkills.length} sections completed
                </p>

                <div className="space-y-3">
                    <PracticeCard
                        icon={BookMarked}
                        title="Vocabulary"
                        subtitle={
                            hasContent('wortschatz')
                                ? 'Learn new words'
                                : 'Not available yet'
                        }
                        done={progress.wortschatz}
                        href={
                            hasContent('wortschatz')
                                ? learn.lessons.vocab.url([
                                      level.code,
                                      day.day_number,
                                  ])
                                : undefined
                        }
                    />
                    <PracticeCard
                        icon={Headphones}
                        title="Listening"
                        subtitle={
                            hasContent('hoeren')
                                ? 'Audio or video'
                                : 'Not available yet'
                        }
                        done={progress.hoeren}
                        href={
                            hasContent('hoeren')
                                ? learn.lessons.listening.url([
                                      level.code,
                                      day.day_number,
                                  ])
                                : undefined
                        }
                    />
                    <PracticeCard
                        icon={BookOpen}
                        title="Reading"
                        subtitle={
                            hasContent('lesen')
                                ? 'Understand a short text'
                                : 'Not available yet'
                        }
                        done={progress.lesen}
                        href={
                            hasContent('lesen')
                                ? learn.lessons.reading.url([
                                      level.code,
                                      day.day_number,
                                  ])
                                : undefined
                        }
                    />
                    <PracticeCard
                        icon={Mic}
                        title="Speaking"
                        subtitle={
                            hasContent('sprechen')
                                ? 'Repeat & dialogue'
                                : 'Not available yet'
                        }
                        done={progress.sprechen}
                        href={
                            hasContent('sprechen')
                                ? learn.lessons.speaking.url([
                                      level.code,
                                      day.day_number,
                                  ])
                                : undefined
                        }
                    />
                </div>

                {completionSummary.isDayComplete && (
                    <Button asChild size="lg" className="w-full">
                        <Link href={learn.lessons.roadmap.url(level.code)}>
                            Back to overview
                        </Link>
                    </Button>
                )}
            </div>
        </>
    );
}
