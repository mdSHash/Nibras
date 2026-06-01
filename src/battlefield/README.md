# Battlefield Engine — `src/battlefield/`

A 2D PixiJS replay engine for Islamic historical battles. Each scenario is a
TypeScript data file describing forces, scripted phases, narration, and
camera choreography; the engine plays them back as a cinematic 60-second
documentary-style replay with autonomous combat resolution and an
auto-cinematic camera.

This is **not a game** — it's a data-driven historical visualization.
Outcomes are predetermined by the scenario; the simulation just animates
the path between deployment and the historical result.

---

## What's in here

```
src/battlefield/
├── core/                 # Engine, Clock, EventBus
├── entities/             # ECS EntityManager
├── systems/index.ts      # Movement, Combat, Render, Terrain (single file)
├── scripting/            # ScriptInterpreter for scenario phase actions
├── timeline/             # TimelineController — drives scenario playback
├── camera/
│   ├── CameraController.ts   # Pan/zoom/follow with GSAP tweens
│   └── CameraDirector.ts     # Autonomous cinematic camera (combat events)
├── audio/BattleAudio.ts  # Web Audio synthesized SFX (clash, charge, takbir)
├── renderer/PixiRenderer.ts  # PixiJS v8 5-layer scene graph
├── react/
│   ├── BattlePlayer.tsx  # Mounts the canvas + Arabic UI overlays
│   └── AtmosphereOverlay.tsx # CSS day-phase + weather effects
├── state/                # 4 Zustand stores (playback, camera, ui, simulation)
├── scenarios/            # 12 scenario files + the registry
├── types/                # All shared types: components, scenario, events
└── machines/             # XState machine — defined but currently unused
```

---

## How a scenario plays back

```
   ┌─ User clicks "شاهد المعركة" on an Event ────────────────┐
   │                                                          │
   ▼                                                          │
BattlePlayer mounts → Engine.init(canvas) → loadScenario()   │
   │                                                          │
   ├─ ScenarioLoader spawns ECS entities                      │
   │  (one per UnitConfig, with transform/movement/combat/    │
   │   formation/visual/unit/selectable/behavior components)  │
   │                                                          │
   ├─ TerrainRenderer paints terrain zones one-shot           │
   │  (palms in oases, mountain peaks, sand ripples,          │
   │   trench hatching, fortress crenellations, …)            │
   │                                                          │
   └─ Per-frame loop @ 60fps (rAF):                           │
                                                              │
        MovementSystem.update    (acceleration + melee-stop)  │
            ↓                                                 │
        CombatSystem.update      (auto-engage, exchange dmg,  │
            ↓                     emit engage/destroy/rout)   │
        TimelineController       (fires scripted phase actions│
            ↓                     + narration + camera cues)  │
        CameraDirector.tick      (frames the action when no   │
            ↓                     scripted cue is active)     │
        RenderSystem.update      (sync ECS → Pixi sprites,    │
            ↓                     fallen casualties etc.)     │
        PixiRenderer.render      (WebGL draw)                 │
                                                              │
        syncToStores @ 10Hz      (push muslim/enemy strength  │
                                  to Zustand for the React    │
                                  header counters)            │
```

---

## Adding a new scenario

1. Create `src/battlefield/scenarios/{name}.ts` exporting a
   `BattleScenario` const. Required top-level fields:
   - `id`, `name`, `nameAr`, `date`, `location`,
   - `description`, `descriptionAr` (always pair English + Arabic; the UI
     prefers Arabic),
   - `map: { width, height, terrain[], landmarks[], backgroundColor }`,
   - `forces: ForceConfig[]` — each force has a `faction`, units (each
     with `id`, `nameAr`, `troopType`, `soldierCount`, `commander?`,
     `startPosition`, `startFormation`, `startFacing`, `stats`),
   - `phases: BattlePhaseConfig[]` — each with `actions[]` (move_unit,
     attack_unit, change_formation, destroy_unit, camera_move, etc.),
   - `narration: NarrationPoint[]` — one Arabic line per dramatic beat
     (`textAr` is required; `text` English is optional fallback),
   - `cameraScript: CameraKeyframe[]` — authored camera moves; the
     CameraDirector fills the gaps autonomously,
   - `outcome: { verdict, muslimCasualties, enemyCasualties?, summary,
     summaryAr, significance, significanceAr }`,
   - `totalDuration` in simulation seconds (the existing 12 are 50–60s),
   - optional: `dayPhase` (`'dawn'|'day'|'dusk'|'night'`),
     `weather` (`'clear'|'sandstorm'|'storm'|'rain'|'dust'`),
     `actualDayCount` (real-world days the battle lasted — turns on the
     day-counter UI for compressed-time scenarios like Khandaq).

2. Register it in `src/battlefield/scenarios/index.ts`:
   ```ts
   import { battleOfFoo } from './foo';
   // …
   export const scenarios: Record<string, BattleScenario> = {
     // …
     'battle-of-foo': battleOfFoo,
   };
   ```

