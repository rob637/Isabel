import { motion } from 'framer-motion';
import type { SoundCategory } from '../types';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import './SoundButton.css';

interface SoundButtonProps {
  category: SoundCategory;
  practiceCount: number;
  onClick: () => void;
}

export function SoundButton({ category, practiceCount, onClick }: SoundButtonProps) {
  const { playPop } = useSoundEffects();
  const { speak } = useSpeech();

  const handleClick = () => {
    playPop();
    // Speak the sound for non-readers
    speak(`${category.sound}! Let's practice ${category.sound}!`, { rate: 0.9 });
    onClick();
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
      <div className="sound-emoji">{category.words[0]?.emoji || '🔤'}</div>
      {practiceCount > 0 && (
        <div className="practice-badge">
          ⭐
        </div>
      )}
    </motion.button>
  );
}
