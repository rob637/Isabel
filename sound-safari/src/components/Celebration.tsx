import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { celebrationMessages } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import './Celebration.css';

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
  sticker?: { emoji: string; name: string } | null;
}

export function Celebration({ show, onComplete, sticker }: CelebrationProps) {
  const { celebrate } = useSpeech();
  const { playSuccess, playMagic } = useSoundEffects();
  
  // Use refs to avoid re-triggering effect when callbacks change
  const onCompleteRef = useRef(onComplete);
  const celebrateRef = useRef(celebrate);
  const playSuccessRef = useRef(playSuccess);
  const playMagicRef = useRef(playMagic);
  const hasTriggeredRef = useRef(false);
  
  // Keep refs updated
  onCompleteRef.current = onComplete;
  celebrateRef.current = celebrate;
  playSuccessRef.current = playSuccess;
  playMagicRef.current = playMagic;

  useEffect(() => {
    if (show && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      playSuccessRef.current();
      const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
      setTimeout(() => celebrateRef.current(message), 200);
      
      if (sticker) {
        setTimeout(() => playMagicRef.current(), 1000);
      }

      const timer = setTimeout(() => {
        onCompleteRef.current();
      }, sticker ? 3500 : 2500);
      
      return () => clearTimeout(timer);
    } else if (!show) {
      hasTriggeredRef.current = false;
    }
  }, [show, sticker]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][
                    Math.floor(Math.random() * 7)
                  ],
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                  x: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Stars */}
          <div className="stars-container">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="star"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: Math.random() * 0.8,
                }}
              >
                ⭐
              </motion.div>
            ))}
          </div>

          {/* Main celebration content */}
          <motion.div
            className="celebration-content"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            <div className="celebration-emoji">🎉</div>
            <div className="celebration-text">
              {celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]}
            </div>
          </motion.div>

          {/* Sticker reward */}
          {sticker && (
            <motion.div
              className="sticker-reward"
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 1, type: 'spring', damping: 8 }}
            >
              <div className="sticker-text">⭐ New Sticker!</div>
              <motion.div
                className="sticker-emoji"
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                {sticker.emoji}
              </motion.div>
              <div className="sticker-name">{sticker.name}</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
