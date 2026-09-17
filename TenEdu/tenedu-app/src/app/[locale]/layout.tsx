import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, Locale, locales } from '@/i18n.config';
import './globals.css';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

export const dynamic = 'force-dynamic';
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TeńEdu — Тең білім бәріне',
  description:
    'Қазақстандағы ауыл жастары мен мүмкіндігі шектеулі азаматтарға арналған цифрлық сауаттылық платформасы',
  keywords: ['цифрлық сауаттылық', 'қазақ тілі', 'білім', 'онлайн оқу', 'accessible'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'TeńEdu — Тең білім бәріне',
    description:
      'Ауыл жастары мен мүмкіндігі шектеулі азаматтарға арналған тегін цифрлық сауаттылық платформасы',
    type: 'website',
    locale: 'kk_KZ',
  },
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={geistSans.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TeńEdu" />
        <meta name="theme-color" content="#1e3a5f" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AccessibilityProvider>
            {children}
          </AccessibilityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
