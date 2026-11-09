/**
 * Alert Component
 * In-page contextual feedback message with optional title and close button.
 * WCAG 2.1 AA with role="alert" for errors/warnings and role="status" for success/info.
 */

import styles from './Alert.module.css';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  closeable?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="10" y="13" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">
        i
      </text>
    </svg>
  ),
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16zm3.5-10.5L8.5 12 6.5 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M10 2L2 16h16L10 2zm0 13a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-7a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  closeable = true,
  className = '',
}) => {
  const alertClass = [
    styles.alert,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={alertClass}
      data-testid={`alert-${variant}`}
    >
      <div className={styles.icon} aria-hidden="true">
        {iconMap[variant]}
      </div>
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {typeof children === 'string' ? (
          <p className={styles.message}>{children}</p>
        ) : (
          <div className={styles.message}>{children}</div>
        )}
      </div>
      {closeable && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close alert"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
