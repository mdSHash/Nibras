# 12 — Visual Style

## Overview

The visual style is inspired by **Total War tactical maps** combined with **Islamic historical elegance**. The aesthetic is educational and atmospheric — NOT gamified. Think documentary visualization, not video game.

---

## 12.1 — Color Palette

### Base Palette (Desert/Parchment)

| Name | Hex | Usage |
|------|-----|-------|
| Parchment Light | `#F5E6D3` | Background base |
| Parchment Medium | `#E8D5B7` | Terrain fill |
| Sand | `#D4A574` | Dunes, paths |
| Desert Dark | `#8B7355` | Hills, elevation |
| Ink Brown | `#4A3728` | Text, borders |
| Deep Brown | `#2C1810` | Shadows, emphasis |

### Muslim Army Colors

| Name | Hex | Usage |
|------|-----|-------|
| Forest Green | `#1B4332` | Infantry primary |
| Emerald | `#15803D` | Cavalry primary |
| Dark Green | `#166534` | Archers primary |
| Gold Accent | `#D4A574` | Commander, highlights |
| White | `#FAFAF9` | Banners, labels |

### Opponent Army Colors

| Name | Hex | Usage |
|------|-----|-------|
| Burnt Sienna | `#7C2D12` | Infantry primary |
| Rust | `#9A3412` | Cavalry primary |
| Crimson | `#B91C1C` | Archers primary |
| Dark Red | `#450A0A` | Commander, emphasis |
| Bone | `#E7E5E4` | Labels |

### UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| Overlay Dark | `rgba(28, 25, 23, 0.85)` | Panel backgrounds |
| Overlay Medium | `rgba(68, 64, 60, 0.70)` | Secondary panels |
| Accent Gold | `#D4A574` | Active states, highlights |
| Text Primary | `#FAFAF9` | Primary text on dark |
| Text Secondary | `#A8A29E` | Secondary text |

---

## 12.2 — Typography

```css
/* Narration text */
.narration-standard {
  font-family: 'Amiri', serif;  /* Arabic-optimized serif */
  font-size: 1.125rem;
  line-height: 1.75;
  color: #FAFAF9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Dramatic narration */
.narration-dramatic {
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}

/* Quran verse style */
.narration-quran {
  font-family: 'Amiri Quran', serif;
  font-size: 1.75rem;
  color: #D4A574;
  text-align: center;
}

/* Phase indicator */
.phase-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Unit labels */
.unit-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  font-weight: 500;
}
```

---

## 12.3 — Unit Token Design

Units are rendered as **geometric tokens** (top-down tactical view):

```
Infantry (Rectangle - shield wall):
┌─────────┐
│ ███████ │  ← Solid fill with team color
│ ███████ │  ← Slight gradient for depth
└─────────┘
  "80"       ← Soldier count below

Cavalry (Triangle - wedge):
    ▲
   ███
  █████      ← Pointed forward (direction of movement)
   "30"

Archers (Diamond - dispersed):
    ◆
   ◆◆◆      ← Diamond shape indicating ranged
    ◆
   "50"

Camel (Rounded Rectangle):
╭─────────╮
│ ███████ │  ← Rounded corners distinguish from infantry
╰─────────╯
   "40"

Reserve (Circle - uncommitted):
  ●●●●●
  ●●●●●     ← Circle indicates not yet deployed
  ●●●●●
   "100"
```

---

## 12.4 — Terrain Rendering

```
Background: Subtle parchment texture (tiled)
Grid: Very faint tactical grid (opacity 0.05)
Hills: Soft brown gradients with contour-like edges
Water: Subtle blue with slight animation
Dunes: Wavy sand-colored shapes
Fortifications: Dark brown with hatching pattern
```

Terrain features use **soft edges** and **muted colors** — never harsh outlines.

---

## 12.5 — Effects Style

| Effect | Visual |
|--------|--------|
| Dust clouds | Soft tan particles, low opacity, drift with wind |
| Arrow volleys | Thin dark lines arcing through air |
| Impact | Brief white flash + small dust puff |
| Charge | Speed lines behind cavalry + larger dust |
| Morale break | Red pulse on unit + scattered particles |
| Rally | Gold pulse on commander + radiating circles |
| Death | Unit fades to gray, shrinks slightly |

---

## 12.6 — UI Overlay Style

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─ Phase Indicator (top center) ─────────────────┐    │
│  │  ▎ OPENING ENGAGEMENT — المبارزة              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│                                                         │
│                   [BATTLEFIELD]                          │
│                                                         │
│                                                         │
│  ┌─ Narration (bottom, semi-transparent) ─────────┐    │
│  │  "The Muslim army advances in crescent          │    │
│  │   formation toward the wells of Badr..."        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─ Timeline ─────────────────────────────────────┐    │
│  │  ████████████░░░░░░░░░░░░  1:23 / 3:00        │    │
│  └────────────────────────────────────────────────┘    │
│  ┌─ Controls ─────────────────────────────────────┐    │
│  │  ▶  │ 0.5x  1x  1.5x  2x  4x │  ↺  │  ✕    │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 12.7 — Animation Principles

1. **Smooth, not snappy** — All movements use easing (never linear)
2. **Formations move as one** — Units within a formation move cohesively
3. **Dust follows movement** — Moving units leave subtle dust trails
4. **Camera breathes** — Slight slow zoom during dramatic moments
5. **Narration fades** — Text fades in/out, never pops
6. **Death is respectful** — Units fade out gracefully, no gore
7. **Victory is dignified** — No celebration animations, just calm overview

---

## 12.8 — Respectful Representation Guidelines

- **No individual soldier death animations** — Units represent groups
- **No blood or gore** — Damage shown through health bars and unit fading
- **No disrespectful depictions** — All historical figures treated with dignity
- **Educational tone** — Narration is factual and respectful
- **Islamic aesthetic** — Geometric patterns, calligraphic elements where appropriate
- **ﷺ always included** — When mentioning the Prophet Muhammad ﷺ
