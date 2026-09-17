"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Volume2, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { getModuleById, getModuleTrack, getQuizForModule } from "@/lib/data/content";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Props { params: { moduleId: string } }

export default function QuizPage({ params }: Props) {
  const { moduleId } = params;
  const router = useRouter();

  const mod = getModuleById(moduleId);
  const track = getModuleTrack(moduleId);
  const questions = getQuizForModule(moduleId);

  const { speak, playSound, notify, mode } = useAccessibility();
  const isVisual = mode === "visual";
  const isChildren = mode === "children";

  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!mod || !track || questions.length === 0) notFound();

  const allAnswered = questions.every((q) => (answers[q.id] ?? []).length > 0);

  function toggleAnswer(qId: string, optIdx: number, isMultiple: boolean) {
    setAnswers((prev) => {
      const cur = prev[qId] ?? [];
      if (isMultiple) {
        const exists = cur.includes(optIdx);
        const next = exists ? cur.filter((x) => x !== optIdx) : [...cur, optIdx];
        return { ...prev, [qId]: next };
      } else {
        return { ...prev, [qId]: [optIdx] };
      }
    });
    playSound("click");
    if (isVisual) {
      const found = questions.find((q) => q.id === qId);
      if (found) speak(found.options[optIdx]);
    }
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);

    const score = questions.reduce((acc, q) => {
      const userAns = [...(answers[q.id] ?? [])].sort().join(",");
      const correctAns = [...q.correct].sort().join(",");
      return acc + (userAns === correctAns ? 1 : 0);
    }, 0);

    const passed = score / questions.length >= 0.7;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save attempt
        const { data: prev } = await supabase
          .from("quiz_attempts")
          .select("attempt_num")
          .eq("user_id", user.id)
          .eq("module_id", moduleId)
          .order("attempt_num", { ascending: false })
          .limit(1)
          .single();

        await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          module_id: moduleId,
          score,
          total: questions.length,
          passed,
          answers,
          attempt_num: (prev?.attempt_num ?? 0) + 1,
        });

        // Mark module completed if passed
        if (passed) {
          await supabase.from("module_completions").upsert({
            user_id: user.id,
            module_id: moduleId,
            track_id: track!.id,
            completed_at: new Date().toISOString(),
          }, { onConflict: "user_id,module_id" });

          playSound("complete");
          if (mode === "hearing") notify("Тест өтілді! Модуль аяқталды ✓", "success");
        } else {
          playSound("error");
          if (mode === "hearing") notify(`${score}/${questions.length} — Қайта байқаңыз`, "error");
        }
      }
    } catch { /* continue */ }

    // Navigate to results
    const answersParam = encodeURIComponent(JSON.stringify(answers));
    router.push(`/quiz/${moduleId}/results?score=${score}&total=${questions.length}&answers=${answersParam}`);
  }

  return (
    <main className="py-8 px-4 max-w-2xl mx-auto" id="main-content" style={{ background: "var(--te-bg)" }}>

      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/catalog/${track.id}/${moduleId}`}
          className="flex items-center gap-2 text-sm mb-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
          style={{ color: "var(--te-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {mod.title}
        </Link>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--te-text)" }}>
          {isChildren ? "🎮 Тест уақыты!" : "Тест тапсыру"}
        </h1>
        <p style={{ color: "var(--te-text-muted)" }}>
          {questions.length} сұрақ · Өту балы: 70%
        </p>

        {/* Progress */}
        <div
          className="h-1.5 rounded-full overflow-hidden mt-4"
          style={{ background: "var(--te-border)" }}
          role="progressbar"
          aria-valuenow={Math.round((Object.keys(answers).length / questions.length) * 100)}
          aria-valuemin={0} aria-valuemax={100}
          aria-label={`${Object.keys(answers).length} / ${questions.length} сұрақ жауапталды`}
        >
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.round((Object.keys(answers).length / questions.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-10">
        {questions.map((question, qi) => {
          const isMultiple = question.question_type === "multiple";
          const qAnswers = answers[question.id] ?? [];

          return (
            <Card
              key={question.id}
              style={{ background: "var(--te-surface)", borderColor: "var(--te-border)" }}
              className="border-2"
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                      qAnswers.length > 0 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-500"
                    )}
                    aria-hidden="true"
                  >
                    {qi + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-semibold leading-snug"
                      id={`q-${question.id}`}
                      style={{ color: "var(--te-text)" }}
                    >
                      {question.question}
                    </p>
                    {isMultiple && (
                      <p className="text-xs mt-1 text-primary-500 font-medium">
                        Бірнешеуін таңдауға болады
                      </p>
                    )}
                  </div>
                </div>
                {/* TTS button */}
                {(isVisual || mode === "dyslexia") && (
                  <button
                    onClick={() => speak(`${question.question}. Жауаптар: ${question.options.join(", ")}`)}
                    className="p-2 rounded-xl shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition-colors"
                    style={{ background: "var(--te-bg-alt)", color: "var(--te-text-muted)" }}
                    aria-label="Сұрақты дыбыстап оқу"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Options */}
              <div
                className="space-y-2"
                role={isMultiple ? "group" : "radiogroup"}
                aria-labelledby={`q-${question.id}`}
              >
                {question.options.map((opt, oi) => {
                  const selected = qAnswers.includes(oi);
                  return (
                    <button
                      key={oi}
                      role={isMultiple ? "checkbox" : "radio"}
                      aria-checked={selected}
                      onClick={() => toggleAnswer(question.id, oi, isMultiple)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-4 py-3 rounded-[0.75rem] border-2 transition-all",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 text-sm",
                        selected ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-primary-300",
                        isChildren && "py-4 text-base"
                      )}
                      style={!selected ? { background: "var(--te-surface)", borderColor: "var(--te-border)" } : {}}
                    >
                      {isMultiple ? (
                        selected
                          ? <CheckSquare className="w-4 h-4 text-primary-600 shrink-0" aria-hidden="true" />
                          : <Square className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <span
                          className={cn(
                            "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                            selected ? "border-primary-600 bg-primary-600" : "border-gray-300"
                          )}
                          aria-hidden="true"
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      )}
                      <span style={{ color: "var(--te-text)" }}>
                        {isChildren && `${["🅰️","🅱️","🅾️","🆎"][oi] ?? ""} `}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit */}
      <Button
        size="xl"
        fullWidth
        onClick={handleSubmit}
        loading={submitting}
        disabled={!allAnswered}
      >
        {isChildren ? "Тексер! ✅" : `Тестті аяқтау (${Object.keys(answers).length}/${questions.length})`}
      </Button>

      {!allAnswered && (
        <p className="text-sm text-center mt-3" style={{ color: "var(--te-text-muted)" }}>
          Барлық {questions.length} сұраққа жауап беріңіз
        </p>
      )}
    </main>
  );
}
