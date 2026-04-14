import { useState, useCallback } from 'react';
import { getTodayString, getYesterdayString } from '../utils/dateUtils.js';

const STATS_KEY = 'impostor_stats';

const defaultStats = {
  streak: 0,
  lastPlayed: null,
  totalPlayed: 0,
  totalWon: 0,
  // index 0 = lost (0/5), index 1 = 1/5, ..., index 5 = 5/5
  scoreDistribution: [0, 0, 0, 0, 0, 0],
};

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...defaultStats };
    const parsed = JSON.parse(raw);
    return {
      ...defaultStats,
      ...parsed,
      scoreDistribution:
        Array.isArray(parsed.scoreDistribution) && parsed.scoreDistribution.length === 6
          ? parsed.scoreDistribution
          : [...defaultStats.scoreDistribution],
    };
  } catch {
    return { ...defaultStats };
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage errors
  }
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);

  const recordResult = useCallback((won, wrongGuessCount) => {
    const today = getTodayString();
    const yesterday = getYesterdayString();

    setStats((prev) => {
      // Don't double-record if already played today
      if (prev.lastPlayed === today) return prev;

      let newStreak = prev.streak;
      if (prev.lastPlayed === yesterday) {
        newStreak = prev.streak + 1;
      } else if (prev.lastPlayed !== today) {
        newStreak = won ? 1 : 0;
      }

      // scoreIndex: 0 = lost, 1-5 = score (5 - wrongGuessCount)
      const scoreIndex = won ? Math.max(0, 5 - wrongGuessCount) : 0;
      const newDist = [...prev.scoreDistribution];
      newDist[scoreIndex] = (newDist[scoreIndex] || 0) + 1;

      const next = {
        streak: newStreak,
        lastPlayed: today,
        totalPlayed: prev.totalPlayed + 1,
        totalWon: prev.totalWon + (won ? 1 : 0),
        scoreDistribution: newDist,
      };

      saveStats(next);
      return next;
    });
  }, []);

  return { stats, recordResult };
}
