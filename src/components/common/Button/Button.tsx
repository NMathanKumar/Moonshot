/**
 * Button Component
 * Reusable button component
 */

import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'medium' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
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
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClass}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loader}>
          <span className={styles.spinner}></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
