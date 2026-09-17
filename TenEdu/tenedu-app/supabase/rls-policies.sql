-- TeńEdu RLS Policies
-- Run these SQL commands in Supabase Dashboard > SQL Editor

-- ════════════════════════════════════════════════════════════════
-- 1. PROFILES TABLE RLS
-- ════════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Public can read profiles (for leaderboards, etc.)
-- Disabled for privacy
-- CREATE POLICY "Public can view profiles"
-- ON public.profiles FOR SELECT
-- USING (true);

-- ════════════════════════════════════════════════════════════════
-- 2. MODULE_COMPLETIONS TABLE RLS
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;

-- Users can see their own completions
CREATE POLICY "Users can view own completions"
ON public.module_completions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions"
ON public.module_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own completions
CREATE POLICY "Users can update own completions"
ON public.module_completions FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all completions
CREATE POLICY "Admins can view all completions"
ON public.module_completions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ════════════════════════════════════════════════════════════════
-- 3. FEEDBACK TABLE RLS
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can see all feedback (public reviews)
CREATE POLICY "Users can view all feedback"
ON public.feedback FOR SELECT
USING (true);

-- Users can insert feedback
CREATE POLICY "Users can insert feedback"
ON public.feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback"
ON public.feedback FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete own feedback"
ON public.feedback FOR DELETE
USING (auth.uid() = user_id);

-- Admins can delete any feedback
CREATE POLICY "Admins can delete any feedback"
ON public.feedback FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ════════════════════════════════════════════════════════════════
-- 4. QUIZ_ATTEMPTS TABLE RLS
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can see their own attempts
CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert attempts
CREATE POLICY "Users can insert quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all attempts
CREATE POLICY "Admins can view all quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ════════════════════════════════════════════════════════════════
-- 5. TRACK_COMPLETIONS TABLE RLS
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.track_completions ENABLE ROW LEVEL SECURITY;

-- Users can see their own track completions
CREATE POLICY "Users can view own track completions"
ON public.track_completions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert track completions
CREATE POLICY "Users can insert track completions"
ON public.track_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all track completions
CREATE POLICY "Admins can view all track completions"
ON public.track_completions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ════════════════════════════════════════════════════════════════
-- 6. LESSON_VIEWS TABLE RLS
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.lesson_views ENABLE ROW LEVEL SECURITY;

-- Users can see their own lesson views
CREATE POLICY "Users can view own lesson views"
ON public.lesson_views FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert lesson views
CREATE POLICY "Users can insert lesson views"
ON public.lesson_views FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════
-- SUMMARY
-- ════════════════════════════════════════════════════════════════
--
-- Пользователи видят:
-- ✓ Только свои данные (completions, attempts, views)
-- ✓ Все feedback (публичные отзывы)
-- ✓ Свой профиль
--
-- Админы видят:
-- ✓ Все профили
-- ✓ Все completions
-- ✓ Все quiz attempts
-- ✓ Все feedback
-- ✓ Могут удалять feedback
--
-- Публика видит:
-- ✓ Feedback (не требует авторизации)
--
-- Неавторизованные пользователи видят:
-- ✗ Ничего (требуется авторизация)
