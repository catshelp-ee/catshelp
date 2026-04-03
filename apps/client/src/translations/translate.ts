import type {Language} from '@context/language-context';

export function translate(key: any, lang: Language): string {
    if (!key) return '';
    return key[lang] || key.en || '';
}