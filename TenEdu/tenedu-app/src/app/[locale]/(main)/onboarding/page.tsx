"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { createClient } from "@/lib/supabase/client";
import type { AccessibilityMode, LearningGoal } from "@/types";

type AgeRange = "child" | "teen" | "young" | "adult";

interface OnboardingData {
  name: string;
  age: AgeRange | null;
  mode: AccessibilityMode | null;
  fontSize: 16 | 20 | 24;
  goal: LearningGoal | null;
}

const TOTAL_STEPS = 5;

const AGE_OPTIONS: { id: AgeRange; label: string; emoji: string; desc: string }[] = [
  { id: "child",  emoji: "🌱", label: "12 жасқа дейін", desc: "Балалар модулі ұсынылады" },
  { id: "teen",   emoji: "🎒", label: "13–17 жас",       desc: "Оқу мен дамуға арналған треки" },
  { id: "young",  emoji: "🚀", label: "18–25 жас",       desc: "Жұмыс, оқу, өзін-өзі дамыту" },
  { id: "adult",  emoji: "🌟", label: "25 жастан жоғары", desc: "Мемлекеттік қызметтер, жұмыс" },
];

interface ModeOption {
  id: AccessibilityMode;
  emoji: string;
  title: string;
  subtitle: string;
  features: string[];
  childOnly?: boolean;
  previewTheme: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "visual",
    emoji: "👁",
    title: "Тыңдап оқимын",
    subtitle: "Мәтінді оқудан гөрі тыңдауды ұнатамын",
    features: ["Автоматты дауыстап оқу", "Үлкен шрифт 22px", "Жоғары контраст"],
    previewTheme: "bg-black text-white border-yellow-400",
  },
  {
    id: "hearing",
    emoji: "👂",
    title: "Оқып үйренемін",
    subtitle: "Дыбыстан гөрі мәтінді оқу ыңғайлы",
    features: ["Барлық ақпарат мәтінде", "Визуалды хабарламалар", "Субтитрлер"],
    previewTheme: "bg-white text-gray-900 border-blue-400",
  },
  {
    id: "dyslexia",
    emoji: "📖",
    title: "Ұзын мәтін оқу қиын",
    subtitle: "Ұзын мәтіндер шаршатады немесе шатастырады",
    features: ["OpenDyslexic қарпі", "Кремді фон", "Қысқа блоктар + дыбыс"],
    previewTheme: "bg-amber-50 text-amber-900 border-amber-400",
  },
  {
    id: "children",
    emoji: "🧒",
    title: "Балалар режимі",
    subtitle: "8–12 жасқа арналған — ойын арқылы оқу",
    features: ["Жұлдызшалар мен марапаттар", "Маскот-нұсқаушы", "Жарқын батырмалар"],
    previewTheme: "bg-white text-yellow-900 border-yellow-400",
    childOnly: true,
  },
  {
    id: "standard",
    emoji: "🎯",
    title: "Кәдімгі режим",
    subtitle: "Стандартты интерфейс, барлық мүмкіндіктер",
    features: ["16px шрифт", "Жарық тема", "Барлық треки қолжетімді"],
    previewTheme: "bg-white text-gray-900 border-gray-300",
  },
];

const GOAL_OPTIONS: { id: LearningGoal; emoji: string; title: string; desc: string; tracks: string }[] = [
  { id: "study",    emoji: "🎓", title: "Оқу үшін",    desc: "Колледж, университет, онлайн оқу",              tracks: "Трек 1 + Трек 3" },
  { id: "work",     emoji: "💼", title: "Жұмыс үшін",  desc: "Жаңа жұмыс табу немесе мансапты өсіру",         tracks: "Трек 2 + Трек 3" },
  { id: "personal", emoji: "🏡", title: "Өз бетімше",  desc: "Мемлекеттік қызметтер, банкинг, күнделікті өмір", tracks: "Трек 1 + Трек 2" },
];

