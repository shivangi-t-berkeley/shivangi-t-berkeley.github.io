# Change Log

This file tracks changes made after the original [PRD](./PRD.md).

Use it like this:
- Treat `PRD.md` as the original product intent.
- Treat this file as the delta from that intent.
- Read `Baseline Snapshot` first, then the dated changes below it.

## Baseline Snapshot
Status as of 2026-03-18 before the entries below.

Implemented:
- Static daily puzzle prototype with hardcoded puzzle data in JSON.
- Narrative game screen with clue reveal flow, previous clues list, progress bar, answer commit modal, win/loss states, stats modal, help modal, share text, and already-played state.
- Local persistence with `localStorage` for today’s puzzle state and aggregate stats.
- Daily puzzle selection from the local puzzle set.
- Answer entry via dropdown-based answer grid.

Not yet implemented relative to the PRD:
- React and Tailwind stack. The app is currently plain HTML, CSS, and JavaScript.
- Backend or editorial puzzle pipeline.
- 30 authored launch puzzles. The prototype currently ships with 3.
- Binary elimination grid as the only grid model. The original prototype used only dropdowns.

## 2026-03-18

### Change: Clue interval increased from 12 seconds to 30 seconds
Files:
- `js/script.js`

What changed:
- Each clue now stays on screen for 30 seconds before the next clue appears.

How this changes the PRD:
- PRD Section 2.2 says clues appear every 12 seconds. The live prototype now uses 30 seconds instead.
- PRD Section 4.4 describes a progress bar that depletes over 12 seconds. The live prototype now depletes over 30 seconds.

Why it matters:
- The play session is less tense and gives players more time to reason before the next clue appears.

Status:
- Implemented.

### Change: Added quick case illustrations to the briefing screen
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- Each case briefing now includes a lightweight illustration between the case title and the summary.
- The illustrations are rendered as inline SVG scenes keyed to the current puzzle, so each case gets a distinct visual without requiring external image assets.

How this changes the PRD:
- This is a presentation upgrade not covered in the original PRD.
- It does not change the game loop or puzzle logic.

Why it matters:
- The case briefing now feels more like an authored story setup instead of a plain text handoff.
- The illustration gives each daily puzzle a stronger identity before the player starts solving.

Status:
- Implemented.

### Change: Added solve confetti and a temporary demo-only tutorial replay on `Start Solving`
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- Solving a case correctly now triggers a short confetti burst over the result transition.
- Clicking `Start Solving` now opens the tutorial modal again before the live case begins.
- Closing that tutorial after the start button now drops the player directly into the active puzzle and starts the timer.

How this changes the PRD:
- Confetti is a polish feature that is not described in the original PRD, but it does not change the core loop.
- Reopening the tutorial from `Start Solving` is a temporary demo-specific divergence from the intended onboarding flow.

Why it matters:
- A correct solve now has a clearer celebration moment.
- The demo flow gives you one more guided explanation beat right before gameplay begins.

Status:
- Implemented.

### Change: Added a pre-case start screen and made the clue rail scroll inside its own container
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- A fresh puzzle now opens in three stages:
- first-launch tutorial
- case briefing screen with the summary and a `Start Solving` button
- live solving view with the grid and clues
- The overall timer no longer starts on page load for a new run. It begins when the player starts the case.
- The clue panel now has a capped height and scrolls internally, so the active solving view stays more compact on mobile.

How this changes the PRD:
- The PRD describes entering the daily puzzle directly. The live prototype now adds a briefing step before active play begins.
- The timer behavior is more player-controlled than the original current-state build because it starts at the start of solving, not at initial load.

Why it matters:
- New players get a cleaner onboarding flow: learn, read the case, then begin.
- Mobile has a better chance of keeping both the grid and clue rail within the same viewport.
- The timer now feels fairer because it reflects solving time rather than page-load time.

Status:
- Implemented.

### Change: Rebalanced the board for readability on mobile and widened the desktop shell
Files:
- `css/styles.css`
- `js/script.js`

