import React, { useState } from 'react';
import { formatDateDisplay } from '../utils/dateUtils.js';
import { buildShareText, shareResult } from '../utils/shareUtils.js';

const SCORE_LABELS = ['Got me', 'Just made it', 'Close', 'Solid', 'Sharp', 'Perfect'];

function buildEmojiGrid(guesses, displayedWords, impostor) {
  return guesses.map((guessedWord) => {
    const guessedIdx = displayedWords.indexOf(guessedWord);
    const isCorrect = guessedWord === impostor;
    return Array.from({ length: 5 }, (_, i) => {
      if (i === guessedIdx) {
        return isCorrect ? '🟩' : '🟥';
      }
      return '⬛';
    }).join('');
  });
}

export default function ScoreCard({ puzzle, guesses, displayedWords, won }) {
  const [shareStatus, setShareStatus] = useState(null); // null | 'copied' | 'shared' | 'error'

  if (!puzzle) return null;

  const wrongGuesses = guesses.filter((g) => g !== puzzle.impostor);
  const scoreIndex = won ? 5 - wrongGuesses.length : 0;
  const scoreLabel = SCORE_LABELS[scoreIndex];
  const scoreDisplay = won ? `${5 - wrongGuesses.length}/5` : '0/5';
  const emojiRows = buildEmojiGrid(guesses, displayedWords, puzzle.impostor);

  async function handleShare() {
    try {
      const text = buildShareText(puzzle, guesses, displayedWords, won);
      const result = await shareResult(text);
      setShareStatus(result);
      setTimeout(() => setShareStatus(null), 2500);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus(null), 2500);
    }
  }

  return (
    <div className="w-full animate-fade-in space-y-8">
      {/* Score header */}
      <div className="text-center">
        <div
          className="text-5xl sm:text-6xl font-bold text-game-text mb-1"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          {scoreDisplay}
        </div>
        <div
          className={[
            'text-xl font-bold uppercase tracking-widest',
            scoreIndex >= 4
              ? 'text-game-accent'
              : scoreIndex >= 2
              ? 'text-game-text'
              : 'text-game-muted',
          ].join(' ')}
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          {scoreLabel}
        </div>
        <div className="text-game-muted text-sm mt-2">
          {formatDateDisplay(puzzle.id)}
        </div>
      </div>

      {/* Emoji grid */}
      {emojiRows.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs uppercase tracking-widest text-game-muted font-semibold mb-2">
            Your guesses
          </div>
          {emojiRows.map((row, i) => (
            <div key={i} className="text-2xl tracking-wider leading-none">
              {row}
            </div>
          ))}
        </div>
      )}

      {/* Connection recap */}
      <div className="bg-game-hint-bg border border-game-border rounded-sm px-5 py-4">
        <div className="text-xs uppercase tracking-widest text-game-muted font-semibold mb-2">
          The connection
        </div>
        <p className="text-game-text text-sm leading-relaxed">{puzzle.connection}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {puzzle.words.map((word) => {
            const isImpostor = word === puzzle.impostor;
            return (
              <span
                key={word}
                className={[
                  'text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm border',
                  isImpostor
                    ? 'border-[#dc2626] text-[#dc2626]'
                    : 'border-game-accent text-game-accent',
                ].join(' ')}
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Share button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleShare}
          className="w-full max-w-xs px-6 py-3 bg-game-accent text-game-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-yellow-300 transition-colors"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          {shareStatus === 'copied'
            ? 'Copied to clipboard!'
            : shareStatus === 'shared'
            ? 'Shared!'
            : shareStatus === 'error'
            ? 'Could not share'
            : 'Share result'}
        </button>

        <p className="text-game-muted text-xs text-center">
          Come back tomorrow for a new puzzle.
        </p>
      </div>
    </div>
  );
}
