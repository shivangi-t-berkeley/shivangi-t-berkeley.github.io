# Product Requirements Document
## "Who Did What Now?" — Daily Philadelphia Speed Logic Puzzle
### For: The Philadelphia Inquirer
### Version: 1.0 | Status: Draft

---

## 1. Overview

"Who Did What Now?" is a daily speed logic puzzle with a Philadelphia narrative framing. Players are presented with a deduction puzzle — assign items across categories to people — and must commit to an answer as clues are revealed one at a time. The fewer clues seen before committing, the higher the score. The puzzle is solvable in under 2 minutes, resets daily, and is shareable.

The tone is warm and witty — each puzzle is a tiny Philly vignette. Five regulars at a South Philly bar. Four vendors at Reading Terminal. Three neighbors on a Fishtown block. The logic is the game; the Philly flavor is the skin.

---

## 2. Game Design Specification

### 2.1 Puzzle Structure

Each puzzle has:
- **3 categories** with **3 items each** (3×3×3 grid)
- **6–8 clues** total, ordered from least to most revealing
- A **minimum solvable clue set** of 3–4 clues (puzzle cannot be solved by logic alone with fewer)
- A **unique solution** (verified at authoring time)

Example puzzle:

> Three Philadelphians — Marcus, Diane, and Yusuf — each have a different favorite neighborhood (Fishtown, Passyunk, Chestnut Hill) and a different go-to order at their local spot (cheesesteak, hoagie, soft pretzel).

Clues (in reveal order):
1. Marcus doesn't live in Fishtown.
2. The person who orders the soft pretzel lives in Chestnut Hill.
3. Diane's favorite order is not the hoagie.
4. Yusuf lives in Passyunk.
5. The Fishtown regular always gets the cheesesteak. ← puzzle solvable here
6. Marcus has never been to Chestnut Hill in his life. ← confirmation / redundant

### 2.2 Core Mechanic

- Clues appear **one at a time**, every **12 seconds**
- Player fills in the deduction grid as clues arrive
- At any point, player can hit **"I've got it"** to lock in their current answer
- If correct: score awarded based on how many clues were seen
- If incorrect: no score, but the correct solution is revealed (no second chances)
- If time runs out (all clues shown + 15 second grace period): player can still submit for a minimum score

### 2.3 Scoring

| Clues seen when committed | Score |
|---|---|
| 3 (minimum solvable) | 100 pts |
| 4 | 80 pts |
| 5 | 60 pts |
| 6 | 40 pts |
| 7+ or grace period | 20 pts |
| Incorrect answer | 0 pts |

Score is fixed per clue threshold — no continuous decay in v1. This avoids tuning complexity while preserving the commitment pressure.

### 2.4 The Deduction Grid

A simple interactive grid where rows = people, columns = categories. Each cell is a dropdown or tap-to-cycle selector. Player doesn't need to fill every cell before committing — partial grids are accepted, and the game checks the full solution against the submitted state.

```
           Neighborhood     Order
Marcus     [ Fishtown ▾]   [ Hoagie  ▾]
Diane      [ Passyunk ▾]   [ Pretzel ▾]
Yusuf      [Ch. Hill  ▾]   [ Steak   ▾]
```

Alternatively: a **binary elimination grid** (classic zebra-puzzle style) where players mark ✅ or ❌ per cell. Friendlier for logic puzzle veterans but higher learning curve for casual players. Recommend the **dropdown model for v1** — lower friction.

### 2.5 Commit Flow

1. Player clicks "I've got it" 
2. Brief confirmation: "You've seen 4 clues. Lock it in?" with Yes / Keep watching
3. On Yes: grid freezes, solution checked immediately
4. Correct → Win screen
5. Incorrect → Loss screen with correct solution revealed, diff highlighting showing where player went wrong

### 2.6 No Second Chances
A wrong committed answer ends the game. This preserves the tension of the commitment mechanic — if players could retry, the risk evaporates.

---

## 3. Screens & UI

### 3.1 Screen List
1. Game Screen (main)
2. Win Screen
3. Loss Screen
4. Stats Panel
5. How to Play Modal
6. Already Played State

### 3.2 Game Screen Layout

