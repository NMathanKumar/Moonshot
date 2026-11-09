/**
 * ToastProvider + useToast
 * Context-based toast system. Renders two aria-live regions so messages are
 * announced to screen readers: errors use an ASSERTIVE region, everything
 * else uses a POLITE region. Toasts auto-dismiss, are keyboard-dismissible,
 * capped to a maximum visible count, and all timers are cleaned up on
 * dismissal and on provider unmount. WCAG 2.1 AA.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Toast } from './Toast';
import styles from './Toast.module.css';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

const VARIANTS = ['info', 'success', 'error', 'warning'] as const;
type Variant = (typeof VARIANTS)[number];
const DEFAULT_MAX_VISIBLE = 4;

interface Toast {
  id: number;
  message: string;
  variant: Variant;
}

interface ToastOptions {
  variant?: Variant;
  duration?: number;
}

interface ToastContextType {
  notify: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  defaultDuration?: number;
  maxVisible?: number;
}> = ({
  children,
  defaultDuration = 5000,
  maxVisible = DEFAULT_MAX_VISIBLE,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const clearTimer = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      setToasts((current) => current.filter((t) => t.id !== id));
      clearTimer(id);
    },
    [clearTimer]
  );

  const notify = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const variant = VARIANTS.includes(options.variant as Variant) ? (options.variant as Variant) : 'info';
      const duration = options.duration ?? defaultDuration;
      idRef.current += 1;
      const id = idRef.current;

      setToasts((current) => {
        const next = [...current, { id, message, variant }];
        // Enforce max visible: drop the oldest, clearing their timers.
        if (next.length > maxVisible) {
          const removed = next.splice(0, next.length - maxVisible);
          removed.forEach((t) => clearTimer(t.id));
        }
        return next;
      });

      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [defaultDuration, maxVisible, dismiss, clearTimer]
  );

  // Clean up every pending timer when the provider unmounts.
  useEffect(() => {
    const timerMap = timers.current;
    return () => {
      timerMap.forEach((timer) => clearTimeout(timer));
      timerMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  const polite = toasts.filter((t) => t.variant !== 'error');
  const assertive = toasts.filter((t) => t.variant === 'error');

  const renderToast = (toast: Toast) => (
    <Toast
      key={toast.id}
      id={toast.id}
      message={toast.message}
      variant={toast.variant}
      onDismiss={dismiss}
    />
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={styles.region}
        role="region"
        aria-label="Notifications"
        data-testid="toast-region"
      >
        <div aria-live="polite" aria-atomic="false">
          {polite.map(renderToast)}
        </div>
        <div aria-live="assertive" role="alert" aria-atomic="false">
          {assertive.map(renderToast)}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

export default ToastProvider;
