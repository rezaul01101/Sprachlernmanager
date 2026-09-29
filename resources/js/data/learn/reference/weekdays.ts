import { ReferenceEntry } from '@/types/learn';

const WEEKDAY_WORDS: { german: string; pronounce: string; meaning: string }[] =
    [
        { german: 'Montag', pronounce: 'মোন্টাক', meaning: 'Monday' },
        { german: 'Dienstag', pronounce: 'ডীন্সটাক', meaning: 'Tuesday' },
        { german: 'Mittwoch', pronounce: 'মিটভোখ', meaning: 'Wednesday' },
        { german: 'Donnerstag', pronounce: 'ডোনারসটাক', meaning: 'Thursday' },
        { german: 'Freitag', pronounce: 'ফ্রাইটাক', meaning: 'Friday' },
        { german: 'Samstag', pronounce: 'জামস্টাক', meaning: 'Saturday' },
        { german: 'Sonntag', pronounce: 'জোনটাক', meaning: 'Sunday' },
    ];

const RELATIVE_DAY_WORDS: {
    german: string;
    pronounce: string;
    meaning: string;
}[] = [
    { german: 'heute', pronounce: 'হয়টে', meaning: 'today' },
    { german: 'gestern', pronounce: 'গেস্টার্ন', meaning: 'yesterday' },
    { german: 'morgen', pronounce: 'মোরগেন', meaning: 'tomorrow' },
    {
        german: 'vorgestern',
        pronounce: 'ফোরগেস্টার্ন',
        meaning: 'the day before yesterday',
    },
    {
        german: 'übermorgen',
        pronounce: 'উবারমোরগেন',
        meaning: 'the day after tomorrow',
    },
];

export const WEEKDAYS: ReferenceEntry[] = [
    ...WEEKDAY_WORDS,
    ...RELATIVE_DAY_WORDS,
].map(({ german, pronounce, meaning }) => ({
    display: german,
    spoken: german,
    pronounce,
    meaning,
}));
