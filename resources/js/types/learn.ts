export type LearnLevel = {
    id: number;
    code: string;
    title: string;
    description: string | null;
    days_count: number;
    done_days: number;
    status: 'done' | 'current' | 'locked';
    enrolled: boolean;
};

export type LearnDay = {
    id: number;
    day_number: number;
    focus_text: string;
};

export type VocabCard = {
    id: number;
    word: string;
    pronounce: string | null;
    tag: string | null;
    translation_en: string;
    translation_bn: string | null;
    example: string | null;
};

export type ListeningWord = {
    word: string;
    pronounce: string | null;
    meaning: string | null;
};

export type ListeningItem = {
    id: number;
    type: 'audio' | 'video';
    video_url: string | null;
    script: string | null;
    title: string;
    duration_label: string;
    words: ListeningWord[];
};

export type ReadingItem = {
    id: number;
    instruction: string;
    article_url: string | null;
    passage: string;
    words: ListeningWord[];
};

export type SpeakingAiLine = {
    id: number;
    text: string;
    sort_order: number;
};

export type SpeakingItem = {
    id: number;
    target_sentence: string;
    ai_lines: SpeakingAiLine[];
};

export type DayProgress = {
    wortschatz: boolean;
    hoeren: boolean;
    lesen: boolean;
    sprechen: boolean;
};

export type CompletionSummary = {
    requiredSkills: (keyof DayProgress)[];
    doneCount: number;
    isDayComplete: boolean;
};

export type ChatMessage = {
    id: string;
    sender: 'ai' | 'user';
    text: string;
};
