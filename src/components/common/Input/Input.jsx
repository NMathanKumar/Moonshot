/**
 * Input Component
 * Reusable input field component
 */

import './Input.css';

export const Input = ({
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
  const inputClass = `input ${error ? 'input--error' : ''} ${className}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
        autoComplete={autoComplete}
        {...props}
      />
      {error && <span className="input__error">{error}</span>}
      {helperText && !error && <span className="input__helper">{helperText}</span>}
    </div>
  );
};

export default Input;
