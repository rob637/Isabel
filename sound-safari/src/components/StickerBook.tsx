import { motion } from 'framer-motion';
import type { Sticker } from '../types';
import { useSoundEffects } from '../hooks/useAudio';
import './StickerBook.css';

interface StickerBookProps {
  stickers: Sticker[];
  onBack: () => void;
}

export function StickerBook({ stickers, onBack }: StickerBookProps) {
  const { playPop } = useSoundEffects();
  const unlockedCount = stickers.filter(s => s.unlocked).length;

  const handleStickerTap = (sticker: Sticker) => {
    if (sticker.unlocked) {
      playPop();
    }
  };

  return (
    <div className="sticker-book">
      <div className="sticker-book-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <div className="sticker-book-title">🏆 My Stickers</div>
        <div className="sticker-count">
          {unlockedCount} / {stickers.length}
        </div>
      </div>

      <div className="sticker-progress">
        <div 
          className="sticker-progress-bar"
          style={{ width: `${(unlockedCount / stickers.length) * 100}%` }}
        />
      </div>

      <div className="sticker-grid">
        {stickers.map((sticker, index) => (
          <motion.div
            key={sticker.id}
            className={`sticker-item ${sticker.unlocked ? 'unlocked' : 'locked'}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={sticker.unlocked ? { scale: 1.2, rotate: [0, -5, 5, 0] } : {}}
            whileTap={sticker.unlocked ? { scale: 0.9 } : {}}
            onClick={() => handleStickerTap(sticker)}
          >
            <div className="sticker-emoji">
              {sticker.unlocked ? sticker.emoji : '❓'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="sticker-hint">
        🌟
      </div>
    </div>
  );
}
