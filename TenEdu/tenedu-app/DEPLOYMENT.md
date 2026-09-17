# Deployment Guide — Vercel + Supabase

## 🚀 Quick Start

### 1. Vercel Setup (5 минут)

```bash
# 1. Запуши код на GitHub
git push origin main

# 2. Перейди на vercel.com и нажми "Import Project"
# 3. Выбери Repository: your-github/tenedu-app
# 4. Нажми Import

# 5. На странице конфигурации добавь Environment Variables (см. ниже)
```

### 2. Environment Variables

В Vercel Dashboard добавь эти переменные:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key-here

# Опционально (для Server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

Найти эти ключи можно в Supabase Dashboard:
- Settings > API
- Copy URL и "anon public" key

### 3. Google OAuth Setup

В Supabase Dashboard:

```
1. Перейди в Authentication > Providers
2. Включи Google
3. Добавь Google OAuth credentials:
   - Client ID: из Google Cloud Console
   - Client Secret: из Google Cloud Console

4. В Google Cloud Console добавь Redirect URI:
   https://your-project.supabase.co/auth/v1/callback
   https://your-vercel-app.vercel.app/auth/callback (если используешь)
```

### 4. Deploy

```bash
# Vercel автоматически деплоит при push
git push origin main

# Или вручную через Vercel Dashboard:
# Project > Deployments > Deploy
```

## 📋 Pre-Deployment Checklist

- [ ] Git initialized: `git status` показывает всё clean
- [ ] `npm run build` проходит без ошибок
- [ ] Environment variables добавлены в Vercel
- [ ] RLS политики добавлены в Supabase
- [ ] Google OAuth скоро будет настроен
- [ ] Accessibility audit passed (Шаг 7)
- [ ] Test login/register работает

## 🔒 Security Checklist

- [ ] .env.local не закоммичен (в .gitignore)
- [ ] NEXT_PUBLIC_ переменные только для public данных
- [ ] RLS политики включены на всех таблицах
- [ ] Middleware проверяет авторизацию
- [ ] Admin role проверяется на /admin маршруте
- [ ] CORS настроен в Supabase (если нужно)

## 📊 Post-Deployment

После успешного деплоя:

```
1. Проверь что сайт доступен
   - https://your-vercel-app.vercel.app

2. Тестирование:
   - Зарегистрируй новый аккаунт
   - Логинься через Google (если настроен)
   - Пройди курс
   - Проверь админку (/admin)
   - Озвучи страницу (Accessibility Panel)

3. Мониторинг:
   - Vercel Analytics (Speed, SEO, Web Vitals)
   - Supabase Logs (Authentication, Database)
   - Error tracking (если настроен)
```

## 🌍 Custom Domain (Опционально)

```
1. В Vercel Dashboard > Settings > Domains
2. Добавь свой домен
3. Обнови DNS records (будут показаны в Vercel)
4. Подожди 24 часа для распространения DNS

Пример DNS records:
Name: www
Type: CNAME
Value: cname.vercel-dns.com

Name: @
Type: A
Value: 76.76.19.165
```

## 🆘 Troubleshooting

### Проблема: Build fails на Vercel
```
Решение:
1. Проверь npm run build локально
2. Удали node_modules и .next
3. npm install && npm run build
4. Пуш на GitHub
```

### Проблема: CORS errors
```
Решение:
В Supabase Settings > API > CORS:
Добавь: https://your-vercel-app.vercel.app
```

### Проблема: Environment variables не работают
```
Решение:
1. Проверь в Vercel Dashboard что переменные добавлены
2. Перейди на Deployments > Redeploy
3. Может потребоваться перезагрузка страницы
```

### Проблема: Google OAuth не работает
```
Решение:
1. Проверь Client ID и Secret в Google Cloud
2. Убедись что Redirect URI правильный
3. Проверь что Google provider включен в Supabase
4. Очисти cookies и попробуй снова
```

## 📱 PWA Installation

После деплоя пользователи смогут:

```
1. Установить app как PWA:
   - Chrome: Menu > Install app
   - Safari: Share > Add to Home Screen
   - Android: Menu > Install app

2. Использовать offline:
   - App работает без интернета
   - Синхронизирует при возвращении онлайн
```

## 🔗 Полезные Ссылки

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Status:** Ready to Deploy ✅  
**Last Updated:** 2026-06-12  
**Next Steps:** Follow steps above to deploy!
