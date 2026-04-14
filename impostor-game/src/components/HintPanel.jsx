import React from 'react';

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      className="inline-block mr-1.5 opacity-40"
    >
      <path d="M9 5H8V3.5a2 2 0 00-4 0V5H3a1 1 0 00-1 1v4a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1zm-4-1.5a1 1 0 012 0V5H5V3.5z" />
    </svg>
  );
}

export default function HintPanel({ hints, hintsRevealed }) {
  if (hintsRevealed === 0) return null;

  return (
    <div className="w-full space-y-2 animate-fade-in">
      <div className="text-xs uppercase tracking-widest text-game-muted font-semibold mb-3">
        Hints
      </div>
      {hints.map((hint, i) => {
        const isRevealed = i < hintsRevealed;
        return (
          <div
            key={i}
            className={[
              'rounded-sm px-4 py-3 border transition-all',
              isRevealed
                ? 'bg-game-hint-bg border-game-border animate-slide-down'
                : 'bg-transparent border-game-border border-dashed opacity-40',
            ].join(' ')}
            style={isRevealed ? { animationDelay: `${i * 60}ms`, animationFillMode: 'both' } : {}}
          >
            {isRevealed ? (
              <div className="flex gap-3 items-start">
                <span className="text-game-accent text-xs font-bold mt-0.5 shrink-0 uppercase tracking-wider">
                  {i + 1}
                </span>
                <p className="text-game-text text-sm leading-relaxed">{hint}</p>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <span className="text-game-muted text-xs font-bold uppercase tracking-wider shrink-0">
                  {i + 1}
                </span>
                <span className="text-game-muted text-sm flex items-center">
                  <LockIcon />
                  Hint {i + 1}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