const PREVIEW_TEXT = "Айдана компьютерді алғаш рет қосты. Экранда жұмыс үстелі пайда болды. Ол тышқанды тауып, оны жылжытты — курсор қозғалды. «Міне, бастадым!» деп ойлады ол.";

// ── Animated step wrapper ─────────────────────────────────────
function StepSlide({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div
      className={cn(
        "transition-all duration-300",
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
      )}
    >
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { setMode, setOverride, effective } = useAccessibility();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "", age: null, mode: null, fontSize: 16, goal: null,
  });
  const [saving, setSaving] = useState(false);

  // Предзаполнить имя из Supabase (Google OAuth)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const googleName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";
        if (googleName && !data.name) {
          setData((d) => ({ ...d, name: googleName }));
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isChild = data.age === "child";
  const visibleModes = MODE_OPTIONS.filter((m) =>
    m.childOnly ? isChild : true
  );

  function canProceed(): boolean {
    if (step === 1) return data.name.trim().length >= 2;
    if (step === 2) return data.age !== null;
    if (step === 3) return data.mode !== null;
    if (step === 4) return true;
    if (step === 5) return data.goal !== null;
    return false;
  }

  function goNext() {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function selectMode(mode: AccessibilityMode) {
    setData((d) => ({ ...d, mode }));
    setMode(mode);
  }

  function selectFontSize(fs: 16 | 20 | 24) {
    setData((d) => ({ ...d, fontSize: fs }));
    setOverride("fontSize", fs);
  }

  const handleFinish = useCallback(async () => {
    if (!canProceed()) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          name:            data.name.trim(),
          goal:            data.goal,
          age_range:       data.age,
          a11y_mode:       data.mode ?? "standard",
          font_size:       data.fontSize,
          theme:           data.mode === "visual" ? "high-contrast"
                         : data.mode === "dyslexia" ? "cream"
                         : "light",
          auto_speak:      data.mode === "visual",
          dyslexic_font:   data.mode === "dyslexia",
          onboarding_done: true,
        }).eq("id", user.id);
      }
    } catch { /* настройки уже в localStorage */ }
    finally {
      setSaving(false);
      router.push("/catalog");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router]);

  // Enter = следующий шаг
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && step < TOTAL_STEPS && canProceed()) goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, data]);

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex flex-col"
      style={{ background: "var(--te-bg)" }}
      id="main-content"
    >
      {/* Progress */}
      <div className="sticky top-16 z-10 px-4 pt-4 pb-3 max-w-2xl mx-auto w-full" style={{ background: "var(--te-bg)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i + 1 < step  ? "w-6 h-2 bg-primary-600" :
                  i + 1 === step ? "w-8 h-2 bg-primary-700" :
                                   "w-2 h-2 bg-gray-300"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--te-text-muted)" }}>
            {step} / {TOTAL_STEPS}
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "var(--te-border)" }}
          role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
          aria-label={`Онбординг: ${step} / ${TOTAL_STEPS} қадам`}
        >
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="relative min-h-[400px] flex flex-col justify-center">

          {/* ── Step 1: Name ─────────────────────────────────── */}
          {step === 1 && (
            <StepSlide active>
              <div className="mb-8">
                <div className="text-5xl mb-5" aria-hidden="true">👋</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ color: "var(--te-text)" }}>
                  Сәлем! Сіздің атыңыз кім?
                </h1>
                <p className="text-lg" style={{ color: "var(--te-text-muted)" }}>
                  Біз сізді атыңызбен шақырамыз.
                </p>
              </div>
              <div>
                <label htmlFor="onb-name" className="sr-only">Атыңыз</label>
                <input
                  id="onb-name"
                  type="text"
                  autoFocus
                  autoComplete="given-name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
                  placeholder="Атыңызды жазыңыз..."
                  className="w-full text-2xl font-medium px-6 py-5 rounded-[0.75rem] border-2 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100"
                  style={{
                    background: "var(--te-bg)",
                    color: "var(--te-text)",
                    borderColor: data.name.trim().length >= 2 ? "#3b82f6" : "var(--te-border)",
                  }}
                  aria-label="Атыңызды енгізіңіз"
                  aria-required="true"
                />
                {data.name.trim().length > 0 && data.name.trim().length < 2 && (
                  <p className="text-sm text-red-500 mt-2" role="alert">Кемінде 2 әріп енгізіңіз</p>
                )}
              </div>
            </StepSlide>
          )}

          {/* ── Step 2: Age ───────────────────────────────────── */}
          {step === 2 && (
            <StepSlide active>
              <div className="mb-8">
                <div className="text-5xl mb-5" aria-hidden="true">🎂</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ color: "var(--te-text)" }}>
                  {data.name.trim() ? `${data.name.trim()}, жасыңыз қанша?` : "Жасыңыз қанша?"}
                </h1>
                <p className="text-lg" style={{ color: "var(--te-text-muted)" }}>
                  Жасыңызға сай бағыттарды ұсынамыз.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Жас диапазонын таңдаңыз">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    role="radio"
                    aria-checked={data.age === opt.id}
                    onClick={() => setData({ ...data, age: opt.id })}
                    className={cn(
                      "relative flex flex-col gap-2 p-5 rounded-[0.75rem] border-2 text-left transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      data.age === opt.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={data.age !== opt.id ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
                  >
                    {data.age === opt.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary-600" aria-hidden="true" />
                    )}
                    <span className="text-3xl" aria-hidden="true">{opt.emoji}</span>
                    <span className="font-bold text-base" style={{ color: "var(--te-text)" }}>{opt.label}</span>
                    <span className="text-xs" style={{ color: "var(--te-text-muted)" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </StepSlide>
          )}

          {/* ── Step 3: Mode ─────────────────────────────────── */}
          {step === 3 && (
            <StepSlide active>
              <div className="mb-6">
                <div className="text-5xl mb-5" aria-hidden="true">✨</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: "var(--te-text)" }}>
                  Сізге қалай оқу ыңғайлы?
                </h1>
                <p style={{ color: "var(--te-text-muted)" }}>
                  Платформа сіздің таңдауыңызға бейімделеді. Кез келген уақытта өзгертуге болады.
                </p>
              </div>
              <div className="space-y-3" role="radiogroup" aria-label="Оқу режимін таңдаңыз">
                {visibleModes.map((opt) => (
                  <button
                    key={opt.id}
                    role="radio"
                    aria-checked={data.mode === opt.id}
                    onClick={() => selectMode(opt.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-4 px-5 py-4 rounded-[0.75rem] border-2 transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      data.mode === opt.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={data.mode !== opt.id ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
                  >
                    {/* Emoji preview swatch */}
                    <div
                      className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border-2", opt.previewTheme)}
                      aria-hidden="true"
                    >
                      {opt.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-base" style={{ color: "var(--te-text)" }}>{opt.title}</p>
                        {data.mode === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary-600" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: "var(--te-text-muted)" }}>{opt.subtitle}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {opt.features.map((f) => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </StepSlide>
          )}

          {/* ── Step 4: Font size live preview ───────────────── */}
          {step === 4 && (
            <StepSlide active>
              <div className="mb-6">
                <div className="text-5xl mb-5" aria-hidden="true">🔤</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: "var(--te-text)" }}>
                  Қандай мәтін өлшемі ыңғайлы?
                </h1>
                <p style={{ color: "var(--te-text-muted)" }}>
                  Төмендегі мәтін — нақты сабақтардағыдай. Батырманы басқанда өзгереді.
                </p>
              </div>

              {/* Size buttons */}
              <div className="flex gap-3 mb-6" role="group" aria-label="Қаріп өлшемін таңдаңыз">
                {([
                  { size: 16 as const, label: "A",  sub: "Кәдімгі",   em: "1em"    },
                  { size: 20 as const, label: "A",  sub: "Үлкен",     em: "1.25em" },
                  { size: 24 as const, label: "A",  sub: "Өте үлкен", em: "1.5em"  },
                ]).map((opt) => (
                  <button
                    key={opt.size}
                    aria-pressed={data.fontSize === opt.size}
                    onClick={() => selectFontSize(opt.size)}
                    className={cn(
                      "flex-1 flex flex-col items-center py-4 px-2 rounded-[0.75rem] border-2 transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      data.fontSize === opt.size
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={data.fontSize !== opt.size ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
                    aria-label={`${opt.sub} — ${opt.size}px`}
                  >
                    <span
                      className="font-bold text-primary-700 leading-none mb-1"
                      style={{ fontSize: opt.em }}
                      aria-hidden="true"
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "var(--te-text-muted)" }}>{opt.sub}</span>
                    <span className="text-xs mt-0.5" style={{ color: "var(--te-text-muted)", opacity: 0.7 }}>{opt.size}px</span>
                  </button>
                ))}
              </div>

              {/* Live preview card */}
              <div
                className="rounded-[0.75rem] border-2 p-5 transition-all duration-300"
                style={{
                  fontSize:    `${data.fontSize}px`,
                  lineHeight:  effective.lineHeight,
                  background:  "var(--te-surface)",
                  borderColor: "var(--te-border)",
                  color:       "var(--te-text)",
                  fontFamily:  effective.fontFamily === "dyslexic" ? "OpenDyslexic, Comic Sans MS, cursive" : "inherit",
                }}
                aria-live="polite"
                aria-label="Мәтін өлшемінің алдын ала көрінісі"
              >
                <p className="mb-3 font-semibold text-primary-700" style={{ fontSize: `${data.fontSize + 2}px` }}>
                  Сабақ: Компьютермен алғашқы танысу
                </p>
                <p style={{ color: "var(--te-text)" }}>
                  {PREVIEW_TEXT}
                </p>
                <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: "var(--te-border)" }}>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "var(--te-bg-alt)", color: "var(--te-text-muted)" }}
                  >
                    {data.fontSize === 16 ? "Кәдімгі" : data.fontSize === 20 ? "Үлкен" : "Өте үлкен"} · {data.fontSize}px
                  </span>
                  {effective.fontFamily === "dyslexic" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      OpenDyslexic
                    </span>
                  )}
                </div>
              </div>
            </StepSlide>
          )}

          {/* ── Step 5: Goal ─────────────────────────────────── */}
          {step === 5 && (
            <StepSlide active>
              <div className="mb-6">
                <div className="text-5xl mb-5" aria-hidden="true">🎯</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: "var(--te-text)" }}>
                  Сіздің мақсатыңыз не?
                </h1>
                <p style={{ color: "var(--te-text-muted)" }}>
                  Мақсатыңызға сай бағыттарды бірінші ұсынамыз. Кейін өзгертуге болады.
                </p>
              </div>
              <div className="space-y-3" role="radiogroup" aria-label="Оқу мақсатын таңдаңыз">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    role="radio"
                    aria-checked={data.goal === opt.id}
                    onClick={() => setData({ ...data, goal: opt.id })}
                    className={cn(
                      "w-full text-left flex items-center gap-4 px-5 py-4 rounded-[0.75rem] border-2 transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      data.goal === opt.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={data.goal !== opt.id ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
                  >
                    <span className="text-4xl shrink-0" aria-hidden="true">{opt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg" style={{ color: "var(--te-text)" }}>{opt.title}</p>
                        {data.goal === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary-600" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-sm mb-1" style={{ color: "var(--te-text-muted)" }}>{opt.desc}</p>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                        Ұсыныс: {opt.tracks}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </StepSlide>
          )}
        </div>

        {/* Navigation */}
        <div className={cn("flex gap-3 mt-8", step > 1 ? "justify-between" : "justify-end")}>
          {step > 1 && (
            <Button variant="ghost" size="lg" onClick={goBack} className="min-w-[110px]">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Артқа
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button
              size="lg"
              onClick={goNext}
              disabled={!canProceed()}
              className="min-w-[160px]"
            >
              Жалғастыру
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleFinish}
              disabled={!canProceed()}
              loading={saving}
              className="min-w-[190px]"
            >
              Оқуды бастау! 🚀
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
