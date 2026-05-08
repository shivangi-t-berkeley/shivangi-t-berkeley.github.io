import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import WordGrid from './components/WordGrid.jsx';
import HintPanel from './components/HintPanel.jsx';
import ConnectionReveal from './components/ConnectionReveal.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import StatsModal from './components/StatsModal.jsx';
import OnboardingOverlay from './components/OnboardingOverlay.jsx';
import ArchiveModal from './components/ArchiveModal.jsx';
import Confetti from './components/Confetti.jsx';
import { useGameState } from './hooks/useGameState.js';
import { useStats } from './hooks/useStats.js';
import { useTriumphSound } from './hooks/useTriumphSound.js';

function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div
          className="text-game-text font-bold text-sm uppercase tracking-widest animate-pulse"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          Loading puzzle...
        </div>
      </div>
    </div>
  );
}

function NoPuzzleScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-sm">
        <div
          className="text-game-text font-bold text-xl"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          No puzzle today.
        </div>
        <p className="text-game-muted text-sm leading-relaxed">
          There's no Impostor puzzle available for today. Check back tomorrow.
        </p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-sm">
        <div
          className="text-[#dc2626] font-bold text-xl"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
        >
          Something went wrong.
        </div>
        <p className="text-game-muted text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [showStats, setShowStats] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archiveDate, setArchiveDate] = useState(null);   // null = daily puzzle
  const [archiveNumber, setArchiveNumber] = useState(null);

  const { stats, recordResult } = useStats();
  const { playTriumph } = useTriumphSound();

  const handleGameComplete = useCallback(
    (won, wrongCount) => {
      // Only record stats for the daily puzzle
      if (!archiveDate) recordResult(won, wrongCount);
    },
    [recordResult, archiveDate]
  );

  const {
    phase,
    puzzle,
    displayedWords,
    selectedWord,
    guesses,
    wrongGuesses,
    hintsRevealed,
    won,
    shakingWord,
    noPuzzle,
    error,
    selectWord,
    confirmGuess,
    completeOnboarding,
    proceedToScorecard,
    resetPuzzle,
  } = useGameState(handleGameComplete, archiveDate);

  const handleHelpClick = useCallback(() => setShowOnboarding(true), []);
  const handleArchiveClick = useCallback(() => setShowArchive(true), []);

  const handleSelectArchivePuzzle = useCallback((date, number) => {
    setArchiveDate(date);
    setArchiveNumber(number);
    setShowArchive(false);
  }, []);

  const handleReturnToDaily = useCallback(() => {
    setArchiveDate(null);
    setArchiveNumber(null);
  }, []);

  // Play fanfare once when the player wins and enters the revealing phase
  useEffect(() => {
    if (won && phase === 'revealing') playTriumph();
  }, [won, phase, playTriumph]);

  const headerProps = {
    onStatsClick: () => setShowStats(true),
    onHelpClick: handleHelpClick,
    onArchiveClick: handleArchiveClick,
  };

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header {...headerProps} />
        <LoadingScreen />
      </div>
    );
  }

  if (phase === 'no-puzzle' || noPuzzle) {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header {...headerProps} />
        <NoPuzzleScreen />
        {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
        {showArchive && (
          <ArchiveModal
            onClose={() => setShowArchive(false)}
            onSelectPuzzle={handleSelectArchivePuzzle}
          />
        )}
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header {...headerProps} />
        <ErrorScreen message={error} />
      </div>
    );
  }

  const canConfirm =
    selectedWord !== null &&
    !guesses.includes(selectedWord) &&
    phase === 'playing';

  const wrongGuessCount = wrongGuesses.length;
  const maxWrong = 5;
  const showConfetti = won && (phase === 'revealing' || phase === 'scorecard');

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {showConfetti && <Confetti />}

      {/* Onboarding overlay — first-time OR help button (daily only) */}
      {(phase === 'onboarding' || showOnboarding) && (
        <OnboardingOverlay
          onComplete={() => {
            if (phase === 'onboarding') completeOnboarding();
            setShowOnboarding(false);
          }}
        />
      )}

      <Header {...headerProps} />

      {/* Archive mode banner */}
      {archiveDate && (
        <div className="w-full border-b border-game-border bg-game-bg">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <span
              className="text-game-accent text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              Archive #{archiveNumber}
            </span>
            <button
              onClick={handleReturnToDaily}
              className="text-game-muted hover:text-game-text text-xs uppercase tracking-widest transition-colors"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              ← Today's puzzle
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8 gap-8">
        {/* Game header */}
        {phase !== 'scorecard' && (
          <div className="w-full text-center space-y-1">
            <div className="text-game-muted text-xs uppercase tracking-widest">
              {phase === 'playing'
                ? `${wrongGuessCount} / ${maxWrong} wrong guesses`
                : phase === 'revealing'
                ? won
                  ? 'Phony found!'
                  : 'The phony got away'
                : null}
            </div>

            {/* Wrong guess pips */}
            {(phase === 'playing' || phase === 'revealing') && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: maxWrong }, (_, i) => (
                  <div
                    key={i}
                    className={[
                      'w-2 h-2 rounded-full transition-all duration-300',
                      i < wrongGuessCount ? 'bg-[#dc2626]' : 'bg-game-border',
                    ].join(' ')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scorecard phase */}
        {phase === 'scorecard' && (
          <>
            <ScoreCard
              puzzle={puzzle}
              guesses={guesses}
              displayedWords={displayedWords}
              won={won}
            />
            <button
              onClick={resetPuzzle}
              className="text-game-muted hover:text-game-text text-xs uppercase tracking-widest transition-colors"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              ↺ Reset puzzle
            </button>
          </>
        )}

        {/* Playing / Revealing phases */}
        {(phase === 'playing' || phase === 'revealing') && (
          <>
            {phase === 'revealing' && (
              <ConnectionReveal
                puzzle={puzzle}
                displayedWords={displayedWords}
                won={won}
                onContinue={proceedToScorecard}
              />
            )}

            {phase === 'playing' && (
              <>
                <WordGrid
                  displayedWords={displayedWords}
                  selectedWord={selectedWord}
                  guesses={guesses}
                  impostor={puzzle.impostor}
                  phase={phase}
                  shakingWord={shakingWord}
                  onSelect={selectWord}
                />

                {hintsRevealed > 0 && (
                  <HintPanel hints={puzzle.hints} hintsRevealed={hintsRevealed} />
                )}

                <div className="w-full flex flex-col items-center gap-3">
                  {canConfirm && (
                    <button
                      onClick={confirmGuess}
                      className="w-full max-w-xs py-3 bg-game-text text-game-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white transition-colors animate-fade-in"
                      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                    >
                      Confirm — {selectedWord}
                    </button>
                  )}
                  {!canConfirm && wrongGuessCount === 0 && (
                    <p className="text-game-muted text-xs text-center">
                      Select a word to begin
                    </p>
                  )}
                  {!canConfirm && wrongGuessCount > 0 && !selectedWord && (
                    <p className="text-game-muted text-xs text-center">
                      Select a word to guess
                    </p>
                  )}
                  <button
                    onClick={resetPuzzle}
                    className="text-game-muted hover:text-game-text text-xs uppercase tracking-widest transition-colors mt-2"
                    style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                  >
                    ↺ Reset puzzle
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
      {showArchive && (
        <ArchiveModal
          onClose={() => setShowArchive(false)}
          onSelectPuzzle={handleSelectArchivePuzzle}
        />
      )}
    </div>
  );
}