```
┌──────────────────────────────────────┐
│  🥨 Who Did What Now?   [?]  [📊]   │
│  Philadelphia Inquirer               │
├──────────────────────────────────────┤
│                                      │
│  Puzzle #8 · May 14                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Three Philadelphians walked    │  │
│  │ into Del Frisco's...           │  │
│  └────────────────────────────────┘  │
│                                      │
│  CLUE 3 OF 8                ⏱ 0:24  │  ← clue counter + elapsed time
│  ┌────────────────────────────────┐  │
│  │ 💡 Diane's favorite order is  │  │
│  │    not the hoagie.             │  │
│  └────────────────────────────────┘  │
│                                      │
│  Previous clues (collapsed):        │
│  1. Marcus doesn't live in Fishtown │
│  2. Soft pretzel → Chestnut Hill    │
│                                      │
│        DEDUCTION GRID               │
│  ┌──────────┬───────────┬────────┐  │
│  │          │ 'Hood     │ Order  │  │
│  ├──────────┼───────────┼────────┤  │
│  │ Marcus   │ [      ▾] │ [   ▾] │  │
│  │ Diane    │ [      ▾] │ [   ▾] │  │
│  │ Yusuf    │ [      ▾] │ [   ▾] │  │
│  └──────────┴───────────┴────────┘  │
│                                      │
│  [ 💡 Keep watching ]               │
│  [ ✅ I've got it   ] ← primary CTA │
│                                      │
└──────────────────────────────────────┘
```

### 3.3 Win Screen

```
┌──────────────────────────────────────┐
│         🥨 Jawn, you got it!         │
│                                      │
│   Solved with 4 clues — 80 pts      │
│                                      │
│   Marcus · Passyunk · Hoagie        │
│   Diane  · Chestnut Hill · Pretzel  │
│   Yusuf  · Fishtown · Cheesesteak   │
│                                      │
│   [ 📤 Share ]   [ 📊 My Stats ]   │
│                                      │
│   Next puzzle in  11:42:07          │
└──────────────────────────────────────┘
```

### 3.4 Loss Screen

```
┌──────────────────────────────────────┐
│       😬 Not quite, jawn.            │
│                                      │
│   Here's what actually happened:    │
│                                      │
│   Marcus · Passyunk · Hoagie   ✅   │
│   Diane  · Fishtown · Pretzel  ❌   │  ← diff: red = wrong
│   Yusuf  · Ch. Hill · Steak    ✅   │
│                                      │
│   [ 📤 Share ]   [ 📊 My Stats ]   │
│                                      │
│   Next puzzle in  11:42:07          │
└──────────────────────────────────────┘
```

### 3.5 Share Card

```
🥨 Who Did What Now? #8

Solved in 4 clues — 80 pts 🧠
⬛⬛🟩🟩⬜⬜⬜⬜

inquirer.com/whodidwhatnow
```
*(Green squares = clues seen before commit, gray = unseen)*

### 3.6 Stats Panel
- Puzzles played
- Win rate
- Average clue count at commit
- Current streak / best streak
- Score distribution (bar chart by clue threshold)

---

## 4. Visual Design

### 4.1 Tone
Warm, slightly irreverent — a Philadelphia dinner party, not a courtroom. The puzzle framing should feel like local gossip, not a logic textbook.

### 4.2 Color Palette

| Role | Color | Hex |
|---|---|---|
| Background | Off-white | `#F9F6F0` |
| Card background | White | `#FFFFFF` |
| Primary accent | Phillies red | `#E81828` |
| Secondary accent | Phillies blue | `#002D72` |
| Clue card background | Pale blue | `#EEF2F8` |
| Correct highlight | Green | `#2E7D32` |
| Incorrect highlight | Red | `#C62828` |
| Text primary | Near-black | `#1A1A1A` |

### 4.3 Clue Reveal Animation
Each new clue card slides in from the right (200ms ease-out) and the previous clue collapses into the "previous clues" list. Keeps focus on the current clue without losing history.

### 4.4 Timer
A subtle progress bar under the clue card depletes over 12 seconds, signaling the next clue is coming. Does not count down numerically — avoids anxiety, maintains tension.

---

## 5. Technical Requirements

### 5.1 Tech Stack
- React, Tailwind CSS
- `localStorage` for daily state and stats
- No backend required for prototype — puzzles hardcoded as JSON

### 5.2 Game State Shape

