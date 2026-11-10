/**
 * Button Component
 * Reusable button component using Tailwind CSS
 */

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

const getVariantClasses = (variant: string): string => {
  const variants: Record<string, string> = {
    primary: 'bg-[#FF6A00] hover:bg-[#E85A00] text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-slate-900 border border-[#DDE2E7]',
    danger: 'bg-[#E01F26] hover:bg-[#C01520] text-white',
    outline: 'border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50',
    ghost: 'text-[#FF6A00] hover:bg-orange-50',
  };
  return variants[variant] || variants.primary;
};

const getSizeClasses = (size: string): string => {
  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2 text-base',
  };
  return sizes[size] || sizes.medium;
};

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
  const baseClasses =
    'inline-flex items-center justify-center border-none rounded transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A00] disabled:opacity-60 disabled:cursor-not-allowed';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClass = [baseClasses, variantClasses, sizeClasses, widthClass, className]
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
        <span className="flex items-center gap-2">
          <span className="inline-block w-[14px] h-[14px] border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
