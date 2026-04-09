# PRD: [Working Title: "Mise en Place"] — Daily Food Word Search Game

**Version:** 0.1 (Pre-Development)  
**Status:** Draft  
**Last Updated:** April 2026

---

## 1. Overview

### 1.1 Product Summary

"Mise en Place" is a daily browser-based word search puzzle game with a food-first identity. Each day, players find a set of ingredient words hidden in a letter grid. Every letter in the grid belongs to a word — there are no filler letters. When the final word is found, the grid dissolves into a reveal: the dish those ingredients make, with an illustration and a link to the full recipe.

The game is designed for casual daily play, shareable results, and the quiet satisfaction of cooking something without leaving your chair.

### 1.2 Inspiration

- **NYT Strands / Elevate Word Bend** — words-only grid (no stray letters), meaningful spatial arrangement
- **NYT Wordle** — daily cadence, shared result, social sharing
- **Food52 / NYT Cooking** — editorial food identity; players should feel like food-literate adults

### 1.3 Goals

- Deliver a polished, delightful daily game that players return to habitually
- Create a shareable moment at puzzle completion that drives organic growth
- Build an editorial content pipeline (puzzles + recipes) that can sustain daily publishing
- Lay groundwork for future expansion (themed packs, restaurant partnerships, etc.)

---

## 2. Target Audience

**Primary:** Casual daily game players (Wordle/NYT Games audience). Comfortable with phone or desktop browsers. Plays games in short sessions (2–5 minutes). Values completing a daily ritual.

**Secondary:** Food enthusiasts. May recognize ingredients instantly, which accelerates play and increases delight. Not required to succeed — the emoji clue system ensures accessibility for non-foodies.

**Not the primary audience (for v1):** Hardcore puzzle players seeking difficulty, or users expecting a cooking app.

---

## 3. Core Game Design

### 3.1 Grid Structure

- **Type:** Words-only grid. Every cell in the grid belongs to exactly one word. There are no orphan letters.
- **Grid size:** Variable per puzzle, typically 8×8 to 10×10 depending on word count and length. Grid size should be determined programmatically during puzzle generation to fit all words with no remainder cells.
- **Word placement:** Words can run in any of 8 directions: horizontal (L→R), horizontal (R→L), vertical (top→bottom), vertical (bottom→top), and all 4 diagonals. No word may overlap another (each cell belongs to exactly one word).
- **Visual design:** Grid presented as a clean, evenly-spaced letter matrix on a neutral background. Letters are large and tappable on mobile.

### 3.2 Words (The Ingredients)

- Each puzzle is built around a single dish (e.g., "Cacio e Pepe", "Chicken Tikka Masala", "Banana Foster").
- Words represent the key ingredients of that dish (e.g., PECORINO, PASTA, PEPPER, GUANCIALE, OLIVE OIL → note: multi-word ingredients use no spaces in the grid).
- Target word count: **6–10 words per puzzle**. Fewer feels thin; more risks frustrating casual players.
- Word length: minimum 4 letters, no maximum (but puzzle generator should balance short and long words).
- Words are normalized: spaces removed, accents stripped, all caps in grid. Display version of the word (shown after discovery) may restore formatting (e.g., "Pecorino Romano").

### 3.3 Clue System

**Clues are emoji, not words.**

- Before play begins, the clue panel displays a row of emoji representing each ingredient (e.g., 🧀🍝🧂🫒🐷 for Cacio e Pepe).
- Emoji are displayed in randomized order so they don't map 1:1 to a word list that would make the grid trivial.
- Total count of emoji = total number of words in the puzzle. Players know how many words to find.
- When a word is found, its corresponding emoji "activates" in the clue panel (glows, pops, or checks off). The text label of the found word appears beneath or beside its emoji.
- If multiple emoji could map to the same ingredient (e.g., 🧄 and 🌿 are both possible for garlic), the mapping is resolved at puzzle completion.

**Clue panel behavior:**
- Unfound emoji: grayscale or muted
- Found emoji: full color, with ingredient name label appearing
- All found: trigger win state

### 3.4 Word Selection Mechanic

- **On desktop:** Click and drag across letters to select a word. Release to confirm.
- **On mobile:** Touch and swipe. Selection highlights as the player drags.
- **Visual feedback:** Selected letters highlight in a distinct color as the player drags. A confirmed correct word highlights permanently in a different color (each word gets a unique color from a fixed palette). An incorrect attempt briefly flashes red and resets.
- **Direction lock:** Once a player begins selecting in a direction (e.g., horizontal), the selection snaps to that axis/diagonal, preventing accidental diagonal mis-selections.

### 3.5 Win State & Reveal

When the final word is found:

