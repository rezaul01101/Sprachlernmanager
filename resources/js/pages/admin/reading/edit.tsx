import { Head, router } from '@inertiajs/react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import reading from '@/routes/admin/levels/reading';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
};

type Day = {
    id: number;
    day_number: number;
};

type OptionForm = {
    text: string;
    is_correct: boolean;
    explanation: string;
};

type ReadingForm = {
    instruction: string;
    article_url: string;
    passage: string;
    question: string;
    options: OptionForm[];
};

type ReadingItem = {
    instruction: string;
    article_url: string | null;
    passage: string;
    question: string;
    options: {
        text: string;
        is_correct: boolean;
        explanation: string | null;
    }[];
};

const emptyOption = (): OptionForm => ({
    text: '',
    is_correct: false,
    explanation: '',
});

const emptyForm = (): ReadingForm => ({
    instruction: 'Lesen Sie den Text und beantworten Sie die Frage.',
    article_url: '',
    passage: '',
    question: '',
    options: [emptyOption()],
});

/** Same client-side-only parsing approach as the vocab importer — see admin/vocab/edit.tsx. */
function parseReadingInput(text: string): ReadingForm {
    const trimmed = text.trim();
    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(
        `"use strict"; return (${trimmed});`,
    )() as unknown;
    const item = (value ?? {}) as Record<string, unknown>;

    const asString = (input: unknown): string =>
        typeof input === 'string' ? input : '';

    if (!asString(item.passage) || !asString(item.question)) {
        throw new Error('Expected "passage" and "question" fields.');
    }

    const options = Array.isArray(item.options) ? item.options : [];

    return {
        instruction: asString(item.instruction) || emptyForm().instruction,
        article_url: asString(item.article_url),
        passage: asString(item.passage),
        question: asString(item.question),
        options: options.map((raw) => {
            const option = (raw ?? {}) as Record<string, unknown>;
            return {
                text: asString(option.text),
                is_correct: Boolean(option.is_correct ?? option.correct),
                explanation: asString(option.explanation),
            };
        }),
    };
}

export default function ReadingEdit({
    level,
    day,
    item,
    cards,
}: {
    level: Level;
    day: Day;
    item: ReadingItem | null;
    cards: VocabCardForm[];
}) {
    const [form, setForm] = useState<ReadingForm>(
        item
            ? {
                  instruction: item.instruction,
                  article_url: item.article_url ?? '',
                  passage: item.passage,
                  question: item.question,
                  options: item.options.map((o) => ({
                      text: o.text,
                      is_correct: o.is_correct,
                      explanation: o.explanation ?? '',
                  })),
              }
            : emptyForm(),
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateOption = (
        index: number,
        field: keyof OptionForm,
        value: string | boolean,
    ) => {
        setForm((prev) => ({
            ...prev,
            options: prev.options.map((option, i) =>
                i === index ? { ...option, [field]: value } : option,
            ),
        }));
    };

    const removeOption = (index: number) => {
        setForm((prev) => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }));
    };

    const addOption = () => {
        setForm((prev) => ({
            ...prev,
            options: [...prev.options, emptyOption()],
        }));
    };

    const onParseJson = () => {
        try {
            setForm(parseReadingInput(jsonText));
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
            instruction: form.instruction,
            article_url: form.article_url || null,
            passage: form.passage,
            question: form.question,
            options: form.options
                .filter((option) => option.text.trim() !== '')
                .map((option) => ({
                    text: option.text,
                    is_correct: option.is_correct,
                    explanation: option.explanation || null,
                })),
        };

        router.put(reading.update.url([level.id, day.id]), payload, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Lesen`} />

            <div className="max-w-6xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Lesen`}
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
                                <div className="grid gap-3 rounded-lg border p-4">
                                    <div className="grid gap-2">
                                        <Label>Instruction</Label>
                                        <Input
                                            value={form.instruction}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    instruction: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Article link (optional)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={form.article_url}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        article_url:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="https://example.com/article"
                                                className="flex-1"
                                            />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={
                                                            !form.article_url.trim()
                                                        }
                                                        title="Preview article"
                                                    >
                                                        <Globe className="size-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="flex h-[85vh] max-w-4xl flex-col sm:max-w-4xl">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Article preview
                                                        </DialogTitle>
                                                        <DialogDescription className="truncate">
                                                            {form.article_url}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="min-h-0 flex-1 overflow-hidden rounded-lg border">
                                                        {form.article_url.trim() && (
                                                            <iframe
                                                                key={
                                                                    form.article_url
                                                                }
                                                                src={
                                                                    form.article_url
                                                                }
                                                                title="Article preview"
                                                                className="size-full"
                                                            />
                                                        )}
                                                    </div>
                                                    <DialogFooter className="items-center sm:justify-between">
                                                        <p className="text-muted-foreground text-xs">
                                                            Some sites block
                                                            being shown in an
                                                            iframe — use
                                                            &quot;Open in new
                                                            tab&quot; if the
                                                            preview stays blank.
                                                        </p>
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                        >
                                                            <a
                                                                href={
                                                                    form.article_url
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                Open in new tab
                                                            </a>
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Passage</Label>
                                        <Textarea
                                            value={form.passage}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    passage: e.target.value,
                                                }))
                                            }
                                            rows={6}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Question</Label>
                                        <Input
                                            value={form.question}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    question: e.target.value,
                                                }))
                                            }
                                            placeholder="Warum geht Frau Keller zum Bürgeramt?"
                                        />
                                    </div>
                                </div>

                                {form.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 gap-3 rounded-lg border p-4"
                                    >
                                        <div className="col-span-2 flex items-center justify-between">
                                            <span className="text-muted-foreground text-xs">
                                                Option {index + 1}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() =>
                                                    removeOption(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>

                                        <div className="col-span-2 grid gap-2">
                                            <Label>Text</Label>
                                            <Input
                                                value={option.text}
                                                onChange={(e) =>
                                                    updateOption(
                                                        index,
                                                        'text',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={option.is_correct}
                                                onCheckedChange={(checked) =>
                                                    updateOption(
                                                        index,
                                                        'is_correct',
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label>Correct answer</Label>
                                        </div>

                                        <div className="col-span-2 grid gap-2">
                                            <Label>Explanation</Label>
                                            <Textarea
                                                value={option.explanation}
                                                onChange={(e) =>
                                                    updateOption(
                                                        index,
                                                        'explanation',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" onClick={addOption}>
                                    <Plus className="size-4" />
                                    Add option
                                </Button>
                            </TabsContent>

                            <TabsContent value="json" className="space-y-3">
                                <Label htmlFor="json-input">
                                    Paste a reading item (JSON)
                                </Label>
                                <Textarea
                                    id="json-input"
                                    value={jsonText}
                                    onChange={(e) =>
                                        setJsonText(e.target.value)
                                    }
                                    rows={12}
                                    className="font-mono text-xs"
                                    placeholder={`{\n  "instruction": "Lesen Sie den Text und beantworten Sie die Frage.",\n  "article_url": "https://example.com/article",\n  "passage": "Frau Keller wohnt seit drei Monaten in Berlin. ...",\n  "question": "Warum geht Frau Keller zum Bürgeramt?",\n  "options": [\n    { "text": "Um ihren Wohnsitz anzumelden", "is_correct": true, "explanation": "..." }\n  ]\n}`}
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
                            {isSaving ? 'Saving…' : 'Save Lesen'}
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

ReadingEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
        { title: 'Lesen', href: reading.edit([props.level.id, props.day.id]) },
    ] satisfies BreadcrumbItem[],
});
