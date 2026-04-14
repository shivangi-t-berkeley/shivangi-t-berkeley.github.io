import React, { useEffect } from 'react';

const SCORE_LABELS = ['0/5 — Got me', '1/5 — Just made it', '2/5 — Close', '3/5 — Solid', '4/5 — Sharp', '5/5 — Perfect'];

export default function StatsModal({ stats, onClose }) {
  // Close on ESC
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const winPct =
    stats.totalPlayed > 0
      ? Math.round((stats.totalWon / stats.totalPlayed) * 100)
      : 0;

  const maxDist = Math.max(...stats.scoreDistribution, 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-enter bg-game-card border border-game-border rounded-sm w-full max-w-sm p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-game-muted hover:text-game-text transition-colors"
          aria-label="Close statistics"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
          </svg>
        </button>

        <h2
          className="text-game-text font-bold uppercase tracking-widest text-sm mb-6"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          Statistics
        </h2>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Streak', value: stats.streak },
            { label: 'Played', value: stats.totalPlayed },
            { label: 'Win %', value: `${winPct}%` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl font-bold text-game-text"
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {value}
              </div>
              <div className="text-game-muted text-xs mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Score distribution */}
        <div>
          <div className="text-xs uppercase tracking-widest text-game-muted font-semibold mb-4">
            Score distribution
          </div>
          <div className="space-y-2">
            {SCORE_LABELS.map((label, i) => {
              const count = stats.scoreDistribution[i] || 0;
              const pct = Math.round((count / maxDist) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-game-muted text-xs w-24 shrink-0">{label}</span>
                  <div className="flex-1 bg-game-bg rounded-sm h-5 overflow-hidden">
                    <div
                      className="h-full rounded-sm flex items-center justify-end pr-2 transition-all duration-500"
                      style={{
                        width: count === 0 ? '4px' : `${Math.max(pct, 8)}%`,
                        backgroundColor: i === 0 ? '#7f1d1d' : i >= 4 ? '#f5c842' : '#2a2a2a',
                        minWidth: count === 0 ? undefined : '2rem',
                      }}
                    >
                      {count > 0 && (
                        <span className="text-xs font-bold text-game-text">{count}</span>
                      )}
                    </div>
                  </div>
                  {count === 0 && (
                    <span className="text-game-muted text-xs w-4 text-right">0</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
