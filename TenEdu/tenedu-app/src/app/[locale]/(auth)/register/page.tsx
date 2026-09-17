"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", passwordConfirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Атыңызды енгізіңіз."); return; }
    if (form.password.length < 6) { setError("Пароль кемінде 6 символдан тұруы керек."); return; }
    if (form.password !== form.passwordConfirm) { setError("Парольдер сәйкес келмейді."); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, onboarding_done: false },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
        },
      });
      if (authError) {
        setError(
          authError.message.includes("already registered")
            ? "Бұл email бұрыннан тіркелген. Кіруге тырысыңыз."
            : "Тіркелу қатесі: " + authError.message
        );
        return;
      }
      setSentEmail(form.email);
      setSent(true);
    } catch {
      setError("Қосылу қатесі. Интернет байланысын тексеріңіз.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch {
      setError("Google арқылы тіркелу сәтсіз болды.");
      setGoogleLoading(false);
    }
  }

  // ── Email sent screen ────────────────────────────────────────
  if (sent) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 px-4 py-12" id="main-content">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-green-100 rounded-[0.75rem] flex items-center justify-center">
              <MailCheck className="w-9 h-9 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-800 mb-3">Emailді тексеріңіз!</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            <span className="font-semibold text-primary-700">{sentEmail}</span> мекенжайына
            растау сілтемесі жіберілді.
          </p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Хатты ашып, «Растау» батырмасын басыңыз — содан кейін оқуды бастай аласыз.
            Хат 1–2 минут ішінде келеді, «Спам» қалтасын да тексеріңіз.
          </p>
          <Link href="/login" className="text-primary-600 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">
            Кіру бетіне өту →
          </Link>
        </Card>
      </main>
    );
  }

  // ── Register form ─────────────────────────────────────────────
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 px-4 py-12" id="main-content">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-primary-700 rounded-[0.75rem] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-800">Тіркелу — тегін!</h1>
          <p className="text-gray-500 mt-1">TeńEdu-да оқуды бастаңыз</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-white border-2 border-gray-200 rounded-[0.75rem] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 disabled:opacity-50"
          aria-label="Google арқылы тіркелу"
        >
          {googleLoading ? (
            <svg className="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <GoogleIcon />
          )}
          Google арқылы тіркелу
        </button>

        <div className="flex items-center gap-3 mb-4" role="separator">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">немесе</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {error && (
          <div role="alert" className="mb-4 p-4 bg-white border border-red-200 text-red-700 rounded-[0.75rem] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Аты-жөніңіз</label>
            <input id="name" type="text" autoComplete="name" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-[0.75rem] border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-colors text-base"
              placeholder="Айдана Бекова" aria-required="true" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input id="email" type="email" autoComplete="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-[0.75rem] border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-colors text-base"
              placeholder="email@gmail.com" aria-required="true" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"}
                autoComplete="new-password" required minLength={6}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-[0.75rem] border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-colors text-base"
                placeholder="Кемінде 6 символ" aria-required="true" aria-describedby="pw-hint" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-lg"
                aria-label={showPassword ? "Парольді жасыру" : "Парольді көрсету"}>
                {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
            <p id="pw-hint" className="text-xs text-gray-400 mt-1">Кемінде 6 символ</p>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">Парольді растаңыз</label>
            <input id="passwordConfirm" type={showPassword ? "text" : "password"}
              autoComplete="new-password" required
              value={form.passwordConfirm} onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
              className="w-full px-4 py-3 rounded-[0.75rem] border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-colors text-base"
              placeholder="••••••••" aria-required="true" />
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Тіркелу
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Аккаунтыңыз бар ма?{" "}
          <Link href="/login" className="text-primary-600 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">
            Кіру
          </Link>
        </div>
      </Card>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