What changed:
- The app shell is now wider on desktop so the grid and clue rail have more room to coexist.
- The L-grid now uses a shared sizing system with smaller, cleaner headers and vertical column labels to reduce width without shrinking the tap targets too far.
- Mobile spacing was reworked so the board, clue list, and surrounding panels stack more cleanly.
- The clue list on the right no longer uses full cards; it now keeps the large numbered circles while dropping the heavy boxes around each clue.

How this changes the PRD:
- This does not change the feature set.
- It significantly changes the presentation and responsive behavior of the core game board.

Why it matters:
- The board is easier to read without forcing the clues offscreen.
- Desktop has enough width to support the three-grid layout more comfortably.
- Mobile now prioritizes legibility instead of compressing the board until the labels stop making sense.

Status:
- Implemented.

### Change: Brought the clue stack back to the right by compacting the L grid
Files:
- `css/styles.css`
- `js/script.js`

What changed:
- The main play area now uses a two-column desktop layout again, with the L-shaped grid on the left and the clues on the right.
- The grid cells, headers, and row labels were reduced in size so the attached three-grid board fits without demanding horizontal scroll.
- The clue panel is now pinned near the top on larger screens so the case file stays visible while the player works through the board.

How this changes the PRD:
- This does not materially change scope or feature behavior.
- It changes the presentation of the core solving layout so clues and grid are visible together again on desktop.

Why it matters:
- The player no longer has to choose between seeing the clues and seeing the board.
- Direct clue reference is easier because the clue stack sits beside the active workspace.
- The smaller board preserves the classic three-grid structure without overwhelming the page width.

Status:
- Implemented.

### Change: Restored the third grid and reshaped the board into a classic L
Files:
- `css/styles.css`
- `js/script.js`

What changed:
- The puzzle board now includes all three logical pairings again:
- `People × Category A`
- `People × Category B`
- `Category B × Category A`
- Those three boards are now rendered as one attached L-shaped case map instead of a vertical stack.
- The clue list stays underneath the board, and the board is centered in the play area.
- Tutorial copy was updated so it no longer refers to “two boards.”

How this changes the PRD:
- The PRD’s v1 recommendation was to keep the solving UI simple and avoid a full classic zebra-grid layout.
- The live prototype now leans further toward a traditional logic-puzzle board than the original PRD intended.
- This change supersedes the earlier “vertical attached board” layout note. The current live layout is an L-shaped three-grid board.

Why it matters:
- Direct relationship clues like `Dawkins -> Wings` now have a visible place on the board instead of being implied through the People rows only.
- The board better matches the way experienced logic-puzzle players expect to reason across dimensions.
- Centering the L grid and moving clues below it gives the layout enough room without forcing the board to collapse again.

Status:
- Implemented.

### Change: Fixed a contradiction in Puzzle #1 clue text
Files:
- `js/puzzles.js`

What changed:
- The clue `Marcus has never been to Chestnut Hill in his life.` was replaced with `Marcus has never been to Passyunk in his life.`

How this changes the PRD:
- PRD Section 2.1 requires a unique, logically valid solution.
- The previous clue text made Puzzle #1 contradictory because it forced Marcus away from both Fishtown and Chestnut Hill while another clue already placed Yusuf in Passyunk.
- The corrected clue restores consistency with the puzzle’s intended solution.

Why it matters:
- The puzzle can now be solved without running into an impossible state caused by the authored clues.

Status:
- Implemented.

### Change: Reduced the logic workspace from 3 boards to 2 boards
Files:
- `js/script.js`

What changed:
- The app now renders only the two `People × Category` boards.
- The `Category × Category` deduction board has been removed.

How this changes the PRD:
- PRD Section 2.4 does not define a classic multi-board layout, but the current prototype had expanded to three boards to mimic a full logic grid.
- The live prototype now uses the minimum board set needed to solve and submit the puzzle.
- This keeps the classic marking interaction while reducing visual complexity.

Why it matters:
- The interface is simpler and easier to scan.
- Players still have enough structure to solve the puzzle because final answers are person-to-category assignments.

