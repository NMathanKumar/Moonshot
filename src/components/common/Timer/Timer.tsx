/**
 * Timer Component
 * Displays countdown or elapsed time with optional warning threshold.
 * Self-managed via setInterval; emits onTick and onComplete callbacks.
 * WCAG 2.1 AA.
 */

import { useEffect, useState, useRef } from 'react';
import styles from './Timer.module.css';

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
  let displayClass = '';
  if (warningThreshold && secondsRemaining <= warningThreshold) {
    displayClass = secondsRemaining <= warningThreshold / 2 ? styles.critical : styles.warning;
  }

  const timerClass = [
    styles.timer,
    orientation === 'vertical' ? styles.timerVertical : '',
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
      <div className={[styles.display, displayClass].filter(Boolean).join(' ')}>
        {formattedTime}
      </div>
    </div>
  );
};

export default Timer;
