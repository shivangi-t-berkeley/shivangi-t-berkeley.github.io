import React, { useState, useEffect } from 'react';

const DIFFICULTY_DOTS = { easy: 1, medium: 2, hard: 3 };
const DIFFICULTY_COLOR = { easy: '#22c55e', medium: '#f5c842', hard: '#ef4444' };

function getCompletionState(date) {
  try {
    const raw = localStorage.getItem(`impostor_puzzle_${date}_state`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ArchiveModal({ onClose, onSelectPuzzle }) {
  const [puzzles, setPuzzles] = useState([]);

  useEffect(() => {
    fetch('/impostor-game/puzzles/archive.json')
      .then((r) => r.json())
      .then(setPuzzles)
      .catch(() => {});
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
    >
      <div className="modal-enter bg-game-card border border-game-border rounded-sm w-full max-w-sm flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-game-border">
          <h2
            className="text-game-text font-bold text-sm uppercase tracking-widest"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', letterSpacing: '0.18em' }}
          >
            Archive
          </h2>
          <button
            onClick={onClose}
            aria-label="Close archive"
            className="text-game-muted hover:text-game-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Puzzle list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {puzzles.map((p) => {
            const saved = getCompletionState(p.date);
            const played = saved?.phase === 'scorecard' || saved?.phase === 'revealing';
            const wonIt = saved?.won;
            const dots = DIFFICULTY_DOTS[p.difficulty] ?? 1;
            const color = DIFFICULTY_COLOR[p.difficulty] ?? '#f5f5f5';

            return (
              <button
                key={p.number}
                onClick={() => onSelectPuzzle(p.date, p.number)}
                className="w-full flex items-center justify-between px-4 py-3 bg-game-bg border border-game-border rounded-sm hover:border-[#444] transition-colors group"
              >
                {/* Left: number + difficulty */}
                <div className="flex items-center gap-4">
                  <span
                    className="text-game-muted text-xs font-bold uppercase tracking-widest w-6 text-left"
                    style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                  >
                    #{p.number}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: i <= dots ? color : '#2a2a2a' }}
                      />
                    ))}
                  </div>
                  <span className="text-game-muted text-xs capitalize">{p.difficulty}</span>
                </div>

                {/* Right: completion badge */}
                {played ? (
                  <span
                    className="text-xs font-bold"
                    style={{ color: wonIt ? '#22c55e' : '#6b6b6b' }}
                  >
                    {wonIt ? '✓' : '○'}
                  </span>
                ) : (
                  <span className="text-game-border text-xs group-hover:text-game-muted transition-colors">→</span>
                )}
              </button>
            );
          })}

          {puzzles.length === 0 && (
            <p className="text-game-muted text-xs text-center py-8">Loading…</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-game-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-game-border text-game-muted text-sm font-bold uppercase tracking-widest rounded-sm hover:text-game-text hover:border-[#444] transition-colors"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
