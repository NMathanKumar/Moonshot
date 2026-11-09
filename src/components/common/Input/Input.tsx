/**
 * Input Component
 * Reusable input field component
 */

import styles from './Input.module.css';

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
  const inputClass = [styles.input, error ? styles.error : '', className]
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
        <label htmlFor={props.id || name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
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
        className={inputClass}
        autoComplete={autoComplete}
        {...props}
      />
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

export default Input;
