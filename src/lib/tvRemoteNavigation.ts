const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[role="button"][tabindex]',
  '[role="link"][tabindex]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"], [role="textbox"]';
const MEDIA_SELECTOR = 'video, audio, iframe';

type Direction = 'left' | 'right' | 'up' | 'down';

function isVisibleFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0 || element.matches(':disabled,[aria-disabled="true"]')) return false;
  if (element.closest('[hidden],[aria-hidden="true"],[inert]')) return false;
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function center(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function findDirectionalTarget(current: HTMLElement, direction: Direction): HTMLElement | null {
  const currentRect = current.getBoundingClientRect();
  const origin = center(currentRect);
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(element => element !== current && !current.contains(element) && isVisibleFocusable(element));

  let best: HTMLElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const rect = candidate.getBoundingClientRect();
    const point = center(rect);
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    const primary = direction === 'left' ? -dx
      : direction === 'right' ? dx
      : direction === 'up' ? -dy : dy;
    if (primary <= 1) continue;

    const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
    const overlap = direction === 'left' || direction === 'right'
      ? Math.min(currentRect.bottom, rect.bottom) - Math.max(currentRect.top, rect.top)
      : Math.min(currentRect.right, rect.right) - Math.max(currentRect.left, rect.left);
    // Prefer items aligned with the current item, then nearby items in the requested direction.
    const score = primary + secondary * (overlap > 0 ? 0.35 : 1.8);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

/**
 * Handles D-pad movement only in the Android TV WebView.
 * Inputs and embedded media retain ownership of their own keyboard events.
 */
export function handleTVRemoteKey(event: KeyboardEvent): boolean {
  if (!(window as Window & { isKinomaAndroidTV?: boolean }).isKinomaAndroidTV) return false;
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return false;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;

  const target = event.target instanceof HTMLElement ? event.target : document.activeElement;
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches(EDITABLE_SELECTOR) || target.closest(EDITABLE_SELECTOR)) return false;
  if (target.matches(MEDIA_SELECTOR) || target.closest(MEDIA_SELECTOR)) return false;

  const current = target.matches(FOCUSABLE_SELECTOR) && isVisibleFocusable(target)
    ? target
    : target.closest<HTMLElement>(FOCUSABLE_SELECTOR);

  // Layout currently focuses the main region on route changes. Recover from
  // that non-interactive focus target without jumping to an arbitrary control.
  if (!current || !isVisibleFocusable(current)) {
    const main = document.querySelector<HTMLElement>('#panda-main-content');
    const mainCandidates = main
      ? Array.from(main.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisibleFocusable)
      : [];
    const first = mainCandidates[0] || Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      .find(isVisibleFocusable);
    if (!first) return false;
    event.preventDefault();
    first.focus({ preventScroll: true });
    first.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    return true;
  }

  const direction: Direction = event.key === 'ArrowLeft' ? 'left'
    : event.key === 'ArrowRight' ? 'right'
    : event.key === 'ArrowUp' ? 'up' : 'down';
  const next = findDirectionalTarget(current, direction);

  // At a deliberate boundary, consume the D-pad event so the document does not
  // unexpectedly scroll. Do not move focus to an unrelated element.
  event.preventDefault();
  if (!next) return true;

  next.focus({ preventScroll: true });
  next.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  return true;
}
