"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Award, BookOpen, ChevronRight, Settings, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { tracks } from "@/lib/data/courses";
import { cn } from "@/lib/utils";
import type { AccessibilityMode, Theme } from "@/types";

const MODE_LABELS: Record<AccessibilityMode, { emoji: string; label: string }> = {
  visual:   { emoji: "👁",  label: "Дыбыспен оқу" },
  hearing:  { emoji: "👂",  label: "Мәтін арқылы" },
  dyslexia: { emoji: "📖",  label: "Дислексия" },
  children: { emoji: "🧒",  label: "Балалар" },
  standard: { emoji: "🎯",  label: "Стандарт" },
};

const MODES: AccessibilityMode[] = ["standard", "visual", "hearing", "dyslexia", "children"];

export default function DashboardPage() {
  const { mode, effective, overrides, setMode, setOverride } = useAccessibility();
  const [showSettings, setShowSettings] = useState(false);

  const userName = "Пайдаланушы";
  const completedLessons = 0;
  const totalLessons = tracks.reduce((sum, t) => sum + t.lessons.length, 0);

  async function generateCertificate(trackTitle: string) {
    if (typeof window === "undefined") return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", format: "a4" });
    doc.setFontSize(32);
    doc.setTextColor(30, 58, 95);
    doc.text("TeńEdu — Сертификат", 148, 60, { align: "center" });
    doc.setFontSize(18);
    doc.setTextColor(80, 80, 80);
    doc.text(`${userName} аяқтады:`, 148, 90, { align: "center" });
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 95);
    doc.text(trackTitle, 148, 115, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(120, 120, 120);
    doc.text(new Date().toLocaleDateString("kk-KZ"), 148, 140, { align: "center" });
    doc.save("tenedu-sertifikat.pdf");
  }

  const currentFontSize = overrides.fontSize ?? effective.fontSize;
  const currentTheme    = overrides.theme    ?? effective.theme;

  return (
    <main className="py-10 px-4 max-w-4xl mx-auto" id="main-content" style={{ background: "var(--te-bg)" }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-[0.75rem] flex items-center justify-center" aria-hidden="true">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--te-text)" }}>{userName}</h1>
            <p className="text-sm" style={{ color: "var(--te-text-muted)" }}>
              Режим: {MODE_LABELS[mode].emoji} {MODE_LABELS[mode].label}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-expanded={showSettings}
          aria-controls="settings-panel"
          className="p-3 rounded-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
          style={{ background: "var(--te-bg-alt)", color: "var(--te-text)" }}
          aria-label="Баптауларды ашу"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <Card
          id="settings-panel"
          className="mb-8 border-2 border-primary-100"
          style={{ background: "var(--te-surface)" }}
          aria-label="Баптаулар"
        >
          <CardHeader>
            <h2 className="text-lg font-bold" style={{ color: "var(--te-text)" }}>Баптаулар</h2>
          </CardHeader>
          <CardBody>
            {/* Mode */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--te-text-muted)" }}>Оқу режимі</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Режим таңдаңыз">
                {MODES.map((m) => (
                  <button
                    key={m}
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-[0.75rem] border-2 text-xs font-medium transition-all",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      mode === m
                        ? "border-primary-600 bg-primary-50 text-primary-800"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={mode !== m ? { color: "var(--te-text)" } : {}}
                  >
                    <span className="text-xl" aria-hidden="true">{MODE_LABELS[m].emoji}</span>
                    {MODE_LABELS[m].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--te-text-muted)" }}>Қаріп өлшемі</p>
              <div className="flex gap-2" role="group" aria-label="Қаріп өлшемін таңдаңыз">
                {([16, 20, 24] as const).map((size) => (
                  <button
                    key={size}
                    aria-pressed={currentFontSize === size}
                    onClick={() => setOverride("fontSize", size)}
                    className={cn(
                      "flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      currentFontSize === size
                        ? "border-primary-600 bg-primary-50 text-primary-800"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={currentFontSize !== size ? { color: "var(--te-text)" } : {}}
                  >
                    {size === 16 ? "Стандарт" : size === 20 ? "Үлкен" : "Өте үлкен"}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--te-text-muted)" }}>Тақырып</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Тақырып таңдаңыз">
                {([
                  { id: "light" as Theme,         label: "Жарық"     },
                  { id: "cream" as Theme,          label: "Кремді"    },
                  { id: "dark" as Theme,           label: "Қараңғы"   },
                  { id: "high-contrast" as Theme,  label: "Контраст"  },
                ]).map((t) => (
                  <button
                    key={t.id}
                    aria-pressed={currentTheme === t.id}
                    onClick={() => setOverride("theme", t.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                      currentTheme === t.id
                        ? "border-primary-600 bg-primary-50 text-primary-800"
                        : "border-gray-200 hover:border-primary-300"
                    )}
                    style={currentTheme !== t.id ? { color: "var(--te-text)" } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexic font */}
            <ToggleChip
              label="OpenDyslexic қарпі"
              active={overrides.dyslexicFont ?? effective.fontFamily === "dyslexic"}
              onToggle={() => {
                const cur = overrides.dyslexicFont ?? (effective.fontFamily === "dyslexic");
                setOverride("dyslexicFont", !cur);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: "Сабақтар", value: `${completedLessons}/${totalLessons}`, color: "text-blue-600 bg-white" },
          { icon: Star,     label: "Жұлдыз",   value: "0",                                    color: "text-yellow-600 bg-white" },
          { icon: Award,    label: "Трек",      value: "0/4",                                  color: "text-purple-600 bg-white" },
          { icon: User,     label: "Күн",       value: "1",                                    color: "text-green-600 bg-white" },
        ].map((stat) => (
          <Card key={stat.label} padding="md" className="text-center" style={{ background: "var(--te-surface)" }}>
            <div className={`w-10 h-10 ${stat.color} rounded-[0.75rem] flex items-center justify-center mx-auto mb-2`} aria-hidden="true">
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--te-text)" }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--te-text-muted)" }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Continue */}
      <section aria-labelledby="continue-heading" className="mb-10">
        <h2 id="continue-heading" className="text-xl font-bold mb-4" style={{ color: "var(--te-text)" }}>
          Оқуды жалғастыру
        </h2>
        <Card className="border-2 border-primary-100" style={{ background: "var(--te-surface)" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-3xl" aria-hidden="true">{tracks[0].emoji}</div>
              <div>
                <p className="font-semibold" style={{ color: "var(--te-text)" }}>{tracks[0].lessons[0].title}</p>
                <p className="text-sm" style={{ color: "var(--te-text-muted)" }}>{tracks[0].title}</p>
              </div>
            </div>
            <Link href={`/courses/${tracks[0].id}/${tracks[0].lessons[0].id}`}>
              <Button size="md">
                Жалғастыру <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Tracks progress */}
      <section aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="text-xl font-bold mb-4" style={{ color: "var(--te-text)" }}>
          Барлық бағыттар
        </h2>
        <div className="space-y-3">
          {tracks.map((track) => {
            const done = 0;
            const total = track.lessons.length;
            const pct = Math.round((done / total) * 100);
            const canDownload = pct === 100;

            return (
              <Card key={track.id} padding="md" style={{ background: "var(--te-surface)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl shrink-0" aria-hidden="true">{track.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold leading-tight" style={{ color: "var(--te-text)" }}>
                          {track.title}
                        </h3>
                        <span className="text-sm shrink-0" style={{ color: "var(--te-text-muted)" }}>
                          {done}/{total}
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                        aria-label={`${track.title}: ${pct}% аяқталды`}
                        style={{ background: "var(--te-border)" }}
                      >
                        <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                  {canDownload ? (
                    <button
                      onClick={() => generateCertificate(track.title)}
                      className="shrink-0 flex items-center gap-1 text-xs text-green-600 font-medium bg-white hover:bg-green-100 px-3 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400"
                      aria-label={`${track.title} сертификатын жүктеу`}
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" /> Сертификат
                    </button>
                  ) : (
                    <Link href={`/courses/${track.id}/${track.lessons[0]?.id}`}>
                      <Button variant="ghost" size="sm">Бастау</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ToggleChip({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
        active ? "border-primary-600 bg-primary-50 text-primary-800" : "border-gray-200 hover:border-primary-300"
      )}
      style={!active ? { color: "var(--te-text)" } : {}}
    >
      {label}
    </button>
  );
}
