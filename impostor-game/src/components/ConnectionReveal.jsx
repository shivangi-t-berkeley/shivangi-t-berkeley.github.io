import React from 'react';

export default function ConnectionReveal({ puzzle, displayedWords, won, onContinue }) {
  return (
    <div className="w-full animate-fade-in">
      {/* Status banner */}
      <div
        className={[
          'w-full py-3 px-4 rounded-sm mb-6 text-center',
          won ? 'bg-game-correct' : 'bg-[#7f1d1d]',
        ].join(' ')}
      >
        <span className="text-white font-bold text-sm uppercase tracking-widest">
          {won ? 'Correct — You found the impostor!' : 'The impostor got away.'}
        </span>
      </div>

      {/* Connection statement */}
      <div className="mb-8 text-center px-2">
        <p
          className="text-game-text text-lg sm:text-xl font-bold leading-snug"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          {puzzle.connection}
        </p>
      </div>

      {/* Words breakdown */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-game-muted font-semibold mb-3 text-center">
          The five words
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {displayedWords.map((word) => {
            const isImpostor = word === puzzle.impostor;
            return (
              <div
                key={word}
                className={[
                  'px-4 py-2 rounded-sm border text-sm font-bold uppercase tracking-widest',
                  'transition-colors',
                  isImpostor
                    ? 'border-[#dc2626] text-[#dc2626] bg-[#1a0a0a]'
                    : 'border-game-accent text-game-accent bg-[#14110a]',
                ].join(' ')}
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {word}
                {isImpostor && (
                  <span className="ml-2 text-[10px] font-normal normal-case tracking-normal opacity-80">
                    impostor
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-game-text text-game-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          See results
        </button>
      </div>
    </div>
  );
}
