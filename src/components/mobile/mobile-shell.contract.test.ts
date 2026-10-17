import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const layout = read('../Layout.tsx');
const mobileShell = read('./mobile-shell.css');
const mobileHome = read('../../pages/MobileHome.tsx');
const homeStyles = read('../../pages/mobile-home.css');
const search = read('../../pages/Search.tsx');

describe('MYpanda.fun mobile shell contract', () => {
  it('uses a shared mobile header and route-aware three-item navigation', () => {
    expect(layout).toContain('panda-mobile-header');
    expect(layout).toContain('aria-label="Profile"');
    expect(layout).not.toContain('aria-label="Search movies and shows"');
    expect(layout).toContain('panda-mobile-bottom-nav');
    expect(layout).toContain("location.startsWith('/watch/')");
    expect(layout).toContain("href === '/library' ? 'Library' : label");
  });

  it('keeps the mobile page surfaces black and makes Watch a viewport-filling shell-free player', () => {
    expect(mobileShell).toContain('background: #000 !important');
    expect(mobileShell).toContain('.panda-app-shell--player .panda-mobile-header');
    expect(mobileShell).toContain('height: 100dvh !important');
    expect(mobileShell).toContain('width: 100vw !important');
    expect(mobileShell).toContain('display: block !important;');
    expect(mobileShell).toContain('flex: none !important;');
    expect(mobileShell).toContain('.panda-mobile-featured__loading');
  });

  it('includes Top 10 and the planned catalogue rows without replacing the existing API', () => {
    for (const section of ['Top 10', 'Trending Now', 'New on Netflix', 'New on Disney+', 'Popular Movies', 'Popular TV Shows', 'Airing Today']) {
      expect(mobileHome).toContain(section);
    }
    expect(mobileHome).toContain('<ModernContinueWatching />');
    expect(mobileHome).toContain('buildDetailsHref');
    expect(homeStyles).toContain('aspect-ratio: 16 / 9');
    expect(homeStyles).toContain('flex: 0 0 68vw;');
    expect(homeStyles).toContain('padding-inline: 16vw;');
    expect(homeStyles).toContain('scroll-snap-stop: always;');
    expect(homeStyles).toContain('overflow-x: clip');
    expect(mobileHome).toContain('const viewportRect = viewport.getBoundingClientRect()');
    expect(mobileHome).toContain('viewport.scrollLeft += cardCenter - viewportCenter');
  });

  it('preserves the existing search API, recent searches, and supported filters', () => {
    expect(search).toContain('api.search(submittedQuery, controller.signal)');
    expect(search).toContain('preferencesUtil.addRecentSearch(clean)');
    expect(search).toContain("filter === 'movie'");
    expect(search).toContain("filter === 'series'");
    expect(search).toContain('Try again');
  });
});
