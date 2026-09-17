"use client";

import { useState, useEffect, useRef } from "react";
import {
  User, Mail, Lock, ChevronDown, ChevronUp,
  Download, CheckCircle2, Eye, EyeOff, Save, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AccessibilityMode, LearningGoal, Theme, TTSSpeed } from "@/types";

// ── Types ─────────────────────────────────────────────────────
interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  goal: LearningGoal | null;
  age_range: string | null;
  a11y_mode: AccessibilityMode;
  font_size: number;
  theme: Theme;
  dyslexic_font: boolean;
  auto_speak: boolean;
  tts_speed: number;
  onboarding_done: boolean;
}

interface TrackProgress {
  track_id: string;
  track_title: string;
  track_emoji: string;
  completed_modules: number;
  total_modules: number;
  is_completed: boolean;
  completed_at: string | null;
}

const MODE_OPTIONS: { id: AccessibilityMode; emoji: string; title: string; desc: string }[] = [
  { id: "standard", emoji: "🎯", title: "Стандарт",       desc: "Кәдімгі интерфейс"             },
  { id: "visual",   emoji: "👁",  title: "Дыбыспен оқу",   desc: "Авто-TTS, үлкен шрифт"          },
  { id: "hearing",  emoji: "👂",  title: "Мәтін арқылы",   desc: "Субтитрлер, визуалды хабарлар"  },
  { id: "dyslexia", emoji: "📖",  title: "Дислексия",       desc: "OpenDyslexic, кремді фон"       },
  { id: "children", emoji: "🧒",  title: "Балалар",         desc: "Геймификация, 8–12 жас"         },
];

const AGE_LABELS: Record<string, string> = {
  child: "12 жасқа дейін",
  teen:  "13–17 жас",
  young: "18–25 жас",
  adult: "25 жастан жоғары",
};

const GOAL_LABELS: Record<LearningGoal, string> = {
  study:    "Оқу үшін",
  work:     "Жұмыс үшін",
  personal: "Өз бетімше",
};

const PREVIEW_TEXT = "Айдана компьютерді алғаш рет қосты. Экранда жұмыс үстелі пайда болды.";

