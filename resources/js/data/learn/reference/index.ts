import type { ReferenceEntry, ReferenceTopic } from '@/types/learn';
import { ALPHABET } from './alphabet';
import { MONTHS_AND_YEAR } from './months';
import { NUMBERS } from './numbers';
import { WEEKDAYS } from './weekdays';

export const REFERENCE_TILES: {
    topic: ReferenceTopic;
    emoji: string;
    title: string;
    subtitle: string;
}[] = [
    { topic: 'alphabet', emoji: '🔤', title: 'Alphabet', subtitle: 'A–Z' },
    { topic: 'numbers', emoji: '🔢', title: 'Numbers', subtitle: '1–100' },
    { topic: 'weekdays', emoji: '📅', title: 'Weekdays', subtitle: 'Mon–Sun' },
    {
        topic: 'months',
        emoji: '🗓️',
        title: 'Months & Year',
        subtitle: 'Jan–Dec',
    },
];

export const REFERENCE_SECTIONS: Record<
    ReferenceTopic,
    { title: string; subtitle: string; entries: ReferenceEntry[] }
> = {
    alphabet: {
        title: 'Alphabet',
        subtitle: 'The German alphabet',
        entries: ALPHABET,
    },
    numbers: {
        title: 'Numbers 1–100',
        subtitle: 'One to a hundred',
        entries: NUMBERS,
    },
    weekdays: {
        title: 'Weekdays',
        subtitle: 'Monday to Sunday, today, yesterday & tomorrow',
        entries: WEEKDAYS,
    },
    months: {
        title: 'Months & Year',
        subtitle: 'January to December',
        entries: MONTHS_AND_YEAR,
    },
};
