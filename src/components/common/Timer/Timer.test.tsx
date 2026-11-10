import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timer } from './Timer';

describe('Timer', () => {
  it('renders initial seconds in MM:SS format', () => {
    render(<Timer initialSeconds={125} isActive={false} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('formats time using custom format function', () => {
    const customFormat = (seconds: number) => `${seconds}s`;
    render(
      <Timer
        initialSeconds={45}
        isActive={false}
        format={customFormat}
      />
    );
    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('displays aria-label with timer info', () => {
    render(
      <Timer
        initialSeconds={60}
        isActive={false}
      />
    );
    expect(screen.getByLabelText(/Timer: 01:00/)).toBeInTheDocument();
  });

  it('forwards extra className', () => {
    const { container } = render(
      <Timer
        initialSeconds={30}
        isActive={false}
        className="custom-timer"
      />
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/custom-timer/);
  });

  it('supports vertical orientation', () => {
    const { container } = render(
      <Timer
        initialSeconds={30}
        isActive={false}
        orientation="vertical"
      />
    );
    // Tailwind class for vertical orientation is flex-col
    const timerDiv = container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(timerDiv.className).toMatch(/flex-col/);
  });

  it('applies warning class when under threshold', () => {
    const { container } = render(
      <Timer
        initialSeconds={3}
        isActive={false}
        warningThreshold={5}
      />
    );
    // Warning state applies animate-pulse and text color
    const timerDiv = container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(timerDiv).toBeInTheDocument();
    // Check that pulse animation is applied
    expect(timerDiv.querySelector('div')?.className).toMatch(/animate-pulse/);
  });

  it('applies critical class when below half of threshold', () => {
    const { container } = render(
      <Timer
        initialSeconds={1}
        isActive={false}
        warningThreshold={5}
      />
    );
    // Critical state also applies animate-pulse
    const timerDiv = container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(timerDiv).toBeInTheDocument();
    expect(timerDiv.querySelector('div')?.className).toMatch(/animate-pulse/);
  });

  it('renders zero time correctly', () => {
    render(<Timer initialSeconds={0} isActive={false} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('renders large times correctly', () => {
    render(<Timer initialSeconds={3661} isActive={false} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('has aria-live="polite" for accessibility', () => {
    const { container } = render(
      <Timer initialSeconds={30} isActive={false} />
    );
    const display = container.querySelector('[aria-live]');
    expect(display).toHaveAttribute('aria-live', 'polite');
  });
});
