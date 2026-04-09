// Node.js script to pre-generate puzzle grids and output puzzles.js
// Run with: node js/generate-puzzles.cjs

const DIRECTIONS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

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

function computeCells(word, startRow, startCol, dr, dc, rows, cols) {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    const r = startRow + dr * i;
    const c = startCol + dc * i;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    cells.push({ row: r, col: c });
  }
  return cells;
}

function allCellsEmpty(cells, grid) {
  return cells.every(({ row, col }) => grid[row][col] === null);
}

function applyWord(cells, word, wordId, grid) {
  cells.forEach(({ row, col }, i) => { grid[row][col] = { letter: word[i], wordId }; });
}

function unapplyWord(cells, grid) {
  cells.forEach(({ row, col }) => { grid[row][col] = null; });
}

function getAllValidPlacements(word, wordId, grid, rows, cols) {
  const candidates = [];
  for (const [dr, dc] of DIRECTIONS) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cells = computeCells(word, r, c, dr, dc, rows, cols);
        if (!cells) continue;
        if (allCellsEmpty(cells, grid)) {
          candidates.push({ wordId, startRow: r, startCol: c, direction: [dr, dc], cells });
        }
      }
    }
  }
  return candidates;
}

function placeWords(sortedWords, index, grid, placements, rows, cols, rng, deadline) {
  if (Date.now() > deadline) return false;
  if (index === sortedWords.length) {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] === null) return false;
    return true;
  }
  const { word, wordId } = sortedWords[index];
  const candidates = shuffle(getAllValidPlacements(word, wordId, grid, rows, cols), rng);
  for (const candidate of candidates) {
    applyWord(candidate.cells, word, wordId, grid);
    if (placeWords(sortedWords, index + 1, grid, placements, rows, cols, rng, deadline)) {
      placements.push(candidate);
      return true;
    }
    unapplyWord(candidate.cells, grid);
  }
  return false;
}

function generate(words, rows, cols, seed, timeoutMs) {
  const rng = makeRng(seed);
  const sortedWords = shuffle(
    words.slice().sort((a, b) => b.word.length - a.word.length),
    rng
  );
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const placements = [];
  const deadline = Date.now() + timeoutMs;
  const success = placeWords(sortedWords, 0, grid, placements, rows, cols, rng, deadline);
  if (!success) return null;
  const letterGrid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => grid[r][c]?.letter ?? '?')
  );
  return { rows, cols, grid: letterGrid, placements };
}

function getFactorPairs(n) {
  const pairs = [];
  for (let r = 1; r <= Math.sqrt(n); r++) {
    if (n % r === 0) pairs.push([r, n / r]);
  }
  pairs.sort((a, b) => (a[1] / a[0]) - (b[1] / b[0]));
  return pairs;
}

