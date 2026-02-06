import { motion } from 'framer-motion';
import type { SoundCategory } from '../types';
import { useSoundEffects } from '../hooks/useAudio';
import './SoundButton.css';

interface SoundButtonProps {
  category: SoundCategory;
  practiceCount: number;
  onClick: () => void;
}

export function SoundButton({ category, practiceCount, onClick }: SoundButtonProps) {
  const { playPop } = useSoundEffects();

  const handleClick = () => {
    playPop();
    onClick();
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '';
    }
  };

  return (
    <motion.button
      className="sound-button"
      style={{ backgroundColor: category.color }}
      whileHover={{ scale: 1.08, rotate: [-1, 1, -1, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div className="sound-letter">{category.sound}</div>
      <div className="sound-label">{category.label}</div>
      <div className="sound-difficulty">{getDifficultyLabel(category.difficulty)}</div>
      {practiceCount > 0 && (
        <div className="practice-badge">
          {practiceCount} ✓
        </div>
      )}
    </motion.button>
  );
}
