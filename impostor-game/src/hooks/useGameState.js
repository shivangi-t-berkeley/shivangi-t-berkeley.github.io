import { useState, useEffect, useCallback, useRef } from 'react';
import { getTodayString } from '../utils/dateUtils.js';

const ONBOARDING_KEY = 'impostor_onboarding_complete';

function getPuzzleStateKey(dateStr) {
  return `impostor_puzzle_${dateStr}_state`;
}

function loadSavedState(dateStr) {
  try {
    const raw = localStorage.getItem(getPuzzleStateKey(dateStr));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(dateStr, state) {
  try {
    const toSave = {
      guesses: state.guesses,
      hintsRevealed: state.hintsRevealed,
      phase: state.phase,
      won: state.won,
    };
    localStorage.setItem(getPuzzleStateKey(dateStr), JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

function buildDisplayedWords(puzzle) {
  if (!puzzle) return [];
  return puzzle.display_word_order.map((idx) => puzzle.words[idx]);
}

export function useGameState(onGameComplete) {
  const [phase, setPhase] = useState('loading'); // loading | onboarding | playing | revealing | scorecard
  const [puzzle, setPuzzle] = useState(null);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [guesses, setGuesses] = useState([]); // array of guessed words in order
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [won, setWon] = useState(false);
  const [shakingWord, setShakingWord] = useState(null);
  const [noPuzzle, setNoPuzzle] = useState(false);
  const [error, setError] = useState(null);

  const dateStr = getTodayString();
  const onGameCompleteRef = useRef(onGameComplete);
  onGameCompleteRef.current = onGameComplete;

  // Load puzzle on mount
  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const res = await fetch(`/impostor-game/puzzles/${dateStr}.json`);
        if (!res.ok) {
          setNoPuzzle(true);
          setPhase('no-puzzle');
          return;
        }
        const data = await res.json();
        setPuzzle(data);
        setDisplayedWords(buildDisplayedWords(data));

        // Check saved state
        const saved = loadSavedState(dateStr);
        if (saved && (saved.phase === 'revealing' || saved.phase === 'scorecard')) {
          setGuesses(saved.guesses || []);
          setHintsRevealed(saved.hintsRevealed || 0);
          setWon(saved.won || false);
          setPhase('scorecard');
          return;
        }

        if (saved && saved.phase === 'playing') {
          setGuesses(saved.guesses || []);
          setHintsRevealed(saved.hintsRevealed || 0);
          setWon(false);
        }

        // Check onboarding
        const onboardingDone = localStorage.getItem(ONBOARDING_KEY) === 'true';
        if (!onboardingDone) {
          setPhase('onboarding');
        } else {
          setPhase('playing');
        }
      } catch (err) {
        setError(err.message);
        setPhase('error');
      }
    }

    fetchPuzzle();
  }, [dateStr]);

  // Persist state whenever it changes (during playing phase)
  useEffect(() => {
    if (!puzzle || phase === 'loading' || phase === 'onboarding' || phase === 'no-puzzle' || phase === 'error') return;
    saveState(dateStr, { guesses, hintsRevealed, phase, won });
  }, [puzzle, guesses, hintsRevealed, phase, won, dateStr]);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setPhase('playing');
  }, []);

  const selectWord = useCallback(
    (word) => {
      if (phase !== 'playing') return;
      if (guesses.includes(word)) return; // already guessed
      setSelectedWord((prev) => (prev === word ? null : word));
    },
    [phase, guesses]
  );

  const confirmGuess = useCallback(() => {
    if (!selectedWord || phase !== 'playing') return;
    if (guesses.includes(selectedWord)) return;

    const isCorrect = selectedWord === puzzle.impostor;
    const newGuesses = [...guesses, selectedWord];

    if (isCorrect) {
      const wrongCount = newGuesses.filter((g) => g !== puzzle.impostor).length;
      setGuesses(newGuesses);
      setSelectedWord(null);
      setWon(true);
      setPhase('revealing');
      saveState(dateStr, { guesses: newGuesses, hintsRevealed, phase: 'revealing', won: true });
      onGameCompleteRef.current?.(true, wrongCount);
    } else {
      // Wrong guess — shake, reveal next hint, clear selection
      setShakingWord(selectedWord);
      setTimeout(() => setShakingWord(null), 600);

      const wrongCount = newGuesses.filter((g) => g !== puzzle.impostor).length;
      const newHints = Math.min(hintsRevealed + 1, puzzle.hints.length);

      setGuesses(newGuesses);
      setHintsRevealed(newHints);
      setSelectedWord(null);

      if (wrongCount >= 5) {
        // Fail state
        setWon(false);
        setTimeout(() => {
          setPhase('revealing');
          saveState(dateStr, { guesses: newGuesses, hintsRevealed: newHints, phase: 'revealing', won: false });
          onGameCompleteRef.current?.(false, wrongCount);
        }, 700);
      } else {
        saveState(dateStr, { guesses: newGuesses, hintsRevealed: newHints, phase: 'playing', won: false });
      }
    }
  }, [selectedWord, phase, guesses, puzzle, hintsRevealed, dateStr]);

  const proceedToScorecard = useCallback(() => {
    setPhase('scorecard');
    saveState(dateStr, { guesses, hintsRevealed, phase: 'scorecard', won });
  }, [dateStr, guesses, hintsRevealed, won]);

  const wrongGuesses = guesses.filter((g) => puzzle && g !== puzzle.impostor);

  return {
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
    dateStr,
    selectWord,
    confirmGuess,
    completeOnboarding,
    proceedToScorecard,
  };
}
