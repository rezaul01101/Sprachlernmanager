import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { SpeakingGespraechPane } from '@/components/learn/speaking-gespraech-pane';
import { SpeakingNachsprechenPane } from '@/components/learn/speaking-nachsprechen-pane';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import learn from '@/routes/learn';
import type { LearnDay, SpeakingItem } from '@/types/learn';

type Level = { code: string };

export default function LessonsSpeaking({
    level,
    day,
    speakingItem,
}: {
    level: Level;
    day: LearnDay;
    speakingItem: SpeakingItem;
}) {
    const [pane, setPane] = useState<'nachsprechen' | 'gespraech'>(
        'nachsprechen',
    );

    const onComplete = () => {
        router.post(learn.lessons.complete.url([level.code, day.day_number]), {
            skill: 'sprechen',
        });
    };

    return (
        <>
            <Head title={`Sprechen — Tag ${day.day_number}`} />

            <div className="mx-auto flex max-w-2xl flex-col gap-5 p-4">
                <Tabs
                    value={pane}
                    onValueChange={(v) => setPane(v as typeof pane)}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="nachsprechen" className="flex-1">
                            Nachsprechen
                        </TabsTrigger>
                        <TabsTrigger value="gespraech" className="flex-1">
                            Gespräch
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="nachsprechen">
                        <SpeakingNachsprechenPane
                            targetSentence={speakingItem.target_sentence}
                        />
                    </TabsContent>
                    <TabsContent value="gespraech">
                        <SpeakingGespraechPane
                            aiLines={speakingItem.ai_lines.map(
                                (line) => line.text,
                            )}
                        />
                    </TabsContent>
                </Tabs>

                <Button size="lg" className="w-full" onClick={onComplete}>
                    Abschnitt abschließen
                </Button>
            </div>
        </>
    );
}
