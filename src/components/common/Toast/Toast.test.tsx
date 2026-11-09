import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from './ToastProvider';

function Trigger({ message = 'Saved', options }: { message?: string; options?: Record<string, unknown> }) {
  const { notify } = useToast();
  return (
    <button type="button" onClick={() => notify(message, options)}>
      fire
    </button>
  );
}

describe('ToastProvider / useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders polite and assertive live regions', () => {
    const { container } = render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );
    expect(container.querySelector('[aria-live="polite"]')).toBeTruthy();
    expect(container.querySelector('[aria-live="assertive"]')).toBeTruthy();
  });

  it('shows a toast when notify is called', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('routes error toasts into the assertive region, others into polite', () => {
    const { container } = render(
      <ToastProvider>
        <Trigger message="Boom" options={{ variant: 'error' }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    const assertive = container.querySelector('[aria-live="assertive"]');
    expect(assertive).toHaveTextContent('Boom');
    const polite = container.querySelector('[aria-live="polite"]');
    expect(polite).not.toHaveTextContent('Boom');
  });

  it('auto-dismisses after the duration', () => {
    render(
      <ToastProvider defaultDuration={3000}>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('can be dismissed via its dismiss button', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    fireEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('caps the number of visible toasts and drops the oldest', () => {
    function MultiTrigger() {
      const { notify } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            for (let i = 1; i <= 6; i += 1) notify(`msg-${i}`, { duration: 0 });
          }}
        >
          burst
        </button>
      );
    }
    render(
      <ToastProvider maxVisible={4}>
        <MultiTrigger />
      </ToastProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('burst'));
    });
    // Only the last 4 remain.
    expect(screen.queryByText('msg-1')).not.toBeInTheDocument();
    expect(screen.queryByText('msg-2')).not.toBeInTheDocument();
    expect(screen.getByText('msg-3')).toBeInTheDocument();
    expect(screen.getByText('msg-6')).toBeInTheDocument();
  });

  it('clears pending timers on provider unmount (no late dismiss errors)', () => {
    const { unmount } = render(
      <ToastProvider defaultDuration={5000}>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    unmount();
    // Advancing timers after unmount must not throw (timers were cleared).
    expect(() => act(() => vi.advanceTimersByTime(10000))).not.toThrow();
  });

  it('throws if useToast is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/must be used within a ToastProvider/i);
    spy.mockRestore();
  });
});
