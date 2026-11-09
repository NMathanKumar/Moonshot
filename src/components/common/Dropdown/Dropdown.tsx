/**
 * Dropdown Component
 * Accessible select-like component using native <select> styled with CSS Modules.
 * WCAG 2.1 AA.
 */

import styles from './Dropdown.module.css';

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
  const selectClass = [styles.select, error ? styles.error : '', className]
    .filter(Boolean)
    .join(' ');

  const errorId = error && name ? `${name}-error` : undefined;
  const helperId = helperText && name ? `${name}-helper` : undefined;
  const describedBy = [errorId, !error ? helperId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={selectClass}
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
        <span id={errorId} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Dropdown;
