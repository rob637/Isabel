import { motion } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import './WordCard.css';

interface WordCardProps {
  word: WordCardType;
  onComplete: () => void;
  size?: 'normal' | 'large';
}

export function WordCard({ word, onComplete, size = 'normal' }: WordCardProps) {
  const { speakWord } = useSpeech();
  const { playPop } = useSoundEffects();

  const handleTap = () => {
    playPop();
    speakWord(word.word, word.sound);
    
    // Auto-complete after speech has time to finish
    setTimeout(onComplete, 3000);
  };

  return (
    <motion.div
      className={`word-card ${size}`}
      style={{ backgroundColor: word.color + '33' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label={`Say ${word.word}`}
    >
      <motion.div
        className="word-emoji"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {word.emoji}
      </motion.div>
      
      <div className="word-text">
        <span className="first-letter" style={{ color: word.color }}>
          {word.word[0]}
        </span>
        <span className="rest-of-word">
          {word.word.slice(1)}
        </span>
      </div>
      
      <motion.div
        className="tap-hint"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Tap me!
      </motion.div>
    </motion.div>
  );
}
