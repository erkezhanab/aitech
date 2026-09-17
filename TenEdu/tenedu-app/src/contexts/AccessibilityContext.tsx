"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type {
  AccessibilityMode,
  ModeSettings,
  ManualOverrides,
  Theme,
  TTSSpeed,
} from "@/types";

// ── Пресеты режимов ──────────────────────────────────────────
const MODE_PRESETS: Record<AccessibilityMode, ModeSettings> = {
  visual: {
    fontSize: 22,
    fontFamily: "system",
    lineHeight: 1.8,
    letterSpacing: 0.01,
    theme: "high-contrast",
    autoTTS: true,
    captionsDefault: false,
    soundFeedback: true,
    gamification: false,
    simplifiedNav: true,
    minTouchTarget: 48,
    blockSpacing: 1.5,
  },
  hearing: {
    fontSize: 17,
    fontFamily: "system",
    lineHeight: 1.7,
    letterSpacing: 0,
    theme: "light",
    autoTTS: false,
    captionsDefault: true,
    soundFeedback: false,
    gamification: false,
    simplifiedNav: false,
    minTouchTarget: 44,
    blockSpacing: 1,
  },
  dyslexia: {
    fontSize: 18,
    fontFamily: "dyslexic",
    lineHeight: 1.8,
    letterSpacing: 0.03,
    theme: "cream",
    autoTTS: false,
    captionsDefault: false,
    soundFeedback: false,
    gamification: false,
    simplifiedNav: false,
    minTouchTarget: 44,
    blockSpacing: 1.5,
  },
  children: {
    fontSize: 20,
    fontFamily: "system",
    lineHeight: 1.7,
    letterSpacing: 0,
    theme: "light",
    autoTTS: false,
    captionsDefault: false,
    soundFeedback: true,
    gamification: true,
    simplifiedNav: true,
    minTouchTarget: 52,
    blockSpacing: 1.25,
  },
  standard: {
    fontSize: 16,
    fontFamily: "system",
    lineHeight: 1.6,
    letterSpacing: 0,
    theme: "light",
    autoTTS: false,
    captionsDefault: false,
    soundFeedback: false,
    gamification: false,
    simplifiedNav: false,
    minTouchTarget: 44,
    blockSpacing: 1,
  },
};

// ── CSS-переменные тем ───────────────────────────────────────
const THEME_VARS: Record<Theme, Record<string, string>> = {
  light: {
    "--te-bg": "#ffffff",
    "--te-bg-alt": "#f8fafc",
    "--te-text": "#1a2332",
    "--te-text-muted": "#6b7280",
    "--te-border": "#e5e7eb",
    "--te-surface": "#ffffff",
    "--te-focus-ring": "#f5b700",
  },
  cream: {
    "--te-bg": "#fdf8f0",
    "--te-bg-alt": "#f5eddf",
    "--te-text": "#2d1f0e",
    "--te-text-muted": "#7a6652",
    "--te-border": "#e8d5b7",
    "--te-surface": "#fdf8f0",
    "--te-focus-ring": "#e07b00",
  },
  dark: {
    "--te-bg": "#111827",
    "--te-bg-alt": "#1f2937",
    "--te-text": "#f9fafb",
    "--te-text-muted": "#9ca3af",
    "--te-border": "#374151",
    "--te-surface": "#1f2937",
    "--te-focus-ring": "#f5b700",
  },
  "high-contrast": {
    "--te-bg": "#000000",
    "--te-bg-alt": "#0a0a0a",
    "--te-text": "#ffffff",
    "--te-text-muted": "#cccccc",
    "--te-border": "#ffffff",
    "--te-surface": "#0a0a0a",
    "--te-focus-ring": "#ffff00",
  },
};

// ── Типы контекста ───────────────────────────────────────────
interface AccessibilityContextType {
  mode: AccessibilityMode;
  preset: ModeSettings;
  overrides: ManualOverrides;
  effective: ModeSettings;           // preset + overrides merged

  setMode: (mode: AccessibilityMode) => void;
  setOverride: <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => void;
  clearOverride: (key: keyof ManualOverrides) => void;

  // TTS
  ttsSpeed: TTSSpeed;
  setTtsSpeed: (speed: TTSSpeed) => void;
  ttsPaused: boolean;
  speak: (text: string) => void;
  pauseResumeTTS: () => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;

  // Sound feedback
  playSound: (type: "success" | "error" | "click" | "complete") => void;

