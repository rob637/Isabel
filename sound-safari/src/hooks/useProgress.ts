import { useState, useEffect, useCallback } from 'react';
import type { Progress, Sticker } from '../types';
import { allStickers } from '../data/words';

const STORAGE_KEY = 'sound-safari-progress';

const defaultProgress: Progress = {
  soundsPracticed: {},
  wordsCompleted: [],
  stickersEarned: [],
  totalSessions: 0,
  streakDays: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProgress, ...parsed };
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
    return defaultProgress;
  });

  const [stickers, setStickers] = useState<Sticker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const earnedIds = new Set(parsed.stickersEarned || []);
        return allStickers.map(s => ({
          ...s,
          unlocked: earnedIds.has(s.id)
        }));
      }
    } catch (e) {
      console.error('Error loading stickers:', e);
    }
    return allStickers;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [progress]);

  const recordPractice = useCallback((sound: string, wordId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        soundsPracticed: {
          ...prev.soundsPracticed,
          [sound]: (prev.soundsPracticed[sound] || 0) + 1,
        },
        wordsCompleted: prev.wordsCompleted.includes(wordId)
          ? prev.wordsCompleted
          : [...prev.wordsCompleted, wordId],
        lastPlayed: new Date(),
      };
      return newProgress;
    });
  }, []);

  const earnSticker = useCallback(() => {
    const unlockedSticker = stickers.find(s => !s.unlocked);
    if (unlockedSticker) {
      setStickers(prev => 
        prev.map(s => 
          s.id === unlockedSticker.id 
            ? { ...s, unlocked: true, unlockedAt: new Date() } 
            : s
        )
      );
      setProgress(prev => ({
        ...prev,
        stickersEarned: [...prev.stickersEarned, unlockedSticker.id],
      }));
      return unlockedSticker;
    }
    return null;
  }, [stickers]);

  const incrementSession = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    setStickers(allStickers);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getTotalPracticeCount = useCallback(() => {
    return Object.values(progress.soundsPracticed).reduce((a, b) => a + b, 0);
  }, [progress.soundsPracticed]);

  return {
    progress,
    stickers,
    recordPractice,
    earnSticker,
    incrementSession,
    resetProgress,
    getTotalPracticeCount,
  };
}
