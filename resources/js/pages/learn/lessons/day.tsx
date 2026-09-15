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
            <Head title={`${level.code} — Tag ${day.day_number}`} />

            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div className="bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
                    <span className="text-primary font-mono text-xs font-bold">
                        {level.code}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        Heutiger Fokus
                    </span>
                </div>

                <p className="text-base">{day.focus_text}</p>

                <p className="text-muted-foreground text-sm">
                    {completionSummary.doneCount} von{' '}
                    {completionSummary.requiredSkills.length} Abschnitten
                    abgeschlossen
                </p>

                <div className="space-y-3">
                    <PracticeCard
                        icon={BookMarked}
                        title="Wortschatz"
                        subtitle={
                            hasContent('wortschatz')
                                ? 'Neue Wörter lernen'
                                : 'Noch nicht verfügbar'
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
                        title="Hören"
                        subtitle={
                            hasContent('hoeren')
                                ? 'Audio oder Video'
                                : 'Noch nicht verfügbar'
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
                        title="Lesen"
                        subtitle={
                            hasContent('lesen')
                                ? 'Kurztext verstehen'
                                : 'Noch nicht verfügbar'
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
                        title="Sprechen"
                        subtitle={
                            hasContent('sprechen')
                                ? 'Nachsprechen & Dialog'
                                : 'Noch nicht verfügbar'
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
                            Zurück zur Übersicht
                        </Link>
                    </Button>
                )}
            </div>
        </>
    );
}
