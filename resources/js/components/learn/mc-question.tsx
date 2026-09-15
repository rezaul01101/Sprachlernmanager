import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { McOption } from '@/types/learn';

export function McQuestion({
    question,
    options,
}: {
    question: string;
    options: McOption[];
}) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const isLocked = selectedId !== null;

    return (
        <div className="space-y-2">
            <div className="font-semibold">{question}</div>
            {options.map((option) => {
                const isSelected = selectedId === option.id;
                const showCorrect = isLocked && option.is_correct;
                const showWrong = isLocked && isSelected && !option.is_correct;

                return (
                    <button
                        key={option.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setSelectedId(option.id)}
                        className={cn(
                            'bg-card w-full rounded-lg border p-3 text-left text-sm transition-colors',
                            showCorrect &&
                                'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30',
                            showWrong &&
                                'border-destructive bg-destructive/10 text-destructive',
                        )}
                    >
                        <div className="font-medium">{option.text}</div>
                        {isSelected && option.explanation && (
                            <div className="text-muted-foreground mt-1.5 text-xs">
                                {option.explanation}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
