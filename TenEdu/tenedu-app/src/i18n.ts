import { getRequestConfig } from 'next-intl/server';
import { getMessages, Locale, locales, defaultLocale } from '@/i18n.config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale,
    messages: await getMessages(locale),
  };
});
