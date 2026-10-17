# MYpanda.fun Android TV Foundation Rewrite

## Goal

Replace the legacy Android TV presentation layer with a clean, TV-first application architecture inspired by the JioHotstar Android TV experience. D-pad navigation is a foundational system requirement, not page-level styling.

## Hard boundaries

- Android TV UI only: replace TV shell, TV navigation, focus management, TV-specific layouts, and TV-only styling.
- Browser and mobile experiences must not change.
- Preserve catalogue/API contracts and data services.
- Preserve the existing Android TV playback path and Vidy provider integration. Do not rewrite provider selection, playback URLs, or player hand-off as part of the UI rewrite.
- Work on an isolated feature branch. Do not delete production code from `main` during the migration.
- Do not merge until automated checks pass and remote navigation has been exercised on a real Android TV device.

## Proposed architecture

```
Android TV WebView entry
└── TVApp
    ├── TVRouter
    │   ├── HomeScreen
    │   ├── SearchScreen
    │   ├── MoviesScreen
    │   ├── SeriesScreen
    │   ├── SportsScreen
    │   ├── CategoriesScreen
    │   ├── MySpaceScreen
    │   ├── DetailsScreen
    │   └── Playback hand-off (existing implementation)
    ├── TVShell
    │   ├── TVNavigationRail
    │   ├── TVContentViewport
    │   └── TVOverlayHost
    ├── RemoteNavigationProvider
    │   ├── RemoteInputAdapter
    │   ├── FocusRegistry
    │   ├── DirectionalFocusResolver
    │   ├── FocusRestoration
    │   └── BackActionDispatcher
    ├── TV design system
    │   ├── TVButton
    │   ├── TVPosterCard
    │   ├── TVContentRail
    │   ├── TVHero
    │   ├── TVSearchField
    │   └── TVDialog
    └── Existing data services (reused, not copied)
```

## D-pad contract

1. A single navigation manager owns ArrowLeft, ArrowRight, ArrowUp and ArrowDown outside text entry and media controls.
2. Focus targets are registered with stable IDs and semantic regions/rows. Navigation must not depend only on geometric guesses across the entire document.
3. Left/right stay within a row when a valid item exists. Up/down target the nearest sensible item in the adjacent region or row.
4. Every focusable control has a visible focus treatment at 10-foot viewing distance.
5. Focus is restored after route changes, overlays, asynchronous content updates and returning from playback.
6. OK/Enter activates only the focused control once; repeated key events must not double-submit.
7. Back closes the topmost overlay first, then returns to the previous route, then uses a defined home/exit policy.
8. Editable inputs and embedded media retain key ownership where required.
9. If a target disappears or becomes disabled, focus moves to a defined safe fallback instead of becoming lost.
10. Scroll movement follows focus; the document must not drift when a directional move has no valid target.

## Visual direction

Use JioHotstar Android TV as the layout and interaction reference: cinematic featured content, dark full-screen surfaces, prominent hero actions, horizontal content rails, large artwork, concise typography, and clear focused/selected states. Recreate the interaction patterns and overall visual language without copying proprietary assets, logos, or source code.

## Migration plan

### Phase 0 — Inventory and guardrails
- Identify the Android TV detection signal and WebView entry point.
- Map all TV-only selectors, navigation branches and remote handlers.
- Mark shared components/data services and the existing playback boundary.
- Keep the current implementation available for rollback on the feature branch.

### Phase 1 — Foundation
- Add the independent TV application entry and TV shell.
- Implement the central remote input/focus manager and unit tests.
- Add route/back handling, overlay ownership and focus restoration.
- Add TV-only design tokens and base controls.

### Phase 2 — Screens
- Home and content rails first.
- Search and keyboard/voice search second.
- Movies, Series, Sports, Categories and My Space.
- Details and playback hand-off integration.

### Phase 3 — Remove legacy TV UI
- Once all routes are migrated, remove obsolete TV-only CSS and old TV-only shell branches.
- Remove the old document-wide geometric focus fallback only after the new manager owns all supported TV screens.
- Keep non-TV styles, routes, APIs and player/provider code intact.

### Phase 4 — Verification
- TypeScript/lint, build, unit tests and runtime checks.
- Verify left/right/up/down/OK/Back, long-press/repeat, route transitions, dialogs, empty/loading/error states, and playback return focus.
- Physical Android TV remote testing is required before declaring the rewrite complete.