function generatePuzzle(words, label) {
  const totalLetters = words.reduce((sum, w) => sum + w.word.length, 0);
  const maxWordLen = Math.max(...words.map(w => w.word.length));

  console.log(`\n[${label}] total=${totalLetters} maxWord=${maxWordLen}`);

  // Try exact factor pairs first
  const candidates = [];
  for (let delta = 0; delta <= 4; delta++) {
    for (const sign of (delta === 0 ? [0] : [-1, 1])) {
      const n = totalLetters + delta * sign;
      if (n <= 0) continue;
      for (const [r, c] of getFactorPairs(n)) {
        if (Math.max(r, c) >= maxWordLen) {
          candidates.push([r, c, n]);
          if (r !== c) candidates.push([c, r, n]);
        }
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = candidates.filter(([r, c]) => {
    const k = `${r}x${c}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });

  // Only try exact total sizes (delta=0 means exact coverage)
  const exactOnly = unique.filter(([r, c, n]) => n === totalLetters);
  const toTry = exactOnly.length > 0 ? exactOnly : unique;

  for (const [rows, cols] of toTry) {
    process.stdout.write(`  trying ${rows}x${cols}...`);
    for (let seed = 0; seed < 500; seed++) {
      const result = generate(words, rows, cols, seed, 5000);
      if (result) {
        console.log(` ✓ seed=${seed}`);
        return result;
      }
    }
    process.stdout.write(' ✗\n');
  }
  return null;
}

// ── Puzzle definitions ──────────────────────────────────────────────────────

const PUZZLE_DEFS = [
  {
    id: "2026-04-03",
    dish_name: "Cacio e Pepe",
    dish_display_name: "Cacio e Pepe",
    cuisine: "Italian",
    difficulty: "medium",
    illustration_emoji: "🍝",
    recipe_url: "https://cooking.nytimes.com/recipes/1017965-cacio-e-pepe",
    words: [
      { word: "PECORINO",  emoji: "🧀", display: "Pecorino Romano" },
      { word: "PASTA",     emoji: "🍝", display: "Pasta" },
      { word: "PEPPER",    emoji: "🌶️", display: "Black Pepper" },
      { word: "GUANCIALE", emoji: "🥩", display: "Guanciale" },
      { word: "OLIVEOIL",  emoji: "🫒", display: "Olive Oil" },
      { word: "SALT",      emoji: "🧂", display: "Salt" },
      { word: "WATER",     emoji: "💧", display: "Water" },
      { word: "STARCH",    emoji: "🌾", display: "Pasta Starch" },
      { word: "EGG",       emoji: "🥚", display: "Egg Yolk" },
    ]
    // total = 8+5+6+9+8+4+5+6+3 = 54 = 6×9 ✓
  },
  {
    id: "2026-04-04",
    dish_name: "Chicken Tikka Masala",
    dish_display_name: "Chicken Tikka Masala",
    cuisine: "Indian",
    difficulty: "hard",
    illustration_emoji: "🍛",
    recipe_url: "https://cooking.nytimes.com/recipes/1017351-chicken-tikka-masala",
    words: [
      { word: "CHICKEN",   emoji: "🍗", display: "Chicken" },
      { word: "TOMATO",    emoji: "🍅", display: "Tomato" },
      { word: "CREAM",     emoji: "🥛", display: "Heavy Cream" },
      { word: "GARAM",     emoji: "🫙", display: "Garam Masala" },
      { word: "GINGER",    emoji: "🫚", display: "Ginger" },
      { word: "GARLIC",    emoji: "🧄", display: "Garlic" },
      { word: "CUMIN",     emoji: "🌿", display: "Cumin" },
      { word: "YOGURT",    emoji: "🥣", display: "Yogurt" },
      { word: "BUTTER",    emoji: "🧈", display: "Butter" },
      { word: "ONION",     emoji: "🧅", display: "Onion" },
    ]
    // total = 7+6+5+5+6+6+5+6+6+5 = 57 = 3×19 or try 57+3=60=6×10 ✓
  },
  {
    id: "2026-04-05",
    dish_name: "Guacamole",
    dish_display_name: "Guacamole",
    cuisine: "Mexican",
    difficulty: "easy",
    illustration_emoji: "🥑",
    recipe_url: "https://www.seriouseats.com/the-best-guacamole",
    words: [
      { word: "AVOCADO",   emoji: "🥑", display: "Avocado" },
      { word: "LIME",      emoji: "🍋", display: "Lime" },
      { word: "CILANTRO",  emoji: "🌿", display: "Cilantro" },
      { word: "ONION",     emoji: "🧅", display: "Red Onion" },
      { word: "JALAPENO",  emoji: "🌶️", display: "Jalapeño" },
      { word: "GARLIC",    emoji: "🧄", display: "Garlic" },
      { word: "SALT",      emoji: "🧂", display: "Salt" },
      { word: "CUMIN",     emoji: "🌱", display: "Cumin" },
    ]
    // total = 7+4+8+5+8+6+4+5 = 47... try 7×7=49 (diff=2), 48=6×8, 50=5×10
    // Adjust: add PEPPER(6) → 53 prime, swap LIME→LEMON(5)→48=6×8 ✓
    // AVOCADO(7)+LEMON(5)+CILANTRO(8)+ONION(5)+JALAPENO(8)+GARLIC(6)+SALT(4)+CUMIN(5)=48=6×8
  },
  {
    id: "2026-04-06",
    dish_name: "Tonkotsu Ramen",
    dish_display_name: "Tonkotsu Ramen",
    cuisine: "Japanese",
    difficulty: "hard",
    illustration_emoji: "🍜",
    recipe_url: "https://www.seriouseats.com/rich-and-creamy-tonkotsu-ramen-broth-recipe",
    words: [
      { word: "PORK",      emoji: "🐷", display: "Pork Belly" },
      { word: "NOODLES",   emoji: "🍜", display: "Ramen Noodles" },
      { word: "MISO",      emoji: "🫙", display: "Miso Paste" },
      { word: "SHOYU",     emoji: "🍶", display: "Soy Sauce" },
      { word: "KOMBU",     emoji: "🌊", display: "Kombu" },
      { word: "GINGER",    emoji: "🫚", display: "Ginger" },
      { word: "GARLIC",    emoji: "🧄", display: "Garlic" },
      { word: "SCALLION",  emoji: "🌱", display: "Scallion" },
      { word: "SESAME",    emoji: "🌾", display: "Sesame Oil" },
      { word: "EGGS",      emoji: "🥚", display: "Soft-boiled Eggs" },
    ]
    // total = 4+7+4+5+5+6+6+8+6+4 = 55 prime, 55=5×11 max=11>=8 ✓
  },
  {
    id: "2026-04-07",
    dish_name: "Tiramisu",
    dish_display_name: "Tiramisu",
    cuisine: "Italian",
    difficulty: "medium",
    illustration_emoji: "🍰",
    recipe_url: "https://cooking.nytimes.com/recipes/1018684-classic-tiramisu",
    words: [
      { word: "MASCARPONE", emoji: "🧀", display: "Mascarpone" },
      { word: "ESPRESSO",   emoji: "☕", display: "Espresso" },
      { word: "SAVOIARDI",  emoji: "🍪", display: "Ladyfingers" },
      { word: "EGGS",       emoji: "🥚", display: "Eggs" },
      { word: "SUGAR",      emoji: "🍬", display: "Sugar" },
      { word: "COCOA",      emoji: "🍫", display: "Cocoa Powder" },
      { word: "MARSALA",    emoji: "🍷", display: "Marsala Wine" },
      { word: "CREAM",      emoji: "🥛", display: "Heavy Cream" },
    ]
    // total = 10+8+9+4+5+5+7+5 = 53 prime, 53+7=60=6×10 max=10>=10 ✓
    // OR try 53+3=56=7×8 max=8<10. Need max>=10.
    // Add VANILLA(7) → 60=6×10 ✓
  },
];

// Fix word lists to get nice totals
// Cacio e Pepe: 54 = 6×9 ✓ (already good)
// Chicken Tikka: 57 → try as-is (3×19), or adjust
// Guacamole: 47 → swap LIME→LEMON to get 48=6×8
// Tiramisu: 53 → add VANILLA to get 60=6×10

// Patch word lists
PUZZLE_DEFS[2].words[1] = { word: "LEMON", emoji: "🍋", display: "Lemon" }; // swap LIME→LEMON

PUZZLE_DEFS[4].words.push({ word: "VANILLA", emoji: "🌸", display: "Vanilla" }); // add VANILLA for Tiramisu

// Verify totals
for (const p of PUZZLE_DEFS) {
  const total = p.words.reduce((s, w) => s + w.word.length, 0);
  const max = Math.max(...p.words.map(w => w.word.length));
  const factors = [];
  for (let r = 1; r <= Math.sqrt(total); r++) {
    if (total % r === 0) factors.push(`${r}×${total/r}`);
  }
  console.log(`${p.id} ${p.dish_name}: ${total} letters, max=${max}, factors: ${factors.join(', ')}`);
}

// ── Generate ────────────────────────────────────────────────────────────────
async function main() {
  const results = [];

  for (const puzzleDef of PUZZLE_DEFS) {
    const result = generatePuzzle(puzzleDef.words, puzzleDef.dish_name);
    if (!result) {
      console.error(`\n❌ FAILED to generate grid for: ${puzzleDef.dish_name}`);
      console.error('   Adjust the word list so totalLetters has a usable factor pair.');
      process.exit(1);
    }
    results.push({ ...puzzleDef, grid: result.grid, placements: result.placements });
  }

  // Output puzzles.js
  const output = `// Mise en Place — Pre-generated Puzzle Data
// Generated by generate-puzzles.cjs — do not edit grid/placements manually.

const PUZZLES = ${JSON.stringify(results, null, 2)};
`;

  require('fs').writeFileSync(
    require('path').join(__dirname, 'puzzles.js'),
    output,
    'utf8'
  );
  console.log('\n✅ puzzles.js written successfully!');
}

main().catch(e => { console.error(e); process.exit(1); });