Status:
- Implemented.

### Change: Moved clues and grid into the same play-area fold
Files:
- `index.html`
- `css/styles.css`

What changed:
- The clue card and logic grid now sit in the same play area instead of stacking as separate long sections.
- On wider screens, clues and grid appear side by side.
- On smaller screens, the layout still collapses to a single column.

How this changes the PRD:
- PRD Section 3.2 presents a vertically stacked mobile-first layout.
- The live prototype now uses a more compact two-column desktop layout while preserving the same content blocks.

Why it matters:
- Players can read the current clue and interact with the grid without scrolling between them as often.
- The main puzzle interaction is more likely to fit within one screen view.

Status:
- Implemented.

### Change: Removed the timer and switched to clue reveals with score tradeoffs
Files:
- `index.html`
- `js/script.js`

What changed:
- The countdown timer and automatic clue cadence have been removed.
- Each puzzle now starts with 3 clues open immediately.
- The remaining clues stay sealed behind blurred reveal cards.
- The player can reveal the next clue manually, but each reveal lowers the score they can still earn.

How this changes the PRD:
- PRD Section 2.2 says clues appear one at a time every 12 seconds.
- The live prototype no longer uses timed clue reveals.
- The PRD score model still exists, but clue count is now controlled by player choice rather than elapsed time.
- PRD Section 4.4 describes a timer progress bar. That mechanic has been removed from the live prototype.

Why it matters:
- The pressure now comes from information sacrifice rather than a countdown clock.
- Players can think at their own pace while still making meaningful scoring tradeoffs.

Status:
- Implemented.

### Change: Removed manual submit and switched to automatic evaluation on full grid completion
Files:
- `index.html`
- `js/script.js`

What changed:
- The submit button and commit confirmation flow have been removed.
- As soon as the two logic boards contain a full answer, the app evaluates the case automatically.

How this changes the PRD:
- PRD Section 2.5 defines an explicit “I’ve got it” commit flow with confirmation.
- The live prototype no longer uses manual commit.
- The tension mechanic now depends on whether the player reveals more clues before they finish the grid, not on when they press a button.

Why it matters:
- The interaction is simpler and more direct.
- The solving board is now the only meaningful input surface from start to finish.

Status:
- Implemented.

### Change: Reframed the app copy around a reporter chasing a case
Files:
- `index.html`
- `js/puzzles.js`
- `js/script.js`

What changed:
- The app language now frames the puzzle as a reporter working a live case.
- Puzzle titles and narratives were rewritten to feel dramatic and investigative.
- Result copy and help copy now speak in terms of cases, leads, files, and publishing pressure.

How this changes the PRD:
- PRD Sections 1, 4.1, and 6 describe a warm, witty, neighborhood-gossip tone.
- The live prototype now leans into a higher-stakes newsroom tone instead.
- The Philadelphia setting remains, but the narrative framing is more dramatic than the original PRD tone.

Why it matters:
- The product voice now matches the higher-pressure gameplay direction.
- The clue and reveal mechanics feel more coherent when framed as a live investigation.

Status:
- Implemented.

### Change: Added a replay button for local testing
Files:
- `index.html`
- `js/script.js`

What changed:
- A replay button now appears in the header and on the finished-state screens.
- Replay resets today’s puzzle state back to a fresh run of the same case.
- Aggregate stats are left intact.

How this changes the PRD:
- PRD Section 3.1 includes an “Already Played” state meant to lock the player out after completion.
- The live prototype now includes a local testing escape hatch that bypasses that lockout.
- This is a development/testing affordance rather than a product-facing gameplay change.

Why it matters:
- You can iterate on the puzzle flow without waiting for the daily reset or manually clearing storage.

Status:
- Implemented.

### Change: Removed clue hiding and made all clues visible at once
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The blurred reveal-bar mechanic has been removed.
- All clues now appear at once in distinct clue cards.
- Clues are visually boxed instead of rendered as a simple running list.

How this changes the PRD:
- PRD Section 2.2 describes clues arriving one at a time.
- The live prototype now exposes the full case file from the start.
- This supersedes the earlier post-PRD experiment where clues were partially hidden behind manual reveal gates.

