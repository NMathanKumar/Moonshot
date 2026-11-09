/**
 * Card Component
 * Semantic container for grouped content with optional title and footer.
 * No state, purely structural.
 */

import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  bordered?: boolean;
  shadow?: 'sm' | 'base' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  bordered = true,
  shadow = 'base',
  padding = 'md',
  className = '',
}) => {
  const cardClass = [
    styles.card,
    bordered ? styles.bordered : '',
    shadow ? styles[`shadow${shadow[0].toUpperCase() + shadow.slice(1)}`] : '',
    padding ? styles[`padding${padding[0].toUpperCase() + padding.slice(1)}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
