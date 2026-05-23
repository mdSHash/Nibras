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

- **Interactive Timeline** — Chronological navigation of Islamic history events (571–661 CE) across three eras: Meccan, Medinan, and Rashidun Caliphate
- **Cinematic Battle Replay Engine** — 11 fully scripted battles rendered with PixiJS WebGL at 60fps, featuring deterministic playback, cinematic camera choreography, and bilingual narration
- **Arabic-First UI** — Full RTL support with Arabic calligraphy intro screen (Amiri/Naskh font), right-to-left layout throughout
- **Map Visualization** — Leaflet-based interactive map with event markers, route polylines, territorial expansion polygons, and marker clustering via Supercluster
- **Companion Profiles** — Biographical data for key Sahaba with their roles in specific events
- **Quran References** — Events linked to relevant Quranic verses with modal display
- **Text-to-Speech Narration** — Gemini-powered Arabic TTS for event descriptions and battle narration, with pre-cached audio via Cloudflare R2
- **Guided App Tour** — Step-by-step onboarding tour for first-time users with spotlight highlighting
- **Keyboard Shortcuts** — Full keyboard navigation support
- **Dark/Light Mode** — Theme toggle with smooth transitions
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
│   │   ├── ARCHITECTURE.md    # Engine architecture overview
│   │   ├── README.md          # Battle system documentation
│   │   ├── camera/            # GSAP-powered camera controller
│   │   ├── core/              # Engine, Clock, EventBus
│   │   ├── entities/          # Entity manager (ECS)
│   │   ├── formations/        # Unit formation calculators
│   │   ├── machines/          # XState battle lifecycle FSM
│   │   ├── react/             # BattlePlayer React shell
│   │   ├── renderer/          # PixiJS WebGL renderer + layers
│   │   ├── scenarios/         # 11 battle scenario data files
│   │   ├── scripting/         # Scenario scripting engine
│   │   ├── state/             # Zustand stores (playback, camera, simulation, UI)
│   │   ├── systems/           # ECS systems (movement, combat, morale)
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

The battle replay engine is a production-grade, ECS-based cinematic visualization system. It renders historical battles as documentary-style replays — not games.

### Architecture

- **ECS (Entity-Component-System)** — Units are entities with position, movement, combat, and render components. Systems process them each frame.
- **Deterministic Playback** — Fixed timestep with seeded RNG ensures identical replays.
- **PixiJS WebGL Rendering** — Layered container hierarchy (terrain, units, effects, UI) renders 500+ entities at 60fps.
- **GSAP Camera** — Cinematic camera choreography with pan, zoom, and tracking shots scripted per battle phase.
- **XState Lifecycle** — Battle phases (deploy, advance, engage, resolve) managed by a finite state machine.
- **Zustand Bridge** — Engine writes to Zustand stores at 10fps; React UI subscribes without coupling to the render loop.

### Data Flow

```
Scenario (.ts) → Engine (rAF loop) → PixiJS (WebGL)
                       ↓
               Zustand Stores (10fps)
                       ↓
               React UI (controls, narration)
```

For full architecture documentation, see [`src/battlefield/ARCHITECTURE.md`](src/battlefield/ARCHITECTURE.md).

---

## Available Battles

| # | Battle | Date | Location | Scenario ID |
|---|--------|------|----------|-------------|
| 1 | Battle of Badr | 17 Ramadan 2 AH (624 CE) | Wells of Badr, Hejaz | `battle-of-badr` |
| 2 | Battle of Uhud | 7 Shawwal 3 AH (625 CE) | Mount Uhud, near Medina | `battle-of-uhud` |
| 3 | Battle of the Trench | Shawwal 5 AH (627 CE) | Northern Medina | `battle-of-khandaq` |
| 4 | Battle of Khaybar | Muharram 7 AH (628 CE) | Khaybar fortress complex | `battle-of-khaybar` |
| 5 | Battle of Mu'tah | Jumada al-Ula 8 AH (629 CE) | Mu'tah, Jordan | `battle-of-mutah` |
| 6 | Conquest of Mecca | 20 Ramadan 8 AH (630 CE) | Mecca | `conquest-of-mecca` |
| 7 | Battle of Hunayn | 10 Shawwal 8 AH (630 CE) | Valley of Hunayn | `battle-of-hunayn` |
| 8 | Expedition of Tabuk | Rajab 9 AH (630 CE) | Tabuk, northern Arabia | `battle-of-tabuk` |
| 9 | Battle of Yarmouk | 15-20 Rajab 15 AH (636 CE) | Yarmouk River, Syria | `battle-of-yarmouk` |
| 10 | Battle of Qadisiyyah | 16-19 Sha'ban 15 AH (636 CE) | Al-Qadisiyyah, Iraq | `battle-of-qadisiyyah` |
| 11 | Battle of Ain Jalut | 25 Ramadan 658 AH (1260 CE) | Jezreel Valley, Palestine | `battle-of-ain-jalut` |

---

## Configuration

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run dev:server` | Start TTS backend server |
| `npm run build` | Production build via Vite |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run cache-audio` | Pre-cache event audio to R2 |
| `npm run cache-details` | Pre-cache detail narration audio |
| `npm run test:ui` | Run Playwright E2E tests |

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
