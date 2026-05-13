import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    title: 'Five words.\nOne doesn\'t belong.',
    body: 'Every puzzle hides a secret connection. Four words share it — one is the phony. Your job: find it.',
    visual: 'grid',
  },
  {
    title: 'Wrong guesses\nreveal hints.',
    body: 'Made a wrong call? A clue unlocks. Up to four hints total — but the more you use, the lower your score.',
    visual: 'hints',
  },
  {
    title: 'Find\nthe phony.',
    body: 'Pick a word, lock in your guess. Nail it without hints and you\'re sharp — a perfect score.',
    visual: 'reveal',
  },
];

const EXAMPLE_WORDS = ['STRAW', 'DESSERTS', 'REPAID', 'DELIVER', 'STONE'];
const EXAMPLE_HINTS = [
  'The connection is about the words themselves.',
  'Try reading each word from right to left.',
];

function GridVisual() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-xs mx-auto pointer-events-none">
      {EXAMPLE_WORDS.map((w) => (
        <div
          key={w}
          className={[
            'rounded-sm border px-3 py-4 text-sm font-bold uppercase tracking-widest',
            w === 'DELIVER'
              ? 'bg-[#252525] border-game-text text-game-text'
              : 'bg-game-card border-game-border text-game-text',
          ].join(' ')}
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

function HintsVisual() {
  return (
    <div className="space-y-2 w-full max-w-xs mx-auto">
      {EXAMPLE_HINTS.map((hint, i) => (
        <div
          key={i}
          className="flex gap-3 items-start bg-game-hint-bg border border-game-border rounded-sm px-3 py-2"
        >
          <span className="text-game-accent text-xs font-bold mt-0.5 uppercase tracking-wider shrink-0">
            {i + 1}
          </span>
          <p className="text-game-text text-xs leading-relaxed">{hint}</p>
        </div>
      ))}
      <div className="flex gap-3 items-center border border-dashed border-game-border rounded-sm px-3 py-2 opacity-40">
        <span className="text-game-muted text-xs font-bold uppercase tracking-wider shrink-0">3</span>
        <span className="text-game-muted text-xs">Hint 3</span>
      </div>
    </div>
  );
}

function RevealVisual() {
  const [stage, setStage] = useState('selecting');

  useEffect(() => {
    let t;
    if (stage === 'selecting') {
      t = setTimeout(() => setStage('revealed'), 1200);
    } else {
      t = setTimeout(() => setStage('selecting'), 2800);
    }
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {/* Banner — fades in on reveal */}
      <div
        style={{
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          opacity: stage === 'revealed' ? 1 : 0,
          transform: stage === 'revealed' ? 'translateY(0)' : 'translateY(-6px)',
        }}
        className="bg-game-correct rounded-sm py-2 px-4 text-center"
      >
        <span className="text-white text-xs font-bold uppercase tracking-widest">
          Correct — You found the phony!
        </span>
      </div>

      {/* Mini word grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {EXAMPLE_WORDS.map((w) => {
          const isImpostor = w === 'STONE';
          let borderColor = '#2a2a2a';
          let textColor = '#f5f5f5';
          if (stage === 'revealed') {
            borderColor = isImpostor ? '#dc2626' : '#f5c842';
            textColor = isImpostor ? '#dc2626' : '#f5c842';
          } else if (isImpostor) {
            borderColor = '#f5f5f5';
          }
          return (
            <div
              key={w}
              style={{
                border: `1.5px solid ${borderColor}`,
                color: textColor,
                transition: 'border-color 0.3s ease, color 0.3s ease',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
              }}
              className="rounded-sm px-2 py-3 text-xs font-bold uppercase tracking-widest text-center bg-game-card"
            >
              {w}
            </div>
          );
        })}
      </div>

      {/* Confirm button — fades out on reveal */}
      <div
        style={{
          transition: 'opacity 0.25s ease',
          opacity: stage === 'selecting' ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="w-full py-2 bg-game-text text-game-bg text-xs font-bold uppercase tracking-widest rounded-sm text-center"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          Confirm — STONE
        </div>
      </div>
    </div>
  );
}

const visuals = {
  grid: <GridVisual />,
  hints: <HintsVisual />,
  reveal: <RevealVisual />,
};

export default function OnboardingOverlay({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
    >
      <div className="modal-enter bg-game-card border border-game-border rounded-sm w-full max-w-sm flex flex-col">
        {/* Header row: title + skip */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <span
            className="text-game-accent text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', letterSpacing: '0.18em' }}
          >
            How to Play
          </span>
          <button
            onClick={onComplete}
            className="text-game-muted hover:text-game-text text-xs uppercase tracking-widest transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Slide indicator — decorative only */}
        <div className="flex justify-center gap-2 pt-4 pb-4">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={[
                'h-1 rounded-full transition-all duration-200',
                i === slide ? 'w-6 bg-game-accent' : 'w-2 bg-game-border',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Visual area */}
        <div className="px-6 pb-6 min-h-[200px] flex items-center justify-center">
          {visuals[current.visual]}
        </div>

        {/* Text */}
        <div className="px-6 pb-6 text-center">
          <h2
            className="text-game-text font-bold text-xl leading-tight mb-3 whitespace-pre-line"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {current.title}
          </h2>
          <p className="text-game-muted text-sm leading-relaxed">{current.body}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 px-6 pb-6">
          {slide > 0 && (
            <button
              onClick={() => setSlide((s) => s - 1)}
              className="flex-1 py-2.5 border border-game-border text-game-muted text-sm font-bold uppercase tracking-widest rounded-sm hover:text-game-text hover:border-[#444] transition-colors"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={onComplete}
              className="flex-1 py-2.5 bg-game-accent text-game-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-yellow-300 transition-colors"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              Play
            </button>
          ) : (
            <button
              onClick={() => setSlide((s) => s + 1)}
              className="flex-1 py-2.5 bg-game-text text-game-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