1. **Pause (0.5s)** — brief beat, player registers they've finished.
2. **Grid animation** — letters that are not part of the dish name animate away or fade. The grid transitions (dissolve, or gentle scatter). Duration: ~1.5 seconds.
3. **Illustration reveal** — a full-bleed or card-style illustration of the completed dish appears. Art style: warm, editorial illustration (think New Yorker food illustration, or a Penguin cookbook cover). Not photorealistic.
4. **Dish name appears** — large, clean typography. E.g., "Cacio e Pepe"
5. **Completion card** — below the illustration:
   - "You cooked it in [X] minutes." (or move count if time feels punishing)
   - Recipe link button: "See the full recipe →" (links to external recipe source, or internal recipe page)
   - Share button (see Section 5.2)
   - "Come back tomorrow for a new dish 🍴"

---

## 4. Content Pipeline

### 4.1 Puzzle Structure

Each puzzle is a JSON object (or equivalent data record) with the following fields:

```json
{
  "id": "2026-04-03",
  "dish_name": "Cacio e Pepe",
  "dish_display_name": "Cacio e Pepe",
  "cuisine": "Italian",
  "difficulty": "medium",
  "words": [
    { "word": "PECORINO", "emoji": "🧀", "display": "Pecorino Romano" },
    { "word": "PASTA", "emoji": "🍝", "display": "Pasta" },
    { "word": "PEPPER", "emoji": "🌶️", "display": "Black Pepper" },
    { "word": "GUANCIALE", "emoji": "🥩", "display": "Guanciale" },
    { "word": "OLIVEOIL", "emoji": "🫒", "display": "Olive Oil" },
    { "word": "SALT", "emoji": "🧂", "display": "Salt" }
  ],
  "recipe_url": "https://...",
  "illustration_asset": "cacio-e-pepe.png",
  "grid": null  // generated at build time by puzzle generator
}
```

### 4.2 Puzzle Generator

A build-time script (not runtime) that:
- Takes a word list as input
- Places words in a grid (8-direction placement) with no overlaps and no empty cells
- Validates that every cell is covered
- Outputs the final grid as a 2D array of letters + word placement metadata (start position, direction, word ID)
- Fails loudly if a valid no-remainder grid cannot be constructed (content team must adjust word list)

The generator should make multiple attempts with different random seeds before failing, to maximize success rate.

### 4.3 Content Cadence

- One puzzle per day, published at midnight local time (or UTC, TBD).
- Minimum content buffer at launch: **30 days of puzzles pre-built**.
- Puzzle variety targets: rotate across cuisines, avoid repeating a cuisine in the same week, mix difficulty.
- Each puzzle requires: word list, recipe URL, illustration asset.

### 4.4 Illustration Strategy

- Each dish requires one illustration. Style must be consistent across all puzzles.
- **Recommended approach for v1:** Commission a set of 60–90 illustrations upfront (enough for 2–3 months), in a consistent editorial illustration style. Use a single illustrator or tight style guide.
- Illustration format: square or 4:3, minimum 800×800px, PNG or SVG.
- **Future option:** Generative illustration (stable diffusion or similar) with consistent style prompting. Not recommended for v1 due to quality consistency risk.

---

## 5. Product Features

### 5.1 Daily Puzzle

