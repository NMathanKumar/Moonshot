/**
 * Toast - Individual toast notification
 * Renders a single toast message with dismiss button.
 * Used by ToastProvider to render all toasts.
 */

export interface ToastProps {
  id: number;
  message: string;
  variant: 'info' | 'success' | 'error' | 'warning';
  onDismiss: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, variant, onDismiss }) => {
  const variantClasses = {
    info: 'border-l-[#17a2b8]',
    success: 'border-l-[#2e7d32]',
    error: 'border-l-[#E01F26]',
    warning: 'border-l-[#f9a825]',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-2 p-4 rounded-md shadow-md bg-white border-l-4 text-[#232D3F] text-sm ${variantClasses[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <p className="flex-1 m-0">{message}</p>
      <button
        type="button"
        className="flex-shrink-0 border-none bg-transparent cursor-pointer text-[#55657B] w-5 h-5 inline-flex items-center justify-center rounded hover:text-[#232D3F] focus-visible:outline-2 focus-visible:outline-[#FF6A00] focus-visible:outline-offset-2"
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
};

export default Toast;
