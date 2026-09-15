import { cn } from '@/lib/utils';

export function ChatBubble({
    text,
    from,
}: {
    text: string;
    from: 'ai' | 'user';
}) {
    return (
        <div
            className={cn(
                'flex',
                from === 'user' ? 'justify-end' : 'justify-start',
            )}
        >
            <div
                className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                    from === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground',
                )}
            >
                {text}
            </div>
        </div>
    );
}
