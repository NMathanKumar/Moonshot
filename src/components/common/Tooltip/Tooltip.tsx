/**
 * Tooltip Component
 * Shows a descriptive bubble on hover, keyboard focus, and touch (tap toggles),
 * linked to the trigger via aria-describedby. Dismissible with Escape.
 * WCAG 2.1 AA.
 *
 * Wraps a single focusable child (e.g. a button or link). The child must be
 * focusable for keyboard and screen-reader users to reach the tooltip.
 *
 * LIMITATIONS (documented, see README):
 * - Tooltip content is SUPPLEMENTARY. Never put information that is only
 *   available via the tooltip; always provide it through a visible label or
 *   accessible name as well.
 * - Positioning is CSS-based (top/bottom/left/right). There is no automatic
 *   viewport-edge flipping; near an edge the bubble can clip. This is a
 *   deliberate trade-off to avoid a positioning dependency. Choose a
 *   `placement` that fits, or keep tooltips away from viewport edges.
 */

import { useId, useRef, useState, cloneElement } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, placement = 'top', children }) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && visible) {
      hide();
    }
  };

  // Touch: tap the wrapper toggles the tooltip (no hover on touch devices).
  const handleTouchStart = (event: React.TouchEvent) => {
    // Prevent the synthetic mouse events that would immediately re-toggle.
    event.preventDefault();
    toggle();
  };

  // Merge aria-describedby onto the child so AT associates the bubble.
  const ariaDesc = (children.props as { 'aria-describedby'?: string })['aria-describedby'];
  const child = cloneElement(children, {
    'aria-describedby': visible
      ? [ariaDesc, tooltipId].filter(Boolean).join(' ')
      : ariaDesc,
  });

  return (
    <span
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
    >
      {child}
      {visible && (
        <span
          role="tooltip"
          id={tooltipId}
          className={[styles.bubble, styles[placement]].join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
