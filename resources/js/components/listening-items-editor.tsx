import { router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { getYoutubeEmbedUrl } from '@/lib/learn/get-youtube-embed-url';
import listening from '@/routes/admin/levels/listening';

export type ListeningWordForm = {
    word: string;
    pronounce: string;
    meaning: string;
};

export type ListeningItemForm = {
    type: 'audio' | 'video';
    video_url: string;
    script: string;
    title: string;
    duration_label: string;
    words: ListeningWordForm[];
};

const emptyWord = (): ListeningWordForm => ({
    word: '',
    pronounce: '',
    meaning: '',
});

const emptyItem = (): ListeningItemForm => ({
    type: 'video',
    video_url: '',
    script: '',
    title: '',
    duration_label: '',
    words: [emptyWord()],
});

/**
 * Server props come straight from Eloquent, where these fields are
 * nullable — normalise to '' so controlled inputs and .trim() calls
 * below don't choke on null.
 */
function normalizeItem(item: ListeningItemForm): ListeningItemForm {
    return {
        type: item.type === 'audio' ? 'audio' : 'video',
        video_url: item.video_url ?? '',
        script: item.script ?? '',
        title: item.title ?? '',
        duration_label: item.duration_label ?? '',
        words:
            item.words && item.words.length > 0
                ? item.words.map((word) => ({
                      word: word.word ?? '',
                      pronounce: word.pronounce ?? '',
                      meaning: word.meaning ?? '',
                  }))
                : [emptyWord()],
    };
}

/**
 * Same client-side-only parsing approach as the vocab importer — see
 * vocab-cards-editor.tsx.
 */
function parseItemsInput(text: string): ListeningItemForm[] {
    const trimmed = text.trim();
    if (!trimmed) {
        return [];
    }

    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(
        `"use strict"; return (${trimmed});`,
    )() as unknown;

    if (!Array.isArray(value)) {
        throw new Error('Expected a JSON array of listening items.');
    }

    const asString = (input: unknown): string =>
        typeof input === 'string' ? input : '';

    return value.map((raw: unknown, index: number) => {
        const item = (raw ?? {}) as Record<string, unknown>;
        const title = asString(item.title);

        if (!title) {
            throw new Error(`Item at index ${index} is missing "title".`);
        }

        const rawWords = Array.isArray(item.words) ? item.words : [];
        const words = rawWords.map((rawWord: unknown, wordIndex: number) => {
            const word = (rawWord ?? {}) as Record<string, unknown>;
            const wordText = asString(word.word);

            if (!wordText) {
                throw new Error(
                    `Item at index ${index}, word at index ${wordIndex} is missing "word".`,
                );
            }

            return {
                word: wordText,
                pronounce: asString(word.pronounce),
                meaning: asString(word.meaning),
            };
        });

        return {
            type: asString(item.type) === 'audio' ? 'audio' : 'video',
            video_url: asString(item.video_url),
            script: asString(item.script),
            title,
            duration_label: asString(item.duration_label),
            words: words.length > 0 ? words : [emptyWord()],
        };
    });
}

export default function ListeningItemsEditor({
    level,
    day,
    items: initialItems,
}: {
    level: { id: number };
    day: { id: number };
    items: ListeningItemForm[];
}) {
    const [items, setItems] = useState<ListeningItemForm[]>(
        initialItems.length > 0
            ? initialItems.map(normalizeItem)
            : [emptyItem()],
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateItem = (
        index: number,
        field: keyof Omit<ListeningItemForm, 'words'>,
        value: string,
    ) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const addItem = () => {
        setItems((prev) => [...prev, emptyItem()]);
    };

    const updateWord = (
        itemIndex: number,
        wordIndex: number,
        field: keyof ListeningWordForm,
        value: string,
    ) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === itemIndex
                    ? {
                          ...item,
                          words: item.words.map((word, w) =>
                              w === wordIndex
                                  ? { ...word, [field]: value }
                                  : word,
                          ),
                      }
                    : item,
            ),
        );
    };

    const addWord = (itemIndex: number) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === itemIndex
                    ? { ...item, words: [...item.words, emptyWord()] }
                    : item,
            ),
        );
    };

    const removeWord = (itemIndex: number, wordIndex: number) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === itemIndex
                    ? {
                          ...item,
                          words: item.words.filter((_, w) => w !== wordIndex),
                      }
                    : item,
            ),
        );
    };

    const onParseJson = () => {
        try {
            const parsed = parseItemsInput(jsonText);
            setItems(parsed.length > 0 ? parsed : [emptyItem()]);
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
            items: items
                .filter((item) => item.title.trim() !== '')
                .map((item) => ({
                    type: item.type,
                    video_url:
                        item.type === 'video' ? item.video_url || null : null,
                    script: item.script || null,
                    title: item.title,
                    duration_label: item.duration_label,
                    words: item.words
                        .filter((word) => word.word.trim() !== '')
                        .map((word) => ({
                            word: word.word,
                            pronounce: word.pronounce || null,
                            meaning: word.meaning || null,
                        })),
                })),
        };

        router.put(listening.update.url([level.id, day.id]), payload, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="manual">
                <TabsList>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="json">JSON import</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                    {items.map((item, index) => {
                        const embedUrl = getYoutubeEmbedUrl(item.video_url);

                        return (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-3 rounded-lg border p-4"
                            >
                                <div className="col-span-2 flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs">
                                        Video {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={item.type}
                                        onValueChange={(value) =>
                                            updateItem(index, 'type', value)
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
                                        value={item.duration_label}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'duration_label',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="02:14"
                                    />
                                </div>

                                <div className="col-span-2 grid gap-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={item.title}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Beim Bürgeramt"
                                    />
                                </div>

                                {item.type === 'video' && (
                                    <div className="col-span-2 grid gap-2">
                                        <Label>Video link</Label>
                                        <Input
                                            value={item.video_url}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'video_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                        {item.video_url.trim() &&
                                            (embedUrl ? (
                                                <div className="aspect-video w-48 overflow-hidden rounded-lg border">
                                                    <iframe
                                                        key={embedUrl}
                                                        src={embedUrl}
                                                        title="Video preview"
                                                        className="size-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-destructive text-xs">
                                                    That doesn't look like a
                                                    YouTube link — paste a
                                                    watch, youtu.be, or shorts
                                                    URL.
                                                </p>
                                            ))}
                                    </div>
                                )}

                                <div className="col-span-2 grid gap-2">
                                    <Label>Script (transcript)</Label>
                                    <Textarea
                                        value={item.script}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'script',
                                                e.target.value,
                                            )
                                        }
                                        rows={6}
                                        placeholder="Full transcript of what's said in the audio/video…"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label>Related words</Label>
                                    <div className="space-y-2">
                                        {item.words.map((word, wordIndex) => (
                                            <div
                                                key={wordIndex}
                                                className="grid grid-cols-3 gap-2 rounded-md border p-2"
                                            >
                                                <Input
                                                    value={word.word}
                                                    onChange={(e) =>
                                                        updateWord(
                                                            index,
                                                            wordIndex,
                                                            'word',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="der Ausweis"
                                                />
                                                <Input
                                                    value={word.pronounce}
                                                    onChange={(e) =>
                                                        updateWord(
                                                            index,
                                                            wordIndex,
                                                            'pronounce',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="dehr OWS-vice"
                                                />
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={word.meaning}
                                                        onChange={(e) =>
                                                            updateWord(
                                                                index,
                                                                wordIndex,
                                                                'meaning',
                                                                e.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="ID card"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-9 shrink-0"
                                                        onClick={() =>
                                                            removeWord(
                                                                index,
                                                                wordIndex,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addWord(index)}
                                    >
                                        <Plus className="size-4" />
                                        Add word
                                    </Button>
                                </div>
                            </div>
                        );
                    })}

                    <Button variant="outline" onClick={addItem}>
                        <Plus className="size-4" />
                        Add video
                    </Button>
                </TabsContent>

                <TabsContent value="json" className="space-y-3">
                    <Label htmlFor="json-input">
                        Paste a listening items array (JSON)
                    </Label>
                    <Textarea
                        id="json-input"
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        rows={12}
                        className="font-mono text-xs"
                        placeholder={`[\n  {\n    "type": "video",\n    "video_url": "https://www.youtube.com/watch?v=...",\n    "script": "Full transcript…",\n    "title": "Beim Bürgeramt",\n    "duration_label": "02:14",\n    "words": [\n      { "word": "der Ausweis", "pronounce": "dehr OWS-vice", "meaning": "ID card" },\n      { "word": "anmelden", "pronounce": "AN-mel-den", "meaning": "to register" }\n    ]\n  }\n]`}
                    />
                    {jsonError && (
                        <p className="text-destructive text-sm">{jsonError}</p>
                    )}
                    <Button
                        variant="outline"
                        onClick={onParseJson}
                        disabled={!jsonText.trim()}
                    >
                        Parse into videos below
                    </Button>
                    <p className="text-muted-foreground text-xs">
                        Parsing replaces the videos in the Manual tab — review
                        them there, then save.
                    </p>
                </TabsContent>
            </Tabs>

            <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Hören'}
            </Button>
        </div>
    );
}
