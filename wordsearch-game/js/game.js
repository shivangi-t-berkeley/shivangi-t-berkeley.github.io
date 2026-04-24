(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────
  const STORAGE_PREFIX = 'mise_';
  const STATS_KEY = STORAGE_PREFIX + 'stats';
  const ONBOARDING_KEY = STORAGE_PREFIX + 'onboarding_complete';

  const WORD_COLORS = [
    'found-0', 'found-1', 'found-2', 'found-3',
    'found-4', 'found-5', 'found-6', 'found-7'
  ];

  const ONBOARDING_STEPS = [
    {
      title: 'Find the hidden ingredients',
      body: 'Every letter in the grid belongs to an ingredient. Click and drag (or swipe) to highlight a word — it can run in any of 8 directions.',
      visual: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" width="180" height="100">
        <rect width="200" height="120" fill="#FAF7F2"/>
        <rect x="4"   y="4"  width="32" height="22" rx="4" fill="#FDF3DC" stroke="#E8A832" stroke-width="1.5"/>
        <text x="20"  y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#1C1814">P</text>
        <rect x="40"  y="4"  width="32" height="22" rx="4" fill="#FDF3DC" stroke="#E8A832" stroke-width="1.5"/>
        <text x="56"  y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#1C1814">A</text>
        <rect x="76"  y="4"  width="32" height="22" rx="4" fill="#FDF3DC" stroke="#E8A832" stroke-width="1.5"/>
        <text x="92"  y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#1C1814">S</text>
        <rect x="112" y="4"  width="32" height="22" rx="4" fill="#FDF3DC" stroke="#E8A832" stroke-width="1.5"/>
        <text x="128" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#1C1814">T</text>
        <rect x="148" y="4"  width="32" height="22" rx="4" fill="#FDF3DC" stroke="#E8A832" stroke-width="1.5"/>
        <text x="164" y="19" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#1C1814">A</text>
        <rect x="4"   y="30" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="20"  y="45" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">O</text>
        <rect x="40"  y="30" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="56"  y="45" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">L</text>
        <rect x="76"  y="30" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="92"  y="45" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">I</text>
        <rect x="112" y="30" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="128" y="45" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">V</text>
        <rect x="148" y="30" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="164" y="45" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">E</text>
        <rect x="4"   y="56" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="20"  y="71" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">B</text>
        <rect x="40"  y="56" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="56"  y="71" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">A</text>
        <rect x="76"  y="56" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="92"  y="71" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">S</text>
        <rect x="112" y="56" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="128" y="71" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">I</text>
        <rect x="148" y="56" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="164" y="71" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">L</text>
        <rect x="4"   y="82" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="20"  y="97" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">S</text>
        <rect x="40"  y="82" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="56"  y="97" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">A</text>
        <rect x="76"  y="82" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="92"  y="97" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">L</text>
        <rect x="112" y="82" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="128" y="97" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65">T</text>
        <rect x="148" y="82" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#E8E2D9" stroke-width="1.5"/>
        <text x="164" y="97" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#7A6F65"> </text>
      </svg>`
    },
    {
      title: 'Use the emoji clues',
      body: 'Each emoji represents one ingredient. Greyed-out means it\'s still hidden. When you find a word, its emoji lights up in full color.',
      visual: `<div style="display:flex;gap:8px;padding:8px;flex-wrap:wrap;justify-content:center">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FDF3DC;border:1.5px solid #E8A832">
          <span style="font-size:1.4rem;filter:grayscale(0)">🧀</span>
          <span style="font-size:0.55rem;color:#1C1814;font-weight:500">Pecorino</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FDF3DC;border:1.5px solid #E8A832">
          <span style="font-size:1.4rem;filter:grayscale(0)">🍝</span>
          <span style="font-size:0.55rem;color:#1C1814;font-weight:500">Pasta</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FAF7F2;border:1.5px solid #E8E2D9">
          <span style="font-size:1.4rem;filter:grayscale(1)">🌶️</span>
          <span style="font-size:0.55rem;color:transparent;font-weight:500">?</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FAF7F2;border:1.5px solid #E8E2D9">
          <span style="font-size:1.4rem;filter:grayscale(1)">🥩</span>
          <span style="font-size:0.55rem;color:transparent;font-weight:500">?</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FAF7F2;border:1.5px solid #E8E2D9">
          <span style="font-size:1.4rem;filter:grayscale(1)">🫒</span>
          <span style="font-size:0.55rem;color:transparent;font-weight:500">?</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:8px;background:#FAF7F2;border:1.5px solid #E8E2D9">
          <span style="font-size:1.4rem;filter:grayscale(1)">🧂</span>
          <span style="font-size:0.55rem;color:transparent;font-weight:500">?</span>
        </div>
      </div>`
    },
    {
      title: 'Reveal the dish',
      body: 'Find all ingredients to reveal what dish you\'ve cooked, plus a link to the full recipe. Come back every day for a new dish!',
      visual: `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px">
        <span style="font-size:3.5rem">🍽️</span>
        <span style="font-family:serif;font-size:1.1rem;font-weight:700;color:#1C1814">Cacio e Pepe</span>
        <span style="font-size:0.75rem;color:#7A6F65">You cooked it in 2:47</span>
      </div>`
    }
  ];

  // ─── State ─────────────────────────────────────────────────────────────────
  let puzzle = null;
  let generatedGrid = null; // { rows, cols, grid, placements }
  let gameState = null;    // { foundWords, startTime, endTime }
  let selState = null;     // { startCell, currentCell, lockedDir, cells }
  let countdownInterval = null;
  let timerInterval = null;

  // ─── DOM refs ─────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const el = {
    gamePanel:       () => $('game-panel'),
    puzzleDate:      () => $('puzzle-date'),
    cluePanel:       () => $('clue-panel'),
    wordGrid:        () => $('word-grid'),
    winOverlay:      () => $('win-overlay'),
    winDishName:     () => $('win-dish-name'),
    winTime:         () => $('win-time'),
    winDishEmoji:    () => $('win-dish-emoji'),
    winFoundEmojis:  () => $('win-found-emojis'),
    recipeLink:      () => $('recipe-link'),
    shareBtn:        () => $('share-btn'),
    winCountdown:    () => $('win-countdown'),
    onboardingModal: () => $('onboarding-modal'),
    onboardingVisual:() => $('onboarding-visual'),
    onboardingTitle: () => $('onboarding-title'),
    onboardingBody:  () => $('onboarding-body'),
    onboardingDots:  () => $('onboarding-dots'),
    onboardingSkip:  () => $('onboarding-skip'),
    onboardingBack:  () => $('onboarding-back'),
    onboardingNext:  () => $('onboarding-next'),
    statsModal:      () => $('stats-modal'),
    statsGrid:       () => $('stats-grid'),
    statsBtn:        () => $('stats-btn'),
    helpBtn:         () => $('help-btn'),
    toast:           () => $('toast'),
  };

  // ─── Utilities ────────────────────────────────────────────────────────────
  function getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDate(dateStr) {
    // "2026-04-03" → "April 3, 2026"
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
  }

  function formatCountdown(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function readStorage(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  }

  function writeStorage(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function deterministicShuffle(arr, seed) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = hashString(seed + String(i)) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // ─── Puzzle Selection ─────────────────────────────────────────────────────
  function getTodaysPuzzle() {
    const today = getTodayDate();
    const exact = PUZZLES.find(p => p.id === today);
    if (exact) return exact;
    const idx = hashString(today) % PUZZLES.length;
    return PUZZLES[idx];
  }

  // ─── State Persistence ────────────────────────────────────────────────────
  function stateKey() {
    return STORAGE_PREFIX + 'puzzle_' + puzzle.id;
  }

  function gridKey() {
    return STORAGE_PREFIX + 'grid_' + puzzle.id;
  }

  function loadOrCreateState() {
    const saved = readStorage(stateKey());
    if (saved && saved.version === 1) {
      gameState = saved;
    } else {
      gameState = {
        version: 1,
        puzzleId: puzzle.id,
        foundWords: [],
        startTime: null,
        endTime: null
      };
    }
  }

  function saveState() {
    writeStorage(stateKey(), gameState);
  }

  // ─── Grid Generation & Caching ────────────────────────────────────────────
  async function getOrGenerateGrid() {
    // Check cache first
    const cached = readStorage(gridKey());
    if (cached && cached.puzzleId === puzzle.id && cached.grid) {
      return cached;
    }
    // Generate asynchronously (won't block the UI)
    const result = await window.MiseGenerator.generatePuzzle(puzzle.words);
    if (!result) {
      console.error('Generator failed for puzzle:', puzzle.id);
      return null;
    }
    const toStore = { puzzleId: puzzle.id, ...result };
    writeStorage(gridKey(), toStore);
    return toStore;
  }

  // ─── Stats ────────────────────────────────────────────────────────────────
  function loadStats() {
    return readStorage(STATS_KEY, {
      version: 1,
      currentStreak: 0,
      lastPlayedDate: null,
      totalPlayed: 0,
      totalTimeMs: 0,
      completedDates: []
    });
  }

  function updateStats() {
    const stats = loadStats();
    const today = puzzle.id;

    if (stats.completedDates.includes(today)) return; // already counted

    stats.completedDates.push(today);
    stats.totalPlayed++;

    const elapsed = gameState.endTime - gameState.startTime;
    stats.totalTimeMs += elapsed;

    // Streak logic
    if (stats.lastPlayedDate) {
      const last = new Date(stats.lastPlayedDate);
      const todayDate = new Date(today);
      const diff = Math.round((todayDate - last) / 86400000);
      if (diff === 1) {
        stats.currentStreak++;
      } else if (diff > 1) {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    stats.lastPlayedDate = today;
    writeStorage(STATS_KEY, stats);
  }

  function renderStats() {
    const stats = loadStats();
    const avgMs = stats.totalPlayed > 0 ? stats.totalTimeMs / stats.totalPlayed : 0;
    const statsEl = el.statsGrid();
    statsEl.innerHTML = [
      { value: stats.totalPlayed,   label: 'Played' },
      { value: stats.currentStreak, label: 'Streak' },
      {
        value: stats.completedDates.length > 0
          ? Math.round(stats.completedDates.length / Math.max(stats.totalPlayed, 1) * 100) + '%'
          : '—',
        label: 'Win %'
      },
      { value: avgMs > 0 ? formatTime(avgMs) : '—', label: 'Avg Time' }
    ].map(({ value, label }) => `
      <div class="stat-item">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
      </div>
    `).join('');
  }

  // ─── Modals & Toast ───────────────────────────────────────────────────────
  function openModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    // Trap focus
    const firstFocusable = modal.querySelector('button, a, [tabindex="0"]');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeModal(id) {
    const modal = $(id);
    if (modal) modal.classList.add('hidden');
  }

  let toastTimeout = null;
  function showToast(msg) {
    const t = el.toast();
    t.textContent = msg;
    t.classList.remove('hidden');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => t.classList.add('hidden'), 2000);
  }

  // ─── Onboarding ───────────────────────────────────────────────────────────
  let onboardingStep = 0;

  function renderOnboardingStep(step) {
    const s = ONBOARDING_STEPS[step];
    el.onboardingTitle().textContent = s.title;
    el.onboardingBody().textContent = s.body;
    el.onboardingVisual().innerHTML = s.visual;

    // Dots
    const dots = el.onboardingDots();
    dots.innerHTML = ONBOARDING_STEPS.map((_, i) =>
      `<div class="onboarding-dot${i === step ? ' active' : ''}"></div>`
    ).join('');

    // Buttons
    el.onboardingBack().style.visibility = step === 0 ? 'hidden' : 'visible';
    el.onboardingNext().textContent = step === ONBOARDING_STEPS.length - 1 ? "Let's cook!" : 'Next';
  }

  function maybeShowOnboarding() {
    const done = readStorage(ONBOARDING_KEY);
    if (done) return;
    onboardingStep = 0;
    renderOnboardingStep(0);
    openModal('onboarding-modal');
  }

  function completeOnboarding() {
    writeStorage(ONBOARDING_KEY, true);
    closeModal('onboarding-modal');
  }

  // ─── Rendering ────────────────────────────────────────────────────────────
  function renderPuzzleDate() {
    el.puzzleDate().textContent = formatDate(puzzle.id);
  }

  function renderCluePanel() {
    const panel = el.cluePanel();
    const shuffledIndices = deterministicShuffle([...puzzle.words.keys()], puzzle.id);

    panel.innerHTML = shuffledIndices.map(i => {
      const w = puzzle.words[i];
      const found = gameState.foundWords.includes(w.word);
      return `
        <div class="clue-chip${found ? ' is-found' : ''}" data-word="${w.word}" role="listitem">
          <span class="clue-emoji">${w.emoji}</span>
          <span class="clue-label">${found ? w.display : ''}</span>
        </div>
      `;
    }).join('');
  }

  function renderGrid() {
    const grid = el.wordGrid();
    const { rows, cols } = generatedGrid;
    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', rows);
    grid.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = generatedGrid.grid[r][c];
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', generatedGrid.grid[r][c]);
        grid.appendChild(cell);
      }
    }

    applyFoundHighlights();
  }

  function applyFoundHighlights() {
    gameState.foundWords.forEach((wordId, colorIdx) => {
      const w = puzzle.words.find(pw => pw.word === wordId);
      const placement = generatedGrid.placements.find(p => p.wordId === wordId);
      if (!placement) return;
      placement.cells.forEach(({ row, col }) => {
        const cell = getCellEl(row, col);
        if (cell) {
          cell.classList.add(WORD_COLORS[colorIdx % WORD_COLORS.length]);
          cell.dataset.found = wordId;
          if (w) {
            cell.textContent = w.emoji;
            cell.classList.add('cell-emoji');
          }
        }
      });
    });
  }

  function updateClueChip(wordId) {
    const chip = el.cluePanel().querySelector(`[data-word="${wordId}"]`);
    if (!chip) return;
    chip.classList.add('is-found');
    const word = puzzle.words.find(w => w.word === wordId);
    chip.querySelector('.clue-label').textContent = word ? word.display : wordId;
    chip.querySelector('.clue-emoji').style.filter = 'grayscale(0)';
  }

  function getCellEl(row, col) {
    return el.wordGrid().querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  // ─── Pointer / Touch Input ────────────────────────────────────────────────
  function cellFromPoint(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);
    if (!target || !target.classList.contains('grid-cell')) return null;
    return { row: parseInt(target.dataset.row), col: parseInt(target.dataset.col) };
  }

  function lockDirection(start, current) {
    const dr = current.row - start.row;
    const dc = current.col - start.col;
    if (dr === 0 && dc === 0) return null;
    const mag = Math.max(Math.abs(dr), Math.abs(dc));
    return [Math.round(dr / mag), Math.round(dc / mag)];
  }

  function getSelectionCells(start, current, dir) {
    if (!dir) return [start];
    const [dr, dc] = dir;
    // How many steps in this direction to reach current?
    const steps = Math.max(
      Math.abs(current.row - start.row),
      Math.abs(current.col - start.col)
    );
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({ row: start.row + dr * i, col: start.col + dc * i });
    }
    return cells;
  }

  function highlightSelection(cells, isWrong = false) {
    // Clear previous selection highlights
    document.querySelectorAll('.grid-cell.is-selecting').forEach(c => c.classList.remove('is-selecting'));
    document.querySelectorAll('.grid-cell.is-wrong').forEach(c => c.classList.remove('is-wrong'));
    cells.forEach(({ row, col }) => {
      const cell = getCellEl(row, col);
      if (cell) cell.classList.add(isWrong ? 'is-wrong' : 'is-selecting');
    });
  }

  function clearSelection() {
    selState = null;
    document.querySelectorAll('.grid-cell.is-selecting').forEach(c => c.classList.remove('is-selecting'));
  }

  function startTimer() {
    if (gameState.startTime || gameState.endTime) return;
    gameState.startTime = Date.now();
    saveState();
  }

  function getWordFromCells(cells) {
    return cells.map(({ row, col }) => generatedGrid.grid[row][col]).join('');
  }

  function findMatchingWord(str) {
    const rev = str.split('').reverse().join('');
    return puzzle.words.find(w => w.word === str || w.word === rev);
  }

  async function onWordFound(word) {
    const colorIdx = gameState.foundWords.length;
    gameState.foundWords.push(word.word);
    saveState();

    // Color the cells
    const placement = generatedGrid.placements.find(p => p.wordId === word.word);
    if (placement) {
      const colorClass = WORD_COLORS[colorIdx % WORD_COLORS.length];
      placement.cells.forEach(({ row, col }) => {
        const cell = getCellEl(row, col);
        if (cell) {
          cell.classList.remove('is-selecting');
          cell.classList.add(colorClass, 'cell-pop');
          cell.dataset.found = word.word;
          setTimeout(() => {
            cell.textContent = word.emoji;
            cell.classList.add('cell-emoji');
          }, 400);
          setTimeout(() => cell.classList.remove('cell-pop'), 400);
        }
      });
    }

    // Update clue panel
    updateClueChip(word.word);

    // Check win
    if (gameState.foundWords.length === puzzle.words.length) {
      await delay(400);
      await triggerWin();
    }
  }

  async function onWrongGuess(cells) {
    highlightSelection(cells, true);
    await delay(450);
    document.querySelectorAll('.grid-cell.is-wrong').forEach(c => c.classList.remove('is-wrong'));
  }

  function checkSelection(cells) {
    if (cells.length < 3) return; // minimum word length
    const str = getWordFromCells(cells);
    const match = findMatchingWord(str);
    if (match && !gameState.foundWords.includes(match.word)) {
      clearSelection();
      onWordFound(match);
    } else {
      onWrongGuess(cells);
      clearSelection();
    }
  }

  function onPointerDown(e) {
    if (gameState.endTime) return; // game over
    e.preventDefault();
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    startTimer();

    selState = { startCell: cell, currentCell: cell, lockedDir: null, cells: [cell] };
    highlightSelection([cell]);

    // Capture pointer to keep events flowing off grid
    try { el.wordGrid().setPointerCapture(e.pointerId); } catch {}
  }

  function onPointerMove(e) {
    if (!selState) return;
    e.preventDefault();
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    // Attempt to lock direction once pointer moves off start cell
    if (!selState.lockedDir) {
      const dir = lockDirection(selState.startCell, cell);
      if (dir) selState.lockedDir = dir;
    }

    selState.currentCell = cell;
    selState.cells = getSelectionCells(selState.startCell, cell, selState.lockedDir);
    highlightSelection(selState.cells);
  }

  function onPointerUp(e) {
    if (!selState) return;
    e.preventDefault();
    const cells = selState.cells;
    clearSelection();
    checkSelection(cells);
  }

  // ─── Win Sequence ─────────────────────────────────────────────────────────
  async function triggerGather() {
    const cells = [...document.querySelectorAll('.cell-emoji')];
    cells.forEach((cell, i) => {
      setTimeout(() => cell.classList.add('cell-sparkle'), i * 50);
    });
    await delay(cells.length * 50 + 600);
  }

  async function triggerWin() {
    gameState.endTime = Date.now();
    saveState();
    updateStats();

    if (timerInterval) clearInterval(timerInterval);

    await triggerGather();

    const elapsed = gameState.endTime - gameState.startTime;

    // Populate win card
    el.winDishName().textContent = puzzle.dish_display_name;
    el.winTime().textContent = `You cooked it in ${formatTime(elapsed)}.`;
    el.winDishEmoji().textContent = puzzle.illustration_emoji || '🍽️';
    el.recipeLink().href = puzzle.recipe_url;

    // Found emojis
    el.winFoundEmojis().textContent = gameState.foundWords
      .map(wid => puzzle.words.find(w => w.word === wid)?.emoji || '')
      .join(' ');

    // Show overlay
    const overlay = el.winOverlay();
    overlay.classList.remove('hidden');
    overlay.classList.add('is-animating');

    // Start countdown to next puzzle
    startCountdown();
  }

  function startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const countdownEl = el.winCountdown();
      if (countdownEl) {
        countdownEl.textContent = `Next dish in ${formatCountdown(diff)}`;
      }
    };
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // ─── Sharing ──────────────────────────────────────────────────────────────
  function buildShareText() {
    const dateStr = formatDate(puzzle.id);
    const emojiRow = gameState.foundWords
      .map(wid => puzzle.words.find(w => w.word === wid)?.emoji || '')
      .join('');
    const elapsed = formatTime(gameState.endTime - gameState.startTime);
    return [
      `Mise en Place — ${dateStr}`,
      `🍽️ ${puzzle.dish_display_name}`,
      emojiRow,
      `Found all ${puzzle.words.length} ingredients in ${elapsed}`,
      `mise-en-place.app`
    ].join('\n');
  }

  async function doShare() {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Result copied to clipboard!');
    } catch {
      showToast('Could not copy — try manually!');
    }
  }

  // ─── Return-visit handling ─────────────────────────────────────────────────
  function showAlreadyCompleted() {
    const elapsed = gameState.endTime - gameState.startTime;
    el.winDishName().textContent = puzzle.dish_display_name;
    el.winTime().textContent = `You cooked it in ${formatTime(elapsed)}.`;
    el.winDishEmoji().textContent = puzzle.illustration_emoji || '🍽️';
    el.recipeLink().href = puzzle.recipe_url;
    el.winFoundEmojis().textContent = gameState.foundWords
      .map(wid => puzzle.words.find(w => w.word === wid)?.emoji || '')
      .join(' ');
    el.winOverlay().classList.remove('hidden');
    el.winOverlay().classList.add('is-animating');
    startCountdown();
  }

  // ─── Event Bindings ───────────────────────────────────────────────────────
  function bindPointerEvents() {
    const grid = el.wordGrid();
    grid.addEventListener('pointerdown', onPointerDown, { passive: false });
    grid.addEventListener('pointermove', onPointerMove, { passive: false });
    grid.addEventListener('pointerup', onPointerUp, { passive: false });
    grid.addEventListener('pointercancel', () => clearSelection());
    // Prevent context menu on long-press mobile
    grid.addEventListener('contextmenu', e => e.preventDefault());
  }

  function bindButtonEvents() {
    // Stats
    el.statsBtn().addEventListener('click', () => {
      renderStats();
      openModal('stats-modal');
    });
    $('stats-modal').addEventListener('click', e => {
      if (e.target.dataset.close === 'stats-modal' || e.target === $('stats-modal')) {
        closeModal('stats-modal');
      }
    });

    // Help / onboarding
    el.helpBtn().addEventListener('click', () => {
      onboardingStep = 0;
      renderOnboardingStep(0);
      openModal('onboarding-modal');
    });

    // Onboarding navigation
    el.onboardingNext().addEventListener('click', () => {
      if (onboardingStep < ONBOARDING_STEPS.length - 1) {
        onboardingStep++;
        renderOnboardingStep(onboardingStep);
      } else {
        completeOnboarding();
      }
    });
    el.onboardingBack().addEventListener('click', () => {
      if (onboardingStep > 0) {
        onboardingStep--;
        renderOnboardingStep(onboardingStep);
      }
    });
    el.onboardingSkip().addEventListener('click', completeOnboarding);
    $('onboarding-modal').addEventListener('click', e => {
      if (e.target === $('onboarding-modal')) completeOnboarding();
    });

    // Share
    el.shareBtn().addEventListener('click', doShare);

    // Close modals on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal('stats-modal');
        closeModal('onboarding-modal');
      }
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  async function init() {
    puzzle = getTodaysPuzzle();
    loadOrCreateState();

    // Show date immediately while grid generates
    renderPuzzleDate();
    bindButtonEvents();

    // Generate / load grid (async — won't freeze the page)
    generatedGrid = await getOrGenerateGrid();
    if (!generatedGrid) {
      document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif;color:#C4522A">Sorry — could not generate today\'s puzzle. Please try refreshing.</p>';
      return;
    }

    renderCluePanel();
    renderGrid();
    bindPointerEvents();

    // Remove loading state
    const loadingEl = document.getElementById('loading-state');
    if (loadingEl) loadingEl.remove();
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (gridWrapper) gridWrapper.classList.remove('hidden');
    const cluePanel = el.cluePanel();
    if (cluePanel) cluePanel.classList.remove('hidden');

    // If already completed today, show win screen
    if (gameState.endTime) {
      showAlreadyCompleted();
      return;
    }

    maybeShowOnboarding();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
