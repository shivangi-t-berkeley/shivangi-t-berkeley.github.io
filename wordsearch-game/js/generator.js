// Mise en Place — Puzzle Grid Generator
// Places words in 8 directions on a grid; fills remaining cells with
// thematic letters drawn from the word list. No blank cells.

window.MiseGenerator = (function () {

  const DIRECTIONS = [
    [0, 1],   // right
    [0, -1],  // left
    [1, 0],   // down
    [-1, 0],  // up
    [1, 1],   // down-right
    [1, -1],  // down-left
    [-1, 1],  // up-right
    [-1, -1], // up-left
  ];

  // Mulberry32 seeded RNG — fast, no dependencies
  function makeRng(seed) {
    let s = (seed >>> 0) + 1;
    return function () {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeEmptyGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  function computeCells(wordLen, startRow, startCol, dr, dc, rows, cols) {
    const cells = [];
    for (let i = 0; i < wordLen; i++) {
      const r = startRow + dr * i;
      const c = startCol + dc * i;
      if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
      cells.push({ row: r, col: c });
    }
    return cells;
  }

  function canPlace(cells, grid) {
    // Each cell must be empty (null)
    return cells.every(({ row, col }) => grid[row][col] === null);
  }

  function placeWord(word, wordId, cells, grid) {
    cells.forEach(({ row, col }, i) => {
      grid[row][col] = { letter: word[i], wordId };
    });
  }

  function tryPlaceWord(word, wordId, grid, rows, cols, rng) {
    const dirs = shuffle(DIRECTIONS, rng);
    // Build all valid candidate placements
    const candidates = [];
    for (const [dr, dc] of dirs) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cells = computeCells(word.length, r, c, dr, dc, rows, cols);
          if (cells && canPlace(cells, grid)) {
            candidates.push({ cells, dir: [dr, dc] });
          }
        }
      }
    }
    if (candidates.length === 0) return null;
    const pick = candidates[Math.floor(rng() * candidates.length)];
    placeWord(word, wordId, pick.cells, grid);
    return pick;
  }

  // Fill empty cells with letters drawn from the puzzle's word list
  function fillBlanks(grid, rows, cols, wordLetters, rng) {
    const pool = wordLetters.split('');
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = { letter: pool[Math.floor(rng() * pool.length)], wordId: null };
        }
      }
    }
  }

  function chooseDims(words) {
    const total = words.reduce((s, w) => s + w.word.length, 0);
    const maxLen = Math.max(...words.map(w => w.word.length));
    // Grid should comfortably fit all words; aim for roughly square
    const minDim = Math.max(maxLen, Math.ceil(Math.sqrt(total * 1.5)));
    const dim = Math.max(minDim, 8); // at least 8×8
    return { rows: dim, cols: dim };
  }

  // Synchronous single-attempt generate
  function generate(words, seed) {
    const { rows, cols } = chooseDims(words);
    const rng = makeRng(seed);
    const grid = makeEmptyGrid(rows, cols);
    const placements = [];

    // Sort longest-first for better packing
    const sorted = shuffle(
      words.slice().sort((a, b) => b.word.length - a.word.length),
      rng
    );

    for (const w of sorted) {
      const result = tryPlaceWord(w.word, w.word, grid, rows, cols, rng);
      if (!result) return null; // rare: retry with new seed
      placements.push({
        wordId: w.word,
        startRow: result.cells[0].row,
        startCol: result.cells[0].col,
        direction: result.dir,
        cells: result.cells,
      });
    }

    // Build letter pool from all words for filler
    const letterPool = words.map(w => w.word).join('');
    fillBlanks(grid, rows, cols, letterPool, rng);

    // Build 2D letter array
    const letterGrid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => grid[r][c].letter)
    );

    return { rows, cols, grid: letterGrid, placements };
  }

  // Public API: returns a Promise so the caller can await and keep UI alive
  function generatePuzzle(words) {
    return new Promise((resolve) => {
      // Try seeds 0..99; each attempt is deferred via setTimeout to avoid blocking
      let seed = 0;
      const MAX_SEEDS = 100;

      function tryNext() {
        if (seed >= MAX_SEEDS) {
          resolve(null);
          return;
        }
        const result = generate(words, seed++);
        if (result) {
          resolve(result);
        } else {
          setTimeout(tryNext, 0);
        }
      }

      setTimeout(tryNext, 0);
    });
  }

  return { generatePuzzle };
})();
