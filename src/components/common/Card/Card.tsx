/**
 * Card Component
 * Semantic container for grouped content with optional title and footer.
 * Uses Tailwind CSS, no state, purely structural.
 */

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  bordered?: boolean;
  shadow?: 'sm' | 'base' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getShadowClasses = (shadow: string): string => {
  const shadows: Record<string, string> = {
    sm: 'shadow-sm',
    base: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  return shadows[shadow] || shadows.base;
};

const getPaddingClasses = (padding: string): string => {
  const paddings: Record<string, string> = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  return paddings[padding] || paddings.md;
};

export const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  bordered = true,
  shadow = 'base',
  padding = 'md',
  className = '',
}) => {
  const baseClasses = 'bg-white rounded-md overflow-hidden flex flex-col';
  const borderClass = bordered ? 'border border-[#DDE2E7]' : '';
  const shadowClasses = getShadowClasses(shadow);
  const paddingClasses = getPaddingClasses(padding);

  const cardClass = [baseClasses, borderClass, shadowClasses, paddingClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
      {title && (
        <div className="border-b border-[#DDE2E7] pb-4 mb-4">
          <h3 className="m-0 text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="flex-1">{children}</div>
      {footer && <div className="border-t border-[#DDE2E7] mt-4 pt-4">{footer}</div>}
    </div>
  );
};

export default Card;
