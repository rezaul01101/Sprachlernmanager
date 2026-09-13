import { Head, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import speaking from '@/routes/admin/levels/speaking';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
};

type Day = {
    id: number;
    day_number: number;
};

type SpeakingForm = {
    target_sentence: string;
    ai_lines: string[];
};

type SpeakingItem = {
    target_sentence: string;
    ai_lines: { text: string }[];
};

const emptyForm = (): SpeakingForm => ({
    target_sentence: '',
    ai_lines: [''],
});

/** Same client-side-only parsing approach as the vocab importer — see admin/vocab/edit.tsx. */
function parseSpeakingInput(text: string): SpeakingForm {
    const trimmed = text.trim();
    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(
        `"use strict"; return (${trimmed});`,
    )() as unknown;
    const item = (value ?? {}) as Record<string, unknown>;

    const asString = (input: unknown): string =>
        typeof input === 'string' ? input : '';
    const targetSentence = asString(item.target_sentence);

    if (!targetSentence) {
        throw new Error('Expected a "target_sentence" field.');
    }

    const lines = Array.isArray(item.ai_lines) ? item.ai_lines : [];

    return {
        target_sentence: targetSentence,
        ai_lines: lines.map((line) =>
            typeof line === 'string'
                ? line
                : asString((line as Record<string, unknown>)?.text),
        ),
    };
}

export default function SpeakingEdit({
    level,
    day,
    item,
    cards,
}: {
    level: Level;
    day: Day;
    item: SpeakingItem | null;
    cards: VocabCardForm[];
}) {
    const [form, setForm] = useState<SpeakingForm>(
        item
            ? {
                  target_sentence: item.target_sentence,
                  ai_lines: item.ai_lines.map((l) => l.text),
              }
            : emptyForm(),
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateLine = (index: number, value: string) => {
        setForm((prev) => ({
            ...prev,
            ai_lines: prev.ai_lines.map((line, i) =>
                i === index ? value : line,
            ),
        }));
    };

    const removeLine = (index: number) => {
        setForm((prev) => ({
            ...prev,
            ai_lines: prev.ai_lines.filter((_, i) => i !== index),
        }));
    };

    const addLine = () => {
        setForm((prev) => ({ ...prev, ai_lines: [...prev.ai_lines, ''] }));
    };

    const onParseJson = () => {
        try {
            setForm(parseSpeakingInput(jsonText));
            setJsonError(null);
        } catch (error) {
            setJsonError(
                error instanceof Error
                    ? error.message
                    : 'Could not parse this input.',
            );
        }
    };

    const onSave = () => {
        setIsSaving(true);
        const payload = {
            target_sentence: form.target_sentence,
            ai_lines: form.ai_lines
                .filter((line) => line.trim() !== '')
                .map((text) => ({ text })),
        };

        router.put(speaking.update.url([level.id, day.id]), payload, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Sprechen`} />

            <div className="max-w-6xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Sprechen`}
                    description={level.code}
                />

                <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                    <div className="space-y-6">
                        <Tabs defaultValue="manual">
                            <TabsList>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                                <TabsTrigger value="json">
                                    JSON import
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="manual" className="space-y-4">
                                <div className="grid gap-2 rounded-lg border p-4">
                                    <Label>
                                        Target sentence (Nachsprechen)
                                    </Label>
                                    <Input
                                        value={form.target_sentence}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                target_sentence: e.target.value,
                                            }))
                                        }
                                        placeholder="Ich möchte meinen Wohnsitz anmelden."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>
                                        AI conversation lines (Gespräch) — line
                                        1 is the greeting, later lines cycle for
                                        subsequent replies
                                    </Label>
                                    {form.ai_lines.map((line, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-muted-foreground w-6 text-xs">
                                                {index + 1}.
                                            </span>
                                            <Input
                                                value={line}
                                                onChange={(e) =>
                                                    updateLine(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 shrink-0"
                                                onClick={() =>
                                                    removeLine(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={addLine}>
                                        <Plus className="size-4" />
                                        Add line
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="json" className="space-y-3">
                                <Label htmlFor="json-input">
                                    Paste a speaking item (JSON)
                                </Label>
                                <Textarea
                                    id="json-input"
                                    value={jsonText}
                                    onChange={(e) =>
                                        setJsonText(e.target.value)
                                    }
                                    rows={12}
                                    className="font-mono text-xs"
                                    placeholder={`{\n  "target_sentence": "Ich möchte meinen Wohnsitz anmelden.",\n  "ai_lines": [\n    "Guten Tag! Wie kann ich Ihnen helfen?",\n    "Verstehe. Haben Sie schon einen Termin vereinbart?",\n    "Gut, bringen Sie bitte Ihren Ausweis mit."\n  ]\n}`}
                                />
                                {jsonError && (
                                    <p className="text-destructive text-sm">
                                        {jsonError}
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={onParseJson}
                                    disabled={!jsonText.trim()}
                                >
                                    Parse into form above
                                </Button>
                                <p className="text-muted-foreground text-xs">
                                    Parsing replaces the fields in the Manual
                                    tab — review them there, then save.
                                </p>
                            </TabsContent>
                        </Tabs>

                        <Button onClick={onSave} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save Sprechen'}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Vocabulary
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                This day's vocab cards — shared with the Vocab
                                module.
                            </p>
                        </div>

                        <VocabCardsEditor
                            level={level}
                            day={day}
                            cards={cards}
                            saveLabel="Save vocab"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

SpeakingEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
        {
            title: 'Sprechen',
            href: speaking.edit([props.level.id, props.day.id]),
        },
    ] satisfies BreadcrumbItem[],
});
