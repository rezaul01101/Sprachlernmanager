import { ReferenceEntry } from '@/types/learn';

// display = the letter itself; spoken = how the letter is named aloud in
// German (fed to TTS), since a bare single character mispronounces on most
// speech engines.
const LETTERS: { letter: string; spoken: string; pronounce: string }[] = [
    { letter: 'A', spoken: 'A', pronounce: 'আ' },
    { letter: 'B', spoken: 'Be', pronounce: 'বে' },
    { letter: 'C', spoken: 'Ce', pronounce: 'ৎসে' },
    { letter: 'D', spoken: 'De', pronounce: 'ডে' },
    { letter: 'E', spoken: 'E', pronounce: 'এ' },
    { letter: 'F', spoken: 'Ef', pronounce: 'এফ' },
    { letter: 'G', spoken: 'Ge', pronounce: 'গে' },
    { letter: 'H', spoken: 'Ha', pronounce: 'হা' },
    { letter: 'I', spoken: 'I', pronounce: 'ই' },
    { letter: 'J', spoken: 'Jot', pronounce: 'ইয়োট' },
    { letter: 'K', spoken: 'Ka', pronounce: 'কা' },
    { letter: 'L', spoken: 'El', pronounce: 'এল' },
    { letter: 'M', spoken: 'Em', pronounce: 'এম' },
    { letter: 'N', spoken: 'En', pronounce: 'এন' },
    { letter: 'O', spoken: 'O', pronounce: 'ও' },
    { letter: 'P', spoken: 'Pe', pronounce: 'পে' },
    { letter: 'Q', spoken: 'Qu', pronounce: 'কু' },
    { letter: 'R', spoken: 'Er', pronounce: 'এয়ার' },
    { letter: 'S', spoken: 'Es', pronounce: 'এস' },
    { letter: 'T', spoken: 'Te', pronounce: 'টে' },
    { letter: 'U', spoken: 'U', pronounce: 'উ' },
    { letter: 'V', spoken: 'Vau', pronounce: 'ফাউ' },
    { letter: 'W', spoken: 'We', pronounce: 'ভে' },
    { letter: 'X', spoken: 'Ix', pronounce: 'ইক্স' },
    { letter: 'Y', spoken: 'Ypsilon', pronounce: 'ইপ্সিলন' },
    { letter: 'Z', spoken: 'Zet', pronounce: 'ৎসেট' },
    { letter: 'Ä', spoken: 'Ä', pronounce: 'অ্যা' },
    { letter: 'Ö', spoken: 'Ö', pronounce: 'ও়' },
    { letter: 'Ü', spoken: 'Ü', pronounce: 'উ়' },
    { letter: 'ß', spoken: 'Eszett', pronounce: 'এসৎসেট' },
];

export const ALPHABET: ReferenceEntry[] = LETTERS.map(
    ({ letter, spoken, pronounce }) => ({
        display: letter,
        spoken,
        pronounce,
        meaning: null,
    }),
);
