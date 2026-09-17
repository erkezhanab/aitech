"use client";

import Link from "next/link";
import { ChevronRight, BookOpen, Clock, Lock } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { STATIC_TRACKS } from "@/lib/data/content";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, { border: string; bg: string; badge: string; text: string; btn: string }> = {
  blue:   { border: "border-gray-200",   bg: "bg-white",   badge: "bg-blue-100 text-blue-700",   text: "text-primary-700",   btn: "bg-primary-700 hover:bg-primary-800 text-white" },
  green:  { border: "border-gray-200",  bg: "bg-white",  badge: "bg-green-100 text-green-700", text: "text-primary-700",  btn: "bg-primary-700 hover:bg-primary-800 text-white" },
  purple: { border: "border-gray-200", bg: "bg-white", badge: "bg-purple-100 text-purple-700",text: "text-primary-700", btn: "bg-primary-700 hover:bg-primary-800 text-white" },
  yellow: { border: "border-gray-200", bg: "bg-white", badge: "bg-yellow-100 text-yellow-700",text: "text-primary-700", btn: "bg-white0 hover:bg-yellow-600 text-white" },
};

export default function CatalogPage() {
  const { mode } = useAccessibility();
  const isChildren = mode === "children";

  const tracks = isChildren
    ? STATIC_TRACKS.filter((t) => t.is_children_only)
    : STATIC_TRACKS;

  return (
    <main className="py-10 px-4" id="main-content" style={{ background: "var(--te-bg)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          {isChildren ? (
            <>
              <div className="text-5xl mb-3" aria-hidden="true">🌟</div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--te-text)" }}>
                Менің курстарым!
              </h1>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--te-text)" }}>
                Курстар каталогы
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: "var(--te-text-muted)" }}>
                Мақсатыңызға сай тректі таңдаңыз. Барлық курстар тегін, қазақ тілінде.
              </p>
            </>
          )}
        </div>

        {/* Tracks */}
        <div className="space-y-8">
          {tracks.map((track) => {
            const c = COLOR_MAP[track.color] ?? COLOR_MAP.blue;

            return (
              <section
                key={track.id}
                aria-labelledby={`track-${track.id}`}
                className={cn("rounded-[1rem] border-2 overflow-hidden", c.border, c.bg)}
              >
                {/* Track header */}
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl shrink-0" aria-hidden="true">{track.emoji}</div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h2 id={`track-${track.id}`} className={cn("text-xl font-bold", c.text)}>
                            {track.title}
                          </h2>
                          {track.is_children_only && (
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", c.badge)}>
                              8–12 жас
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                          {track.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" aria-hidden="true" />
                            {track.modules.length} модуль
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/catalog/${track.id}`}
                      className={cn("flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400", c.btn)}
                      aria-label={`${track.title} тректін ашу`}
                    >
                      {isChildren ? "Кіру! 🚀" : "Бастау"}
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>

                  {/* Module list preview */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {track.modules.map((mod, idx) => (
                      <Link
                        key={mod.id}
                        href={`/catalog/${track.id}/${mod.id}`}
                        className="group flex items-start gap-3 bg-white/70 hover:bg-white p-4 rounded-[0.75rem] border border-white/80 hover:border-gray-200 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 shadow-sm hover:shadow-md"
                      >
                        <div
                          className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", c.badge)}
                          aria-hidden="true"
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-primary-700 transition-colors">
                            {mod.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {mod.description}
                          </p>
                        </div>
                        {idx > 0 && (
                          <Lock className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" aria-label="Алдыңғыны аяқтаңыз" />
                        )}
                      </Link>
                    ))}

                    {/* Coming soon */}
                    <div className="flex items-center gap-3 bg-white/30 p-4 rounded-[0.75rem] border border-dashed border-gray-300">
                      <Clock className="w-5 h-5 text-gray-300 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Жақында...</p>
                        <p className="text-xs text-gray-300">Жаңа модульдер қосылады</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
