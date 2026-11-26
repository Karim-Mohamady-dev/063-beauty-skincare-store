import en from '../locales/en/common.json';
import ar from '../locales/ar/common.json';

export type Lang = 'en' | 'ar';
export type Dict = Record<string, string>;

export const dicts: Record<Lang, Dict> = {
  en: en as Dict,
  ar: ar as Dict,
};

export function initialLang(storageKey: string): Lang {
  try {
    return localStorage.getItem(storageKey) === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

export function t(dict: Dict, key: string): string {
  return dict[key] ?? key;
}
