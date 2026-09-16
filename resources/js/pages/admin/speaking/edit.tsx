import { Head, router } from '@inertiajs/react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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

type DialogueLineForm = {
    german: string;
    english: string;
    pronounce: string;
};

type WordForm = {
    german: string;
    english: string;
    pronounce: string;
};

type SpeakingForm = {
    dialogue: DialogueLineForm[];
    words: WordForm[];
};

type SpeakingItem = {
    dialogue: {
        german: string;
        english: string;
        pronounce: string | null;
    }[];
    words: {
        german: string;
        english: string;
        pronounce: string | null;
    }[];
};

const emptyDialogueLine = (): DialogueLineForm => ({
    german: '',
    english: '',
    pronounce: '',
});

const emptyWord = (): WordForm => ({
    german: '',
    english: '',
    pronounce: '',
});

const emptyForm = (): SpeakingForm => ({
    dialogue: [emptyDialogueLine()],
    words: [emptyWord()],
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

    const dialogue = Array.isArray(item.dialogue) ? item.dialogue : [];

    if (dialogue.length === 0) {
        throw new Error('Expected a non-empty "dialogue" array.');
    }

    const words = Array.isArray(item.words) ? item.words : [];

    return {
        dialogue: dialogue.map((raw, index) => {
            const line = (raw ?? {}) as Record<string, unknown>;
            if (!asString(line.german) || !asString(line.english)) {
                throw new Error(
                    `Dialogue line at index ${index} needs "german" and "english".`,
                );
            }
            return {
                german: asString(line.german),
                english: asString(line.english),
                pronounce: asString(line.pronounce),
            };
        }),
        words: words.map((raw, index) => {
            const word = (raw ?? {}) as Record<string, unknown>;
            if (!asString(word.german) || !asString(word.english)) {
                throw new Error(
                    `Word at index ${index} needs "german" and "english".`,
                );
            }
            return {
                german: asString(word.german),
                english: asString(word.english),
                pronounce: asString(word.pronounce),
            };
        }),
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
                  dialogue:
                      item.dialogue.length > 0
                          ? item.dialogue.map((line) => ({
                                german: line.german,
                                english: line.english,
                                pronounce: line.pronounce ?? '',
                            }))
                          : [emptyDialogueLine()],
                  words:
                      item.words.length > 0
                          ? item.words.map((word) => ({
                                german: word.german,
                                english: word.english,
                                pronounce: word.pronounce ?? '',
                            }))
                          : [emptyWord()],
              }
            : emptyForm(),
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateDialogueLine = (
        index: number,
        field: keyof DialogueLineForm,
        value: string,
    ) => {
        setForm((prev) => ({
            ...prev,
            dialogue: prev.dialogue.map((line, i) =>
                i === index ? { ...line, [field]: value } : line,
            ),
        }));
    };

    const removeDialogueLine = (index: number) => {
        setForm((prev) => ({
            ...prev,
            dialogue: prev.dialogue.filter((_, i) => i !== index),
        }));
    };

    const addDialogueLine = () => {
        setForm((prev) => ({
            ...prev,
            dialogue: [...prev.dialogue, emptyDialogueLine()],
        }));
    };

    const updateWord = (
        index: number,
        field: keyof WordForm,
        value: string,
    ) => {
        setForm((prev) => ({
            ...prev,
            words: prev.words.map((word, i) =>
                i === index ? { ...word, [field]: value } : word,
            ),
        }));
    };

    const removeWord = (index: number) => {
        setForm((prev) => ({
            ...prev,
            words: prev.words.filter((_, i) => i !== index),
        }));
    };

    const addWord = () => {
        setForm((prev) => ({ ...prev, words: [...prev.words, emptyWord()] }));
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
            dialogue: form.dialogue
                .filter(
                    (line) =>
                        line.german.trim() !== '' || line.english.trim() !== '',
                )
                .map((line) => ({
                    german: line.german,
                    english: line.english,
                    pronounce: line.pronounce || null,
                })),
            words: form.words
                .filter((word) => word.german.trim() !== '')
                .map((word) => ({
                    german: word.german,
                    english: word.english,
                    pronounce: word.pronounce || null,
                })),
        };

        router.put(speaking.update.url([level.id, day.id]), payload, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Sprechen`} />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Sprechen`}
                    description={level.code}
                />

                <div className="space-y-6">
                    <Tabs defaultValue="manual">
                        <TabsList>
                            <TabsTrigger value="manual">Manual</TabsTrigger>
                            <TabsTrigger value="json">JSON import</TabsTrigger>
                        </TabsList>

                        <TabsContent value="manual" className="space-y-4">
                            <div className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Dialogue
                                    </h3>
                                </div>

                                {form.dialogue.map((line, index) => (
                                    <div
                                        key={index}
                                        className="space-y-2 rounded-md border p-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-xs">
                                                Line {index + 1}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 shrink-0"
                                                onClick={() =>
                                                    removeDialogueLine(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                        <Input
                                            value={line.german}
                                            onChange={(e) =>
                                                updateDialogueLine(
                                                    index,
                                                    'german',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="German"
                                        />
                                        <Input
                                            value={line.english}
                                            onChange={(e) =>
                                                updateDialogueLine(
                                                    index,
                                                    'english',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="English"
                                        />
                                        <Input
                                            value={line.pronounce}
                                            onChange={(e) =>
                                                updateDialogueLine(
                                                    index,
                                                    'pronounce',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Pronunciation (Bengali)"
                                        />
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addDialogueLine}
                                >
                                    <Plus className="size-4" />
                                    Add line
                                </Button>
                            </div>

                            <div className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Words
                                    </h3>
                                </div>

                                {form.words.map((word, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 gap-2 rounded-md border p-2"
                                    >
                                        <Input
                                            value={word.german}
                                            onChange={(e) =>
                                                updateWord(
                                                    index,
                                                    'german',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="German"
                                        />
                                        <Input
                                            value={word.english}
                                            onChange={(e) =>
                                                updateWord(
                                                    index,
                                                    'english',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="English"
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                value={word.pronounce}
                                                onChange={(e) =>
                                                    updateWord(
                                                        index,
                                                        'pronounce',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Pronounce"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-9 shrink-0"
                                                onClick={() =>
                                                    removeWord(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addWord}
                                >
                                    <Plus className="size-4" />
                                    Add word
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
                                onChange={(e) => setJsonText(e.target.value)}
                                rows={16}
                                className="font-mono text-xs"
                                placeholder={`{\n  "dialogue": [\n    { "german": "Hallo! Ich möchte mich kurz vorstellen.", "english": "Hello! I would like to briefly introduce myself.", "pronounce": "হ্যালো! ইশ ম্যোশটে মিশ কুর্ৎস ফোরস্টেলেন।" }\n  ],\n  "words": [\n    { "german": "vorstellen", "english": "to introduce", "pronounce": "ফোরস্টেলেন" }\n  ]\n}`}
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
                                Parsing replaces the fields in the Manual tab —
                                review them there, then save.
                            </p>
                        </TabsContent>
                    </Tabs>

                    <Button onClick={onSave} disabled={isSaving}>
                        {isSaving ? 'Saving…' : 'Save Sprechen'}
                    </Button>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="fixed top-1/2 right-4 z-40 size-11 -translate-y-1/2 rounded-full shadow-lg"
                        title="Vocabulary"
                    >
                        <BookOpen className="size-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-sm">
                    <SheetHeader>
                        <SheetTitle>Vocabulary</SheetTitle>
                        <SheetDescription>
                            This day's vocab cards — shared with the Vocab
                            module.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 pb-4 text-sm">
                        <VocabCardsEditor
                            level={level}
                            day={day}
                            cards={cards}
                            saveLabel="Save vocab"
                        />
                    </div>
                </SheetContent>
            </Sheet>
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
