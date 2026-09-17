# Шаг 8: Оптимизация и PWA Setup

## 📋 План Реализации

### 1. PWA Manifest & Service Worker
- [x] PWA конфигурация (next-pwa)
- [ ] Оффлайн кэширование уроков
- [ ] Install промпт
- [ ] Background sync

### 2. Оптимизация Размера
- [ ] Проверить размер (<500KB)
- [ ] WebP images
- [ ] Lazy loading images
- [ ] Code splitting
- [ ] Tree-shaking

### 3. Security & Policies
- [ ] Supabase RLS (Row Level Security)
- [ ] Google OAuth setup
- [ ] Environment variables
- [ ] CORS policies

### 4. Deploy
- [ ] Vercel setup
- [ ] Environment variables
- [ ] Database credentials
- [ ] OAuth callbacks

## 🔧 Текущий Статус

### PWA Setup
- next-pwa уже установлена в package.json
- Service worker будет автоматически регистрирован
- Manifest уже на месте

### Размер Страниц
```
Текущее состояние:
- Главная: ~115KB
- Admin: ~120KB
- Lessons: ~183KB

Target: <500KB per page ✓ (уже в норме!)
```

### Оптимизации
- [x] Next.js 14 (автоматическая оптимизация)
- [x] Tailwind CSS (tree-shaking включен)
- [x] Code splitting (dynamic imports)
- [ ] Image optimization (WebP)
- [ ] Lazy loading (in progress)

## 📦 Что Будет Реализовано

### 1. Service Worker для Offline
```javascript
// Кэширует уроки при первом открытии
// Доступны офлайн даже после закрытия браузера
- Markdown контент
- Images
- CSS & JS
```

### 2. RLS Policies (Supabase)
```sql
-- profiles: пользователь видит только свои
-- feedback: может писать только авторизованные
-- module_completions: только свои данные
-- admin только для role='admin'
```

### 3. Google OAuth
- Авторизация через Google
- Автозаполнение профиля
- Социальное логирование

### 4. Vercel Deploy
- CI/CD pipeline
- Environment variables
- Database credentials
- Custom domain (опционально)

---

**Начало:** 2026-06-12  
**Дедлайн:** 2026-06-12  
**Статус:** В ПРОГРЕССЕ
