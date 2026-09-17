-- ============================================================
-- TeńEdu — Full Database Schema v2
-- Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ ─────────────────────────────────
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  name            text not null default '',
  avatar_url      text,
  role            text not null default 'user' check (role in ('user', 'admin')),
  goal            text check (goal in ('study', 'work', 'personal')),
  age_range       text check (age_range in ('child', 'teen', 'young', 'adult')),

  -- Accessibility
  a11y_mode       text not null default 'standard'
                    check (a11y_mode in ('visual','hearing','dyslexia','children','standard')),
  font_size       int  not null default 16,
  theme           text not null default 'light'
                    check (theme in ('light','dark','cream','high-contrast')),
  dyslexic_font   boolean not null default false,
  auto_speak      boolean not null default false,
  tts_speed       numeric not null default 1.0,

  onboarding_done boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── 2. ТРЕКИ ─────────────────────────────────────────────────
create table if not exists public.tracks (
  id          text primary key,          -- e.g. 'track-1'
  slug        text unique not null,
  title       text not null,
  description text not null,
  emoji       text not null default '📚',
  color       text not null default 'blue',
  sort_order  int  not null default 0,
  is_children_only boolean not null default false,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── 3. МОДУЛИ ────────────────────────────────────────────────
create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  track_id    text references public.tracks(id) on delete cascade not null,
  title       text not null,
  description text not null,
  sort_order  int  not null default 0,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── 4. СЛАЙДЫ УРОКА ──────────────────────────────────────────
-- slide_type: 'title' | 'checklist' | 'content' | 'interactive' | 'summary'
create table if not exists public.slides (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid references public.modules(id) on delete cascade not null,
  sort_order  int  not null default 0,
  slide_type  text not null check (slide_type in ('title','checklist','content','interactive','summary')),
  -- JSON payload — разная структура для каждого типа
  -- title: { title, subtitle, emoji, illustration_emoji }
  -- checklist: { title, items: string[] }
  -- content: { title, text, emoji, tip, keyword_highlights: string[] }
  -- interactive: { title, prompt, items: { text, checked_default }[] }
  -- summary: { title, learned: string[], reflection: string[], resource_url, resource_label }
  content     jsonb not null default '{}',
  video_url   text,           -- опциональный YouTube URL
  audio_url   text,           -- опциональный аудиофайл (будущее)
  created_at  timestamptz not null default now()
);

-- ── 5. ТЕСТЫ ─────────────────────────────────────────────────
create table if not exists public.quiz_questions (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid references public.modules(id) on delete cascade not null,
  sort_order   int  not null default 0,
  question     text not null,
  question_type text not null default 'single' check (question_type in ('single','multiple')),
  options      jsonb not null,    -- string[]
  correct      jsonb not null,    -- int[] (индексы правильных ответов)
  explanation  text,              -- объяснение после ответа
  created_at   timestamptz not null default now()
);

-- ── 6. ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ ─────────────────────────────────
create table if not exists public.lesson_views (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  module_id    uuid references public.modules(id) on delete cascade not null,
  slides_seen  int not null default 0,
  total_slides int not null default 0,
  completed    boolean not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(user_id, module_id)
);

create table if not exists public.quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  module_id    uuid references public.modules(id) on delete cascade not null,
  score        int not null,          -- баллы
  total        int not null,          -- всего вопросов
  passed       boolean not null,
  answers      jsonb not null,        -- { question_id: [selected_indices] }
  attempt_num  int not null default 1,
  created_at   timestamptz not null default now()
);

create table if not exists public.module_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  module_id    uuid references public.modules(id) on delete cascade not null,
  track_id     text references public.tracks(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  unique(user_id, module_id)
);

create table if not exists public.track_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  track_id     text references public.tracks(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  unique(user_id, track_id)
);

-- ── 7. ФИДБЕК ────────────────────────────────────────────────
create table if not exists public.feedback (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  track_id     text references public.tracks(id) on delete cascade not null,
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique(user_id, track_id)
);

-- ── 8. ТРИГГЕРЫ ──────────────────────────────────────────────

-- Автосоздание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Автообновление updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists lesson_views_updated_at on public.lesson_views;
create trigger lesson_views_updated_at
  before update on public.lesson_views
  for each row execute function public.update_updated_at();

-- ── 9. ROW LEVEL SECURITY ────────────────────────────────────

alter table public.profiles          enable row level security;
alter table public.tracks            enable row level security;
alter table public.modules           enable row level security;
alter table public.slides            enable row level security;
alter table public.quiz_questions    enable row level security;
alter table public.lesson_views      enable row level security;
alter table public.quiz_attempts     enable row level security;
alter table public.module_completions enable row level security;
alter table public.track_completions enable row level security;
alter table public.feedback          enable row level security;

-- profiles
create policy "Own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "Own profile update" on public.profiles for update using (auth.uid() = id);

-- content: читают все авторизованные
create policy "Tracks read"     on public.tracks         for select using (auth.role() = 'authenticated');
create policy "Modules read"    on public.modules        for select using (auth.role() = 'authenticated');
create policy "Slides read"     on public.slides         for select using (auth.role() = 'authenticated');
create policy "Quiz read"       on public.quiz_questions for select using (auth.role() = 'authenticated');

-- content: пишет только admin (через service_role из админки)
create policy "Admin tracks write" on public.tracks for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin modules write" on public.modules for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin slides write" on public.slides for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin quiz write" on public.quiz_questions for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- прогресс пользователя
create policy "Own lesson views" on public.lesson_views for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own quiz attempts" on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own module completions" on public.module_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own track completions" on public.track_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own feedback" on public.feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- admin читает всё
create policy "Admin read all lesson_views" on public.lesson_views for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin read all quiz_attempts" on public.quiz_attempts for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin read all feedback" on public.feedback for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admin read all profiles" on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- ── 10. SEED: ТРЕКИ ──────────────────────────────────────────
insert into public.tracks (id, slug, title, description, emoji, color, sort_order, is_children_only) values
  ('track-1', 'digital-basics',    'Базалық цифрлық сауаттылық',  'Компьютерді нөлден үйрен: құжаттар, email, интернет', '💻', 'blue',   1, false),
  ('track-2', 'digital-life',      'Өмірдегі цифрлық дағдылар',   'eGov.kz, онлайн-банкинг, интернет қауіпсіздігі',      '🏛️', 'green',  2, false),
  ('track-3', 'work-and-study',    'Оқу және жұмыс',              'Түйіндеме, жұмыс іздеу, онлайн сұхбат',               '💼', 'purple', 3, false),
  ('track-children', 'first-steps','Алғашқы қадамдар',            '8–12 жас: компьютер негіздері, интернет қауіпсіздігі', '🌟', 'yellow', 4, true)
on conflict (id) do nothing;
