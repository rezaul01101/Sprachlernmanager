import { Head, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
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
    title: string;
    duration_label: string;
    question: string;
    options: OptionForm[];
};

type ListeningItem = {
    type: 'audio' | 'video';
    title: string;
    duration_label: string;
    question: string;
    options: { text: string; is_correct: boolean; explanation: string | null }[];
};

const emptyOption = (): OptionForm => ({ text: '', is_correct: false, explanation: '' });

const emptyForm = (): ListeningForm => ({
    type: 'video',
    title: '',
    duration_label: '',
    question: '',
    options: [emptyOption()],
});

/** Same client-side-only parsing approach as the vocab importer — see admin/vocab/edit.tsx. */
function parseListeningInput(text: string): ListeningForm {
    const trimmed = text.trim();
    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(`"use strict"; return (${trimmed});`)() as unknown;
    const item = (value ?? {}) as Record<string, unknown>;

    const asString = (input: unknown): string => (typeof input === 'string' ? input : '');
    const type = asString(item.type) === 'audio' ? 'audio' : 'video';

    if (!asString(item.title) || !asString(item.question)) {
        throw new Error('Expected "title" and "question" fields.');
    }

    const options = Array.isArray(item.options) ? item.options : [];

    return {
        type,
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
}: {
    level: Level;
    day: Day;
    item: ListeningItem | null;
}) {
    const [form, setForm] = useState<ListeningForm>(
        item
            ? {
                  type: item.type,
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

    const updateOption = (index: number, field: keyof OptionForm, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            options: prev.options.map((option, i) => (i === index ? { ...option, [field]: value } : option)),
        }));
    };

    const removeOption = (index: number) => {
        setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
    };

    const addOption = () => {
        setForm((prev) => ({ ...prev, options: [...prev.options, emptyOption()] }));
    };

    const onParseJson = () => {
        try {
            setForm(parseListeningInput(jsonText));
            setJsonError(null);
        } catch (error) {
            setJsonError(error instanceof Error ? error.message : 'Could not parse this input.');
        }
    };

    const onSave = () => {
        setIsSaving(true);
        const payload = {
            type: form.type,
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

            <div className="max-w-3xl space-y-6 p-4">
                <Heading title={`Day ${day.day_number} — Hören`} description={level.code} />

                <Tabs defaultValue="manual">
                    <TabsList>
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                        <TabsTrigger value="json">JSON import</TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, type: value as 'audio' | 'video' }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="audio">Audio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Duration label</Label>
                                <Input
                                    value={form.duration_label}
                                    onChange={(e) => setForm((prev) => ({ ...prev, duration_label: e.target.value }))}
                                    placeholder="02:14"
                                />
                            </div>

                            <div className="col-span-2 grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                    placeholder="Beim Bürgeramt"
                                />
                            </div>

                            <div className="col-span-2 grid gap-2">
                                <Label>Question</Label>
                                <Input
                                    value={form.question}
                                    onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                                    placeholder="Was muss die Person beim Bürgeramt mitbringen?"
                                />
                            </div>
                        </div>

                        {form.options.map((option, index) => (
                            <div key={index} className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                                <div className="col-span-2 flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs">Option {index + 1}</span>
                                    <Button variant="ghost" size="icon" className="size-7" onClick={() => removeOption(index)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <div className="col-span-2 grid gap-2">
                                    <Label>Text</Label>
                                    <Input value={option.text} onChange={(e) => updateOption(index, 'text', e.target.value)} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={option.is_correct}
                                        onCheckedChange={(checked) => updateOption(index, 'is_correct', checked === true)}
                                    />
                                    <Label>Correct answer</Label>
                                </div>

                                <div className="col-span-2 grid gap-2">
                                    <Label>Explanation</Label>
                                    <Textarea
                                        value={option.explanation}
                                        onChange={(e) => updateOption(index, 'explanation', e.target.value)}
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
                        <Label htmlFor="json-input">Paste a listening item (JSON)</Label>
                        <Textarea
                            id="json-input"
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            rows={12}
                            className="font-mono text-xs"
                            placeholder={`{\n  "type": "video",\n  "title": "Beim Bürgeramt",\n  "duration_label": "02:14",\n  "question": "Was muss die Person beim Bürgeramt mitbringen?",\n  "options": [\n    { "text": "Nur den Ausweis", "is_correct": false, "explanation": "..." },\n    { "text": "Ausweis und Meldebescheinigung", "is_correct": true, "explanation": "..." }\n  ]\n}`}
                        />
                        {jsonError && <p className="text-destructive text-sm">{jsonError}</p>}
                        <Button variant="outline" onClick={onParseJson} disabled={!jsonText.trim()}>
                            Parse into form above
                        </Button>
                        <p className="text-muted-foreground text-xs">
                            Parsing replaces the fields in the Manual tab — review them there, then save.
                        </p>
                    </TabsContent>
                </Tabs>

                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save'}
                </Button>
            </div>
        </>
    );
}

ListeningEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: levels.show(props.level.id) },
        { title: 'Hören', href: listening.index(props.level.id) },
        { title: `Day ${props.day.day_number}`, href: listening.edit([props.level.id, props.day.id]) },
    ] satisfies BreadcrumbItem[],
});
