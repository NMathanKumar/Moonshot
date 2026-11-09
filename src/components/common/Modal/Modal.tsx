/**
 * Modal Component
 * Accessible dialog with focus trap, Escape-to-close, focus restore,
 * backdrop dismissal and reference-counted body scroll lock. WCAG 2.1 AA.
 *
 * Stacking: multiple modals may be open at once. Each locks the body via a
 * shared reference-counted manager, so scrolling only unlocks when the last
 * modal closes. Each modal traps focus within its own dialog and restores
 * focus to whatever was focused before it opened.
 */

import { useEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { lockBodyScroll, unlockBodyScroll } from './scrollLock';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Returns focusable descendants that are actually visible/operable.
// Visibility is determined via computed style (display/visibility) and the
// `hidden`/`aria-hidden` attributes rather than layout geometry, so the logic
// works both in real browsers and in jsdom (where getBoundingClientRect is 0).
function isHidden(el: Element): boolean {
  if (el.hasAttribute('disabled')) return true;
  if (el.hasAttribute('hidden')) return true;
  if (el.getAttribute('aria-hidden') === 'true') return true;
  const style =
    typeof window !== 'undefined' && window.getComputedStyle
      ? window.getComputedStyle(el)
      : null;
  if (style && (style.display === 'none' || style.visibility === 'hidden')) {
    return true;
  }
  return false;
}

function getVisibleFocusable(container: Element | null): Element[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (el) => !isHidden(el)
  );
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeLabel?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeLabel = 'Close dialog',
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = getVisibleFocusable(dialogRef.current);
        if (focusable.length === 0) {
          // Nothing focusable: keep focus on the dialog itself.
          event.preventDefault();
          (dialogRef.current as HTMLElement)?.focus();
          return;
        }
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        const active = document.activeElement as HTMLElement;
        const insideDialog = dialogRef.current?.contains(active);

        // Escaped focus (active element outside this dialog): pull it back in.
        if (!insideDialog) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
          return;
        }
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    lockBodyScroll();

    // Move focus into the dialog (first visible focusable, else the dialog).
    const node = dialogRef.current as HTMLElement;
    const focusable = getVisibleFocusable(node);
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus?.();
    } else if (node) {
      node.focus?.();
    }

    return () => {
      unlockBodyScroll();
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onBackdropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={onBackdropMouseDown}
      data-testid="modal-backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={[styles.dialog, className].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
      >
        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              aria-label={closeLabel}
              onClick={onClose}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