Why it matters:
- The puzzle is now actually solvable from the opening state, without forcing extra reveal actions.
- The clue area reads more like a case board than a transcript.

Status:
- Implemented.

### Change: Replaced clue-based pressure with one overall solve timer
Files:
- `index.html`
- `js/script.js`

What changed:
- A single running case timer now starts at the beginning of the puzzle.
- The timer stops automatically when the logic boards are complete.
- Score is now based on solve time rather than clue count.

How this changes the PRD:
- PRD Sections 2.2 and 2.3 define clue-timing pressure and clue-threshold scoring.
- The live prototype now uses full-information timed play instead.
- This also supersedes the earlier post-PRD version that removed timers entirely.

Why it matters:
- The puzzle keeps urgency without hiding necessary information.
- The score now reflects how quickly the player solves the full visible case.

Status:
- Implemented.

### Change: Reworked the help modal into a tutorial and auto-opened it on first launch
Files:
- `index.html`
- `js/script.js`

What changed:
- The help modal now uses guided step-by-step tutorial copy instead of changelog-style instructions.
- On first launch, the tutorial opens automatically.
- The case timer pauses while the tutorial modal is open and resumes when it closes.

How this changes the PRD:
- PRD Section 3.1 includes a “How to Play” modal, but does not define onboarding behavior in detail.
- The live prototype now treats that modal as a real first-run tutorial instead of a static help sheet.

Why it matters:
- New players get an actual walkthrough of the grid, the timer, and the automatic evaluation flow.
- Opening guidance no longer feels like internal product documentation leaking into the UI.

Status:
- Implemented.

### Change: Fixed daily puzzle selection to use local date instead of UTC date
Files:
- `js/script.js`

What changed:
- The app now computes “today” from the player’s local calendar date.
- It no longer uses `toISOString()` to derive the puzzle date key.

How this changes the PRD:
- PRD Section 2.1 says the puzzle resets daily.
- The live prototype now interprets “daily” in local time, which is the expected player-facing behavior.

Why it matters:
- Players in time zones behind UTC will no longer see tomorrow’s puzzle early in the evening.
- March 19 and March 20 now resolve correctly as separate local-day puzzles.

Status:
- Implemented.

### Change: Clarified result-screen diff messaging
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The result and already-played screens now explicitly say that the grid shows the verified solution.
- On failed runs, the UI now explains that red means the player’s submitted match for that slot was different.

How this changes the PRD:
- PRD Section 2.5 and Section 3.4 call for the correct solution to be revealed with diff highlighting.
- The live prototype still does that, but now explains the meaning of the highlighting more clearly.

Why it matters:
- Players no longer have to guess whether the result screen is showing their own answer or the actual solution.

Status:
- Implemented.

### Change: Corrected Puzzle #3’s authored solution and invalidated stale saved state
Files:
- `js/puzzles.js`
- `js/script.js`

What changed:
- Puzzle #3’s stored solution was corrected from the wrong `Nina -> Dawkins -> Wings / Omar -> Kelce -> Sausage` mapping to the logically valid one.
- The app now stores a `puzzleVersion` with daily state and resets saved state automatically when a puzzle’s authored version changes.

How this changes the PRD:
- PRD Section 2.1 requires a unique correct solution.
- The live prototype previously had a bad source-of-truth for Puzzle #3 even though the clues pointed elsewhere.
- The version check is an implementation safeguard so content fixes propagate cleanly to players.

Why it matters:
- The result screen now reflects the actual clue-consistent answer.
- A player who already loaded or finished the broken puzzle will no longer stay stuck on stale incorrect local data after the fix.

Status:
- Implemented.

### Change: Polished tutorial modal spacing and step cues
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The tutorial now shows an explicit `Step X of Y` label.
- Extra spacing was added between the tutorial content and the action row.
- The back button is hidden on the first step instead of showing as a dead control.

How this changes the PRD:
- This does not change product scope. It improves the usability of the existing tutorial flow.

