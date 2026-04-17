import React, { useMemo } from 'react';

const EMOJIS = ['🕵️', '🔍'];
const COUNT = 48;

export default function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * 100,
      size: 18 + Math.random() * 16,
      duration: 2.4 + Math.random() * 1.8,
      delay: Math.random() * 1.8,
      drift: (Math.random() - 0.5) * 120,
      rotate: (Math.random() - 0.5) * 540,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-60px',
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
