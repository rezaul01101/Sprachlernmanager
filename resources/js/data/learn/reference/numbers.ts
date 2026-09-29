import { ReferenceEntry } from '@/types/learn';

// German compounds numbers 21-99 as "[unit]und[tens]" (e.g. 25 =
// "fünfundzwanzig"), with "eins" shortening to "ein" in that position — this
// table generates all 100 words/pronunciations from those grammar rules
// instead of hand-authoring 100 error-prone lines.
const UNITS: Record<
    number,
    {
        word: string;
        compoundWord?: string;
        pronounce: string;
        compoundPronounce?: string;
    }
> = {
    1: {
        word: 'eins',
        compoundWord: 'ein',
        pronounce: 'আইন্স',
        compoundPronounce: 'আইন',
    },
    2: { word: 'zwei', pronounce: 'ৎসভাই' },
    3: { word: 'drei', pronounce: 'ড্রাই' },
    4: { word: 'vier', pronounce: 'ফির' },
    5: { word: 'fünf', pronounce: 'ফ্যুনফ' },
    6: { word: 'sechs', pronounce: 'জেক্স' },
    7: { word: 'sieben', pronounce: 'জীবেন' },
    8: { word: 'acht', pronounce: 'আখ্ট' },
    9: { word: 'neun', pronounce: 'নয়ন' },
};

const TEENS: Record<number, { word: string; pronounce: string }> = {
    10: { word: 'zehn', pronounce: 'ৎসেন' },
    11: { word: 'elf', pronounce: 'এল্ফ' },
    12: { word: 'zwölf', pronounce: 'ৎসভ্যোল্ফ' },
    13: { word: 'dreizehn', pronounce: 'ড্রাইৎসেন' },
    14: { word: 'vierzehn', pronounce: 'ফিয়ারৎসেন' },
    15: { word: 'fünfzehn', pronounce: 'ফ্যুনফৎসেন' },
    16: { word: 'sechzehn', pronounce: 'জেখৎসেন' },
    17: { word: 'siebzehn', pronounce: 'জীপৎসেন' },
    18: { word: 'achtzehn', pronounce: 'আখ্টৎসেন' },
    19: { word: 'neunzehn', pronounce: 'নয়নৎসেন' },
};

const TENS: Record<number, { word: string; pronounce: string }> = {
    20: { word: 'zwanzig', pronounce: 'ৎস্সভানৎসিশ' },
    30: { word: 'dreißig', pronounce: 'ড্রাইসিশ' },
    40: { word: 'vierzig', pronounce: 'ফিয়ারৎসিশ' },
    50: { word: 'fünfzig', pronounce: 'ফ্যুনফৎসিশ' },
    60: { word: 'sechzig', pronounce: 'জেখৎসিশ' },
    70: { word: 'siebzig', pronounce: 'জীপৎসিশ' },
    80: { word: 'achtzig', pronounce: 'আখ্টৎসিশ' },
    90: { word: 'neunzig', pronounce: 'নয়নৎসিশ' },
};

function germanNumber(n: number): { word: string; pronounce: string } {
    if (n === 100) return { word: 'hundert', pronounce: 'হুন্ডার্ট' };
    if (n <= 9) return UNITS[n];
    if (n <= 19) return TEENS[n];
    if (n % 10 === 0) return TENS[n];

    const tens = TENS[n - (n % 10)];
    const unit = UNITS[n % 10];
    return {
        word: `${unit.compoundWord ?? unit.word}und${tens.word}`,
        pronounce: `${unit.compoundPronounce ?? unit.pronounce}-উন্ড-${tens.pronounce}`,
    };
}

export const NUMBERS: ReferenceEntry[] = Array.from({ length: 100 }, (_, i) => {
    const n = i + 1;
    const { word, pronounce } = germanNumber(n);
    return { display: word, spoken: word, pronounce, meaning: String(n) };
});
