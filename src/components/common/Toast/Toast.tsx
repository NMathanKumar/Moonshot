/**
 * Toast - Individual toast notification
 * Renders a single toast message with dismiss button.
 * Used by ToastProvider to render all toasts.
 */

import styles from './Toast.module.css';

export interface ToastProps {
  id: number;
  message: string;
  variant: 'info' | 'success' | 'error' | 'warning';
  onDismiss: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, variant, onDismiss }) => (
  <div
    className={[styles.toast, styles[variant]].join(' ')}
    role={variant === 'error' ? 'alert' : 'status'}
  >
    <p className={styles.message}>{message}</p>
    <button
      type="button"
      className={styles.dismiss}
      aria-label="Dismiss notification"
      onClick={() => onDismiss(id)}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path
          d="M3 3l6 6M9 3l-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  </div>
);

export default Toast;
