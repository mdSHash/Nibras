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

Nibras (نِبْرَاس — "lamp" or "light" in Arabic) is an interactive web application that illuminates Islamic history through dynamic timeline visualization, geographical mapping, and cinematic battle replays. It covers the period from 571 CE to 661 CE, spanning the Meccan period, the Medinan period, and the Rashidun Caliphate.

The platform serves as a spatial-temporal reference for exploring the Prophetic biography (Seerah) and early Islamic history. Events are presented on an interactive map with territorial changes, linked Quran references, companion biographies, and narrated descriptions. Major battles are rendered as full cinematic replays using a custom PixiJS-based engine.

---

## Features

- **Interactive Timeline** — Chronological navigation of Islamic history events across the Prophetic, Rashidun, and selected later eras (Ain Jalut)
- **Cinematic Battle Replay Engine** — 12 fully scripted battles rendered with PixiJS WebGL at 60fps. Each unit is a stylized soldier silhouette per troop type (infantry, cavalry, archers, elephant, camel rider, …). Includes:
  - **Autonomous combat resolution** — units close to melee range, exchange damage, take visible casualties (fallen-soldier silhouettes appear in formation as numbers drop)
  - **Cinematic auto-camera** — pans + zooms onto engagements, snaps to dying units, yields to authored keyframes
  - **Day/night + weather** — sandstorm, storm, dust haze, plus dayPhase tinting (e.g. Khandaq night)
  - **Time compression UI** — day counter for siege-length engagements (Khandaq 27d, Khaybar 20d, Tabuk 30d)
  - **End-of-battle summary** — Arabic verdict badge (نصر / انسحاب تكتيكي / غزوة بدون قتال) + casualty grid + historical significance
- **Arabic-only UI** — Full RTL support with Arabic calligraphy intro (Amiri / Tajawal). All user-facing strings, narration, and aria-labels are Arabic; numerals use Arabic-Eastern digits in summary panels.
- **Map Visualization** — Leaflet-based interactive map with event markers, route polylines, territorial expansion polygons (Voronoi via Turf.js), and marker clustering via Supercluster
- **Companion Profiles** — Biographical data for key Sahaba with their roles in specific events
- **Quran References** — Events linked to relevant Quranic verses with modal display
- **Text-to-Speech Narration** — Gemini-powered Arabic TTS for event descriptions and battle narration, served from pre-cached WAV files in `public/audio/` (SHA-256-hashed)
- **Synthesized Battle Audio** — Web Audio API generates clash, charge, defeat, takbir, and horn SFX for the battlefield engine — no asset files needed
- **Guided App Tour** — Step-by-step onboarding with spotlight highlighting; auto-repositions when targets resize/remount via ResizeObserver
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
git clone https://github.com/<your-org>/nibras.git
cd nibras
npm install
```

### Environment Variables

Copy the example environment file and configure:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID (audio storage) |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name (default: `nibras-audio`) |
| `R2_PUBLIC_URL` | Public URL for the R2 bucket |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for TTS |

### Running Locally

```bash
# Start the frontend dev server (port 3000)
npm run dev

# Start the TTS backend server (separate terminal)
npm run dev:server
```

The app will be available at `http://localhost:3000`.

---

## Usage

1. **Timeline Navigation** — Use the vertical timeline on the right to browse events chronologically. Filter by era (Meccan, Medinan, Rashidun) or event type.
2. **Map Exploration** — Click markers on the map to view event details. Territorial polygons update as you move through time.
3. **Event Details** — Select any event to open the detail panel with full description, companion roles, Quran references, and TTS narration.
4. **Battle Replay** — Events tagged as battles display a "Watch Battle" button. Click to launch the full-screen cinematic replay with play/pause controls and narration.
5. **Search** — Use the search menu (keyboard shortcut available) to find events by title.
6. **Autoplay** — Enable player mode to auto-advance through events with narration.

---

## Project Structure

```
nibras/
├── public/                    # Static assets (favicon, audio cache)
├── scripts/                   # Build/utility scripts (audio caching, R2 migration)
├── server/                    # Express TTS proxy server
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
│   │   ├── scenarios/         # 12 battle scenario data files + registry
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
│   │   └── SearchMenu.tsx     # Event search overlay
│   ├── contexts/              # React contexts (Tour)
│   ├── hooks/                 # Custom hooks (gestures, keyboard, focus trap)
│   ├── services/              # TTS service layer (Gemini)
│   ├── constants/             # App-wide constants (z-index, etc.)
│   ├── data/                  # Tour step definitions
│   └── utils/                 # Utilities (animations, formatting, era colors)
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
| 12 | معركة عين جالوت | 25 Ramadan 658 AH (1260 CE) | Jezreel Valley, Palestine | `battle-of-ain-jalut` |

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
| `npm run cache-audio` | Pre-cache event-title audio (run during build, not at runtime) |
| `npm run cache-details` | Pre-cache full-description audio |
| `npm run test:ui` | Run Playwright tests |
| `node scripts/capture-yamama.mjs` | Playwright capture of the Yamama battle at key sim times — useful template for verifying any new scenario |
| `node scripts/capture-contrast.mjs` | Playwright capture of the EventPanel in light + dark mode at desktop + mobile viewports |

### TTS Setup

The application uses Google Gemini for Arabic text-to-speech. Audio is generated on-demand and cached to Cloudflare R2 for subsequent requests. The TTS proxy server runs separately via `npm run dev:server`.

To pre-cache all audio (recommended for production):

```bash
npm run cache-audio
npm run cache-details
```

---

## Deployment

Build the production bundle:

```bash
npm run build
```

Output is written to `dist/`. Deploy to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

The TTS server (`server/`) must be deployed separately as a Node.js service if live TTS generation is required. Pre-cached audio served from R2 does not require the server at runtime.

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
