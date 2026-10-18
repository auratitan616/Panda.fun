<div align="center">

PANDA.FUN

Movie and TV discovery, built for the modern web.

<br>

<br /><br />\

<br />\

<br>

<img src=""https://skillicons.dev/icons?i=react,ts,vite,tailwind,express,firebase,kotlin,androidstudio&perline=8" (https://skillicons.dev/icons?i=react,ts,vite,tailwind,express,firebase,kotlin,androidstudio&perline=8)" alt="Panda.fun technology stack">

<br><br>

Discover. Search. Watch. Continue.

</div>

---

Introduction

Panda.fun, formerly Kinoma, is a responsive movie and TV discovery and playback application with a Panda-themed interface.

It uses the separate "MovieAPI" (https://github.com/titan717/movieapi) backend for catalog data, metadata, search, trailers, and playback URL resolution. Optional Firebase accounts provide synchronization for libraries and watch progress, while PWA support and a native Android TV application extend the experience across devices.

«Status: Active development. Some internals still use the old "Kinoma" name for compatibility, including storage keys, component names, and Android package paths.»

Panda.fun does not host video files. It displays catalog data from MovieAPI and loads the configured external embed player inside an iframe.

---

Key Features

Discovery

- Trending and popular content
- Movie and TV search
- Title details and similar titles
- Trailer support
- Season and episode information

Playback

- Movie and TV playback
- Season and episode selection
- Previous and next episode controls
- Automatic next episode
- External iframe player

Accounts and personalization

- Optional Google and email/password authentication
- Local-first user state
- Firestore synchronization
- My List
- Watch history and progress
- User preferences
- Analytics events

Web and Android TV

- Responsive mobile, tablet, and desktop UI
- PWA support and service worker caching
- Native Android TV application
- Kotlin, Jetpack Compose, Media3, and ExoPlayer

---

Prerequisites

- Node.js 20 or newer
- npm
- A Firebase project if authentication or Firestore synchronization is required
- Access to a MovieAPI deployment

---

Setup

Clone the repository and install dependencies:

git clone https://github.com/titan717/Panda.fun.git
cd Panda.fun
npm install

Create a local environment file:

cp .env.example .env

Edit ".env" with the required values, then start the development server:

npm run dev

Open the application at:

http://localhost:3000

---

Configuration

Environment variables

Variable| Required| Description
"VITE_MOVIE_API_URL"| Yes| MovieAPI base URL
"VITE_MOVIE_API_FALLBACK_URL"| No| Backup API origin

Example:

VITE_MOVIE_API_URL=https://movieapi-3d0v.onrender.com
VITE_MOVIE_API_FALLBACK_URL=

The fallback API origin must also be added to "connect-src" in "vercel.json".

Firebase settings are stored in:

firebase-applet-config.json

«[!WARNING]
Never put TMDB tokens, provider credentials, or admin secrets in the frontend. Everything prefixed with "VITE_" is public in the built JavaScript.»

Media IDs

Format| Meaning
"tmdb_movie_<id>"| TMDB movie
"tmdb_tv_<id>"| TMDB TV show
"kinoma_tvmaze_<id>"| TVmaze show

TVmaze shows can be resolved to a TMDB ID when playback or trailer information requires one.

Routes

Route| Purpose
"/"| Landing page
"/home"| Main browsing experience
"/browse"| Main browsing experience
"/search"| Movie and TV search
"/details/:id"| Title details
"/watch/:id"| Player
"/library"| My List
"/history"| Watch history
"/profile"| Account
"/settings"| Preferences
"/whats-new"| What's new
"/about"| Information
"/docs"| Documentation
"/terms"| Terms
"/privacy"| Privacy
"/contact"| Support
"/admin"| Admin dashboard

Unknown routes display the 404 state.

---

Development Commands

Command| What it does
"npm run dev"| Starts the Express and Vite development server
"npm run build"| Builds the Vite frontend and server bundle
"npm start"| Runs the production server
"npm run preview"| Previews the Vite build
"npm run lint"| Runs TypeScript checks with "tsc --noEmit"
"npm test"| Runs Vitest

Build and run the production server locally:

npm run build
node dist/server.cjs

---

Architecture

System overview

flowchart LR

    A["Panda.fun<br/>React + Vite"] --> B["MovieAPI<br/>Hono + Zod"]

    B --> C["TMDB"]
    B --> D["TVmaze"]

    A --> E["Firebase Auth"]
    A --> F["Firestore"]

    A --> G["External Embed<br/>Vidy.st"]

    G --> H["Video Playback"]

    style A fill:#111827,color:#fff,stroke:#374151
    style B fill:#111827,color:#fff,stroke:#374151
    style E fill:#111827,color:#fff,stroke:#374151
    style F fill:#111827,color:#fff,stroke:#374151
    style G fill:#111827,color:#fff,stroke:#374151

Application flow

Browser
   |
   +--------------------+
   |                    |
   v                    v
Panda.fun           Firebase
React + Vite        Auth / Firestore
   |
   v
MovieAPI
   |
   +--------> TMDB
   |
   +--------> TVmaze
   |
   v
Playback URL
   |
   v
External Embed Player

User flow

Landing
   |
   v
Browse / Search
   |
   v
Title Details
   |
   v
Watch
   |
   +----> Continue Watching
   |
   +----> My List

Technology stack

Layer| Technology
Frontend| React 19, TypeScript, Vite 6
Styling| Tailwind CSS 4
Routing| wouter
Data fetching| SWR
Animation| motion
Icons| lucide-react
Media| hls.js
Virtualization| react-window
Local storage| idb-keyval
Server| Express
Backend API| MovieAPI — Hono + Zod
Metadata| TMDB + TVmaze
Accounts| Firebase Auth + Firestore
PWA| vite-plugin-pwa
Android TV| Kotlin + Jetpack Compose
TV playback| Media3 / ExoPlayer
Hosting| Vercel / Render

Project structure

Panda.fun/
│
├── android/
│   └── Native Android TV app
│
├── docs/
│   └── Project documentation
│
├── public/
│   ├── icons
│   └── downloads
│
├── src/
│   ├── components/
│   │   └── Shared UI
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── history.ts
│   │   ├── library.ts
│   │   ├── preferences.ts
│   │   ├── AuthContext.tsx
│   │   └── analytics.ts
│   │
│   ├── pages/
│   │   └── Route screens
│   │
│   ├── services/
│   │   └── Supporting services
│   │
│   ├── styles/
│   │   └── panda-home.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── update/
│   └── latest.json
│
├── server.ts
├── firestore.rules
├── vercel.json
├── render.yaml
└── vite.config.ts

---

Playback and Data Behavior

Playback currently uses Vidy.st as the configured embed provider.

Movies

TMDB movie ID
      |
      v
Vidy.st embed
      |
      v
Playback

TV

TMDB ID
   +
Season
   +
Episode
   |
   v
Vidy.st embed
   |
   v
Playback

The player URL uses:

autoplay=true

TV playback additionally supports:

nextEpisode
episodeSelector
autoplayNextEpisode

The player page provides previous and next episode controls, a season picker, episode cards, My List, native sharing, and similar titles.

Because the iframe is cross-origin, Panda.fun cannot read the exact playback position directly. Resume data depends on information the application can record itself. Autoplay also depends on browser policies and the external embed provider.

If another provider is added, update "frame-src" and "Permissions-Policy" in "vercel.json".

Accounts, library, and history

Firebase authentication is optional. Browsing works without an account.

Supported authentication:

Google
Email / Password

My List and watch progress are stored locally first and synchronized to Firestore when the user is signed in.

users/
└── {uid}/
    ├── progress/
    │   └── {id}
    │
    └── library/
        └── {id}

Analytics events can include page views, searches, watch start, watch progress, watch completion, library actions, and errors. Analytics must never block navigation or playback.

Performance

Panda.fun includes:

- In-memory GET caching
- TTL-based caching
- Request de-duplication
- Request timeouts
- Background recommendation loading
- Route-level code splitting
- Lazy-loaded pages
- PWA caching
- Long-lived immutable asset caching

Further recommendations are documented in "AUDIT.md".

---

Deployment

Panda.fun supports Render or another Node host for the complete Express feature set, and Vercel for a static SPA deployment.

Render or Node host

Use this deployment shape when you need SEO metadata, "sitemap.xml", "robots.txt", legacy API proxy routes, Android update routes, APK downloads, and the Express server.

Build:

npm install && npm run build

Start:

node dist/server.cjs

Set:

NODE_ENV=production

When running behind a proxy such as Render or Fly:

app.set('trust proxy', true)

This ensures canonical and Open Graph URLs use HTTPS correctly.

Vercel

Vercel uses "vercel.json" for security headers, cache headers, and SPA rewrites.

«[!NOTE]
"server.ts" does not run on a pure Vercel static deployment.»

The following features are unavailable in that deployment shape:

Per-title SEO injection
Dynamic sitemap
/api/* proxy routes
Android update routes
APK route

Configure the "VITE_*" variables and add the production domain to Firebase Authorized Domains.

Keep these values synchronized:

connect-src
frame-src
MovieAPI origin
Player origin

Server routes

These routes exist when the Express server is running locally or on a Node host such as Render. They are not available on a pure Vercel static deployment.

Route| Behaviour
"GET /robots.txt"| Allows crawling and disallows private routes
"GET /sitemap.xml"| Built from MovieAPI trending and popular lists
"GET /details/*"| SEO-enabled title page
"GET /watch/*"| SEO-enabled watch page
"GET /api/health"| API health
"GET /api/search"| Search proxy
"GET /api/trending"| Trending proxy
"GET /api/popular"| Popular proxy
"GET /api/info/:id"| Title information
"GET /api/episodes/:id"| Episode information
"GET /api/servers/:id/:ep"| Playback servers
"GET /api/stream/:id/:ep"| Stream resolution
"GET /api/schedule"| Schedule
"GET /tv/update.json"| Android TV update manifest
"GET /update/latest.json"| Android update metadata
"GET /downloads/Panda.fun.apk"| APK download

---

Troubleshooting

<details>
<summary><strong>First load takes 30–60 seconds</strong></summary>

The free Render API instance may have gone to sleep, producing a cold start.

Consider using an uptime pinger or a hosting provider without automatic spin-down.

</details>

<details>
<summary><strong>Player is blank</strong></summary>

The external player may be blocked by the Content Security Policy.

Check:

frame-src
Permissions-Policy

Also verify that the external provider is operational.

</details>

<details>
<summary><strong>API calls fail only in production</strong></summary>

Check "connect-src" in "vercel.json".

The MovieAPI origin must be permitted by the production CSP.

</details>

<details>
<summary><strong>Firebase sign-in popup fails</strong></summary>

Check Firebase Authorized Domains.

The production domain must be registered there.

</details>

<details>
<summary><strong>Analytics or admin pages show nothing</strong></summary>

Check Firestore security rules and the browser console.

A common error is:

permission-denied

</details>

<details>
<summary><strong>Share previews show HTTP URLs</strong></summary>

If Express is behind a reverse proxy, configure:

app.set('trust proxy', true)

This allows the server to correctly determine the original HTTPS protocol.

</details>

---

Security Checklist

- [ ] Restrict Firebase API key by HTTP referrer
- [ ] Enable Firebase App Check
- [ ] Remove open Firestore rules
- [ ] Secure analytics collections
- [ ] Secure admin collections
- [ ] Restrict CSP origins
- [ ] Keep secrets out of "VITE_*"
- [ ] Sign Android APKs
- [ ] Publish a real SHA-256 checksum in "update/latest.json"

«[!IMPORTANT]
Only allow script, style, connection, and frame origins that you actually control or trust.»

---

Contributing

1. Decide whether the change belongs in Panda.fun or MovieAPI.
2. Keep playback-provider logic separate from UI code.
3. Preserve responsive behavior.
4. Preserve D-pad and keyboard behavior.
5. Never expose secrets in the frontend.
6. Run "npm run lint".
7. Run "npm test".
8. Keep commits small and reversible.

Roadmap

1. Security

- Fix audit findings
- Harden Firebase rules
- Enable App Check
- Improve CSP

2. Playback

- Multiple playback servers
- Automatic fallback
- Report broken link
- Better playback recovery

3. Notifications

- Next-episode notifications
- PWA push notifications
- Airing schedule integration

4. Profiles

- Multiple profiles
- Per-profile history
- Profile-specific libraries

5. Discovery

- Actor pages
- Cast pages
- “Because you watched...” rows

6. Preferences

- Subtitle preferences
- Language preferences

7. Testing

- Vitest tests
- Playwright tests
- CI on every pull request

---

Content and Legal Notice

Panda.fun is a frontend application that displays metadata and embeds players provided by third parties. It does not host or upload video.

Content availability and licensing are the responsibility of the relevant providers.

If you operate this project publicly, provide a clear:

Takedown process
Contact process
Terms of Service
Privacy Policy

Make sure you have the appropriate rights or lawful basis for content you link to.

---

License

No license has currently been declared.

Without an explicit license, others do not automatically receive permission to reuse or redistribute the code.

If you want Panda.fun to be open source, consider adding an appropriate license such as MIT.

---

<div align="center">

PANDA.FUN

Find something good. Press play. Relax.

<br>

<br />\

<br>

<img src=""https://skillicons.dev/icons?i=react,ts,vite,tailwind,firebase,kotlin&perline=6" (https://skillicons.dev/icons?i=react,ts,vite,tailwind,firebase,kotlin&perline=6)" alt="Panda.fun stack">

<br><br>

<sub>Formerly Kinoma · Active development</sub>

</div>
