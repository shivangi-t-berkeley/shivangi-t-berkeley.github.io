import React from 'react';

export default function Header({ onStatsClick, onHelpClick }) {
  return (
    <header className="w-full border-b border-game-border bg-game-bg sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Wordmark */}
        <span
          className="text-game-text tracking-widest text-sm font-bold uppercase"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', letterSpacing: '0.2em' }}
        >
          IMPOSTOR
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onStatsClick}
            aria-label="View statistics"
            className="p-2 rounded text-game-muted hover:text-game-text hover:bg-game-card transition-colors"
            title="Statistics"
          >
            {/* Bar chart icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="12" width="3" height="6" rx="0.5" />
              <rect x="7" y="8" width="3" height="10" rx="0.5" />
              <rect x="12" y="4" width="3" height="14" rx="0.5" />
              <rect x="17" y="2" width="1" height="0" rx="0" opacity="0" />
            </svg>
          </button>
          <button
            onClick={onHelpClick}
            aria-label="How to play"
            className="p-2 rounded text-game-muted hover:text-game-text hover:bg-game-card transition-colors"
            title="How to play"
          >
            {/* Question mark icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 1.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 2.25c-1.518 0-2.75 1.232-2.75 2.75a.75.75 0 001.5 0c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25c0 .484-.3.878-.78 1.21l-.16.106C9.646 10.293 9 11.07 9 12.25a.75.75 0 001.5 0c0-.57.274-.91.72-1.21l.16-.106C12.2 10.372 13 9.44 13 8.5c0-1.518-1.232-2.75-2.75-2.75zM10 14a.875.875 0 110 1.75A.875.875 0 0110 14z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
