# MYpanda.fun Mobile Shell, Home, and Search Design

Date: 2026-10-17
Status: Draft for user review

## Goal
Polish the mobile web experience into a cohesive, premium streaming interface while keeping the mobile presentation isolated from desktop and Android TV behavior.

## Recommended approach
Extend the existing mobile-specific layout and styles rather than replacing the application shell or duplicating data/API logic. Reuse current routes, catalog queries, tracking, and playback handoff.

Alternatives considered:
1. **Extend existing mobile components (recommended):** smallest change surface and best chance of preserving current behavior.
2. Build a second parallel mobile application shell: stronger separation but duplicates route and state logic and increases regression risk.
3. Redesign shared desktop/mobile components together: potentially consistent but risks unwanted desktop and Android TV changes.

## Experience and layout
- Mobile pages use a consistent compact header with MYpanda.fun branding, a direct Search action, and profile access.
- A fixed bottom navigation presents Home, Search, and Library. The selected destination has a high-contrast accent/glow and a restrained icon/label transition. Respect device safe areas and reserve content space so the bar never covers controls.
- The visual foundation is deep black/charcoal with restrained teal accents, readable contrast, and minimal chrome.
- The mobile home begins with a swipeable rectangular-card hero: one centered, dominant title with neighboring cards partially visible on both sides. Cards remain rectangular, never skewed or angled.
- Below the hero, show clearly separated, horizontally browsable sections such as Continue Watching and Trending Now, followed by other catalogue sections only when the existing API/data supports them. Do not fabricate rows or placeholder artwork.
- Search gets a deliberate mobile layout: prominent query field, clear/submit controls, supported content-type filters, recent searches, responsive poster results, and accessible loading, empty, and error states. Keep the existing search API, route navigation, and tracking behavior. Do not add an Anime filter unless the backend actually supports it.
- Library keeps its existing underlying functionality and receives the same mobile shell and visual treatment.

## Route and playback rules
- Header and bottom navigation appear on mobile Home, Search, Library, and applicable browsing/detail pages.
- The player remains genuinely fullscreen and hides the mobile header and bottom navigation.
- Do not modify Vidy provider settings, playback URL behavior, Android TV components, D-pad/remote handling, or desktop layout as part of this task.

## Interaction and accessibility
- All navigation items must lead to real routes/actions.
- The selected navigation state follows the current route, including direct URL entry and browser back/forward.
- Provide visible focus/pressed states, sufficient contrast, keyboard/screen-reader labels, and reduced-motion support.
- Carousel interactions must work with touch swipes and accessible controls; no control should be decorative-only if it appears interactive.

## Data and failure states
- Reuse current catalogue and search data sources. Avoid introducing a new API or changing provider contracts.
- Preserve real loading, no-results, and recoverable-error feedback.
- Missing artwork must use the app's existing approved image behavior; never invent title data or silently show unrelated poster fallbacks.

## Verification and acceptance criteria
1. Mobile viewport checks at narrow and wide phone widths: no horizontal page overflow, clipped controls, or bottom-nav overlap.
2. Home hero shows one centered rectangular card and partial neighboring cards; swipe/selection works.
3. Header and bottom navigation are consistent across supported mobile routes, with correct active state.
4. Search supports query, clear, existing filters, recent searches, loading, empty, error, and result-to-details navigation.
5. Library remains functional.
6. Player remains fullscreen with no mobile shell chrome.
7. Desktop and Android TV behavior remain unchanged; Vidy playback integration is untouched.
8. Run project type/build checks and available focused tests; report any unrelated or pre-existing failures separately.