  // Visual notification (hearing mode)
  notify: (message: string, type?: "info" | "success" | "error") => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = "tenedu_a11y_v2";

function merge(preset: ModeSettings, overrides: ManualOverrides): ModeSettings {
  return {
    ...preset,
    ...(overrides.fontSize !== undefined && { fontSize: overrides.fontSize }),
    ...(overrides.theme !== undefined && { theme: overrides.theme }),
    ...(overrides.autoTTS !== undefined && { autoTTS: overrides.autoTTS }),
    ...(overrides.dyslexicFont !== undefined && {
      fontFamily: overrides.dyslexicFont ? "dyslexic" : preset.fontFamily,
    }),
  };
}

function applyCSSVars(effective: ModeSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // тема
  const themeVars = THEME_VARS[effective.theme];
  Object.entries(themeVars).forEach(([k, v]) => root.style.setProperty(k, v));

  // типографика
  root.style.setProperty("--te-font-size", `${effective.fontSize}px`);
  root.style.setProperty("--te-line-height", String(effective.lineHeight));
  root.style.setProperty("--te-letter-spacing", `${effective.letterSpacing}em`);
  root.style.setProperty("--te-block-spacing", `${effective.blockSpacing}rem`);
  root.style.setProperty("--te-touch-min", `${effective.minTouchTarget}px`);

  // классы
  root.classList.remove(
    "mode-visual", "mode-hearing", "mode-dyslexia", "mode-children", "mode-standard",
    "theme-light", "theme-dark", "theme-cream", "theme-high-contrast",
    "font-dyslexic"
  );
  root.classList.add(`theme-${effective.theme}`);
  if (effective.fontFamily === "dyslexic") root.classList.add("font-dyslexic");
}

// ── Provider ─────────────────────────────────────────────────
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AccessibilityMode>("standard");
  const [overrides, setOverrides] = useState<ManualOverrides>({});
  const [ttsSpeed, setTtsSpeedState] = useState<TTSSpeed>(1);
  const [ttsPaused, setTtsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [, setNotifications] = useState<{ id: number; message: string; type: string }[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const preset = MODE_PRESETS[mode];
  const effective = merge(preset, overrides);

  // Загружаем из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { mode: m, overrides: o, ttsSpeed: s } = JSON.parse(saved);
        if (m) setModeState(m);
        if (o) setOverrides(o);
        if (s) setTtsSpeedState(s);
      }
    } catch { /* ignore */ }
  }, []);

  // Сохраняем и применяем CSS-переменные
  useEffect(() => {
    applyCSSVars(merge(MODE_PRESETS[mode], overrides));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, overrides, ttsSpeed }));
    } catch { /* ignore */ }
  }, [mode, overrides, ttsSpeed]);

  const setMode = useCallback((newMode: AccessibilityMode) => {
    setModeState(newMode);
    // overrides не стираем
  }, []);

  const setOverride = useCallback(<K extends keyof ManualOverrides>(
    key: K, value: ManualOverrides[K]
  ) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearOverride = useCallback((key: keyof ManualOverrides) => {
    setOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // ── TTS ──────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "kk-KZ";
    u.rate = ttsSpeed;
    u.onstart = () => { setIsSpeaking(true); setTtsPaused(false); };
    u.onend = () => { setIsSpeaking(false); setTtsPaused(false); };
    u.onerror = () => { setIsSpeaking(false); setTtsPaused(false); };
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [ttsSpeed]);

  const pauseResumeTTS = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setTtsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setTtsPaused(true);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setTtsPaused(false);
    }
  }, []);

  const setTtsSpeed = useCallback((speed: TTSSpeed) => {
    setTtsSpeedState(speed);
    if (utteranceRef.current && isSpeaking) {
      // перезапускаем с новой скоростью не прерывая логику
    }
  }, [isSpeaking]);

  // ── Sound feedback ────────────────────────────────────────
  const playSound = useCallback((type: "success" | "error" | "click" | "complete") => {
    if (!effective.soundFeedback || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      switch (type) {
        case "success":
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.12);
          osc.frequency.setValueAtTime(784, now + 0.24);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now); osc.stop(now + 0.45);
          break;
        case "complete":
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          osc.frequency.setValueAtTime(784, now + 0.2);
          osc.frequency.setValueAtTime(1047, now + 0.3);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.start(now); osc.stop(now + 0.55);
          break;
        case "error":
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(180, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.35);
          break;
        case "click":
          osc.frequency.setValueAtTime(900, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now); osc.stop(now + 0.05);
          break;
      }
    } catch { /* ignore */ }
  }, [effective.soundFeedback]);

  // ── Visual notification (hearing mode) ───────────────────
  const notify = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    if (typeof document === "undefined") return;
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    const el = document.createElement("div");
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
    el.style.cssText = `
      position:fixed; top:1rem; right:1rem; z-index:9999;
      padding:1rem 1.5rem; border-radius:1rem; font-weight:600;
      font-size:1rem; max-width:320px; box-shadow:0 4px 20px rgba(0,0,0,0.15);
      animation: teSlideIn 0.25s ease;
      background:${type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#1e3a5f"};
      color:#fff;
    `;
    el.textContent = message;

    const style = document.createElement("style");
    style.textContent = `@keyframes teSlideIn{from{transform:translateX(110%);opacity:0}to{transform:none;opacity:1}}`;
    document.head.appendChild(style);
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transition = "opacity 0.3s";
      el.style.opacity = "0";
      setTimeout(() => { el.remove(); style.remove(); }, 300);
    }, 3500);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        mode, preset, overrides, effective,
        setMode, setOverride, clearOverride,
        ttsSpeed, setTtsSpeed, ttsPaused, isSpeaking,
        speak, pauseResumeTTS, stopSpeaking,
        playSound, notify,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