// ── Collapsible section ───────────────────────────────────────
function Section({
  title, emoji, children, defaultOpen = true,
}: {
  title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden" style={{ background: "var(--te-surface)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 rounded-xl"
        aria-expanded={open}
      >
        <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--te-text)" }}>
          <span aria-hidden="true">{emoji}</span> {title}
        </h2>
        {open
          ? <ChevronUp className="w-5 h-5 shrink-0" style={{ color: "var(--te-text-muted)" }} aria-hidden="true" />
          : <ChevronDown className="w-5 h-5 shrink-0" style={{ color: "var(--te-text-muted)" }} aria-hidden="true" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ProfilePage() {
  const { mode, effective, overrides, setMode, setOverride } = useAccessibility();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<TrackProgress[]>([]);

  // Edit states
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState<LearningGoal | null>(null);
  const [editAge, setEditAge] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password change
  const [showPwSection, setShowPwSection] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Avatar upload ref
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Load profile ───────────────────────────────────────────
  useEffect(() => {
    async function load() {
      // Demo mode: show a test profile without Supabase
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        setProfile({
          id: "demo-user",
          name: "Демо қолданушы",
          email: "demo@tenedu.kz",
          avatar_url: null,
          role: "admin",
          goal: "study",
          age_range: "young",
          a11y_mode: "standard",
          font_size: 16,
          theme: "light",
          dyslexic_font: false,
          auto_speak: false,
          tts_speed: 1,
          onboarding_done: true,
        });
        setEditName("Демо қолданушы");
        setEditGoal("study");
        setEditAge("young");
        setProgress([
          { track_id: "computer-basics", track_title: "Компьютерлік сауаттылық", track_emoji: "💻", completed_modules: 2, total_modules: 3, is_completed: false, completed_at: null },
          { track_id: "digital-life", track_title: "Цифрлық өмір дағдылары", track_emoji: "🌐", completed_modules: 3, total_modules: 3, is_completed: true, completed_at: new Date().toISOString() },
        ]);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (p) {
        setProfile({ ...p, email: user.email ?? "" });
        setEditName(p.name ?? "");
        setEditGoal(p.goal ?? null);
        setEditAge(p.age_range ?? null);
      }

      // Прогресс: module_completions JOIN tracks (используем статические данные)
      const { data: completions } = await supabase
        .from("module_completions")
        .select("track_id, module_id, completed_at")
        .eq("user_id", user.id);

      const { data: trackRows } = await supabase
        .from("tracks")
        .select("id, title, emoji")
        .order("sort_order");

      const { data: moduleRows } = await supabase
        .from("modules")
        .select("id, track_id");

      if (trackRows && moduleRows) {
        const prog: TrackProgress[] = trackRows.map((t) => {
          const trackModules = moduleRows.filter((m) => m.track_id === t.id);
          const doneModules = (completions ?? []).filter((c) => c.track_id === t.id);
          const done = doneModules.length;
          const total = trackModules.length || 1;
          const isCompleted = done >= total && total > 0;
          const lastDone = doneModules.sort((a, b) =>
            new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          )[0];
          return {
            track_id: t.id,
            track_title: t.title,
            track_emoji: t.emoji,
            completed_modules: done,
            total_modules: total,
            is_completed: isCompleted,
            completed_at: lastDone?.completed_at ?? null,
          };
        });
        setProgress(prog);
      }

      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, []);

  // ── Save profile ───────────────────────────────────────────
  async function handleSaveProfile() {
    if (!profile) return;
    setSavingProfile(true);
    try {
      const supabase = createClient();
      await supabase.from("profiles").update({
        name: editName.trim(),
        goal: editGoal,
        age_range: editAge,
      }).eq("id", profile.id);
      setProfile((p) => p ? { ...p, name: editName.trim(), goal: editGoal, age_range: editAge } : p);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setSavingProfile(false);
    }
  }

  // ── Change mode (immediate + Supabase) ────────────────────
  async function handleModeChange(newMode: AccessibilityMode) {
    setMode(newMode);
    if (!profile) return;
    const supabase = createClient();
    await supabase.from("profiles").update({
      a11y_mode:    newMode,
      theme:        newMode === "visual" ? "high-contrast" : newMode === "dyslexia" ? "cream" : "light",
      auto_speak:   newMode === "visual",
      dyslexic_font: newMode === "dyslexia",
    }).eq("id", profile.id);
  }

  // ── Change display setting (immediate + Supabase) ─────────
  async function handleDisplayChange<K extends "fontSize" | "theme" | "dyslexicFont" | "autoTTS" | "ttsSpeed">(
    key: K,
    value: number | string | boolean
  ) {
    if (key === "fontSize")    setOverride("fontSize",    value as number);
    if (key === "theme")       setOverride("theme",       value as Theme);
    if (key === "dyslexicFont") setOverride("dyslexicFont", value as boolean);
    if (key === "autoTTS")     setOverride("autoTTS",     value as boolean);
    if (key === "ttsSpeed")    setOverride("ttsSpeed",    value as TTSSpeed);

    if (!profile) return;
    const supabase = createClient();
    const dbKey: Record<string, string> = {
      fontSize: "font_size", theme: "theme",
      dyslexicFont: "dyslexic_font", autoTTS: "auto_speak", ttsSpeed: "tts_speed",
    };
    await supabase.from("profiles").update({ [dbKey[key]]: value }).eq("id", profile.id);
  }

  // ── Password change ────────────────────────────────────────
  async function handlePasswordChange() {
    setPwMsg(null);
    if (pw.next.length < 6) { setPwMsg({ type: "err", text: "Пароль кемінде 6 символ болуы керек." }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ type: "err", text: "Парольдер сәйкес келмейді." }); return; }
    setPwLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: pw.next });
      if (error) { setPwMsg({ type: "err", text: "Қате: " + error.message }); }
      else {
        setPwMsg({ type: "ok", text: "Пароль сәтті өзгертілді." });
        setPw({ current: "", next: "", confirm: "" });
        setShowPwSection(false);
      }
    } finally { setPwLoading(false); }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function generateCertificate(trackTitle: string, trackEmoji: string) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", format: "a4" });
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(245, 183, 0);
    doc.rect(10, 10, 277, 190, "S");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14); doc.text("TeńEdu — Тең білім бәріне", 148, 40, { align: "center" });
    doc.setFontSize(36); doc.setTextColor(245, 183, 0);
    doc.text("СЕРТИФИКАТ", 148, 70, { align: "center" });
    doc.setFontSize(18); doc.setTextColor(255, 255, 255);
    doc.text("Бұл сертификат мынаны растайды:", 148, 92, { align: "center" });
    doc.setFontSize(22); doc.setTextColor(245, 183, 0);
    doc.text(profile?.name || "Пайдаланушы", 148, 108, { align: "center" });
    doc.setFontSize(16); doc.setTextColor(200, 220, 255);
    doc.text(`"${trackEmoji} ${trackTitle}" тректін аяқтады`, 148, 124, { align: "center" });
    doc.setFontSize(12); doc.setTextColor(150, 180, 220);
    doc.text(new Date().toLocaleDateString("kk-KZ", { year: "numeric", month: "long", day: "numeric" }), 148, 150, { align: "center" });
    doc.save(`tenedu-sertifikat-${profile?.name ?? "user"}.pdf`);
  }

  const currentFontSize = overrides.fontSize ?? effective.fontSize;
  const currentTheme    = overrides.theme    ?? effective.theme;
  const isDyslexicFont  = overrides.dyslexicFont ?? (effective.fontFamily === "dyslexic");
  const isAutoTTS       = overrides.autoTTS ?? effective.autoTTS;
  const currentTTSSpeed = overrides.ttsSpeed ?? 1;

  if (loading) {
    return (
      <main className="py-12 px-4 max-w-2xl mx-auto" id="main-content">
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map((i) => (
            <div key={i} className="h-32 rounded-[1rem]" style={{ background: "var(--te-border)" }} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 px-4 max-w-2xl mx-auto space-y-4" id="main-content" style={{ background: "var(--te-bg)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--te-text)" }}>Менің профилім</h1>

      {/* ── 1. Жеке деректер ─────────────────────────────────── */}
      <Section title="Жеке деректер" emoji="👤">
        {/* Avatar + name/email row */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="relative w-16 h-16 rounded-[0.75rem] overflow-hidden bg-primary-100 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 shrink-0"
            aria-label="Аватарды өзгерту"
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Аватар" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary-400" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white text-xs opacity-0 hover:opacity-100 font-medium">Өзгерту</span>
            </div>
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" className="sr-only" aria-label="Аватар файлы" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-tight truncate" style={{ color: "var(--te-text)" }}>
              {profile?.name || "—"}
            </p>
            <p className="text-sm flex items-center gap-1" style={{ color: "var(--te-text-muted)" }}>
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              {profile?.email}
            </p>
            {profile?.role === "admin" && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold mt-1 inline-block">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="prof-name" className="block text-sm font-medium mb-1.5" style={{ color: "var(--te-text-muted)" }}>
              Аты-жөніңіз
            </label>
            <input
              id="prof-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 rounded-[0.75rem] border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100 text-base"
              style={{ background: "var(--te-bg)", color: "var(--te-text)", borderColor: "var(--te-border)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--te-text-muted)" }}>Жасыңыз</label>
              <select
                value={editAge ?? ""}
                onChange={(e) => setEditAge(e.target.value || null)}
                className="w-full px-4 py-3 rounded-[0.75rem] border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100 text-base"
                style={{ background: "var(--te-bg)", color: "var(--te-text)", borderColor: "var(--te-border)" }}
              >
                <option value="">—</option>
                {Object.entries(AGE_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--te-text-muted)" }}>Мақсат</label>
              <select
                value={editGoal ?? ""}
                onChange={(e) => setEditGoal((e.target.value as LearningGoal) || null)}
                className="w-full px-4 py-3 rounded-[0.75rem] border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100 text-base"
                style={{ background: "var(--te-bg)", color: "var(--te-text)", borderColor: "var(--te-border)" }}
              >
                <option value="">—</option>
                {Object.entries(GOAL_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSaveProfile}
              loading={savingProfile}
              disabled={editName.trim().length < 2}
              size="md"
              className="flex-1"
            >
              {profileSaved ? <><CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Сақталды!</> : <><Save className="w-4 h-4" aria-hidden="true" /> Сақтау</>}
            </Button>
          </div>
        </div>

        {/* Password change */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--te-border)" }}>
          <button
            onClick={() => setShowPwSection(!showPwSection)}
            className="flex items-center gap-2 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
            style={{ color: "var(--te-text-muted)" }}
            aria-expanded={showPwSection}
          >
            <Lock className="w-4 h-4" aria-hidden="true" />
            Парольді өзгерту
            {showPwSection ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
          </button>
          {showPwSection && (
            <div className="mt-4 space-y-3">
              {pwMsg && (
                <div
                  role="alert"
                  className={cn("p-3 rounded-xl text-sm font-medium",
                    pwMsg.type === "ok" ? "bg-white text-green-700" : "bg-white text-red-700"
                  )}
                >
                  {pwMsg.text}
                </div>
              )}
              {(["next", "confirm"] as const).map((field) => (
                <div key={field} className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder={field === "next" ? "Жаңа пароль (кемінде 6)" : "Жаңа парольді растаңыз"}
                    value={pw[field]}
                    onChange={(e) => setPw({ ...pw, [field]: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-[0.75rem] border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100 text-base"
                    style={{ background: "var(--te-bg)", color: "var(--te-text)", borderColor: "var(--te-border)" }}
                    aria-label={field === "next" ? "Жаңа пароль" : "Жаңа парольді растаңыз"}
                  />
                  {field === "next" && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                      style={{ color: "var(--te-text-muted)" }}
                      aria-label={showPw ? "Парольді жасыру" : "Парольді көрсету"}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                    </button>
                  )}
                </div>
              ))}
              <Button onClick={handlePasswordChange} loading={pwLoading} size="md" variant="ghost" fullWidth>
                Парольді сақтау
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* ── 2. Оқу режимі ─────────────────────────────────────── */}
      <Section title="Оқу режимі" emoji="✨">
        <p className="text-sm mb-4" style={{ color: "var(--te-text-muted)" }}>
          Режим таңдаңыз — платформа бейімделеді. Параметрлерді жеке өзгертуге болады.
        </p>
        <div className="space-y-2" role="radiogroup" aria-label="Оқу режимін таңдаңыз">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              role="radio"
              aria-checked={mode === opt.id}
              onClick={() => handleModeChange(opt.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-[0.75rem] border-2 text-left transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                mode === opt.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              )}
              style={mode !== opt.id ? { background: "var(--te-bg-alt)", borderColor: "var(--te-border)" } : {}}
            >
              <span className="text-2xl shrink-0" aria-hidden="true">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: "var(--te-text)" }}>{opt.title}</p>
                <p className="text-xs" style={{ color: "var(--te-text-muted)" }}>{opt.desc}</p>
              </div>
              {mode === opt.id && (
                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* ── 3. Көрсету баптаулары ─────────────────────────────── */}
      <Section title="Көрсету баптаулары" emoji="🎨">

        {/* Font size + live preview */}
        <div className="mb-5">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--te-text-muted)" }}>Қаріп өлшемі</p>
          <div className="flex gap-2 mb-4" role="group" aria-label="Қаріп өлшемін таңдаңыз">
            {([16, 20, 24] as const).map((size) => (
              <button
                key={size}
                aria-pressed={currentFontSize === size}
                onClick={() => handleDisplayChange("fontSize", size)}
                className={cn(
                  "flex-1 flex flex-col items-center py-3 rounded-[0.75rem] border-2 transition-all",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                  currentFontSize === size ? "border-primary-600 bg-primary-50" : "border-gray-200 hover:border-primary-300"
                )}
                style={currentFontSize !== size ? { background: "var(--te-bg-alt)", borderColor: "var(--te-border)" } : {}}
              >
                <span
                  className="font-bold text-primary-700"
                  style={{ fontSize: size === 16 ? "16px" : size === 20 ? "20px" : "24px" }}
                  aria-hidden="true"
                >A</span>
                <span className="text-xs mt-0.5" style={{ color: "var(--te-text-muted)" }}>
                  {size === 16 ? "Кәдімгі" : size === 20 ? "Үлкен" : "Өте үлкен"}
                </span>
              </button>
            ))}
          </div>

          {/* Live preview */}
          <div
            className="rounded-[0.75rem] border-2 p-4 transition-all duration-300"
            style={{
              fontSize: `${currentFontSize}px`,
              lineHeight: effective.lineHeight,
              background: "var(--te-surface)",
              borderColor: "var(--te-border)",
              color: "var(--te-text)",
              fontFamily: isDyslexicFont ? "OpenDyslexic, Comic Sans MS, cursive" : "inherit",
            }}
            aria-live="polite"
            aria-label="Мәтін көрінісі"
          >
            {PREVIEW_TEXT}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-5">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--te-text-muted)" }}>Тақырып</p>
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Түс тақырыбын таңдаңыз">
            {([
              { id: "light"         as Theme, label: "Жарық",    bg: "#ffffff", text: "#1a2332" },
              { id: "cream"         as Theme, label: "Кремді",   bg: "#fdf8f0", text: "#2d1f0e" },
              { id: "dark"          as Theme, label: "Қараңғы",  bg: "#111827", text: "#f9fafb" },
              { id: "high-contrast" as Theme, label: "Контраст", bg: "#000000", text: "#ffffff" },
            ]).map((t) => (
              <button
                key={t.id}
                aria-pressed={currentTheme === t.id}
                onClick={() => handleDisplayChange("theme", t.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-xs font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                  currentTheme === t.id ? "border-primary-600" : "border-gray-200 hover:border-primary-300"
                )}
                style={currentTheme !== t.id ? { borderColor: "var(--te-border)" } : {}}
              >
                <span
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold"
                  style={{ background: t.bg, color: t.text, borderColor: t.id === "light" ? "#e5e7eb" : t.bg }}
                  aria-hidden="true"
                >A</span>
                <span style={{ color: "var(--te-text)", fontSize: "10px" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <ToggleRow
            label="OpenDyslexic қарпі"
            desc="Дислексияға арналған арнайы қаріп"
            active={isDyslexicFont}
            onToggle={() => handleDisplayChange("dyslexicFont", !isDyslexicFont)}
          />
          <ToggleRow
            label="Авто-дыбыс (сабақта)"
            desc="Сабақ ашылғанда автоматты оқылады"
            active={isAutoTTS}
            onToggle={() => handleDisplayChange("autoTTS", !isAutoTTS)}
          />
        </div>

        {/* TTS speed */}
        {isAutoTTS && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--te-text-muted)" }}>Оқу жылдамдығы</p>
            <div className="flex gap-2" role="group" aria-label="Дыбыс жылдамдығын таңдаңыз">
              {([0.75, 1, 1.5] as TTSSpeed[]).map((s) => (
                <button
                  key={s}
                  aria-pressed={currentTTSSpeed === s}
                  onClick={() => handleDisplayChange("ttsSpeed", s)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                    currentTTSSpeed === s ? "border-primary-600 bg-primary-50 text-primary-800" : "border-gray-200 hover:border-primary-300"
                  )}
                  style={currentTTSSpeed !== s ? { background: "var(--te-bg-alt)", borderColor: "var(--te-border)", color: "var(--te-text)" } : {}}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── 4. Менің үлгерімім ─────────────────────────────────── */}
      <Section title="Менің үлгерімім" emoji="📊" defaultOpen={false}>
        {progress.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: "var(--te-text-muted)" }}>
            Деректер жүктелуде...
          </p>
        ) : (
          <div className="space-y-3">
            {progress.map((p) => {
              const pct = Math.round((p.completed_modules / p.total_modules) * 100);
              return (
                <div key={p.track_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--te-text)" }}>
                      <span aria-hidden="true">{p.track_emoji}</span>
                      {p.track_title}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--te-text-muted)" }}>
                      {p.completed_modules}/{p.total_modules} модуль
                    </span>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: "var(--te-border)" }}
                    role="progressbar"
                    aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                    aria-label={`${p.track_title}: ${pct}%`}
                  >
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", p.is_completed ? "bg-white0" : "bg-primary-600")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {p.is_completed && (
                    <p className="text-xs mt-1 text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Аяқталды
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── 5. Сертификаттар ──────────────────────────────────── */}
      <Section title="Сертификаттар" emoji="🏆" defaultOpen={false}>
        {progress.filter((p) => p.is_completed).length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: "var(--te-text-muted)" }}>
            Тректі аяқтаған соң сертификат пайда болады.
          </p>
        ) : (
          <div className="space-y-3">
            {progress.filter((p) => p.is_completed).map((p) => (
              <div
                key={p.track_id}
                className="flex items-center justify-between gap-3 p-4 rounded-[0.75rem] border-2 border-gray-200 bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{p.track_emoji}</span>
                  <div>
                    <p className="font-semibold text-primary-700 text-sm">{p.track_title}</p>
                    {p.completed_at && (
                      <p className="text-xs text-green-600">
                        {new Date(p.completed_at).toLocaleDateString("kk-KZ")}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => generateCertificate(p.track_title, p.track_emoji)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400"
                  aria-label={`${p.track_title} сертификатын жүктеу`}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Sign out ──────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[0.75rem] border-2 border-red-200 text-red-600 hover:bg-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400 text-sm"
          aria-label="Шығу"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Шығу (Выйти)
        </button>
      </div>
    </main>
  );
}

function ToggleRow({ label, desc, active, onToggle }: { label: string; desc: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-[0.75rem] border-2 transition-all text-left",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
        active ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-primary-300"
      )}
      style={!active ? { background: "var(--te-bg-alt)", borderColor: "var(--te-border)" } : {}}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--te-text)" }}>{label}</p>
        <p className="text-xs" style={{ color: "var(--te-text-muted)" }}>{desc}</p>
      </div>
      <span
        className={cn("w-11 h-6 rounded-full relative shrink-0 ml-3 transition-colors", active ? "bg-primary-600" : "bg-gray-300")}
        aria-hidden="true"
      >
        <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", active ? "translate-x-6" : "translate-x-1")} />
      </span>
    </button>
  );
}
