import { formatDateDisplay } from './dateUtils.js';

const SCORE_LABELS = ['Got me', 'Just made it', 'Close', 'Solid', 'Sharp', 'Perfect'];

/**
 * Builds the share text for a completed game.
 * @param {object} puzzle - The puzzle object
 * @param {string[]} guesses - Array of guessed words (in order)
 * @param {string[]} displayedWords - Words in display order
 * @param {boolean} won - Whether the player won
 */
export function buildShareText(puzzle, guesses, displayedWords, won) {
  const wrongGuesses = guesses.filter((g) => g !== puzzle.impostor);
  const scoreIndex = won ? 5 - wrongGuesses.length : 0;
  const label = SCORE_LABELS[scoreIndex];
  const scoreDisplay = won ? `${5 - wrongGuesses.length}/5` : '0/5';
  const dateDisplay = formatDateDisplay(puzzle.id);

  // Build emoji grid — one row per guess
  const rows = guesses.map((guessedWord) => {
    const guessedIdx = displayedWords.indexOf(guessedWord);
    const isCorrect = guessedWord === puzzle.impostor;
    return Array.from({ length: 5 }, (_, i) => {
      if (i === guessedIdx) {
        return isCorrect ? '🟩' : '🟥';
      }
      return '⬛';
    }).join('');
  });

  const emojiGrid = rows.join('\n');

  return [
    `IMPOSTOR — ${dateDisplay}`,
    `🕵️ ${scoreDisplay} ${label}`,
    '',
    emojiGrid,
    '',
    puzzle.connection,
    'impostor.game',
  ].join('\n');
}

/**
 * Shares or copies the share text.
 * Returns 'shared', 'copied', or throws.
 */
export async function shareResult(text) {
  if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      // Fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(text);
  return 'copied';
}