3. Wire the event into the UI:
   - Add the title → battleId mapping to `src/data.ts` `BATTLE_ID_MAP`.
   - Add the scenario id to `AVAILABLE_BATTLE_SCENARIOS` in
     `src/components/EventPanel.tsx` so the "شاهد المعركة" button
     appears on the event panel.

4. Verify with the Playwright capture pattern in
   `scripts/capture-yamama.mjs` — duplicate it pointing at the new
   battle, run against the dev server, and screenshot at the
   simulation-time markers you defined.

---

## Conventions

### Factions

The `Faction` union (in `types/components.ts`) covers every army that has
appeared in the existing scenarios:

| Faction         | Use                                         |
|-----------------|---------------------------------------------|
| `muslim`        | Prophetic + Rashidun era Muslim armies      |
| `mamluk`        | Mamluks (Ain Jalut)                         |
| `quraysh`       | Pre-Islamic Mecca                           |
| `jewish_tribes` | Khaybar fortresses                          |
| `hawazin`       | Hawazin / Thaqif (Hunayn)                   |
| `banu_hanifa`   | Yamama (Musaylimah)                         |
| `byzantine`     | Eastern Rome (Mu'tah, Tabuk, Yarmouk)       |
| `sasanian`      | Sasanian Persia (Qadisiyyah)                |
| `mongol`        | Ilkhanate (Ain Jalut)                       |
| `neutral`       | Civilians, terrain entities                 |

Each faction has a layered color palette (`base/light/dark/banner/dot`) in
`systems/index.ts → FACTION_COLORS` and a banner glyph in
`drawFactionGlyph()` (al-uqab crescent, eagle silhouette, Chi-Rho /
labarum, drafsh kaviani rhombus, mongol tugh X, palm tree, etc.).

`FACTION_NAME_AR` in `types/components.ts` carries the Arabic name shown
in the BattlePlayer header.

`isMuslimSide(faction)` returns true for `muslim` and `mamluk` — used by
the simulation store so Mamluk troops at Ain Jalut count as the
protagonist side without conflating their banner with the early
caliphate.

### Troop types

`infantry`, `cavalry`, `heavy_cavalry`, `horse_archer`, `archers`,
`camel_riders`, `elephant`, `siege_engineer`, `reserves`, `command`. The
RenderSystem draws a stylized silhouette per type — infantry with a
spear, cavalry with a lance, archers with a bow, an elephant with a
howdah and tusks, and so on. Movement system gives each type a base
speed (cavalry > infantry > siege).

### Terrain types

`sand`, `rocky`, `oasis`, `dune`, `flat`, `elevated`, `trench`,
`fortress_wall`, `river`, `gorge`, `mountain`, `snow`. The renderer
paints distinct treatments per type (e.g. crenellations for
`fortress_wall`, jagged peaks with snow caps for `mountain`, palm
clusters in `oasis`, diagonal hatching for `trench`).

### BattleVerdict

`outcome.verdict` is one of `muslim_victory`, `enemy_victory`,
`tactical_withdrawal` (Mu'tah), `unfought_expedition` (Tabuk — sets
`enemyCasualties: undefined`), `draw`, `inconclusive`. The
end-of-battle summary panel renders a colored verdict badge based on
this.

### Combat tuning

`CombatSystem` damage rate is a fraction of `maxSoldiers/sec` (default
~0.018), scaled by attacker.attack/defender.defense and a small troop-
type matchup multiplier (cavalry × 1.3 vs infantry, elephant × 1.6,
etc.). Tuned so a 50-second engagement at parity removes 5–15% of a
unit — historical-ish casualty percentages without making the
autonomous combat decisive enough to rewrite scenario outcomes.
Scripted `destroy_unit` actions still drive the major story beats.

### Audio

`BattleAudio` synthesizes SFX with the Web Audio API — no asset files.
It listens to `combat:engagement_started`, `combat:unit_destroyed`,
`combat:unit_routed`, and `phase:started`, mapping to clash, defeat,
charge, takbir, or horn voices. AudioContext is unlocked lazily on
first user gesture.

---

## Hard rules (also recorded in `.claude/.../memory/`)

- **All UI strings Arabic.** No English fallback in the BattlePlayer
  header, summary panel, narration, aria-labels, or button text. The
  Arabic field on a scenario (`nameAr`, `descriptionAr`, `summaryAr`,
  `significanceAr`, `narration[].textAr`) is canonical.
- **Historical accuracy per Sunni scholarly sources** (Ibn Hisham,
  Tabari, Ibn Kathir, Bukhari). Don't invent commanders, casualty
  counts, or scenes that contradict the canonical sirah.
- **WCAG AA contrast in both light and dark mode.** Era `textLight`
  pairs with `bgLight`, `textDark` with `bgDark` — never crossed.
- **No `Co-Authored-By` trailers in commits.** History reads as solo-
  authored.
