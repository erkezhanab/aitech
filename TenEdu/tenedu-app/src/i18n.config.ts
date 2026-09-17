import { notFound } from 'next/navigation';

export type Locale = 'kk' | 'ru' | 'en';

export const locales: Locale[] = ['kk', 'ru', 'en'];
export const defaultLocale: Locale = 'kk';

export const localeLabels: Record<Locale, { native: string; english: string }> = {
  kk: { native: 'Қазақша', english: 'Kazakh' },
  ru: { native: 'Русский', english: 'Russian' },
  en: { native: 'English', english: 'English' },
};

export const speechLangs: Record<Locale, string> = {
  kk: 'kk-KZ',
  ru: 'ru-RU',
  en: 'en-US',
};

// Load messages dynamically
const messages = {
  kk: () => import('./messages/kk.json').then(module => module.default),
  ru: () => import('./messages/ru.json').then(module => module.default),
  en: () => import('./messages/en.json').then(module => module.default),
};

export async function getMessages(locale: Locale) {
  try {
    return await messages[locale]();
  } catch {
    notFound();
  }
}
