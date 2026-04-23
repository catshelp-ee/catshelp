import type {Language} from '@context/language-context.tsx';

export function translate(key: any, lang: Language): string {
    if (!key) return '';
    return key[lang] || key.en || '';
}