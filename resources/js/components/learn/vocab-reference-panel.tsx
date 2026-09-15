import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { VocabCard } from '@/types/learn';

export function VocabReferencePanel({ cards }: { cards: VocabCard[] }) {
    const [visible, setVisible] = useState(true);

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-semibold"
            >
                Vokabeln
                {visible ? (
                    <EyeOff className="text-muted-foreground size-4" />
                ) : (
                    <Eye className="text-muted-foreground size-4" />
                )}
            </button>

            {visible &&
                (cards.length > 0 ? (
                    <div className="space-y-2">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className="bg-card rounded-lg border p-2"
                            >
                                <div className="text-sm font-semibold">
                                    {card.word}
                                </div>
                                <div className="text-primary text-xs">
                                    {card.translation_en}
                                </div>
                                {card.example && (
                                    <div className="text-muted-foreground mt-1 text-xs">
                                        {card.example}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground text-xs">
                        Keine Vokabeln für diesen Tag.
                    </div>
                ))}
        </div>
    );
}
