# Nibras (نبراس)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PixiJS](https://img.shields.io/badge/PixiJS-8-E72264?logo=pixijs&logoColor=white)](https://pixijs.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**An interactive Islamic history educational platform with a cinematic battle replay engine.**


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Battle Engine](#battle-engine)
- [Available Battles](#available-battles)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

Nibras (نِبْرَاس — "lamp" or "light" in Arabic) is an interactive web application that illuminates Islamic history through dynamic timeline visualization, geographical mapping, and cinematic battle replays. It covers 571–661 CE — the Meccan period, the Medinan period, and the four Rashidun caliphates (Abu Bakr, Umar, Uthman, Ali) up to `عام الجماعة` in 41 هـ.

131 chapter-events are laid out on an interactive Leaflet map with time-varying territorial polygons, linked Quranic and hadith references, ~150 companion biographies at classical-source depth, and Arabic TTS narration on every title and description. Twelve decisive battles are rendered as full cinematic replays through a custom PixiJS engine.

---

## Features

- **Interactive Timeline** — 131 chronological events spanning the Prophetic era (571 CE) and all four Rashidun caliphates (632–661 CE). Filter by era or category. Events with a playable cinematic battle are marked with a gold ▷ badge on the timeline diamond, the search list, and the map pin so watchable moments are recognizable at a glance.
- **Cinematic Battle Replay Engine** — 12 fully scripted battles rendered with PixiJS WebGL at 60fps. Each unit is a stylized soldier silhouette per troop type (infantry, cavalry, archers, elephant, camel rider, …). Includes:
  - **Autonomous combat resolution** — units close to melee range, exchange damage, take visible casualties (fallen-soldier silhouettes appear in formation as numbers drop)
  - **Cinematic auto-camera** — pans + zooms onto engagements, snaps to dying units, yields to authored keyframes. Every scenario opens at the "fit the whole battlefield" zoom, which is also the widest view the camera can reach — the reset-view button snaps back to it, and no cinematic keyframe can pan wider. Mobile viewports reserve space for the top header + narration + controls so no unit ends up behind the chrome.
  - **Day/night + weather** — sandstorm, storm, dust haze, plus dayPhase tinting (e.g. Khandaq night)
  - **Time compression UI** — day counter for siege-length engagements (Khandaq 27d, Khaybar 20d, Tabuk 30d)
  - **End-of-battle summary** — Arabic verdict badge (نصر / انسحاب تكتيكي / غزوة بدون قتال) + casualty grid + historical significance
- **Arabic-only UI** — Full RTL support with Arabic calligraphy intro (Amiri / Tajawal). All user-facing strings, narration, and aria-labels are Arabic; numerals use Arabic-Eastern digits in summary panels.
- **Map Visualization** — Leaflet-based interactive map with event markers, route polylines, territorial expansion polygons (Voronoi via Turf.js), and marker clustering via Supercluster
- **Companion Profiles** — ~150 Sahaba biographies at Ibn Hajar / Ibn al-Athir / Ibn Sa'd source depth, indexed by name and alias for cross-event lookup
- **Quran & Hadith References** — Events linked to relevant Quranic verses and canonical hadith (Bukhari, Muslim, Ahmad, Tirmidhi) with modal display
- **Text-to-Speech Narration** — 262 pre-cached Charon-voice WAV files (Gemini 3.1 flash-tts, 24 kHz PCM) covering every event's title and full description, served as static assets from `public/audio/{sha256}.wav`
- **Synthesized Battle Audio** — Web Audio API generates clash, charge, defeat, takbir, and horn SFX for the battlefield engine — no asset files needed
- **Diacritic-tolerant Arabic search** — Type `معركه بدر` or `بدر الكبرى` and match the vocalized title `مَعْرَكَةُ بَدْرٍ الْكُبْرَى`. Normalizes tashkeel, alef/yeh/teh-marbuta variants, and matches whitespace-separated tokens (all-of), against title, summary, full description, location, and year.
- **Guided App Tour** — Step-by-step onboarding with spotlight highlighting; auto-repositions when targets resize/remount and after slide-in animations settle
- **Keyboard Shortcuts** — Full keyboard navigation; gated when modals are open
- **Dark/Light Mode** — Theme toggle, WCAG AA contrast verified in both modes
- **Autoplay Mode** — Sequential event playback with narration

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19, TypeScript 5.8 |
| Build | Vite 6 |
| Battle Renderer | PixiJS 8 (WebGL) |
| State Management | Zustand 5, XState 5 |
| Animation | Framer Motion 12, GSAP 3 |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet, React-Leaflet, Supercluster |
| AI/TTS | Google Generative AI (Gemini) |
| Geo Utilities | Turf.js |
| Testing | Playwright |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/mdSHash/Nibras.git
cd Nibras
npm install
cd server && npm install && cd ..
```

### Environment Variables

Runtime doesn't require any secrets — the 262 narration WAVs are committed under `public/audio/` and served with the site. Environment variables are only needed at **build time** if you're regenerating audio.

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `server/.env` | Google Gemini API key. Consumed by `server/index.js` (TTS proxy) and `scripts/cache-event-*.js`. Get one at https://aistudio.google.com/apikey. |

### Running Locally

```bash
# Frontend dev server (port 3000)
npm run dev

# TTS backend server (separate terminal, only needed if you regenerate audio)
npm run dev:server
```

The app will be available at `http://localhost:3000`.

---

## Usage

1. **Timeline Navigation** — Use the vertical timeline on the right to browse events chronologically. Filter by era (Meccan, Medinan, Rashidun) or event type.
2. **Map Exploration** — Click markers on the map to view event details. Territorial polygons update as you move through time.
3. **Event Details** — Select any event to open the detail panel with full description, companion roles, Quran references, and TTS narration.
4. **Battle Replay** — Events tagged as battles display a "Watch Battle" button. Click to launch the full-screen cinematic replay with play/pause controls and narration.
5. **Search** — Open the search drawer (Ctrl+K on desktop, magnifier icon on mobile) to filter events by keyword, era, or type. Search is diacritic-tolerant Arabic: `معركه` matches `معركة`, `بدر الكبرى` matches `غزوة بدر الكبرى`, and tokens can appear in any order across title, summary, description, location, or year.
6. **Autoplay** — Enable player mode to auto-advance through events with narration.

---

## Project Structure

```
nibras/
├── public/                    # Static assets — includes public/audio/*.wav (262 SHA-256-hashed narration files)
├── scripts/                   # Build/utility scripts (audio caching, Playwright captures)
├── server/                    # Express TTS proxy server (build-time only)
├── src/
│   ├── App.tsx                # Root application component
│   ├── data.ts                # Event data loader and type definitions
│   ├── dataList.json          # Full event dataset (JSON)
│   ├── types.ts               # Shared TypeScript types
│   ├── battlefield/           # Battle replay engine (see below)
│   │   ├── README.md          # Engine architecture + scenario authoring guide
│   │   ├── audio/             # BattleAudio — Web Audio synthesized SFX
│   │   ├── camera/            # CameraController (GSAP) + CameraDirector (cinematic)
│   │   ├── core/              # Engine, Clock, EventBus
│   │   ├── entities/          # Entity manager (ECS)
│   │   ├── formations/        # Unit formation calculators
│   │   ├── machines/          # XState machine (defined, currently unused)
│   │   ├── react/             # BattlePlayer + AtmosphereOverlay
│   │   ├── renderer/          # PixiJS WebGL renderer + 5-layer scene graph
│   │   ├── scenarios/         # 13 battle scenario data files + registry
│   │   ├── scripting/         # ScriptInterpreter for scenario phase actions
│   │   ├── state/             # Zustand stores (playback, camera, simulation, UI)
│   │   ├── systems/           # ECS systems (Movement, Combat, Render, Terrain)
│   │   ├── timeline/          # Playback timeline controller
│   │   └── types/             # Engine type definitions
│   ├── components/            # UI components
│   │   ├── AppTour.tsx        # Guided tour overlay
│   │   ├── EventPanel.tsx     # Event detail panel with TTS
│   │   ├── IntroScreen.tsx    # Arabic calligraphy intro animation
│   │   ├── Map.tsx            # Leaflet map with territories
│   │   ├── Timeline.tsx       # Vertical timeline with autoplay
│   │   ├── CompanionModal.tsx # Sahaba biography modal
│   │   ├── QuranModal.tsx     # Quran reference modal
│   │   ├── SearchMenu.tsx     # Event search + filter drawer
│   │   └── timeline/          # Timeline subcomponents (Rail, DesktopDock, MobileDock, Diamond, EraPill)
│   ├── contexts/              # React contexts (Tour)
│   ├── hooks/                 # Custom hooks (gestures, keyboard, focus trap)
│   ├── services/              # TTS service layer (Gemini)
│   ├── constants/             # App-wide constants (z-index, etc.)
│   ├── data/                  # Tour step definitions
│   └── utils/                 # Utilities (animations, formatting, era colors, Arabic-search normalization)
├── .env.example               # Environment variable template
├── package.json               # Dependencies and scripts
├── PRD.md                     # Product Requirements Document
└── index.html                 # Entry HTML
```

---

## Battle Engine

A 2D PixiJS replay engine for Islamic historical battles. Each scenario is a TypeScript data file describing forces, scripted phases, narration, and camera choreography; the engine plays them back as a 50-60-second cinematic with autonomous combat and an auto-cinematic camera.

This is **not a game** — outcomes are predetermined by the scenario; the simulation animates the path between deployment and the historical result.

### Architecture

- **ECS (Entity-Component-System)** — Units are entities with transform, movement, combat, formation, visual, and unit components. Systems process them each frame.
- **Fixed-timestep simulation** — Movement → Combat → Timeline (scripted actions) → CameraDirector → Render, in that order, at 60 fps.
- **PixiJS v8 WebGL rendering** — 5-layer scene graph (background terrain → tactical → entity → effects → UI). Each soldier is a stylized silhouette per troop type with faction-tinted palette.
- **Autonomous CombatSystem** — Detects unit-vs-unit engagement at melee range, exchanges damage as a fraction of `maxSoldiers/sec`, scaled by attack/defense ratio + troop-type matchup multipliers. Casualties become visible as fallen-soldier figures in formation.
- **CameraDirector** — Listens to combat events (engagement_started, unit_destroyed, unit_routed) and cinematically pans/zooms onto the action, yielding to authored `cameraScript` keyframes when they're active.
- **GSAP CameraController** — Smooth pan / zoom / focus tweens with keyframe support, driven by both the scenario's `cameraScript` and the autonomous director.
- **BattleAudio** — Web Audio API synthesized clash / charge / defeat / takbir / horn SFX. Listens to the EventBus, no asset files required.
- **Zustand Bridge** — Engine writes to four Zustand stores (`playback`, `camera`, `ui`, `simulation`) at ~10 fps. React UI subscribes without coupling to the render loop.
- **AtmosphereOverlay** — CSS-based dayPhase tinting + weather effects (sandstorm, storm, rain, dust) above the Pixi canvas.

### Data Flow

```
Scenario (.ts) → Engine.loadScenario() → ECS entities + Pixi sprites
                       ↓
               rAF loop @ 60fps
                       ↓
        Movement → Combat → Timeline → CameraDirector → Render
                       ↓
        syncToStores @ 10fps  (muslim/enemy strength, morale)
                       ↓
               React UI (header counters, narration, summary)
```

For the full engine architecture, scenario format, and authoring guide see [`src/battlefield/README.md`](src/battlefield/README.md).

---

## Available Battles

| # | Battle | Date | Location | Scenario ID |
|---|--------|------|----------|-------------|
| 1 | غزوة بدر الكبرى | 17 Ramadan 2 AH (624 CE) | Wells of Badr, Hejaz | `battle-of-badr` |
| 2 | غزوة أُحُد | 7 Shawwal 3 AH (625 CE) | Mount Uhud, near Medina | `battle-of-uhud` |
| 3 | غزوة الخندق (الأحزاب) | Shawwal 5 AH (627 CE) | Northern Medina | `battle-of-khandaq` |
| 4 | غزوة خيبر | Muharram 7 AH (628 CE) | Khaybar fortress complex | `battle-of-khaybar` |
| 5 | معركة مؤتة | Jumada al-Ula 8 AH (629 CE) | Mu'tah, Jordan | `battle-of-mutah` |
| 6 | فتح مكة المكرمة | 20 Ramadan 8 AH (630 CE) | Mecca | `conquest-of-mecca` |
| 7 | غزوة حُنين | 10 Shawwal 8 AH (630 CE) | Valley of Hunayn | `battle-of-hunayn` |
| 8 | غزوة تبوك | Rajab 9 AH (630 CE) | Tabuk, northern Arabia | `battle-of-tabuk` |
| 9 | معركة اليمامة (حديقة الموت) | 12 AH (633 CE) | Aqraba plain, al-Yamamah | `battle-of-yamama` |
| 10 | معركة اليرموك | 15-20 Rajab 15 AH (636 CE) | Yarmouk River, Syria | `battle-of-yarmouk` |
| 11 | معركة القادسية | 16-19 Sha'ban 15 AH (636 CE) | Al-Qadisiyyah, Iraq | `battle-of-qadisiyyah` |
| 12 | معركة نهاوند (فتح الفتوح) | 21 AH (642 CE) | Nahavand, northern Zagros | `battle-of-nahavand` |
---

## Configuration

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server (port 3000) |
| `npm run dev:server` | Start the TTS backend server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking (`tsc --noEmit`) |
| `npm run cache-audio` | Pre-cache title audio for every event through the TTS proxy |
| `npm run cache-details` | Pre-cache full-description audio (chunked at 4500 chars) |
| `node scripts/verify-all-audio.js` | Check every event has both title + description WAVs in `public/audio/` — reports missing files with expected SHA-256 hashes |
| `node scripts/capture-yamama.mjs` | Playwright capture of the Yamama battle at key sim times — useful template for verifying any new scenario |
| `node scripts/capture-nahavand.mjs` | Same for the Nahavand replay |
| `node scripts/capture-contrast.mjs` | Playwright capture of the EventPanel in light + dark mode at desktop + mobile viewports |

### TTS Setup

Every event's title + `full_description` is pre-rendered as a WAV in `public/audio/`. Filenames are `SHA-256(normalizeText(text) + "|" + voice + "|" + rate)` — the front-end recomputes the same hash and fetches from that path, so audio playback is a static-file GET, not a live API call.

To regenerate audio (e.g. after adding new events):

```bash
# 1. Put a Gemini key in server/.env (see .env.example)
# 2. Start the TTS proxy
npm run dev:server &

# 3. Cache titles + full descriptions
npm run cache-audio
npm run cache-details

# 4. Sanity-check coverage
node scripts/verify-all-audio.js
```

---

## Deployment

Production is hosted at **https://mdshash.github.io/Nibras/** on GitHub Pages. Every push to `main` triggers `.github/workflows/deploy.yml`, which builds with Vite (`base: '/Nibras/'`) and publishes the `dist/` artifact via `actions/deploy-pages@v4`. Typical build-and-deploy time is ~2 minutes.

Because all audio ships as static WAVs bundled into `dist/audio/`, no separate backend is required at runtime. The TTS proxy in `server/` is only used at authoring time when regenerating narration.

To publish new content:

```bash
# 1. Add events / companions, generate audio locally
# 2. Verify
node scripts/verify-all-audio.js

# 3. Commit + push
git add src/dataList.json src/companionsList.ts public/audio/
git commit -m "…"
git push origin main    # GitHub Actions handles the deploy
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

For adding new battle scenarios, see [`src/battlefield/README.md`](src/battlefield/README.md) for the complete authoring guide.

---

## License

MIT

---

## Author

Nibras Team
