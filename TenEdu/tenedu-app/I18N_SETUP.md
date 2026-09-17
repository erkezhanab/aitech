# 🌍 i18n Интеграция TeńEdu

## Статус: ✅ Структура готова, требуется финализация

### Что установлено:
- ✅ `next-intl` библиотека
- ✅ `src/i18n.config.ts` - конфиг локалей
- ✅ `middleware.ts` - определение языка по URL
- ✅ `src/messages/kk.json`, `ru.json`, `en.json` - переводы
- ✅ `src/app/[locale]/layout.tsx` - Root layout с NextIntlClientProvider
- ✅ `src/app/[locale]/page.tsx` - Лендинг с useTranslations()
- ✅ `src/components/layout/LanguageSwitcher.tsx` - Переключатель языков
- ✅ `src/components/layout/Header.tsx` - Обновлён для i18n

### URL Маршруты:
```
/kk/                 → Казахский
/ru/                 → Русский
/en/                 → Английский
/                    → Редирект на /kk/
```

### Использование в компонентах:

#### Server Component:
```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations();
  return <h1>{t('hero.title')}</h1>;
}
```

#### Client Component:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations();
  return <button>{t('buttons.submit')}</button>;
}
```

### Следующие шаги для полной интеграции:

#### 1️⃣ Перенести старые маршруты под [locale]:
```bash
# Переместить (auth), (main), admin под [locale]/
src/app/[locale]/(auth)/...
src/app/[locale]/(main)/...
src/app/[locale]/admin/...
```

#### 2️⃣ Обновить все страницы на использование useTranslations():
```bash
# Примеры:
src/app/[locale]/(main)/dashboard/page.tsx
src/app/[locale]/(main)/catalog/page.tsx
src/app/[locale]/(main)/profile/page.tsx
src/app/[locale]/admin/dashboard/page.tsx
```

#### 3️⃣ Сохранение предпочтений языка в Supabase:

**Миграция БД:**
```sql
ALTER TABLE profiles ADD COLUMN preferred_language text DEFAULT 'kk';
```

**Обновить hook:**
```tsx
useEffect(() => {
  const supabase = createClient();
  supabase
    .from('profiles')
    .update({ preferred_language: locale })
    .eq('id', user.id);
}, [locale]);
```

#### 4️⃣ Web Speech API для озвучки:

```tsx
import { speechLangs } from '@/i18n.config';

const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = speechLangs[locale]; // 'kk-KZ', 'ru-RU', 'en-US'
window.speechSynthesis.speak(utterance);
```

#### 5️⃣ PDF сертификаты на выбранном языке:

```tsx
const generateCertificate = (locale: Locale, userName: string) => {
  const titles = {
    kk: 'Тап Сертификаты',
    ru: 'Сертификат',
    en: 'Certificate'
  };
  
  return generatePDF(titles[locale], userName);
};
```

#### 6️⃣ Содержание курсов (контент) на разных языках:

**Суpabase таблица `modules`:**
```sql
CREATE TABLE modules (
  id uuid PRIMARY KEY,
  title_kk text NOT NULL,
  title_ru text,
  title_en text,
  description_kk text,
  description_ru text,
  description_en text,
  ...
);
```

**Админка для редактирования:**
```tsx
<div className="flex gap-4">
  <input value={title_kk} placeholder="Қазақша аты" />
  <input value={title_ru} placeholder="Русское название" />
  <input value={title_en} placeholder="English title" />
</div>
```

**Фронт (display content):**
```tsx
const locale = useLocale();
const contentKey = `title_${locale}` as const;
const title = module[contentKey] || module.title_kk; // fallback to kk
```

### Список всех ключей переводов:

- `nav.*` - Навигация
- `hero.*` - Лендинг  
- `accessibility.*` - Режимы доступности
- `buttons.*` - Кнопки
- `onboarding.*` - Онбординг (5 шагов)
- `dashboard.*` - Дашборд
- `catalog.*` - Каталог курсов
- `quiz.*` - Тесты
- `profile.*` - Профиль
- `admin.*` - Админ панель
- `language.*` - Переключатель языка
- `content.*` - Контент курсов

### Проверка работы:

```bash
# Начнет с казахского
http://localhost:3000/kk/

# Переключитесь на русский
http://localhost:3000/ru/

# И на английский
http://localhost:3000/en/

# Используйте переключатель языка в header (иконка 🌐)
```

### Таблица покрытия переводов:

| Компонент | Статус | Примечание |
|-----------|--------|-----------|
| Header | ✅ | Обновлён с i18n |
| Landing | ✅ | Все ключи переведены |
| Navigation | ✅ | В Header |
| Buttons | ✅ | Все стандартные кнопки |
| Accessibility Panel | ⏳ | Готово к интеграции |
| Onboarding | ✅ | 5 шагов переведены |
| Dashboard | ✅ | Ключи подготовлены |
| Catalog | ✅ | Ключи подготовлены |
| Quiz | ✅ | Результаты переведены |
| Profile | ✅ | Основные функции |
| Admin Panel | ✅ | CRUD операции |

### Время на реализацию:
- Миграция маршрутов: ~30 мин
- Обновление компонентов: ~1-2 часа
- Суpabase интеграция: ~30 мин
- Web Speech API: ~15 мин
- Тестирование: ~30 мин

**Итого: ~3-4 часа для полной интеграции**

---

📝 **Автор:** Claude AI  
🗓️ **Дата:** 2026-06-12  
📦 **Версия:** next-intl 3.0+
