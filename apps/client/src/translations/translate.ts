import type { Language } from '@config/app.ts';

export function translate(key, lang: Language): string {
  if (!key) return '';
  return key[lang] || key.en || '';
}
