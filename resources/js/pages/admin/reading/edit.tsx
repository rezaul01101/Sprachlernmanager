import { Head, router } from '@inertiajs/react';
import { BookOpen, Globe, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import VocabCardsEditor, {
    type VocabCardForm,
} from '@/components/vocab-cards-editor';
import { Button } from '@/components/ui/button';
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

type WordForm = {
    word: string;
    pronounce: string;
    meaning: string;
};

type ReadingForm = {
    instruction: string;
    article_url: string;
    passage: string;
    words: WordForm[];
};

type ReadingItem = {
    instruction: string;
    article_url: string | null;
    passage: string;
    words: {
        word: string;
        pronounce: string | null;
        meaning: string | null;
    }[];
};

const emptyWord = (): WordForm => ({
    word: '',
    pronounce: '',
    meaning: '',
});

const emptyForm = (): ReadingForm => ({
    instruction: 'Lesen Sie den Text und lernen Sie die markierten Wörter.',
    article_url: '',
    passage: '',
    words: [emptyWord()],
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

    if (!asString(item.passage)) {
        throw new Error('Expected a "passage" field.');
    }

    const words = Array.isArray(item.words) ? item.words : [];

    return {
        instruction: asString(item.instruction) || emptyForm().instruction,
        article_url: asString(item.article_url),
        passage: asString(item.passage),
        words: words.map((raw, index) => {
            const word = (raw ?? {}) as Record<string, unknown>;
            if (!asString(word.word)) {
                throw new Error(`Word at index ${index} is missing "word".`);
            }
            return {
                word: asString(word.word),
                pronounce: asString(word.pronounce),
                meaning: asString(word.meaning),
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
                  words:
                      item.words.length > 0
                          ? item.words.map((w) => ({
                                word: w.word,
                                pronounce: w.pronounce ?? '',
                                meaning: w.meaning ?? '',
                            }))
                          : [emptyWord()],
              }
            : emptyForm(),
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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
        setForm((prev) => ({
            ...prev,
            words: [...prev.words, emptyWord()],
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
            words: form.words
                .filter((word) => word.word.trim() !== '')
                .map((word) => ({
                    word: word.word,
                    pronounce: word.pronounce || null,
                    meaning: word.meaning || null,
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

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Lesen`}
                    description={level.code}
                />

                <div className="space-y-6">
                    <Tabs defaultValue="manual">
                        <TabsList>
                            <TabsTrigger value="manual">Manual</TabsTrigger>
                            <TabsTrigger value="json">JSON import</TabsTrigger>
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
                                                    article_url: e.target.value,
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
                                                        Some sites block being
                                                        shown in an iframe — use
                                                        &quot;Open in new
                                                        tab&quot; if the preview
                                                        stays blank.
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
                            </div>

                            <div className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Related words
                                    </h3>
                                </div>

                                {form.words.map((word, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 gap-2 rounded-md border p-2"
                                    >
                                        <Input
                                            value={word.word}
                                            onChange={(e) =>
                                                updateWord(
                                                    index,
                                                    'word',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Word"
                                        />
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
                                        <div className="flex gap-2">
                                            <Input
                                                value={word.meaning}
                                                onChange={(e) =>
                                                    updateWord(
                                                        index,
                                                        'meaning',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Meaning"
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
                                Paste a reading item (JSON)
                            </Label>
                            <Textarea
                                id="json-input"
                                value={jsonText}
                                onChange={(e) => setJsonText(e.target.value)}
                                rows={12}
                                className="font-mono text-xs"
                                placeholder={`{\n  "instruction": "Lesen Sie den Text und lernen Sie die markierten Wörter.",\n  "article_url": "https://example.com/article",\n  "passage": "Frau Keller wohnt seit drei Monaten in Berlin. ...",\n  "words": [\n    { "word": "der Wohnsitz", "pronounce": "dehr VOHN-zits", "meaning": "residence" }\n  ]\n}`}
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
                        {isSaving ? 'Saving…' : 'Save Lesen'}
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
