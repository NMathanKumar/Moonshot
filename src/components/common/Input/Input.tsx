/**
 * Input Component
 * Reusable input field component using Tailwind CSS
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  type?: string;
  name: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  autoComplete,
  ...props
}) => {
  const inputClasses = `px-3 py-2 text-sm border rounded transition-colors font-inherit ${
    error
      ? 'border-red-600 focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-100'
      : 'border-[#DDE2E7] focus:outline-none focus:border-[#FF6A00] focus:ring-3 focus:ring-orange-100'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''} ${className}`;

  const errorId = error && name ? `${name}-error` : undefined;
  const helperId = helperText && name ? `${name}-helper` : undefined;
  const describedBy = [errorId, !error ? helperId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && (
        <label htmlFor={props.id || name} className="text-sm font-semibold text-slate-900">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        id={props.id || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={inputClasses}
        autoComplete={autoComplete}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs text-red-600 -mt-1" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className="text-xs text-slate-500 -mt-1">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
