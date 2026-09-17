"use client";

import { useState, useRef, useEffect } from "react";
import { Settings2, Sun, Type, Volume2, VolumeX, X } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import type { Theme, TTSSpeed } from "@/types";

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const {
    effective, overrides,
    setOverride, clearOverride,
    speak, stopSpeaking, isSpeaking,
    ttsSpeed, setTtsSpeed,
  } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const speakPage = () => {
    const main = document.querySelector("main");
    if (main) speak((main as HTMLElement).innerText.slice(0, 2000));
  };

  const currentFontSize = overrides.fontSize ?? effective.fontSize;
  const currentTheme = overrides.theme ?? effective.theme;

  return (
    <div ref={panelRef} className="fixed bottom-6 right-4 z-50" role="region" aria-label="Қолжетімділік панелі">

      {/* Panel */}
      <div
        id="a11y-panel"
        className={cn(
          "absolute bottom-full right-0 mb-3 w-80 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 origin-bottom-right",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ background: "var(--te-surface)", border: "1px solid var(--te-border)" }}
        aria-hidden={!open}
        role="dialog"
        aria-label="Қолжетімділік баптаулары"
      >
        {/* Header */}
        <div className="bg-primary-700 text-white px-5 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Баптаулар</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Панелді жабу"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* Font size */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--te-text-muted)" }}>
              Қаріп өлшемі (px)
            </p>
            <div className="flex gap-2" role="group" aria-label="Қаріп өлшемін таңдау">
              {[16, 20, 24].map((size) => (
                <button
                  key={size}
                  aria-pressed={currentFontSize === size}
                  onClick={() => setOverride("fontSize", size)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                    currentFontSize === size
                      ? "bg-primary-700 text-white"
                      : "hover:bg-primary-50 text-gray-600"
                  )}
                  style={currentFontSize !== size ? { background: "var(--te-bg-alt)", color: "var(--te-text)" } : {}}
                  aria-label={`${size}px қаріп`}
                >
                  <span style={{ fontSize: size === 16 ? "14px" : size === 20 ? "17px" : "20px" }}>A</span>
                </button>
              ))}
            </div>
            {overrides.fontSize !== undefined && (
              <button
                onClick={() => clearOverride("fontSize")}
                className="text-xs mt-1 text-primary-500 hover:underline"
              >
                Режим әдепкісіне қайту
              </button>
            )}
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--te-text-muted)" }}>
              Тақырып
            </p>
            <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Түс тақырыбын таңдау">
              {([
                { id: "light",          label: "Жарық",     swatch: "#fff",     border: "#e5e7eb" },
                { id: "cream",          label: "Кремді",    swatch: "#fdf8f0",  border: "#e8d5b7" },
                { id: "dark",           label: "Қараңғы",   swatch: "#111827",  border: "#374151" },
                { id: "high-contrast",  label: "Контраст",  swatch: "#000",     border: "#fff"    },
              ] as { id: Theme; label: string; swatch: string; border: string }[]).map((t) => (
                <button
                  key={t.id}
                  aria-pressed={currentTheme === t.id}
                  onClick={() => setOverride("theme", t.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-xs",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                    currentTheme === t.id ? "border-primary-600" : "border-gray-200"
                  )}
                  aria-label={`${t.label} тақырыбы`}
                >
                  <span
                    className="w-6 h-6 rounded-full border"
                    style={{ background: t.swatch, borderColor: t.border }}
                    aria-hidden="true"
                  />
                  <span style={{ color: "var(--te-text)", fontSize: "10px" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dyslexic font toggle */}
          <ToggleRow
            icon={<Type className="w-4 h-4" aria-hidden="true" />}
            label="OpenDyslexic қарпі"
            active={overrides.dyslexicFont ?? effective.fontFamily === "dyslexic"}
            onToggle={() => {
              const cur = overrides.dyslexicFont ?? (effective.fontFamily === "dyslexic");
              setOverride("dyslexicFont", !cur);
            }}
          />

          {/* Auto TTS toggle */}
          <ToggleRow
            icon={<Volume2 className="w-4 h-4" aria-hidden="true" />}
            label="Авто-дыбыс (сабақта)"
            active={overrides.autoTTS ?? effective.autoTTS}
            onToggle={() => {
              const cur = overrides.autoTTS ?? effective.autoTTS;
              setOverride("autoTTS", !cur);
            }}
          />

          {/* TTS speed (shown when autoTTS active) */}
          {(overrides.autoTTS ?? effective.autoTTS) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--te-text-muted)" }}>
                Дыбыс жылдамдығы
              </p>
              <div className="flex gap-2" role="group" aria-label="Дыбыс жылдамдығын таңдау">
                {([0.75, 1, 1.5] as TTSSpeed[]).map((s) => (
                  <button
                    key={s}
                    aria-pressed={ttsSpeed === s}
                    onClick={() => setTtsSpeed(s)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      ttsSpeed === s ? "bg-primary-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Speak page / Stop */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--te-border)" }}>
            {!isSpeaking ? (
              <button
                onClick={speakPage}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
                style={{ background: "var(--te-bg-alt)", color: "var(--te-text)" }}
                aria-label="Бетті оқып шығу"
              >
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                Бетті оқып шығу
              </button>
            ) : (
              <button
                onClick={stopSpeaking}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400"
                aria-label="Дыбысты тоқтату"
              >
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
                Дыбысты тоқтату
              </button>
            )}
          </div>

          {/* High contrast shortcut */}
          <ToggleRow
            icon={<Sun className="w-4 h-4" aria-hidden="true" />}
            label="Жоғары контраст"
            active={currentTheme === "high-contrast"}
            onToggle={() =>
              setOverride("theme", currentTheme === "high-contrast" ? "light" : "high-contrast")
            }
          />

        </div>
      </div>

      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Қолжетімділік баптаулары"
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-accent-400",
          open && "rotate-45"
        )}
      >
        <Settings2 className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  );
}

function ToggleRow({
  icon, label, active, onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
        active ? "bg-primary-50 border border-primary-200" : "hover:bg-gray-50"
      )}
      style={!active ? { background: "var(--te-bg-alt)", color: "var(--te-text)" } : {}}
    >
      <span className="flex items-center gap-2" style={{ color: active ? undefined : "var(--te-text)" }}>
        {icon} {label}
      </span>
      <span
        className={cn("w-10 h-6 rounded-full relative transition-colors", active ? "bg-primary-600" : "bg-gray-300")}
        aria-hidden="true"
      >
        <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", active ? "translate-x-5" : "translate-x-1")} />
      </span>
    </button>
  );
}
