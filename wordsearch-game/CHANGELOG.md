# Mise en Place — Changelog

All notable changes to this project will be documented here.
Format: `[version] — date — summary`

---

## [0.1.0] — 2026-04-04 — Initial build

### Added
- **Core game loop** — daily food word search puzzle based on PRD v0.1
- **Word search grid** — letters rendered in CSS Grid, 8-direction word placement (horizontal, vertical, all 4 diagonals)
- **Async puzzle generator** (`js/generator.js`) — Mulberry32 seeded RNG, places words in a square grid then fills remaining cells with thematic letters drawn from the word list; runs via `Promise` + `setTimeout` so it never blocks the UI
- **Puzzle data** (`js/puzzles.js`) — 5 launch puzzles: Cacio e Pepe, Chicken Tikka Masala, Guacamole, Tonkotsu Ramen, Tiramisu
- **Grid caching** — generated grid stored in `localStorage` keyed by puzzle date; no re-generation on return visits
- **Emoji clue panel** — horizontally scrollable row of greyscale emoji chips; each activates (full colour + ingredient label) when the word is found
- **Drag-to-select mechanic** — pointer events (mouse + touch unified), direction lock after first cell move, `setPointerCapture` for reliable off-grid tracking
- **Wrong guess feedback** — cells flash red for 450 ms then reset
- **Word found animation** — cells pop (scale bounce) and receive a persistent colour from an 8-tone earthy palette
- **Win overlay** — dish emoji, dish name, completion time, recipe link, share button, next-puzzle countdown
- **Share** — Web Share API on mobile, clipboard fallback on desktop; Wordle-style emoji text output
- **Stats modal** — streak, total played, win %, avg time; stored in `localStorage`, no login required
- **3-slide onboarding** — shown once for new players, re-accessible via help icon; state persisted in `localStorage`
- **Loading state** — spinner shown while grid generates on first visit; hidden once grid is ready
- **Daily puzzle selection** — exact date match → deterministic hash fallback so there's always a puzzle
- **Return-visit handling** — completed puzzle shows win screen immediately on revisit
- **Accessibility** — `aria-label` on all icon buttons, `role="grid"` / `role="gridcell"`, keyboard Escape closes modals
- **Responsive design** — `clamp()`-based cell sizing, horizontal clue panel scroll, mobile-first layout capped at 480 px
- **Design system** — warm editorial palette (cream `#FAF7F2`, terracotta `#C4522A`, saffron `#E8A832`, sage), Lora serif for display, Inter sans for UI, JetBrains Mono for grid letters

### Architecture
- Vanilla HTML / CSS / JS — no build tool, works on GitHub Pages
- Single IIFE in `game.js` — no global pollution
- Generator exposed as `window.MiseGenerator` for future tooling access
- `localStorage` keys: `mise_puzzle_[date]`, `mise_grid_[date]`, `mise_stats`, `mise_onboarding_complete`

### Known limitations / future work
- Grid uses filler letters (thematic, drawn from word pool) — PRD's "words-only, no filler" constraint is deferred; it requires exact-cover generation which is NP-hard for arbitrary word lists
- No puzzle archive (per PRD v1 scope)
- No user accounts (per PRD v1 scope)
- Illustration assets are emoji placeholders; real editorial illustrations TBD

---

## Planned

### [0.2.0] — Words-only grid
- Offline Node.js generator (`generate-puzzles.cjs`) that pre-solves exact-cover grids and embeds them in `puzzles.js`
- Remove runtime generation; load pre-baked grids instantly

### [0.3.0] — Content expansion
- 30-day puzzle buffer
- OG meta image per puzzle for social link previews

### [0.4.0] — Illustration pass
- Replace emoji placeholders with editorial illustrations (WebP, ≤150 KB each)
- Animated reveal: grid fades out, illustration fades in on win
