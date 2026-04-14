import React from 'react';

function getCardState({ word, selectedWord, guesses, impostor, phase, shakingWord }) {
  const isShaking = shakingWord === word;
  const guessIndex = guesses.indexOf(word);
  const hasBeenGuessed = guessIndex !== -1;
  const isCorrect = hasBeenGuessed && word === impostor;
  const isWrong = hasBeenGuessed && word !== impostor;
  const isSelected = selectedWord === word && !hasBeenGuessed;
  const isGameOver = phase === 'revealing' || phase === 'scorecard';
  const isDisabled = isGameOver || (hasBeenGuessed && !isCorrect);

  // During reveal/scorecard: connected words get a subtle highlight, impostor gets marked
  const isRevealedCorrect = isGameOver && word === impostor;
  const isRevealedConnected = isGameOver && word !== impostor;

  return {
    isShaking,
    isCorrect,
    isWrong,
    isSelected,
    isDisabled,
    isRevealedCorrect,
    isRevealedConnected,
    hasBeenGuessed,
  };
}

function WordCard({ word, selectedWord, guesses, impostor, phase, shakingWord, onSelect }) {
  const {
    isShaking,
    isCorrect,
    isWrong,
    isSelected,
    isDisabled,
    isRevealedCorrect,
    isRevealedConnected,
    hasBeenGuessed,
  } = getCardState({ word, selectedWord, guesses, impostor, phase, shakingWord });

  const isGameOver = phase === 'revealing' || phase === 'scorecard';

  let bgColor = 'bg-game-card';
  let borderColor = 'border-game-border';
  let textColor = 'text-game-text';
  let borderWidth = 'border';
  let extraClasses = '';

  if (isShaking) {
    extraClasses += ' animate-shake';
  }

  if (isCorrect && !isGameOver) {
    bgColor = 'bg-game-correct';
    borderColor = 'border-game-correct';
    textColor = 'text-white';
    extraClasses += ' animate-pulse-correct';
  } else if (isWrong && !isGameOver) {
    bgColor = 'bg-game-card';
    borderColor = 'border-game-border';
    textColor = 'text-game-muted';
  } else if (isSelected) {
    bgColor = 'bg-[#252525]';
    borderColor = 'border-game-text';
    borderWidth = 'border-2';
  } else if (isGameOver && isRevealedCorrect) {
    bgColor = 'bg-game-correct';
    borderColor = 'border-game-correct';
    textColor = 'text-white';
  } else if (isGameOver && isRevealedConnected) {
    bgColor = 'bg-game-card';
    borderColor = 'border-game-border';
    textColor = 'text-game-text';
  }

  const strikeThrough = isWrong && !isGameOver ? 'line-through opacity-40' : '';

  return (
    <button
      onClick={() => !isDisabled && onSelect(word)}
      disabled={isDisabled || hasBeenGuessed}
      className={[
        'relative flex items-center justify-center',
        'rounded-sm px-4 py-6',
        bgColor,
        borderColor,
        borderWidth,
        textColor,
        'transition-all duration-150',
        !isDisabled && !hasBeenGuessed ? 'cursor-pointer hover:bg-[#222] hover:border-[#444]' : 'cursor-default',
        extraClasses,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={isSelected}
      aria-label={word}
    >
      <span
        className={[
          'text-xl sm:text-2xl font-bold tracking-widest uppercase select-none',
          strikeThrough,
        ].join(' ')}
        style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
      >
        {word}
      </span>

      {/* Game-over overlay markers */}
      {isGameOver && isRevealedCorrect && (
        <span className="absolute top-1.5 right-2 text-xs font-bold text-white opacity-80 uppercase tracking-wider">
          impostor
        </span>
      )}
    </button>
  );
}

export default function WordGrid({ displayedWords, selectedWord, guesses, impostor, phase, shakingWord, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
      {displayedWords.map((word) => (
        <WordCard
          key={word}
          word={word}
          selectedWord={selectedWord}
          guesses={guesses}
          impostor={impostor}
          phase={phase}
          shakingWord={shakingWord}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
