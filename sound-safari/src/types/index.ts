export interface WordCard {
  id: string;
  word: string;
  sound: string;
  emoji: string;
  color: string;
  emphasisWord: string; // Word with emphasized sound like "B-B-Ball!"
}

export interface SoundCategory {
  sound: string;
  label: string;
  color: string;
  words: WordCard[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Progress {
  soundsPracticed: Record<string, number>;
  wordsCompleted: string[];
  stickersEarned: string[];
  totalSessions: number;
  lastPlayed?: Date;
  streakDays: number;
}

export interface GameState {
  currentSound: string | null;
  currentWord: WordCard | null;
  score: number;
  showCelebration: boolean;
}
