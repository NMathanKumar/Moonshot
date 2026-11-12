/**
 * Shared body scroll-lock manager.
 *
 * Reference-counted so that multiple (nested/stacked) modals lock the body
 * once and unlock only when the LAST modal releases. This prevents an inner
 * modal's close from unlocking scrolling while an outer modal is still open.
 */

let lockCount = 0;
let previousOverflow = '';

export function lockBodyScroll(): void {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

// Test-only helper to observe current lock depth.
export function _getLockCount(): number {
  return lockCount;
}
