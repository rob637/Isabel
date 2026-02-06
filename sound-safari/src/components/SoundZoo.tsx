import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoundCategory, WordCard as WordCardType } from '../types';
import { WordCard } from './WordCard';
import { Celebration } from './Celebration';
import { useSoundEffects } from '../hooks/useAudio';
import './SoundZoo.css';

interface SoundZooProps {
  category: SoundCategory;
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
  practiceCount: number;
}

export function SoundZoo({ category, onBack, onComplete, onEarnSticker, practiceCount }: SoundZooProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);
  const [completedInSession, setCompletedInSession] = useState(0);
  const { playWhoosh } = useSoundEffects();

  const currentWord: WordCardType = category.words[currentIndex];

  const handleWordComplete = useCallback(() => {
    onComplete(currentWord.id);
    const newCompleted = completedInSession + 1;
    setCompletedInSession(newCompleted);

    // Award sticker every 5 words
    if ((practiceCount + newCompleted) % 5 === 0) {
      const sticker = onEarnSticker();
      setEarnedSticker(sticker);
    }

    setShowCelebration(true);
  }, [currentWord.id, onComplete, completedInSession, practiceCount, onEarnSticker]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
    playWhoosh();
    
    // Move to next word
    setCurrentIndex((prev) => (prev + 1) % category.words.length);
  }, [playWhoosh, category.words.length]);

  const handlePrevious = () => {
    playWhoosh();
    setCurrentIndex((prev) => (prev - 1 + category.words.length) % category.words.length);
  };

  const handleNext = () => {
    playWhoosh();
    setCurrentIndex((prev) => (prev + 1) % category.words.length);
  };

  return (
    <div className="sound-zoo">
      <div className="sound-zoo-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <div 
          className="category-title"
          style={{ color: category.color }}
        >
          {category.sound} {category.words[0]?.emoji}
        </div>
        <div className="session-score">
          {completedInSession} ⭐
        </div>
      </div>

      <div className="word-progress">
        {category.words.map((_, i) => (
          <div 
            key={i} 
            className={`progress-dot ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'completed' : ''}`}
            style={{ backgroundColor: i === currentIndex ? category.color : undefined }}
          />
        ))}
      </div>

      <div className="word-card-container">
        <motion.button
          className="nav-arrow left"
          onClick={handlePrevious}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ◀
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <WordCard 
              word={currentWord} 
              onComplete={handleWordComplete}
              size="large"
            />
          </motion.div>
        </AnimatePresence>

        <motion.button
          className="nav-arrow right"
          onClick={handleNext}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ▶
        </motion.button>
      </div>

      <div className="sound-zoo-hint">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👆
        </motion.div>
      </div>

      <Celebration 
        show={showCelebration} 
        onComplete={handleCelebrationComplete}
        sticker={earnedSticker}
      />
    </div>
  );
}
