export type AccessibilityMode =
  | "visual"
  | "hearing"
  | "dyslexia"
  | "children"
  | "standard";

export type LearningGoal = "study" | "work" | "personal";

export type FontSize = "normal" | "large" | "xlarge";

export type Theme = "light" | "dark" | "cream" | "high-contrast";

export type TTSSpeed = 0.75 | 1 | 1.5;

// ── Полный пресет режима ─────────────────────────────────────
export interface ModeSettings {
  fontSize: number;          // базовый px
  fontFamily: "system" | "dyslexic";
  lineHeight: number;
  letterSpacing: number;     // em
  theme: Theme;
  autoTTS: boolean;
  captionsDefault: boolean;
  soundFeedback: boolean;
  gamification: boolean;
  simplifiedNav: boolean;
  minTouchTarget: number;    // px
  blockSpacing: number;      // rem — отступ между блоками текста
}

// ── Ручные переопределения (не стираются при смене режима) ───
export interface ManualOverrides {
  fontSize?: number;
  theme?: Theme;
  autoTTS?: boolean;
  dyslexicFont?: boolean;
  ttsSpeed?: TTSSpeed;
}

export interface AccessibilitySettings {
  mode: AccessibilityMode;
  // computed из preset + overrides:
  effectiveSettings: ModeSettings;
  overrides: ManualOverrides;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  accessibility: AccessibilitySettings;
  goal: LearningGoal | null;
  onboardingDone: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  trackId: string;
  order: number;
  title: string;
  description: string;
  content: LessonBlock[];
  audioUrl?: string;
  duration: number;
  quiz: QuizQuestion[];
}

export type LessonBlockType = "text" | "image" | "tip" | "warning";

export interface LessonBlock {
  type: LessonBlockType;
  content: string;
  alt?: string;
  src?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
  isChildrenOnly?: boolean;
  targetGoals?: LearningGoal[];
}

export interface UserProgress {
  userId: string;
  trackId: string;
  lessonId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  completedAt?: string;
}