- One puzzle available per calendar day.
- Puzzle resets at midnight (behavior: the current day's puzzle persists until the player completes it or the next day begins — do not force-reset mid-session).
- Puzzle state is persisted in `localStorage` so players can leave and return mid-puzzle.
- Players cannot replay today's puzzle after completing it (show the completion card again if they return).
- **No archive in v1.** Future feature.

### 5.2 Sharing

Share output is a text string (emoji-based, in the style of Wordle), plus an optional image of the completion card.

**Text share format:**
```
Mise en Place — April 3, 2026
🍝 Cacio e Pepe
🧀🍝🌶️🥩🫒🧂
Found all 6 ingredients in 2:47
mise-en-place.app
```

- Share button triggers native share sheet on mobile (Web Share API), falls back to clipboard copy on desktop.
- Optional: Open Graph / social meta tags so that sharing the URL renders the dish illustration as a preview card.

### 5.3 Streak & Stats (v1 — lightweight)

Track in localStorage:
- Current streak (consecutive days played)
- Total puzzles completed
- Average completion time

Display on a simple stats modal (accessible from the header). No account/login required in v1.

### 5.4 How to Play

- First-time players see a brief onboarding overlay (3 slides max):
  1. "Find the hidden ingredients" — shows a small example grid with one word highlighted
  2. "Use the emoji clues" — shows the clue panel
  3. "Reveal the dish" — shows the win card animation concept
- "Skip" option always available. Onboarding state persisted in localStorage.

### 5.5 Header / Navigation

Minimal header:
- Game logo / wordmark (left)
- Stats icon (center or right)
- Help/How to Play icon (right)
- No nav menu in v1

---

## 6. Technical Specification

### 6.1 Platform

- **Target:** Browser-based, mobile-first, responsive.
- **Framework:** React (recommended for component state management and animation control).
- **Styling:** Tailwind CSS or CSS Modules. Design tokens for color palette and typography.
- **Hosting:** Static site (Vercel, Netlify, or equivalent). No backend required for v1.
- **Data:** Puzzle data loaded as static JSON files, one per date. Bundled at build time or fetched from a CDN path (e.g., `/puzzles/2026-04-03.json`).

### 6.2 State Management

All game state lives in React component state + localStorage. No server-side session.

**localStorage keys:**
```
mise_puzzle_[date]_state     → { foundWords: [], gridHighlights: [], startTime, endTime }
mise_stats                   → { streak, lastPlayed, totalPlayed, totalTime }
mise_onboarding_complete     → boolean
```

### 6.3 Grid Rendering

- Grid rendered as a CSS Grid or SVG.
- Each cell is a fixed-size square. On mobile, cells should be at minimum 40×40px tap targets.
- Selection state tracked as `{ startCell, currentCell, direction }`.
- Highlighting rendered as a colored overlay per found word (each word gets a color from a fixed 10-color accessible palette).

### 6.4 Animation

- Word found: brief scale pop on found letters + emoji activation in clue panel.
- Win sequence: CSS transition or Framer Motion animation. Grid fades out, illustration fades in over ~1.5s. Dish name slides up.
- Keep all animations under 200KB in added library weight if using a library; prefer CSS transitions where possible.

### 6.5 Performance

- Target: Lighthouse score ≥ 90 on mobile.
- Puzzle JSON files: < 5KB each.
- Illustration assets: optimized WebP, < 150KB each.
- No analytics or tracking scripts in v1 (keeps load fast and avoids GDPR complexity).

### 6.6 Accessibility

- All interactive elements keyboard-accessible (Tab, Arrow keys, Enter to confirm selection).
- Color is never the only indicator of state — found words also show a checkmark or label.
- Minimum contrast ratio 4.5:1 for all text.
- `aria-label` on all icon buttons.

---

## 7. Design Direction

### 7.1 Visual Identity

- **Palette:** Warm neutrals (cream, warm white) with food-adjacent accent colors (terracotta, sage, saffron yellow). Avoid cold blues/grays.
- **Typography:** A humanist sans-serif for UI (e.g., Inter, DM Sans). A slightly editorial serif for the dish name reveal (e.g., Playfair Display, Freight Text). Letter grid uses a clean monospaced or tabular font.
- **Tone:** Warm, confident, adult. Not cute/childish. Think: a well-designed cookbook, not a kids' food app.

### 7.2 Illustration Style

- Editorial, hand-illustrated feel. Warm color palette consistent with brand.
- Top-down ("flat lay") or three-quarter view of plated dish.
- No photorealism. No AI-generated art (for v1 — brand consistency risk).

---

## 8. Success Metrics

| Metric | Target (30 days post-launch) |
|---|---|
| Day 1 retention | ≥ 40% |
| Day 7 retention | ≥ 20% |
| Puzzle completion rate | ≥ 70% of sessions started |
| Share rate (of completions) | ≥ 15% |
| Average session length | 2–5 minutes |
| Streak ≥ 7 days (% of active users) | ≥ 10% |

---

## 9. Out of Scope (v1)

The following are explicitly deferred to future versions:

- **User accounts / login** — all state is local only
- **Puzzle archive** — no replaying past puzzles
- **Difficulty modes** — one difficulty per day
- **Restaurant / brand partnership puzzles** (Philly 76 concept, etc.) — strong future expansion but not v1
- **Native mobile app** — browser only
- **Multiplayer / race mode**
- **Accessibility language translations**
- **Monetization** (ads, subscriptions) — build the audience first

---

## 10. Open Questions

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | What is the canonical name / URL of the product? | Product | High |
| 2 | Where do recipe links point? (Internal pages vs. external NYT Cooking / Food52 / etc.) | Content | High |
| 3 | What is the illustration commissioning budget and timeline? | Design / Finance | High |
| 4 | How is the puzzle content calendar managed? (Spreadsheet, CMS, flat files?) | Content | Medium |
| 5 | Should completion time be shown in sharing output? (Some players may feel embarrassed by slow times) | Product | Medium |
| 6 | What happens when a player visits on a day with no puzzle published? (Need a fallback/buffer state) | Engineering | Medium |
| 7 | Do we want a "give up / reveal" option? (Risk: undermines streak integrity) | Product | Low |
| 8 | Grid generator: what is the fallback if a valid all-covered grid can't be constructed for a given word list? | Engineering | Low |

---

## 11. Future Expansion Concepts

- **Restaurant Mode:** Partner with restaurants (e.g., Philly 76 concept). Words are dishes, reveal is the restaurant. Could be sponsored content.
- **Cuisine Weeks:** A week-long series of puzzles all from one cuisine, culminating in a multi-course "menu" reveal.
- **Difficulty Tiers:** "Prep Cook" (emoji + word count shown), "Chef" (emoji only), "Sous Vide" (no clues).
- **Seasonal / Holiday puzzles:** Thanksgiving week, Lunar New Year, etc.
- **Recipe integration:** In-app recipe viewer rather than external link, with ingredient checklist.

---

*End of Document*