```javascript
{
  puzzleId: number,
  date: string,
  status: "watching" | "committed" | "solved" | "failed",
  cluesSeen: number,
  currentClueIndex: number,
  grid: {
    [personId]: {
      [categoryId]: string | null  // selected item or null
    }
  },
  commitTime: number | null,
  score: number | null,
  timerHandle: null  // interval ref, not persisted
}
```

### 5.3 Puzzle Data Format

```javascript
{
  id: 8,
  date: "2025-05-14",
  title: "Del Frisco's, 6pm",
  narrative: "Three Philadelphians walked into Del Frisco's on a Tuesday. Each came from a different neighborhood. Each ordered something different. Nothing about this was unusual.",
  people: ["Marcus", "Diane", "Yusuf"],
  categories: [
    {
      id: "neighborhood",
      label: "Neighborhood",
      items: ["Fishtown", "Passyunk", "Chestnut Hill"]
    },
    {
      id: "order",
      label: "Order",
      items: ["Cheesesteak", "Hoagie", "Soft Pretzel"]
    }
  ],
  clues: [
    { id: 1, text: "Marcus doesn't live in Fishtown." },
    { id: 2, text: "The person who orders the soft pretzel lives in Chestnut Hill." },
    { id: 3, text: "Diane's favorite order is not the hoagie." },
    { id: 4, text: "Yusuf lives in Passyunk." },
    { id: 5, text: "The Fishtown regular always gets the cheesesteak." },
    { id: 6, text: "Marcus has never been to Chestnut Hill in his life." }
  ],
  minimumSolvableClues: 4,
  solution: {
    Marcus:  { neighborhood: "Passyunk",      order: "Hoagie"       },
    Diane:   { neighborhood: "Chestnut Hill", order: "Soft Pretzel" },
    Yusuf:   { neighborhood: "Fishtown",      order: "Cheesesteak"  }
  }
}
```

### 5.4 Core Logic Functions

```javascript
// Check submitted grid against solution
checkSolution(grid, solution) → { correct: boolean, diff: { [personId]: { [categoryId]: boolean } } }

// Determine score based on clues seen at commit
scoreFromClues(cluesSeen, minimumSolvableClues) → number

// Advance to next clue (called by interval timer)
revealNextClue(state) → newState

// Check if all grid cells are filled (gate on "I've got it" button)
isGridComplete(grid) → boolean
```

### 5.5 localStorage Keys
```
wdwn_stats    → { played, won, streak, bestStreak, avgClues, scoreDistribution }
wdwn_today    → { date, status, cluesSeen, grid, score }
```

---

## 6. Content Guidelines

### 6.1 Puzzle Scenarios
Each puzzle should be a self-contained Philly vignette. Good scenarios:
- Regulars at a neighborhood bar or diner
- Vendors or shoppers at Reading Terminal Market
- Fans at a Phillies or Eagles tailgate
- Neighbors on a block in a named neighborhood
- Contestants at a fictional Philly eating competition

### 6.2 Clue Writing Rules
- Clues must be unambiguous — one valid logical interpretation only
- Order clues from least to most revealing (first clue eliminates one possibility; last clue is near-redundant)
- Write in a casual, Philly-inflected voice ("Yusuf would sooner move to Jersey than order a hoagie")
- Minimum 6 clues, maximum 8
- Always verify: puzzle is NOT solvable with fewer than `minimumSolvableClues`

### 6.3 Naming & Flavor
- Use diverse, realistic Philadelphia names
- Neighborhoods, bars, and venues should be real Philly locations
- Avoid inside jokes that only 5% of readers would get — aim for recognizable Philly touchstones

### 6.4 Launch Content Requirement
- Minimum 30 puzzles authored before launch

---

## 7. Out of Scope (v1)
- Hint system
- Multiple difficulty tiers
- User accounts / cloud sync
- Continuous score decay (fixed thresholds used instead)
- Elimination grid (binary ✅/❌ model) — dropdown only for v1

---

## 8. Open Questions
1. Should the "I've got it" button be disabled until the grid is fully filled, or allow partial commits?
2. Should the clue interval be fixed at 12 seconds or player-adjustable (slow/fast mode)?
3. Is 3×3×3 the right puzzle size, or should some days be 4×3 (4 people, 3 categories) for variety?
4. Should incorrect commits show the diff immediately, or make the player wait until all clues would have been shown?

---

*Document owner: Product / Editorial*
*Version: 1.0 — Prototype spec*
*Last updated: March 2026*
