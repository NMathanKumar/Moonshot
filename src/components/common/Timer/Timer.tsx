/**
 * Timer Component
 * Displays countdown or elapsed time with optional warning threshold.
 * Self-managed via setInterval; emits onTick and onComplete callbacks.
 * WCAG 2.1 AA.
 */

import { useEffect, useState, useRef } from 'react';

export type TimerFormatFunction = (seconds: number) => string;

export interface TimerProps {
  initialSeconds: number;
  isActive?: boolean;
  onComplete?: () => void;
  onTick?: (remainingSeconds: number) => void;
  format?: TimerFormatFunction;
  displayVariant?: 'countdown' | 'elapsed';
  warningThreshold?: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const defaultFormat: TimerFormatFunction = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  isActive = false,
  onComplete,
  onTick,
  format = defaultFormat,

  warningThreshold,
  className = '',
  orientation = 'horizontal',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = Math.max(0, prev - 1);

        // Call onTick with remaining time
        onTick?.(next);

        // Call onComplete when countdown reaches zero
        if (next === 0) {
          onComplete?.();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onComplete, onTick]);

  // Determine warning/critical state
  let displayClasses = '';
  if (warningThreshold && secondsRemaining <= warningThreshold) {
    if (secondsRemaining <= warningThreshold / 2) {
      // Critical state
      displayClasses = 'text-[#E01F26] animate-pulse';
    } else {
      // Warning state
      displayClasses = 'text-[#f9a825] animate-pulse';
    }
  }

  const timerClass = [
    'inline-flex items-center justify-center p-4 rounded-md bg-white border border-[#DDE2E7] min-w-[200px]',
    orientation === 'vertical' ? 'flex-col gap-4' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const formattedTime = format(secondsRemaining);

  return (
    <div
      className={timerClass}
      aria-label={`Timer: ${formattedTime}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`font-mono text-2xl font-bold text-[#232D3F] transition-colors letter-spacing-2 text-center ${displayClasses} ${orientation === 'vertical' ? 'text-4xl' : ''}`}
      >
        {formattedTime}
      </div>
    </div>
  );
};

export default Timer;