Why it matters:
- The tutorial now reads like an actual guided sequence instead of a generic modal with unlabeled pages.
- The action row feels cleaner and less confusing on the first step.

Status:
- Implemented.

### Change: Rewrote tutorial copy around first-time player needs
Files:
- `js/script.js`

What changed:
- The tutorial language was rewritten to focus on what the player should do and why.
- Copy that referenced prior prototype mechanics or internal product context was removed.

How this changes the PRD:
- This does not change product scope. It improves onboarding clarity.

Why it matters:
- First-time players now see task-oriented guidance instead of wording that assumes knowledge of earlier versions of the app.
- The tutorial now explains the grid, the clues, and the timer in more direct player language.

Status:
- Implemented.

### Change: Combined the two logic boards into one attached grid and moved clues to the right
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The two separate `People × Category` boards now render as one connected grid with grouped category columns.
- The clue panel now sits on the right side of the play area on wider screens.

How this changes the PRD:
- PRD Section 3.2 shows clues above the grid, but does not prescribe a connected multi-block logic layout.
- The live prototype now uses a more newspaper-style attached board inspired by classic logic-grid formats.

Why it matters:
- The puzzle feels like one continuous solving surface instead of two independent widgets.
- The clues and grid now read more like a single workbench.

Status:
- Implemented.

### Change: Switched to a vertical attached board, neutral clue cards, and a new type system
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The connected board now stacks category sections vertically to avoid horizontal scrolling.
- The clue cards no longer use red/blue importance styling; all clues are presented with equal weight.
- The grid section heading and body copy were restyled to avoid awkward alignment.
- The clock now uses a timer icon with the stakes displayed next to it.
- The app now uses `Lora` for headings and `Manrope` for body text.

How this changes the PRD:
- This does not materially change feature scope.
- It significantly changes the visual presentation and hierarchy of the solving interface.

Why it matters:
- The board is easier to use without horizontal scrolling.
- The timer and stakes now read as one connected scoring system.
- The page typography and section layout feel more deliberate and easier to scan.

Status:
- Implemented.

### Change: Added tick/cross elimination boards alongside the answer grid
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The app now includes an elimination board for each category.
- Each square cycles through three note states: blank, `X`, and `✓`.
- A tick updates the matching answer dropdown for that person and category.
- Elimination notes are saved in `localStorage` with the rest of the daily puzzle state.

How this changes the PRD:
- PRD Section 2.4 recommends a dropdown answer model for v1 and describes a binary elimination grid as an alternative with a higher learning curve.
- The live prototype is now a hybrid model:
  - Dropdowns still power the committed answer.
  - Elimination boards support logic note-taking during play.
- PRD Section 7 marks the elimination grid as out of scope for v1. That is no longer true for the prototype.
- PRD Section 5.2 does not include elimination-note state. The live prototype now stores note state as part of today’s game state.

Why it matters:
- Players can record deductions as they go instead of relying on memory.
- The app now better supports classic logic-puzzle play patterns without removing the lower-friction answer-entry flow.

Status:
- Implemented.

### Change: Replaced the separate dropdown answer grid with a single unified logic grid
Files:
- `index.html`
- `css/styles.css`
- `js/script.js`

What changed:
- The standalone answer grid has been removed.
- The main logic grid is now the only puzzle workspace.
- The player’s answer is inferred from `✓` marks in the People-to-Category boards.
- Category-to-category boards remain available as deduction support, similar to a classic logic-puzzle layout.

How this changes the PRD:
- PRD Section 2.4 describes a dropdown answer grid as the recommended v1 input model.
- The live prototype no longer uses dropdown answer entry.
- The prototype now behaves more like a classic zebra-puzzle board, with one grid serving both deduction and answer submission.
- This change supersedes the previous “hybrid model” note above. The current live model is a unified logic grid.

Why it matters:
- The solving interface is more coherent because the player no longer has to maintain both notes and answers in separate places.
- The app now matches the interaction style shown in the reference image more closely than the original PRD.

Status:
- Implemented.
