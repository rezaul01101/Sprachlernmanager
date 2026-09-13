import { router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import vocab from '@/routes/admin/levels/vocab';

export type VocabCardForm = {
    word: string;
    tag: string;
    translation_en: string;
    translation_bn: string;
    example: string;
};

const emptyCard = (): VocabCardForm => ({
    word: '',
    tag: '',
    translation_en: '',
    translation_bn: '',
    example: '',
});

/**
 * Accepts either plain JSON or the exact TS snippet the mobile app's
 * data/vocab.ts files use (an `import`/`export const X: VocabCard[] = [...]`
 * wrapper around the array). Evaluated client-side only, in the admin's own
 * browser, on text they pasted themselves — equivalent to typing it into
 * devtools, not a server-side or cross-user execution path.
 */
function parseCardsInput(text: string): VocabCardForm[] {
    const trimmed = text.trim();
    if (!trimmed) {
        return [];
    }

    let code = trimmed.replace(/^import\s[^;]+;\s*/, '');
    code = code.replace(/^export\s+const\s+\w+\s*(:\s*[\w<>[\]]+)?\s*=\s*/, '');
    code = code.replace(/;\s*$/, '');

    // eslint-disable-next-line no-implied-eval -- admin's own pasted text, run in their own browser only
    const value = new Function(`"use strict"; return (${code});`)() as unknown;

    if (!Array.isArray(value)) {
        throw new Error('Expected a JSON array of vocab cards.');
    }

    const asString = (input: unknown): string =>
        typeof input === 'string' ? input : '';

    return value.map((raw: unknown, index: number) => {
        const item = (raw ?? {}) as Record<string, unknown>;
        const word = asString(item.word);
        const translationEn = asString(item.translation_en);

        if (!word || !translationEn) {
            throw new Error(
                `Card at index ${index} is missing "word" or "translation_en".`,
            );
        }

        return {
            word,
            tag: asString(item.tag),
            translation_en: translationEn,
            translation_bn: asString(item.translation_bn),
            example: asString(item.example),
        };
    });
}

export default function VocabCardsEditor({
    level,
    day,
    cards: initialCards,
    saveLabel = 'Save vocab',
}: {
    level: { id: number };
    day: { id: number };
    cards: VocabCardForm[];
    saveLabel?: string;
}) {
    const [cards, setCards] = useState<VocabCardForm[]>(
        initialCards.length > 0 ? initialCards : [emptyCard()],
    );
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateCard = (
        index: number,
        field: keyof VocabCardForm,
        value: string,
    ) => {
        setCards((prev) =>
            prev.map((card, i) =>
                i === index ? { ...card, [field]: value } : card,
            ),
        );
    };

    const removeCard = (index: number) => {
        setCards((prev) => prev.filter((_, i) => i !== index));
    };

    const addCard = () => {
        setCards((prev) => [...prev, emptyCard()]);
    };

    const onParseJson = () => {
        try {
            const parsed = parseCardsInput(jsonText);
            setCards(parsed.length > 0 ? parsed : [emptyCard()]);
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
            cards: cards
                .filter((card) => card.word.trim() !== '')
                .map((card) => ({
                    word: card.word,
                    tag: card.tag || null,
                    translation_en: card.translation_en,
                    translation_bn: card.translation_bn || null,
                    example: card.example || null,
                })),
        };

        router.put(vocab.update.url([level.id, day.id]), payload, {
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
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-2 gap-3 rounded-lg border p-4"
                        >
                            <div className="col-span-2 flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">
                                    Card {index + 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => removeCard(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>

                            <div className="grid gap-2">
                                <Label>Word</Label>
                                <Input
                                    value={card.word}
                                    onChange={(e) =>
                                        updateCard(
                                            index,
                                            'word',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="der Ausweis"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Tag</Label>
                                <Input
                                    value={card.tag}
                                    onChange={(e) =>
                                        updateCard(index, 'tag', e.target.value)
                                    }
                                    placeholder="Substantiv · m."
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Translation (EN)</Label>
                                <Input
                                    value={card.translation_en}
                                    onChange={(e) =>
                                        updateCard(
                                            index,
                                            'translation_en',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ID card"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Translation (BN)</Label>
                                <Input
                                    value={card.translation_bn}
                                    onChange={(e) =>
                                        updateCard(
                                            index,
                                            'translation_bn',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="আইডি কার্ড"
                                />
                            </div>

                            <div className="col-span-2 grid gap-2">
                                <Label>Example</Label>
                                <Textarea
                                    value={card.example}
                                    onChange={(e) =>
                                        updateCard(
                                            index,
                                            'example',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="„Bitte zeigen Sie Ihren Ausweis am Schalter.“"
                                />
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" onClick={addCard}>
                        <Plus className="size-4" />
                        Add card
                    </Button>
                </TabsContent>

                <TabsContent value="json" className="space-y-3">
                    <Label htmlFor="json-input">
                        Paste a vocab array (JSON, or the mobile app's
                        data/vocab.ts snippet)
                    </Label>
                    <Textarea
                        id="json-input"
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        rows={12}
                        className="font-mono text-xs"
                        placeholder={`[\n  {\n    "word": "der Ausweis",\n    "tag": "Substantiv · m.",\n    "translation_en": "ID card",\n    "translation_bn": "আইডি কার্ড",\n    "example": "„Bitte zeigen Sie Ihren Ausweis am Schalter.“"\n  }\n]`}
                    />
                    {jsonError && (
                        <p className="text-destructive text-sm">{jsonError}</p>
                    )}
                    <Button
                        variant="outline"
                        onClick={onParseJson}
                        disabled={!jsonText.trim()}
                    >
                        Parse into cards below
                    </Button>
                    <p className="text-muted-foreground text-xs">
                        Parsing replaces the cards in the Manual tab — review
                        them there, then save.
                    </p>
                </TabsContent>
            </Tabs>

            <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : saveLabel}
            </Button>
        </div>
    );
}
