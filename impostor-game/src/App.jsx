import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import WordGrid from './components/WordGrid.jsx';
import HintPanel from './components/HintPanel.jsx';
import ConnectionReveal from './components/ConnectionReveal.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import StatsModal from './components/StatsModal.jsx';
import OnboardingOverlay from './components/OnboardingOverlay.jsx';
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
  const { stats, recordResult } = useStats();
  const { playTriumph } = useTriumphSound();

  const handleGameComplete = useCallback(
    (won, wrongCount) => {
      recordResult(won, wrongCount);
    },
    [recordResult]
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
  } = useGameState(handleGameComplete);

  const handleHelpClick = useCallback(() => {
    // Re-show the onboarding overlay when help is clicked
    setShowOnboarding(true);
  }, []);

  // Play fanfare once when the player wins and enters the revealing phase
  useEffect(() => {
    if (won && phase === 'revealing') playTriumph();
  }, [won, phase, playTriumph]);

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header onStatsClick={() => setShowStats(true)} onHelpClick={handleHelpClick} />
        <LoadingScreen />
      </div>
    );
  }

  if (phase === 'no-puzzle' || noPuzzle) {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header onStatsClick={() => setShowStats(true)} onHelpClick={handleHelpClick} />
        <NoPuzzleScreen />
        {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col">
        <Header onStatsClick={() => setShowStats(true)} onHelpClick={handleHelpClick} />
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

      {/* Onboarding overlay — first-time OR help button */}
      {(phase === 'onboarding' || showOnboarding) && (
        <OnboardingOverlay
          onComplete={() => {
            if (phase === 'onboarding') {
              completeOnboarding();
            }
            setShowOnboarding(false);
          }}
        />
      )}

      <Header onStatsClick={() => setShowStats(true)} onHelpClick={handleHelpClick} />

      <main className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8 gap-8">
        {/* Game header */}
        {phase !== 'scorecard' && (
          <div className="w-full text-center space-y-1">
            <div className="text-game-muted text-xs uppercase tracking-widest">
              {phase === 'playing'
                ? `${wrongGuessCount} / ${maxWrong} wrong guesses`
                : phase === 'revealing'
                ? won
                  ? 'Impostor found!'
                  : 'The impostor got away'
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
          <ScoreCard
            puzzle={puzzle}
            guesses={guesses}
            displayedWords={displayedWords}
            won={won}
          />
        )}

        {/* Playing / Revealing phases */}
        {(phase === 'playing' || phase === 'revealing') && (
          <>
            {/* Connection reveal section */}
            {phase === 'revealing' && (
              <ConnectionReveal
                puzzle={puzzle}
                displayedWords={displayedWords}
                won={won}
                onContinue={proceedToScorecard}
              />
            )}

            {/* Word grid */}
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

                {/* Hint panel */}
                {hintsRevealed > 0 && (
                  <HintPanel hints={puzzle.hints} hintsRevealed={hintsRevealed} />
                )}

                {/* Confirm button */}
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
                </div>
              </>
            )}
          </>
        )}
      </main>

      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
    </div>
  );
}
