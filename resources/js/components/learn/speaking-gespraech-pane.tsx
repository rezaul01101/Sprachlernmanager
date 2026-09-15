import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { ChatBubble } from '@/components/learn/chat-bubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatMessage } from '@/types/learn';

const AI_REPLY_DELAY_MS = 700;

export function SpeakingGespraechPane({ aiLines }: { aiLines: string[] }) {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        { id: 'seed-1', sender: 'ai', text: aiLines[0] ?? '' },
    ]);
    const [inputText, setInputText] = useState('');
    const userMessageCountRef = useRef(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const getNextAiReply = (userMessageCount: number) =>
        aiLines[userMessageCount % aiLines.length] ?? '';

    const handleSend = () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        setMessages((prev) => [
            ...prev,
            { id: `u-${Date.now()}`, sender: 'user', text: trimmed },
        ]);
        setInputText('');
        userMessageCountRef.current += 1;
        const count = userMessageCountRef.current;

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${Date.now()}`,
                    sender: 'ai',
                    text: getNextAiReply(count),
                },
            ]);
        }, AI_REPLY_DELAY_MS);
    };

    return (
        <div className="flex h-full min-h-80 flex-col gap-3">
            <div
                ref={scrollRef}
                className="bg-background flex-1 space-y-2 overflow-y-auto rounded-lg border p-3"
            >
                {messages.map((message) => (
                    <ChatBubble
                        key={message.id}
                        text={message.text}
                        from={message.sender}
                    />
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nachricht schreiben…"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button
                    type="button"
                    size="icon"
                    onClick={handleSend}
                    aria-label="Senden"
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
}
