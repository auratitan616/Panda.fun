export type TVDirection = 'left' | 'right' | 'up' | 'down';

export const TV_FOCUSABLE_SELECTOR = [
  '[data-tv-focus-id]',
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[role="button"][tabindex]',
].join(',');

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"], [role="textbox"]';
const MEDIA_SELECTOR = 'video, audio, iframe';

export function isTVFocusable(element: HTMLElement): boolean {
  if (element.matches(':disabled,[aria-disabled="true"],[hidden]')) return false;
  if (element.tabIndex < 0 && !element.hasAttribute('data-tv-focus-id')) return false;
  if (element.closest('[hidden],[aria-hidden="true"],[inert]')) return false;

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function midpoint(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function sameGroup(current: HTMLElement, candidate: HTMLElement): boolean {
  const currentGroup = current.dataset.tvFocusGroup;
  const candidateGroup = candidate.dataset.tvFocusGroup;
  return Boolean(currentGroup && candidateGroup && currentGroup === candidateGroup);
}

function scoreCandidate(current: HTMLElement, candidate: HTMLElement, direction: TVDirection): number {
  const from = current.getBoundingClientRect();
  const to = candidate.getBoundingClientRect();
  const a = midpoint(from);
  const b = midpoint(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  const primary = direction === 'left' ? -dx
    : direction === 'right' ? dx
    : direction === 'up' ? -dy : dy;

  if (primary <= 1) return Number.POSITIVE_INFINITY;

  const horizontal = direction === 'left' || direction === 'right';
  const crossAxis = horizontal ? Math.abs(dy) : Math.abs(dx);
  const overlap = horizontal
    ? Math.min(from.bottom, to.bottom) - Math.max(from.top, to.top)
    : Math.min(from.right, to.right) - Math.max(from.left, to.left);

  const groupPenalty = sameGroup(current, candidate) ? 0 : 80;
  const rowPenalty = current.dataset.tvFocusRow && candidate.dataset.tvFocusRow &&
    current.dataset.tvFocusRow === candidate.dataset.tvFocusRow ? 0 : 28;
  return primary + crossAxis * (overlap > 0 ? 0.55 : 2.2) + groupPenalty + rowPenalty;
}

/**
 * Resolve the next focus target using stable TV metadata before falling back
 * to visible geometry. The document-wide search is limited to explicit TV
 * focus targets and standard controls; hidden/inert content is excluded.
 */
export function resolveTVFocusTarget(current: HTMLElement, direction: TVDirection): HTMLElement | null {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(TV_FOCUSABLE_SELECTOR))
    .filter(candidate => candidate !== current && !current.contains(candidate) && isTVFocusable(candidate));

  let best: HTMLElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const score = scoreCandidate(current, candidate, direction);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

/** Handles directional remote keys only; activation and Back are separate actions. */
export function handleTVDirectionalKey(event: KeyboardEvent): boolean {
  if (!(window as Window & { isKinomaAndroidTV?: boolean }).isKinomaAndroidTV) return false;
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return false;

  const directions: Record<string, TVDirection> = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };
  const direction = directions[event.key];
  if (!direction) return false;

  const target = event.target instanceof HTMLElement ? event.target : document.activeElement;
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches(EDITABLE_SELECTOR) || target.closest(EDITABLE_SELECTOR)) return false;
  if (target.matches(MEDIA_SELECTOR) || target.closest(MEDIA_SELECTOR)) return false;

  const current = target.matches(TV_FOCUSABLE_SELECTOR)
    ? target
    : target.closest<HTMLElement>(TV_FOCUSABLE_SELECTOR);
  const origin = current && isTVFocusable(current) ? current : null;
  if (!origin) return false;

  event.preventDefault();
  const next = resolveTVFocusTarget(origin, direction);
  if (!next) return true;

  next.focus({ preventScroll: true });
  next.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  return true;
}
