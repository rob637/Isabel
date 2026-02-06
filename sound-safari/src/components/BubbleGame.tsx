import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './BubbleGame.css';

interface Bubble {
  id: string;
  word: WordCardType;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface BubbleGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

export function BubbleGame({ onBack, onComplete, onEarnSticker }: BubbleGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);
  const [currentTarget, setCurrentTarget] = useState<WordCardType | null>(null);
  
  const { speakWord, celebrate } = useSpeech();
  const { playBubblePop, playSuccess } = useSoundEffects();

  // Refs to store latest functions without causing re-renders
  const speakWordRef = useRef(speakWord);
  const celebrateRef = useRef(celebrate);
  const onCompleteRef = useRef(onComplete);
  const onEarnStickerRef = useRef(onEarnSticker);
  
  speakWordRef.current = speakWord;
  celebrateRef.current = celebrate;
  onCompleteRef.current = onComplete;
  onEarnStickerRef.current = onEarnSticker;

  // Get all words from all categories - memoized to prevent infinite loops
  const allWords = useMemo(() => soundCategories.flatMap(cat => cat.words), []);
  const hasInitialized = useRef(false);
  const needsNewTarget = useRef(false);

  const createBubble = useCallback((): Bubble => {
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    return {
      id: `${Date.now()}-${Math.random()}`,
      word,
      x: Math.random() * 70 + 15,
      y: 100 + Math.random() * 20,
      size: 80 + Math.random() * 40,
      speed: 0.3 + Math.random() * 0.3,
    };
  }, [allWords]);

  // Initialize bubbles and target - only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initialBubbles = Array.from({ length: 5 }, () => createBubble());
    setBubbles(initialBubbles);
    
    // Set first target
    if (initialBubbles.length > 0) {
      const firstTarget = initialBubbles[0].word;
      setCurrentTarget(firstTarget);
      setTimeout(() => {
        speakWordRef.current(firstTarget.word, firstTarget.sound);
      }, 500);
    }
  }, [createBubble]);

  // Animate bubbles floating up - uses ref to avoid dependency issues
  useEffect(() => {
    const createBubbleForInterval = () => {
      const word = allWords[Math.floor(Math.random() * allWords.length)];
      return {
        id: `${Date.now()}-${Math.random()}`,
        word,
        x: Math.random() * 70 + 15,
        y: 100 + Math.random() * 20,
        size: 80 + Math.random() * 40,
        speed: 0.3 + Math.random() * 0.3,
      };
    };
    
    const interval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -20);

        while (updated.length < 5) {
          updated.push(createBubbleForInterval());
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [allWords]);

  // Handle setting new target - separate effect triggered by flag
  useEffect(() => {
    if (needsNewTarget.current && bubbles.length > 0 && !currentTarget) {
      needsNewTarget.current = false;
      const randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
      setCurrentTarget(randomBubble.word);
      speakWordRef.current(randomBubble.word.word, randomBubble.word.sound);
    }
  }, [bubbles, currentTarget]);

  const handleBubblePop = useCallback((bubble: Bubble) => {
    if (bubble.word.id === currentTarget?.id) {
      playBubblePop();
      playSuccess();
      
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      onCompleteRef.current(bubble.word.id);
      
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore % 5 === 0) {
          const sticker = onEarnStickerRef.current();
          setEarnedSticker(sticker);
          setShowCelebration(true);
        } else {
          celebrateRef.current("Yes!");
        }
        return newScore;
      });
      
      // Set flag for new target
      needsNewTarget.current = true;
      setCurrentTarget(null);
    } else {
      playBubblePop();
      speakWordRef.current(bubble.word.word, bubble.word.sound);
    }
  }, [currentTarget, playBubblePop, playSuccess]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  const handleTargetTap = useCallback(() => {
    if (currentTarget) {
      speakWordRef.current(currentTarget.word, currentTarget.sound);
    }
  }, [currentTarget]);

  return (
    <div className="bubble-game">
      <div className="bubble-game-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ← Back
        </motion.button>
        <div className="game-title">Pop the Bubbles!</div>
        <div className="game-score">
          {score} 🫧
        </div>
      </div>

      {currentTarget && (
        <motion.div
          className="target-prompt"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleTargetTap}
        >
          <div className="target-label">Find:</div>
          <div className="target-emoji">{currentTarget.emoji}</div>
          <div className="target-word">
            <span className="target-sound">{currentTarget.word[0]}</span>
            {currentTarget.word.slice(1)}
          </div>
          <div className="tap-to-hear">👆 Tap to hear</div>
        </motion.div>
      )}

      <div className="bubble-container">
        <AnimatePresence>
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className="bubble"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleBubblePop(bubble)}
            >
              <span className="bubble-emoji">{bubble.word.emoji}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Celebration
        show={showCelebration}
        onComplete={handleCelebrationComplete}
        sticker={earnedSticker}
      />
    </div>
  );
}
