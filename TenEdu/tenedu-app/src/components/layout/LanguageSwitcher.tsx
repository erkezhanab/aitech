'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { Locale, locales, localeLabels } from '@/i18n.config';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeLanguage = (newLocale: Locale) => {
    // Replace locale in pathname: /kk/... → /ru/...
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');

    router.push(newPathname);

    // Save to localStorage and Supabase (would be done in useEffect)
    localStorage.setItem('preferred-locale', newLocale);

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-[0.5rem] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
        aria-label="Тіл таңдау"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{localeLabels[locale as Locale].native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-[0.5rem] shadow-card z-50">
          <div className="py-1">
            {(locales as Locale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => handleChangeLanguage(loc)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  locale === loc
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="block font-medium">{localeLabels[loc].native}</span>
                <span className="text-xs text-gray-500">{localeLabels[loc].english}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
