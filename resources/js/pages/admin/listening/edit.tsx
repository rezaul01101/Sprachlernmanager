import { Head, router } from '@inertiajs/react';
import { BookMarked, Plus, Trash2 } from 'lucide-react';
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import listening from '@/routes/admin/levels/listening';
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

type ListeningForm = {
    type: 'audio' | 'video';
    video_url: string;
    script: string;
    title: string;
    duration_label: string;
    question: string;
    options: OptionForm[];
};

type ListeningItem = {
    type: 'audio' | 'video';
    video_url: string | null;
    script: string | null;
    title: string;
    duration_label: string;
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

const emptyForm = (): ListeningForm => ({
    type: 'video',
    video_url: '',
    script: '',
    title: '',
    duration_label: '',
    question: '',
    options: [emptyOption()],
});

/**
 * Accepts watch/share/shorts/embed URLs and bare video IDs. Returns null for
 * anything that doesn't look like a YouTube video so the preview can fall
 * back to a message instead of an iframe pointed at a broken embed.
 */
function getYouTubeEmbedUrl(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) {
        return null;
    }

    try {
        const url = new URL(trimmed);
        const host = url.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            const id = url.pathname.slice(1);
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (url.pathname === '/watch') {
                const id = url.searchParams.get('v');
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }

            const shortsMatch = url.pathname.match(/^\/shorts\/([\w-]+)/);
            if (shortsMatch) {
                return `https://www.youtube.com/embed/${shortsMatch[1]}`;
            }

            const embedMatch = url.pathname.match(/^\/embed\/([\w-]+)/);
            if (embedMatch) {
                return `https://www.youtube.com/embed/${embedMatch[1]}`;
            }
        }
    } catch {
        return null;
    }

    return null;
}

/** Same client-side-only parsing approach as the vocab importer — see admin/vocab/edit.tsx. */
function parseListeningInput(text: string): ListeningForm {
    const trimmed = text.trim();
    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(
        `"use strict"; return (${trimmed});`,
    )() as unknown;
    const item = (value ?? {}) as Record<string, unknown>;

    const asString = (input: unknown): string =>
        typeof input === 'string' ? input : '';
    const type = asString(item.type) === 'audio' ? 'audio' : 'video';

    if (!asString(item.title) || !asString(item.question)) {
        throw new Error('Expected "title" and "question" fields.');
    }

    const options = Array.isArray(item.options) ? item.options : [];

    return {
        type,
        video_url: asString(item.video_url),
        script: asString(item.script),
        title: asString(item.title),
        duration_label: asString(item.duration_label),
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

export default function ListeningEdit({
    level,
    day,
    item,
    cards,
}: {
    level: Level;
    day: Day;
    item: ListeningItem | null;
    cards: VocabCardForm[];
}) {
    const [form, setForm] = useState<ListeningForm>(
        item
            ? {
                  type: item.type,
                  video_url: item.video_url ?? '',
                  script: item.script ?? '',
                  title: item.title,
                  duration_label: item.duration_label,
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

    const youtubeEmbedUrl = getYouTubeEmbedUrl(form.video_url);

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
            setForm(parseListeningInput(jsonText));
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
            type: form.type,
            video_url: form.type === 'video' ? form.video_url : null,
            script: form.script || null,
            title: form.title,
            duration_label: form.duration_label,
            question: form.question,
            options: form.options
                .filter((option) => option.text.trim() !== '')
                .map((option) => ({
                    text: option.text,
                    is_correct: option.is_correct,
                    explanation: option.explanation || null,
                })),
        };

        router.put(listening.update.url([level.id, day.id]), payload, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number} Hören`} />

            <div className="max-w-6xl space-y-6 p-4">
                <Heading
                    title={`Day ${day.day_number} — Hören`}
                    description={level.code}
                />

                <Tabs defaultValue="manual">
                    <div className="flex items-center justify-between gap-4">
                        <TabsList>
                            <TabsTrigger value="manual">Manual</TabsTrigger>
                            <TabsTrigger value="json">JSON import</TabsTrigger>
                        </TabsList>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Vocabulary"
                                >
                                    <BookMarked className="size-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
                                <DialogHeader>
                                    <DialogTitle>Vocabulary</DialogTitle>
                                    <DialogDescription>
                                        This day's vocab cards — shared with the
                                        Vocab module.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto pr-1">
                                    <VocabCardsEditor
                                        level={level}
                                        day={day}
                                        cards={cards}
                                        saveLabel="Save vocab"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <TabsContent value="manual" className="space-y-6">
                        {/* Top: media + metadata, full width */}
                        <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            type: value as 'audio' | 'video',
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="video">
                                            Video
                                        </SelectItem>
                                        <SelectItem value="audio">
                                            Audio
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Duration label</Label>
                                <Input
                                    value={form.duration_label}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            duration_label: e.target.value,
                                        }))
                                    }
                                    placeholder="02:14"
                                />
                            </div>

                            <div className="col-span-2 grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Beim Bürgeramt"
                                />
                            </div>

                            {form.type === 'video' && (
                                <div className="col-span-2 grid gap-2">
                                    <Label>YouTube video link</Label>
                                    <Input
                                        value={form.video_url}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                video_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {form.video_url.trim() &&
                                        (youtubeEmbedUrl ? (
                                            <div className="aspect-video overflow-hidden rounded-lg border">
                                                <iframe
                                                    key={youtubeEmbedUrl}
                                                    src={youtubeEmbedUrl}
                                                    title="YouTube video preview"
                                                    className="size-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-destructive text-xs">
                                                That doesn't look like a YouTube
                                                link — paste a watch, youtu.be,
                                                or shorts URL.
                                            </p>
                                        ))}
                                </div>
                            )}

                            <div className="col-span-2 grid gap-2">
                                <Label>Question</Label>
                                <Input
                                    value={form.question}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            question: e.target.value,
                                        }))
                                    }
                                    placeholder="Was muss die Person beim Bürgeramt mitbringen?"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Script (transcript)</Label>
                            <Textarea
                                value={form.script}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        script: e.target.value,
                                    }))
                                }
                                rows={10}
                                placeholder="Full transcript of what's said in the audio/video…"
                            />
                        </div>

                        <div className="space-y-4">
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
                                            onClick={() => removeOption(index)}
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
                        </div>

                        <Button onClick={onSave} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save Hören'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="json" className="space-y-3">
                        <Label htmlFor="json-input">
                            Paste a listening item (JSON)
                        </Label>
                        <Textarea
                            id="json-input"
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            rows={12}
                            className="font-mono text-xs"
                            placeholder={`{\n  "type": "video",\n  "video_url": "https://www.youtube.com/watch?v=...",\n  "script": "Full transcript…",\n  "title": "Beim Bürgeramt",\n  "duration_label": "02:14",\n  "question": "Was muss die Person beim Bürgeramt mitbringen?",\n  "options": [\n    { "text": "Nur den Ausweis", "is_correct": false, "explanation": "..." },\n    { "text": "Ausweis und Meldebescheinigung", "is_correct": true, "explanation": "..." }\n  ]\n}`}
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
            </div>
        </>
    );
}

ListeningEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.show([props.level.id, props.day.id]),
        },
        {
            title: 'Hören',
            href: listening.edit([props.level.id, props.day.id]),
        },
    ] satisfies BreadcrumbItem[],
});
