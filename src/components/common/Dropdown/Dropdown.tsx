/**
 * Dropdown Component
 * Accessible select-like component using native <select> styled with Tailwind CSS.
 * WCAG 2.1 AA.
 */

export interface Option {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  name: string;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const errorId = error && name ? `${name}-error` : undefined;
  const helperId = helperText && name ? `${name}-helper` : undefined;
  const describedBy =
    [errorId, !error ? helperId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="font-semibold text-sm text-[#232D3F] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[#E01F26]">*</span>}
        </label>
      )}
      <div className="relative inline-block w-full">
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`w-full px-4 py-2 text-sm font-inherit border rounded bg-white text-[#232D3F] cursor-pointer transition-all pr-10 appearance-none bg-no-repeat bg-right ${
            error
              ? 'border-[#E01F26] bg-[rgba(224,31,38,0.1)]'
              : 'border-[#DDE2E7] hover:border-[#999999] focus-visible:outline-2 focus-visible:outline-[#FF6A00] focus-visible:outline-offset-2 focus-visible:border-[#FF6A00]'
          } disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#f5f5f5] ${className}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
            backgroundPosition: `right ${8}px center`,
            backgroundSize: '16px',
            paddingRight: `calc(1rem + 16px + 8px)`,
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span id={errorId} className="text-xs text-[#E01F26] font-medium block" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className="text-xs text-[#55657B] block">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Dropdown;
