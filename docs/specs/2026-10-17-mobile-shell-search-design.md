# MYpanda.fun Mobile Shell, Home, and Search Design

Date: 2026-10-17
Status: Approved by user on 2026-10-17

## Goal
Polish the mobile web experience into a cohesive, premium streaming interface while keeping the mobile presentation isolated from desktop and Android TV behavior.

## Recommended approach
Extend the existing mobile-specific layout and styles rather than replacing the application shell or duplicating data/API logic. Reuse current routes, catalog queries, tracking, and playback handoff.

Alternatives considered:
1. **Extend existing mobile components (recommended):** smallest change surface and best chance of preserving current behavior.
2. Build a second parallel mobile application shell: stronger separation but duplicates route and state logic and increases regression risk.
3. Redesign shared desktop/mobile components together: potentially consistent but risks unwanted desktop and Android TV changes.

## Visual system
- Use pure black (#000) as the background across every mobile page and surface: Home, Search, Library, details, header, bottom navigation, and player. Do not use teal-tinted or charcoal page backgrounds.
- Use a better dark accent: restrained deep crimson/wine red with a subtle glow for selected/active states. Keep the entire app dark, cinematic, and low-clutter; maintain readable text and control contrast.
- Remove unintended blank space at the top of every page by tracing actual route/layout wrappers, default margins, duplicated padding, and safe-area offsets. Keep only intentional device safe-area padding; do not add a new arbitrary top spacer.
- Keep a consistent compact mobile header with MYpanda.fun branding, direct Search access, and profile access.
- A fixed bottom navigation presents Home, Search, and Library. The active destination has a clear dark-red accent/glow and restrained icon/label transition. Respect device safe areas and reserve content space so the bar never covers controls.

## Home and catalogue sections
- The mobile home begins with a swipeable rectangular-card hero: one centered, dominant title with neighboring cards partially visible on both sides. Cards remain rectangular, never skewed or angled.
- Include **Top 10** as a first-class catalogue section, using the available Top 10 artwork/number assets and the actual supported catalogue data. Keep the numbered treatment legible against pure black.
- Include Continue Watching, Trending Now, and the other sections already planned for MYpanda.fun, reusing existing catalogue sources and section logic. Do not silently drop planned rows or invent unsupported content/placeholders. Keep section headings clear and rails horizontally browsable.

## Search and Library
- Search gets a deliberate mobile layout: prominent query field, clear/submit controls, supported content-type filters, recent searches, responsive poster results, and accessible loading, empty, and error states.
- Keep the existing search API, route navigation, and tracking behavior. Do not add an Anime filter unless the backend actually supports it.
- Library keeps its existing underlying functionality and receives the same mobile shell and pure-black visual treatment.

## Route and playback rules
- Header and bottom navigation appear on mobile Home, Search, Library, and applicable browsing/detail pages.
- Pressing **Watch Now** must open the player directly in fullscreen. The player view contains no header, bottom navigation, details text, or other surrounding page UI; only the player and its necessary playback controls remain.
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
1. Mobile viewport checks at narrow and wide phone widths: no horizontal page overflow, clipped controls, unintended top gaps, or bottom-nav overlap.
2. Home hero shows one centered rectangular card and partial neighboring cards; swipe/selection works.
3. Top 10 and all other planned supported sections appear in the intended order with real data and working card actions.
4. Header and bottom navigation are consistent across supported mobile routes, with correct active state and pure-black backgrounds.
5. Search supports query, clear, existing filters, recent searches, loading, empty, error, and result-to-details navigation.
6. Library remains functional.
7. Watch Now opens a clean fullscreen player without mobile shell chrome or surrounding details.
8. Desktop and Android TV behavior remain unchanged; Vidy playback integration is untouched.
9. Run project type/build checks and available focused tests; report any unrelated or pre-existing failures separately.
