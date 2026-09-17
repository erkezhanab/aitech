"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Lock, CheckCircle2, BookOpen, ArrowLeft } from "lucide-react";
import { getTrackById } from "@/lib/data/content";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Props { params: { trackId: string } }

export default function TrackPage({ params }: Props) {
  const { trackId } = params;
  const track = getTrackById(trackId);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("module_completions")
        .select("module_id")
        .eq("user_id", user.id)
        .eq("track_id", trackId)
        .then(({ data }) => {
          if (data) setCompletedModules(new Set(data.map((r) => r.module_id)));
        });
    });
  }, [trackId]);

  if (!track) notFound();

  return (
    <main className="py-10 px-4 max-w-3xl mx-auto" id="main-content" style={{ background: "var(--te-bg)" }}>

      {/* Back */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
        style={{ color: "var(--te-text-muted)" }}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Каталогқа оралу
      </Link>

      {/* Track header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="text-5xl shrink-0" aria-hidden="true">{track.emoji}</div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--te-text)" }}>
            {track.title}
          </h1>
          <p className="leading-relaxed" style={{ color: "var(--te-text-muted)" }}>
            {track.description}
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: "var(--te-text-muted)" }}>
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{track.modules.length} модуль</span>
            <span>·</span>
            <span>{completedModules.size}/{track.modules.length} аяқталды</span>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-10"
        style={{ background: "var(--te-border)" }}
        role="progressbar"
        aria-valuenow={Math.round((completedModules.size / track.modules.length) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Трек барысы: ${completedModules.size} / ${track.modules.length}`}
      >
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-500"
          style={{ width: `${Math.round((completedModules.size / track.modules.length) * 100)}%` }}
        />
      </div>

      {/* Modules list */}
      <ol className="space-y-4" aria-label={`${track.title} модульдері`}>
        {track.modules.map((mod, idx) => {
          const isDone = completedModules.has(mod.id);
          // Module locked if previous not completed (except first)
          const prevDone = idx === 0 || completedModules.has(track.modules[idx - 1].id);
          const isLocked = !prevDone && !isDone;

          return (
            <li key={mod.id}>
              <div
                className={cn(
                  "relative rounded-[1rem] border-2 p-5 transition-all",
                  isDone
                    ? "border-green-300 bg-white"
                    : isLocked
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-primary-200 bg-white hover:border-primary-400 hover:shadow-card"
                )}
                style={!isDone && !isLocked ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
              >
                <div className="flex items-start gap-4">
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-[0.75rem] flex items-center justify-center shrink-0 font-bold text-sm",
                      isDone ? "bg-white0 text-white" : isLocked ? "bg-gray-200 text-gray-400" : "bg-primary-700 text-white"
                    )}
                    aria-hidden="true"
                  >
                    {isDone
                      ? <CheckCircle2 className="w-5 h-5" />
                      : isLocked
                      ? <Lock className="w-4 h-4" />
                      : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base mb-1" style={{ color: isDone ? "#166534" : isLocked ? "#9ca3af" : "var(--te-text)" }}>
                      {mod.title}
                      {isDone && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          Аяқталды ✓
                        </span>
                      )}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--te-text-muted)" }}>
                      {mod.description}
                    </p>

                    {/* CTA */}
                    {!isLocked && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Link
                          href={`/catalog/${trackId}/${mod.id}`}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                            isDone
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-primary-700 text-white hover:bg-primary-600"
                          )}
                        >
                          {isDone ? "Қайталау" : "Бастау"}
                          <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                    {isLocked && (
                      <p className="text-xs mt-2" style={{ color: "var(--te-text-muted)" }}>
                        🔒 Алдыңғы модульді аяқтаңыз
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
