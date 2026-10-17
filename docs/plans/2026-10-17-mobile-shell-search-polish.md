# MYpanda.fun Mobile Shell and Search Polish Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved mobile-only MYpanda.fun shell, catalogue sections, search refinement, and clean fullscreen player without changing desktop or Android TV behavior.

**Architecture:** Extend the existing `Layout`, `MobileHome`, and page-level styles. Add a dedicated mobile stylesheet imported by the layout; use existing routes, media objects, catalogue APIs, and search state. Detect the watch route at the shell boundary and apply fullscreen-only CSS, leaving Vidy source resolution and playback behavior unchanged.

**Tech Stack:** React 19, TypeScript, Wouter, Vite, CSS, Vitest.

## Global Constraints

- Mobile page and chrome backgrounds are pure black (`#000`); use a restrained deep-crimson/wine accent with a subtle glow.
- Remove unintended top gaps by correcting actual mobile layout spacing while retaining only intentional device safe-area insets.
- Mobile home has a centered rectangular hero with partial neighboring cards, Top 10, Continue Watching, Trending Now, and other supported/planned catalogue rows. No angled cards or fabricated title data.
- Header and Home/Search/Library bottom navigation are consistent on mobile browse/detail pages. Active state follows the route and remains accessible.
- Search keeps its existing API, query URL, supported All/Movies/Series filters, recent searches, analytics, and loading/empty/error states.
- Watch Now opens a viewport-filling player with no app header, bottom nav, details, or surrounding chrome.
- Do not change desktop layout, Android TV components or D-pad behavior, Vidy provider configuration, playback URL behavior, or existing data/API contracts.

---

### Task 1: Shared mobile shell, route state, and top spacing

**Files:**
- Modify: `src/components/Layout.tsx`
- Create: `src/components/mobile/mobile-shell.css` (proposed)
- Modify: `src/pages/mobile-home.css`

**Interfaces:**
- Consumes: Wouter's existing `useLocation()`, `KinomaLogo`, existing `ITEMS` routes.
- Produces: shared `.panda-mobile-header`, route-aware `.panda-app-shell--player`, fixed three-destination mobile nav.

- [ ] Add route-focused checks for active Home/Search/Library routes and the watch-route shell class using the repository's existing test conventions.
- [ ] Run the focused checks and confirm they fail before the shell changes.
- [ ] Add compact brand/Search/Profile header on mobile routes; hide duplicate home-only header; show no mobile chrome on `/watch/*`; set mobile background to black and use crimson active indicators.
- [ ] Remove the mobile home's arbitrary 14px top padding and normalize mobile content wrapper spacing, without removing safe-area padding from fixed bottom navigation.
- [ ] Verify the focused checks, then run `npm run lint`.

### Task 2: Mobile home hero and catalogue rows

**Files:**
- Modify: `src/pages/MobileHome.tsx`
- Modify: `src/pages/mobile-home.css`

**Interfaces:**
- Consumes: existing `MovieApiMedia[] items`, `buildDetailsHref`, `ModernContinueWatching`, `optimizeImageUrl`.
- Produces: swipeable centered rectangular hero, Top 10 row with ranked real items, Continue Watching, Trending Now, and supported movie/series rows.

- [ ] Add a focused test for Top 10's maximum ten unique entries, rank labels, and valid details links.
- [ ] Run it and confirm the missing Top 10 behavior fails.
- [ ] Build Top 10 from the existing real mobile catalogue input; deduplicate by ID, display outlined ranks and artwork, keep card links on existing details routes, and add separate supported movie/series rails without inventing content.
- [ ] Preserve the hero's scroll-snap behavior and accessible card labels; provide visible, neutral empty/loading behavior when the API has no items.
- [ ] Verify the focused test and run `npm run lint`.

### Task 3: Search, Library, and detail-route mobile styling

**Files:**
- Create: `src/components/mobile/mobile-shell.css` (shared with Task 1)
- Modify: `src/pages/Search.tsx` only if required for mobile semantics; prefer CSS for presentation.
- Modify: existing page styles only where a mobile-specific override is necessary.

**Interfaces:**
- Consumes: existing Search state/API and Library storage/history behavior.
- Produces: black, compact mobile layouts with visible search controls, supported filters, recent queries, poster grid, and reserved space above bottom nav.

- [ ] Add or extend focused tests for search submit/clear, supported filters, and mobile route active state where current tests allow.
- [ ] Verify the tests expose any missing behavior before changing it.
- [ ] Apply scoped `max-width: 767px` styles to Search, Library, and Details page roots; retain existing handlers and API calls; correct top margins/padding and reserve bottom-nav space.
- [ ] Confirm loading, error, empty, recent-search, and result-navigation behavior remains backed by existing logic.
- [ ] Run focused tests and `npm run lint`.

### Task 4: Fullscreen mobile playback and regression verification

**Files:**
- Modify: `src/components/mobile/mobile-shell.css`
- Modify: `src/components/Layout.tsx` only if route class behavior needs adjustment.
- Do not modify: `src/pages/Watch.tsx` provider/source resolution or Android TV files.

**Interfaces:**
- Consumes: existing `/watch/:id` route and player DOM classes `.panda-watch-page`, `.panda-watch-stage`, `.panda-watch-player`.
- Produces: a pure-black, viewport-filling mobile player with no header/nav or adjacent page content.

- [ ] Add a focused check that the watch route hides shell chrome and fills the viewport on mobile.
- [ ] Verify it fails before the fullscreen styles.
- [ ] Apply route-scoped fixed viewport styles, including `100dvh`, `100vw`, zero outer padding/margins, and black background; keep player controls and error/loading UI inside the player view.
- [ ] Run `npm test`, `npm run lint`, and `npm run build`; inspect the final diff to confirm no desktop, Android TV, remote-navigation, or Vidy playback code was changed.
- [ ] Commit only independently verified changes and report any checks that cannot run or fail for pre-existing reasons.

## Unresolved externally observable decisions

None. The approved specification settles the mobile theme, navigation destinations, catalogue sections, search behaviors, player presentation, and compatibility boundaries.
