import { useState, useEffect, useCallback, useRef } from 'react';
import { getTodayString } from '../utils/dateUtils.js';

const ONBOARDING_KEY = 'impostor_onboarding_complete';

function getPuzzleStateKey(dateStr, isArchive) {
  // Archive plays are stored separately so they never conflict with daily puzzle state
  return isArchive
    ? `impostor_archive_${dateStr}_state`
    : `impostor_puzzle_${dateStr}_state`;
}

function getArchiveDoneKey(dateStr) {
  return `impostor_archive_${dateStr}_done`;
}

function saveArchiveDone(dateStr, won) {
  // Separate completion record so archive games can always start fresh
  try {
    localStorage.setItem(getArchiveDoneKey(dateStr), JSON.stringify({ won }));
  } catch {
    // ignore
  }
}

function loadSavedState(dateStr, isArchive) {
  try {
    const raw = localStorage.getItem(getPuzzleStateKey(dateStr, isArchive));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(dateStr, isArchive, state) {
  try {
    const toSave = {
      guesses: state.guesses,
      hintsRevealed: state.hintsRevealed,
      phase: state.phase,
      won: state.won,
    };
    localStorage.setItem(getPuzzleStateKey(dateStr, isArchive), JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

function buildDisplayedWords(puzzle) {
  if (!puzzle) return [];
  return puzzle.display_word_order.map((idx) => puzzle.words[idx]);
}

export function useGameState(onGameComplete, overrideDateStr = null) {
  const todayStr = getTodayString();
  const dateStr = overrideDateStr ?? todayStr;
  const isArchive = overrideDateStr !== null;

  const [phase, setPhase] = useState('loading');
  const [puzzle, setPuzzle] = useState(null);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [won, setWon] = useState(false);
  const [shakingWord, setShakingWord] = useState(null);
  const [noPuzzle, setNoPuzzle] = useState(false);
  const [error, setError] = useState(null);

  const onGameCompleteRef = useRef(onGameComplete);
  onGameCompleteRef.current = onGameComplete;

  // Stable ref for puzzle so callbacks can read it without re-creating
  const puzzleRef = useRef(puzzle);
  puzzleRef.current = puzzle;

  // Load puzzle whenever the target date changes (daily ↔ archive)
  useEffect(() => {
    setPhase('loading');
    setSelectedWord(null);
    setGuesses([]);
    setHintsRevealed(0);
    setWon(false);
    setShakingWord(null);
    setNoPuzzle(false);
    setError(null);
    setPuzzle(null);
    setDisplayedWords([]);

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

        const saved = loadSavedState(dateStr, isArchive);

        if (!isArchive && saved && (saved.phase === 'revealing' || saved.phase === 'scorecard')) {
          // Daily puzzle: restore completed state
          setGuesses(saved.guesses || []);
          setHintsRevealed(saved.hintsRevealed || 0);
          setWon(saved.won || false);
          setPhase('scorecard');
          return;
        }

        // Archive puzzles that were completed always start fresh
        // (completion is tracked separately via impostor_archive_${date}_done)
        if (saved && saved.phase === 'playing') {
          setGuesses(saved.guesses || []);
          setHintsRevealed(saved.hintsRevealed || 0);
        }

        // Archive puzzles skip onboarding
        if (isArchive) {
          setPhase('playing');
        } else {
          const onboardingDone = localStorage.getItem(ONBOARDING_KEY) === 'true';
          setPhase(onboardingDone ? 'playing' : 'onboarding');
        }
      } catch (err) {
        setError(err.message);
        setPhase('error');
      }
    }

    fetchPuzzle();
  }, [dateStr, isArchive]);

  // Persist state on every meaningful change
  useEffect(() => {
    if (!puzzle || phase === 'loading' || phase === 'onboarding' || phase === 'no-puzzle' || phase === 'error') return;
    saveState(dateStr, isArchive, { guesses, hintsRevealed, phase, won });
  }, [puzzle, guesses, hintsRevealed, phase, won, dateStr, isArchive]);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setPhase('playing');
  }, []);

  const selectWord = useCallback(
    (word) => {
      if (phase !== 'playing') return;
      if (guesses.includes(word)) return;
      setSelectedWord((prev) => (prev === word ? null : word));
    },
    [phase, guesses]
  );

  const confirmGuess = useCallback(() => {
    if (!selectedWord || phase !== 'playing') return;
    if (guesses.includes(selectedWord)) return;

    const p = puzzleRef.current;
    const isCorrect = selectedWord === p.impostor;
    const newGuesses = [...guesses, selectedWord];

    if (isCorrect) {
      const wrongCount = newGuesses.filter((g) => g !== p.impostor).length;
      setGuesses(newGuesses);
      setSelectedWord(null);
      setWon(true);
      setPhase('revealing');
      saveState(dateStr, isArchive, { guesses: newGuesses, hintsRevealed, phase: 'revealing', won: true });
      if (isArchive) saveArchiveDone(dateStr, true);
      onGameCompleteRef.current?.(true, wrongCount);
    } else {
      setShakingWord(selectedWord);
      setTimeout(() => setShakingWord(null), 600);

      const wrongCount = newGuesses.filter((g) => g !== p.impostor).length;
      const newHints = Math.min(hintsRevealed + 1, p.hints.length);

      setGuesses(newGuesses);
      setHintsRevealed(newHints);
      setSelectedWord(null);

      if (wrongCount >= 5) {
        setWon(false);
        setTimeout(() => {
          setPhase('revealing');
          saveState(dateStr, isArchive, { guesses: newGuesses, hintsRevealed: newHints, phase: 'revealing', won: false });
          if (isArchive) saveArchiveDone(dateStr, false);
          onGameCompleteRef.current?.(false, wrongCount);
        }, 700);
      } else {
        saveState(dateStr, isArchive, { guesses: newGuesses, hintsRevealed: newHints, phase: 'playing', won: false });
      }
    }
  }, [selectedWord, phase, guesses, hintsRevealed, dateStr, isArchive]);

  const proceedToScorecard = useCallback(() => {
    setPhase('scorecard');
    saveState(dateStr, isArchive, { guesses, hintsRevealed, phase: 'scorecard', won });
  }, [dateStr, isArchive, guesses, hintsRevealed, won]);

  const resetPuzzle = useCallback(() => {
    localStorage.removeItem(getPuzzleStateKey(dateStr, isArchive));
    setSelectedWord(null);
    setGuesses([]);
    setHintsRevealed(0);
    setWon(false);
    setShakingWord(null);
    setPhase('playing');
  }, [dateStr, isArchive]);

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
    resetPuzzle,
  };
}
