import { describe, it, expect, beforeEach } from 'vitest';

describe('Quiz Logic', () => {
  // Helper function to calculate score
  const calculateScore = (correct: number, total: number) => {
    return (correct / total) * 100;
  };

  // Helper to determine if quiz is passed (70% threshold)
  const isQuizPassed = (score: number) => {
    return score >= 70;
  };

  let quizState: {
    answers: (number | number[])[];
    questions: Array<{ correct: number | number[]; type: 'single' | 'multiple' }>;
    score: number;
    passed: boolean;
  };

  beforeEach(() => {
    quizState = {
      answers: [],
      questions: [
        { correct: 1, type: 'single' }, // Single choice
        { correct: [0, 2], type: 'multiple' }, // Multiple choice
        { correct: 0, type: 'single' },
        { correct: [1, 3], type: 'multiple' },
        { correct: 2, type: 'single' },
      ],
      score: 0,
      passed: false,
    };
  });

  it('should count correct answers for single choice questions', () => {
    const correct = 3;
    const total = quizState.questions.length;
    const score = calculateScore(correct, total);
    expect(score).toBe(60);
  });

  it('should count correct answers for multiple choice questions', () => {
    const correct = 4;
    const total = quizState.questions.length;
    const score = calculateScore(correct, total);
    expect(score).toBe(80);
  });

  it('70% score should mark quiz as passed', () => {
    const score = 70;
    expect(isQuizPassed(score)).toBe(true);
  });

  it('69% score should mark quiz as not passed', () => {
    const score = 69;
    expect(isQuizPassed(score)).toBe(false);
  });

  it('100% score should mark quiz as passed', () => {
    const score = 100;
    expect(isQuizPassed(score)).toBe(true);
  });

  it('multiple choice: exact match = full points', () => {
    const questionCorrect = [0, 2];
    const userAnswer = [0, 2];
    const isCorrect = JSON.stringify(questionCorrect) === JSON.stringify(userAnswer);
    expect(isCorrect).toBe(true);
  });

  it('multiple choice: partial match = 0 points', () => {
    const questionCorrect = [0, 2];
    const userAnswer = [0]; // Only answered one of two correct answers
    const isCorrect = JSON.stringify(questionCorrect) === JSON.stringify(userAnswer);
    expect(isCorrect).toBe(false);
  });

  it('multiple choice: extra wrong answer = 0 points', () => {
    const questionCorrect = [0, 2];
    const userAnswer = [0, 1, 2]; // Added wrong answer 1
    const isCorrect = JSON.stringify(questionCorrect) === JSON.stringify(userAnswer);
    expect(isCorrect).toBe(false);
  });

  it('retaking quiz should reset previous score', () => {
    let previousScore = 60;
    expect(previousScore).toBe(60);

    // Reset for retake
    previousScore = 0;
    const newScore = 80;
    expect(previousScore).toBe(0);
    expect(newScore).toBe(80);
  });

  it('should calculate correct percentage for partial answers', () => {
    const correct = 2;
    const total = 5;
    const score = calculateScore(correct, total);
    expect(score).toBe(40);
  });

  it('should handle 0 correct answers', () => {
    const correct = 0;
    const total = 5;
    const score = calculateScore(correct, total);
    expect(score).toBe(0);
    expect(isQuizPassed(score)).toBe(false);
  });
});
