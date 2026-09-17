"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Volume2, VolumeX,
  Pause, Play, CheckCircle2, XCircle, Award, BookOpen, Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import type { Track, Lesson, LessonBlock } from "@/types";

interface Props {
  track: Track;
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  nextLessonId?: string;
  prevLessonId?: string;
}

type Phase = "content" | "quiz" | "complete";

// ── TTS Speed Selector ───────────────────────────────────────
function TTSControls() {
  const { isSpeaking, ttsPaused, pauseResumeTTS, stopSpeaking, ttsSpeed, setTtsSpeed } =
    useAccessibility();
  if (!isSpeaking) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-xl"
      role="toolbar"
      aria-label="Дыбыс басқару"
    >
      <button
        onClick={pauseResumeTTS}
        className="p-2 rounded-full hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label={ttsPaused ? "Жалғастыру" : "Кідірту"}
      >
        {ttsPaused
          ? <Play className="w-4 h-4" aria-hidden="true" />
          : <Pause className="w-4 h-4" aria-hidden="true" />}
      </button>
      <button
        onClick={stopSpeaking}
        className="p-2 rounded-full hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Тоқтату"
      >
        <VolumeX className="w-4 h-4" aria-hidden="true" />
      </button>
      <div className="flex gap-1 ml-1" role="group" aria-label="Оқу жылдамдығы">
        {([0.75, 1, 1.5] as const).map((s) => (
          <button
            key={s}
            onClick={() => setTtsSpeed(s)}
            aria-pressed={ttsSpeed === s}
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold transition-colors",
              ttsSpeed === s ? "bg-accent-400 text-black" : "hover:bg-white/20"
            )}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Один блок контента ───────────────────────────────────────
function ContentBlock({
  block,
  mode,
  onSpeak,
}: {
  block: LessonBlock;
  mode: string;
  onSpeak: (text: string) => void;
}) {
  const isDyslexia = mode === "dyslexia";
  const isVisual = mode === "visual";

  if (block.type === "image") {
    return (
      <figure className="rounded-3xl overflow-hidden my-4">
        <Image
          src={block.src || "/placeholder.webp"}
          alt={block.alt || "Сабақ суреті"}
          width={800}
          height={450}
          className="w-full object-cover"
        />
        {block.alt && (
          <figcaption className="text-sm text-center mt-2" style={{ color: "var(--te-text-muted)" }}>
            {block.alt}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "tip") {
    return (
      <div
        className="border-l-4 border-accent-400 px-5 py-4 rounded-r-2xl te-text-block"
        style={{ background: "var(--te-bg-alt)" }}
        role="note"
      >
        <p>{block.content}</p>
        {(isDyslexia || isVisual) && (
          <SpeakButton text={block.content} onSpeak={onSpeak} />
        )}
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div
        className="border-l-4 border-red-400 px-5 py-4 rounded-r-2xl te-text-block bg-red-50"
        role="note"
      >
        <p className="text-red-800">{block.content}</p>
        {(isDyslexia || isVisual) && (
          <SpeakButton text={block.content} onSpeak={onSpeak} />
        )}
      </div>
    );
  }

  // text — дислексия разбивает по предложениям, у каждого своя кнопка озвучки
  if (isDyslexia) {
    const sentences = block.content
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .reduce<string[][]>((acc, s, i) => {
        const chunk = Math.floor(i / 2);
        if (!acc[chunk]) acc[chunk] = [];
        acc[chunk].push(s);
        return acc;
      }, []);

    return (
      <div className="te-text-block space-y-3">
        {sentences.map((group, gi) => (
          <div key={gi} className="flex items-start gap-2 group">
            <p className="flex-1">{group.join(" ")}</p>
            <SpeakButton text={group.join(" ")} onSpeak={onSpeak} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="te-text-block group relative">
      <p>{block.content}</p>
      {isVisual && (
        <button
          onClick={() => onSpeak(block.content)}
          className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1.5 bg-primary-50 text-primary-600 rounded-xl transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          aria-label="Осы абзацты дыбыстап оқу"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function SpeakButton({ text, onSpeak }: { text: string; onSpeak: (t: string) => void }) {
  return (
    <button
      onClick={() => onSpeak(text)}
      className="shrink-0 p-1.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      aria-label="Дыбыстап оқу"
    >
      <Volume2 className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────
export function LessonClient({
  track, lesson, lessonIndex, totalLessons, nextLessonId, prevLessonId,
}: Props) {
  const { mode, effective, speak, stopSpeaking, playSound, notify } = useAccessibility();

  const [phase, setPhase] = useState<Phase>("content");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const progressPercent = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  const isVisual   = mode === "visual";
  const isHearing  = mode === "hearing";
  const isDyslexia = mode === "dyslexia";
  const isChildren = mode === "children";

  // Auto-TTS при открытии урока
  useEffect(() => {
    if (effective.autoTTS && phase === "content") {
      const text = lesson.content
        .filter((b) => b.type !== "image")
        .map((b) => b.content)
        .join(". ");
      setTimeout(() => speak(text), 500);
    }
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, phase]);

  function handleSpeakAll() {
    const text = lesson.content
      .filter((b) => b.type !== "image")
      .map((b) => b.content)
      .join(". ");
    speak(text);
  }

  function handleAnswer(questionId: string, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (effective.soundFeedback) playSound("click");

    // Visual mode: озвучить вариант ответа
    if (isVisual) {
      const q = lesson.quiz.find((q) => q.id === questionId);
      if (q) speak(q.options[optionIndex]);
    }
  }

  function handleSubmitQuiz() {
    setSubmitted(true);
    const score = lesson.quiz.filter((q) => answers[q.id] === q.correct).length;
    const passed = score >= Math.ceil(lesson.quiz.length / 2);

    if (passed) {
      playSound("success");
      if (isHearing) notify(`Тест өтті! ${score}/${lesson.quiz.length} дұрыс`, "success");
      if (isVisual) speak(`Керемет! ${score} дұрыс жауап. Сабақ аяқталды!`);
      setTimeout(() => setPhase("complete"), 1200);
    } else {
      playSound("error");
      if (isHearing) notify(`${score}/${lesson.quiz.length} дұрыс. Қайталаңыз.`, "error");
      if (isVisual) speak(`${score} дұрыс. Тексеріп, қайталаңыз.`);
    }
  }

  // Озвучить вопрос теста
  function speakQuestion(q: typeof lesson.quiz[0]) {
    speak(`${q.question}. Жауаптар: ${q.options.join(", ")}`);
  }

  const score = submitted
    ? lesson.quiz.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined);
  const passed = submitted && score >= Math.ceil(lesson.quiz.length / 2);

  return (
    <>
      <main className="py-8 px-4 max-w-3xl mx-auto" id="main-content">

        {/* Breadcrumb */}
        <nav aria-label="Навигация" className="mb-6">
          <ol className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "var(--te-text-muted)" }}>
            <li><Link href="/catalog" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">Каталог</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--te-text-muted)" }}>{track.emoji} {track.title}</li>
            <li aria-hidden="true">/</li>
            <li className="font-medium" style={{ color: "var(--te-text)" }} aria-current="page">{lesson.title}</li>
          </ol>
        </nav>

        {/* Progress bar */}
        <div
          className="mb-8"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Трек барысы: ${lessonIndex + 1} / ${totalLessons} сабақ`}
        >
          <div className="flex justify-between text-sm mb-2" style={{ color: "var(--te-text-muted)" }}>
            <span>Сабақ {lessonIndex + 1} / {totalLessons}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--te-border)" }}>
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── CONTENT phase ─────────────────────────────── */}
        {phase === "content" && (
          <article aria-labelledby="lesson-title">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1
                id="lesson-title"
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: "var(--te-text)" }}
              >
                {lesson.title}
              </h1>
              {/* TTS кнопка для visual и dyslexia */}
              {(isVisual || isDyslexia) && (
                <button
                  onClick={handleSpeakAll}
                  className="shrink-0 p-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
                  style={{ background: "var(--te-bg-alt)", color: "var(--te-text)" }}
                  aria-label="Бүкіл сабақты дыбыстап оқу"
                >
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Hearing mode: напоминание что весь контент в тексте */}
            {isHearing && (
              <div className="mb-4 px-4 py-3 rounded-2xl border-2 border-blue-200 bg-blue-50 text-blue-800 text-sm font-medium">
                📝 Барлық ақпарат мәтін форматында берілген
              </div>
            )}

            {/* Children mode: маскот */}
            {isChildren && (
              <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-accent-50 border-2 border-accent-200">
                <span className="text-3xl" aria-hidden="true">🦊</span>
                <p className="text-sm font-medium text-primary-800">
                  Мен Акела! Сенімен бірге оқимын. Дайынсың ба? 🚀
                </p>
              </div>
            )}

            {/* Content blocks */}
            <div className="space-y-2">
              {lesson.content.map((block, idx) => (
                <ContentBlock key={idx} block={block} mode={mode} onSpeak={speak} />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t" style={{ borderColor: "var(--te-border)" }}>
              {prevLessonId ? (
                <Link href={`/courses/${track.id}/${prevLessonId}`}>
                  <Button variant="ghost" size="md">
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Алдыңғы
                  </Button>
                </Link>
              ) : (
                <Link href="/catalog">
                  <Button variant="ghost" size="md">
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Каталог
                  </Button>
                </Link>
              )}
              <Button
                size={isChildren || isVisual ? "xl" : "lg"}
                onClick={() => { stopSpeaking(); setPhase("quiz"); }}
              >
                {isChildren ? "Тестке өту! 🎮" : "Тест"}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </article>
        )}

        {/* ── QUIZ phase ────────────────────────────────── */}
        {phase === "quiz" && (
          <section aria-labelledby="quiz-heading">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent-400 rounded-2xl flex items-center justify-center">
                {isChildren
                  ? <Star className="w-5 h-5 text-primary-800" aria-hidden="true" />
                  : <BookOpen className="w-5 h-5 text-primary-800" aria-hidden="true" />
                }
              </div>
              <div>
                <h1 id="quiz-heading" className="text-xl font-bold" style={{ color: "var(--te-text)" }}>
                  {isChildren ? "Ойын уақыты! 🎮" : `Тест: ${lesson.title}`}
                </h1>
                <p style={{ color: "var(--te-text-muted)" }} className="text-sm">
                  {lesson.quiz.length} сұрақ
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {lesson.quiz.map((q, qi) => {
                const userAnswer = answers[q.id];
                const isCorrect  = submitted && userAnswer === q.correct;
                const isWrong    = submitted && userAnswer !== undefined && userAnswer !== q.correct;

                return (
                  <Card
                    key={q.id}
                    className={cn(
                      "transition-colors",
                      submitted && isCorrect && "border-2 border-green-400",
                      submitted && isWrong   && "border-2 border-red-300",
                    )}
                    style={{
                      background: submitted && isCorrect ? "#f0fdf4"
                        : submitted && isWrong ? "#fef2f2"
                        : "var(--te-surface)",
                      borderColor: submitted ? undefined : "var(--te-border)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <p
                        className="font-semibold"
                        id={`question-${q.id}`}
                        style={{ color: "var(--te-text)" }}
                      >
                        {isChildren
                          ? `❓ ${q.question}`
                          : `${qi + 1}. ${q.question}`}
                      </p>
                      {/* Visual mode: озвучить вопрос */}
                      {(isVisual || isDyslexia) && (
                        <button
                          onClick={() => speakQuestion(q)}
                          className="shrink-0 p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                          style={{ background: "var(--te-bg-alt)", color: "var(--te-text)" }}
                          aria-label="Сұрақты дыбыстап оқу"
                        >
                          <Volume2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div
                      className="space-y-2"
                      role="radiogroup"
                      aria-labelledby={`question-${q.id}`}
                    >
                      {q.options.map((option, oi) => {
                        const isSelected      = userAnswer === oi;
                        const isCorrectOption = submitted && oi === q.correct;
                        const isWrongOption   = submitted && isSelected && oi !== q.correct;

                        return (
                          <button
                            key={oi}
                            role="radio"
                            aria-checked={isSelected}
                            disabled={submitted}
                            onClick={() => handleAnswer(q.id, oi)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150 text-sm",
                              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400",
                              !submitted && isSelected  && "border-primary-500 bg-primary-50",
                              !submitted && !isSelected && "border-gray-200 hover:border-primary-300",
                              isCorrectOption && "border-green-500 bg-green-50 font-medium",
                              isWrongOption   && "border-red-400 bg-red-50",
                              submitted && !isSelected && !isCorrectOption && "opacity-50",
                              isChildren && "py-4 text-base font-medium",
                            )}
                            aria-label={`${option}${isCorrectOption ? " — дұрыс жауап" : ""}${isWrongOption ? " — қате жауап" : ""}`}
                          >
                            <span className="flex items-center gap-2">
                              {submitted && isCorrectOption && (
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" />
                              )}
                              {submitted && isWrongOption && (
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
                              )}
                              {isChildren && !submitted && (
                                <span className="shrink-0" aria-hidden="true">
                                  {["🅰️","🅱️","🅾️","🆘"][oi]}
                                </span>
                              )}
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            {!submitted ? (
              <Button
                size={isChildren || isVisual ? "xl" : "lg"}
                fullWidth
                disabled={!allAnswered}
                onClick={handleSubmitQuiz}
              >
                {isChildren ? "Тексер! ✅" : "Тексеру"}
              </Button>
            ) : (
              <div
                className={cn("p-5 rounded-3xl text-center mb-4 border-2",
                  passed ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-200"
                )}
                role="status"
                aria-live="polite"
              >
                {passed ? (
                  <>
                    <div className="text-4xl mb-2" aria-hidden="true">
                      {isChildren ? "🌟🎉🌟" : "✅"}
                    </div>
                    <p className="font-bold text-green-800 text-lg">
                      {isChildren ? "Керемет! Сен жұлдызсың!" : "Керемет!"}{" "}
                      {score}/{lesson.quiz.length} дұрыс
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Сабақ аяқталды!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2" aria-hidden="true">
                      {isChildren ? "💪 Тағы бір рет!" : "🔄"}
                    </div>
                    <p className="font-bold text-orange-800 text-lg">
                      {score}/{lesson.quiz.length} дұрыс
                    </p>
                    <p className="text-orange-600 text-sm mt-1 mb-4">Қайта байқаңыз!</p>
                    <Button
                      variant="secondary" size="md"
                      onClick={() => { setAnswers({}); setSubmitted(false); }}
                    >
                      Қайталау
                    </Button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => { stopSpeaking(); setPhase("content"); }}
              className="mt-2 text-sm w-full text-center hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
              style={{ color: "var(--te-text-muted)" }}
            >
              ← Сабаққа оралу
            </button>
          </section>
        )}

        {/* ── COMPLETE phase ─────────────────────────────── */}
        {phase === "complete" && (
          <section className="text-center py-8" aria-labelledby="complete-heading" aria-live="polite">
            {isChildren ? (
              <div className="text-6xl mb-6" aria-hidden="true">🏆🌟🎉</div>
            ) : (
              <div className="w-20 h-20 bg-accent-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary-800" aria-hidden="true" />
              </div>
            )}

            <h1
              id="complete-heading"
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--te-text)" }}
            >
              {isChildren ? "Сабақ бітті! Сен керемет! 🦊" : "Сабақ аяқталды!"}
            </h1>
            <p style={{ color: "var(--te-text-muted)" }} className="mb-8 text-lg">
              {score}/{lesson.quiz.length} дұрыс жауап
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {nextLessonId ? (
                <Link href={`/courses/${track.id}/${nextLessonId}`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {isChildren ? "Келесі сабақ! ➡️" : "Келесі сабақ"}
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Award className="w-5 h-5" aria-hidden="true" />
                    {isChildren ? "Марапаттарымды қарау! 🌟" : "Трек аяқталды — Кабинет"}
                  </Button>
                </Link>
              )}
              <Link href="/catalog">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Каталогқа оралу
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* TTS controls — плавающие */}
      <TTSControls />
    </>
  );
}
