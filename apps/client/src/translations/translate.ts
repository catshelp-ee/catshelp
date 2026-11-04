import type { Language } from '@config/app.ts';

export function translate(key: Record<Language, string> | Record<Language, (args?: any) => string>, lang: Language, args?: any): string {
    if (!key) return '';
    const translation = key[lang] || key['en'] || '';
    if (typeof translation === 'function') {
        return translation(args);
    }
    return translation;
}
