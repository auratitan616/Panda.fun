export type MediaImageSize = 'w342' | 'w500' | 'w780' | 'w1280';
export type MediaImageProvider = 'auto' | 'tmdb';

const TMDB_IMAGE_HOST = 'image.tmdb.org';

function isTmdbImage(url: URL) {
  return url.hostname.toLowerCase() === TMDB_IMAGE_HOST && url.pathname.includes('/t/p/');
}

/** Normalize provider artwork while preserving valid same-origin paths returned by frontend data sources. */
export function normalizeMediaImageUrl(
  value: string | null | undefined,
  provider: MediaImageProvider = 'auto'
): string | null {
  if (typeof value !== 'string') return null;
  const input = value.trim();
  if (!input || /^(?:javascript|file):/i.test(input)) return null;

  const candidate = input.startsWith('//') ? 'https:' + input : input;
  if (/^https?:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
      if (parsed.hostname.toLowerCase() === 'static.tvmaze.com') return null;
      parsed.protocol = 'https:';
      return parsed.toString();
    } catch {
      return null;
    }
  }

  if (/^\/t\/p\//i.test(candidate)) {
    const path = candidate.startsWith('/t/p/')
      ? candidate
      : '/t/p/original/' + candidate.replace(/^\/+/, '');
    return 'https://' + TMDB_IMAGE_HOST + path;
  }

  // TVMaze upload paths are not valid TMDB artwork and must not resolve against the app origin.
  if (/^\/?uploads\/images\//i.test(candidate)) return null;


  // TMDB raw poster_path is a single root-level filename (for example /abc123.jpg).
  // Preserve app-relative paths such as /assets/... and /api/... on the current origin.
  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    const isRawTmdbFilename = provider === 'tmdb' && /^\/[^/]+\.(?:jpe?g|png|webp)$/i.test(candidate);
    return isRawTmdbFilename
      ? 'https://' + TMDB_IMAGE_HOST + '/t/p/original' + candidate
      : candidate;
  }

  return null;
}

export function optimizeImageUrl(
  url: string | null | undefined,
  size: MediaImageSize = 'w342'
): string | null {
  const normalized = normalizeMediaImageUrl(url);
  if (!normalized) return null;
  try {
    const parsed = new URL(normalized);
    if (!isTmdbImage(parsed)) return normalized;
    parsed.pathname = parsed.pathname.replace(/\/t\/p\/(?:original|w\d+)\//, '/t/p/' + size + '/');
    return parsed.toString();
  } catch {
    return null;
  }
}

const INLINE_FALLBACK = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><rect width="400" height="600" fill="#101116"/><path d="M0 470 120 350 205 430 290 315 400 425V600H0Z" fill="#191b23"/><circle cx="200" cy="260" r="58" fill="#222530"/><path d="M174 250h8m36 0h8M182 278q18 14 36 0" stroke="#6d7282" stroke-width="7" stroke-linecap="round" fill="none"/></svg>'
);

function tmdbSizedCandidates(url: string, size: MediaImageSize): string[] {
  try {
    const parsed = new URL(url);
    if (!isTmdbImage(parsed)) return [url];
    const requested = optimizeImageUrl(url, size);
    const secondarySize: MediaImageSize = size === 'w342' ? 'w500' : 'w780';
    const secondary = optimizeImageUrl(url, secondarySize);
    const original = parsed.toString().replace(/\/t\/p\/(?:original|w\d+)\//, '/t/p/original/');
    return Array.from(new Set([requested, secondary, original].filter((item): item is string => Boolean(item))));
  } catch {
    return [url];
  }
}

/** Try primary provider sizes first, then the supplied fallback, then an inline fallback. */
export function buildMediaImageCandidates(
  src: string | null | undefined,
  fallbackSrc: string | null | undefined = null,
  size: MediaImageSize = 'w342',
  provider: MediaImageProvider = 'auto'
): string[] {
  const primary = normalizeMediaImageUrl(src, provider);
  const fallback = normalizeMediaImageUrl(fallbackSrc, provider);
  const candidates = primary ? tmdbSizedCandidates(primary, size) : [];
  if (fallback) candidates.push(...tmdbSizedCandidates(fallback, size));
  candidates.push(INLINE_FALLBACK);
  return Array.from(new Set(candidates));
}
