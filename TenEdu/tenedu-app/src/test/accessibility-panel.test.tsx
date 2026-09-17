import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock AccessibilityPanel Component
interface AccessibilityPanelProps {
  onFontSizeChange: (size: number) => void;
  onThemeChange: (theme: string) => void;
}

const AccessibilityPanel = ({ onFontSizeChange, onThemeChange }: AccessibilityPanelProps) => (
  <div data-testid="a11y-panel">
    <button onClick={() => onFontSizeChange(16)}>A-</button>
    <button onClick={() => onFontSizeChange(20)}>A</button>
    <button onClick={() => onFontSizeChange(24)}>A+</button>

    <button onClick={() => onThemeChange('light')}>Light</button>
    <button onClick={() => onThemeChange('dark')}>Dark</button>
    <button onClick={() => onThemeChange('high-contrast')}>Contrast</button>

    <button onClick={() => document.body.style.fontFamily = 'OpenDyslexic'}>
      OpenDyslexic
    </button>

    <button onClick={() => window.speechSynthesis.speak({} as SpeechSynthesisUtterance)}>
      Озвучить
    </button>
  </div>
);

describe('Accessibility Panel Component', () => {
  let fontSizeChangeHandler: (size: number) => void;
  let themeChangeHandler: (theme: string) => void;

  beforeEach(() => {
    fontSizeChangeHandler = vi.fn();
    themeChangeHandler = vi.fn();
  });

  it('should render A- / A / A+ buttons for font size', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    expect(screen.getByRole('button', { name: /A-/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^A$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /A\+/i })).toBeInTheDocument();
  });

  it('clicking A- button should set font size to 16px', async () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const button = screen.getByRole('button', { name: /A-/i });
    fireEvent.click(button);

    expect(fontSizeChangeHandler).toHaveBeenCalledWith(16);
  });

  it('clicking A button should set font size to 20px', async () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const button = screen.getByRole('button', { name: /^A$/i });
    fireEvent.click(button);

    expect(fontSizeChangeHandler).toHaveBeenCalledWith(20);
  });

  it('clicking A+ button should set font size to 24px', async () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const button = screen.getByRole('button', { name: /A\+/i });
    fireEvent.click(button);

    expect(fontSizeChangeHandler).toHaveBeenCalledWith(24);
  });

  it('should render theme buttons', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    expect(screen.getByRole('button', { name: /Light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contrast/i })).toBeInTheDocument();
  });

  it('clicking theme button should apply theme', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const darkButton = screen.getByRole('button', { name: /Dark/i });
    fireEvent.click(darkButton);

    expect(themeChangeHandler).toHaveBeenCalledWith('dark');
  });

  it('should render OpenDyslexic toggle button', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    expect(screen.getByRole('button', { name: /OpenDyslexic/i })).toBeInTheDocument();
  });

  it('clicking OpenDyslexic button should apply font', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const button = screen.getByRole('button', { name: /OpenDyslexic/i });
    fireEvent.click(button);

    expect(document.body.style.fontFamily).toContain('OpenDyslexic');
  });

  it('should render read aloud button', () => {
    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    expect(screen.getByRole('button', { name: /Озвучить/i })).toBeInTheDocument();
  });

  it('clicking read aloud button should trigger speech synthesis', () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');

    render(
      <AccessibilityPanel
        onFontSizeChange={fontSizeChangeHandler}
        onThemeChange={themeChangeHandler}
      />
    );

    const button = screen.getByRole('button', { name: /Озвучить/i });
    fireEvent.click(button);

    expect(speakSpy).toHaveBeenCalled();
  });
});
