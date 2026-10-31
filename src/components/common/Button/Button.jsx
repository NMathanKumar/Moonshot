/**
 * Button Component
 * Reusable button component
 */

import './Button.css';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full-width' : ''} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClass}
      {...props}
    >
      {isLoading ? (
        <span className="btn__loader">
          <span className="spinner"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
