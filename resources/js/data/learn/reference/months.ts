import { ReferenceEntry } from '@/types/learn';

const MONTH_WORDS: { german: string; pronounce: string; meaning: string }[] = [
    { german: 'Januar', pronounce: 'ইয়ানুয়ার', meaning: 'January' },
    { german: 'Februar', pronounce: 'ফেব্রুয়ার', meaning: 'February' },
    { german: 'März', pronounce: 'ম্যর্ৎস', meaning: 'March' },
    { german: 'April', pronounce: 'আপ্রিল', meaning: 'April' },
    { german: 'Mai', pronounce: 'মাই', meaning: 'May' },
    { german: 'Juni', pronounce: 'ইউনি', meaning: 'June' },
    { german: 'Juli', pronounce: 'ইউলি', meaning: 'July' },
    { german: 'August', pronounce: 'আউগুস্ট', meaning: 'August' },
    { german: 'September', pronounce: 'শেপ্টেম্বার', meaning: 'September' },
    { german: 'Oktober', pronounce: 'অক্টোবার', meaning: 'October' },
    { german: 'November', pronounce: 'নোভেম্বার', meaning: 'November' },
    { german: 'Dezember', pronounce: 'ডেৎসেম্বার', meaning: 'December' },
];

const YEAR_WORDS: { german: string; pronounce: string; meaning: string }[] = [
    { german: 'das Jahr', pronounce: 'ডাস ইয়ার', meaning: 'the year' },
    { german: 'der Monat', pronounce: 'ডের মোনাট', meaning: 'the month' },
    { german: 'die Woche', pronounce: 'ডি ভোখে', meaning: 'the week' },
    { german: 'der Tag', pronounce: 'ডের টাক', meaning: 'the day' },
];

export const MONTHS_AND_YEAR: ReferenceEntry[] = [
    ...MONTH_WORDS,
    ...YEAR_WORDS,
].map(({ german, pronounce, meaning }) => ({
    display: german,
    spoken: german,
    pronounce,
    meaning,
}));
