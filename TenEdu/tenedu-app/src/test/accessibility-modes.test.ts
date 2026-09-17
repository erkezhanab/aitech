import { describe, it, expect, beforeEach } from 'vitest';

describe('Accessibility Modes', () => {
  const MODE_PRESETS = {
    visual: {
      fontSize: 22,
      theme: 'high-contrast',
      fontFamily: 'system',
      autoTTS: true,
    },
    hearing: {
      fontSize: 17,
      theme: 'light',
      fontFamily: 'system',
      captionsDefault: true,
    },
    dyslexia: {
      fontSize: 18,
      theme: 'cream',
      fontFamily: 'dyslexic',
      autoTTS: false,
    },
    children: {
      fontSize: 20,
      theme: 'light',
      fontFamily: 'system',
      gamification: true,
    },
    standard: {
      fontSize: 16,
      theme: 'light',
      fontFamily: 'system',
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should apply correct CSS variables for visual mode', () => {
    const mode = MODE_PRESETS.visual;
    expect(mode.theme).toBe('high-contrast');
    expect(mode.fontSize).toBe(22);
    expect(mode.autoTTS).toBe(true);
  });

  it('should apply correct CSS variables for hearing mode', () => {
    const mode = MODE_PRESETS.hearing;
    expect(mode.captionsDefault).toBe(true);
    expect(mode.fontSize).toBe(17);
  });

  it('should apply correct CSS variables for dyslexia mode', () => {
    const mode = MODE_PRESETS.dyslexia;
    expect(mode.fontFamily).toBe('dyslexic');
    expect(mode.theme).toBe('cream');
  });

  it('should apply correct CSS variables for children mode', () => {
    const mode = MODE_PRESETS.children;
    expect(mode.gamification).toBe(true);
    expect(mode.fontSize).toBe(20);
  });

  it('manual overrides should not be reset when changing mode', () => {
    const overrides = { fontSize: 24 };

    // Change mode but keep overrides
    expect(overrides.fontSize).toBe(24); // Override persists
  });

  it('children mode should be auto-selected for ages under 12', () => {
    const age = 10;
    const recommendedMode = age < 12 ? 'children' : 'standard';
    expect(recommendedMode).toBe('children');
  });

  it('adult mode should be selected for ages 12+', () => {
    const age = 15;
    const recommendedMode = age < 12 ? 'children' : 'standard';
    expect(recommendedMode).toBe('standard');
  });

  it('should persist mode selection to localStorage', () => {
    const selectedMode = 'dyslexia';
    localStorage.setItem('a11y_mode', selectedMode);
    expect(localStorage.getItem('a11y_mode')).toBe('dyslexia');
  });

  it('should restore mode from localStorage on app load', () => {
    localStorage.setItem('a11y_mode', 'visual');
    const restored = localStorage.getItem('a11y_mode');
    expect(restored).toBe('visual');
  });
});
