import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './StarGame.css';

interface StarGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

interface FallingStar {
  id: string;
  word: WordCardType;
  x: number;
  delay: number;
}

export function StarGame({ onBack, onComplete, onEarnSticker }: StarGameProps) {
  const [targetSound, setTargetSound] = useState<string>('');
  const [stars, setStars] = useState<FallingStar[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);

  const { speakWord, speak, celebrate } = useSpeech();
  const { playSuccess, playWhoosh, playMagic } = useSoundEffects();

  // Refs to prevent loops
  const speakRef = useRef(speak);
  const speakWordRef = useRef(speakWord);
  const celebrateRef = useRef(celebrate);
  const onCompleteRef = useRef(onComplete);
  const onEarnStickerRef = useRef(onEarnSticker);
  const hasInitialized = useRef(false);
  
  speakRef.current = speak;
  speakWordRef.current = speakWord;
  celebrateRef.current = celebrate;
  onCompleteRef.current = onComplete;
  onEarnStickerRef.current = onEarnSticker;

  const allWords = useMemo(() => soundCategories.flatMap(cat => cat.words), []);

  const generateRound = useCallback(() => {
    // Pick a random target sound
    const sounds = ['B', 'M', 'P', 'D', 'N', 'T'];
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    setTargetSound(sound);

    // Get words - some matching, some not
    const matchingWords = allWords.filter(w => w.sound === sound);
    const otherWords = allWords.filter(w => w.sound !== sound);
    
    // Pick 3 matching and 3 distractors
    const shuffledMatching = [...matchingWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const shuffledOther = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    
    const roundWords = [...shuffledMatching, ...shuffledOther].sort(() => Math.random() - 0.5);
    
    // Create falling stars with random positions and delays
    const newStars: FallingStar[] = roundWords.map((word, i) => ({
      id: `${word.id}-${Date.now()}-${i}`,
      word,
      x: 10 + Math.random() * 70, // 10-80% from left
      delay: i * 0.3, // Stagger the falls
    }));
    
    setStars(newStars);
    setCaught(0);

    setTimeout(() => {
      // Speak example words to help non-readers
      const exampleWord = shuffledMatching[0]?.word || sound;
      speakRef.current(`Catch stars like ${exampleWord}!`, { rate: 0.8 });
    }, 300);
  }, [allWords]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      generateRound();
    }
  }, [generateRound]);

  const handleStarClick = useCallback((star: FallingStar) => {
    speakWordRef.current(star.word.word, star.word.sound);
    
    // Remove the star
    setStars(prev => prev.filter(s => s.id !== star.id));

    if (star.word.sound === targetSound) {
      // Correct!
      playMagic();
      onCompleteRef.current(star.word.id);
      setCaught(prev => prev + 1);
      
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore % 5 === 0) {
          const sticker = onEarnStickerRef.current();
          setEarnedSticker(sticker);
          setShowCelebration(true);
        } else {
          // Reinforce the word after a beat
          setTimeout(() => {
            speakWordRef.current(star.word.word, star.word.sound);
          }, 1200);
        }
        return newScore;
      });
    } else {
      // Wrong star - wait then encourage
      playWhoosh();
      setTimeout(() => {
        speakRef.current("Try another star!", { rate: 0.9 });
      }, 1500);
    }
  }, [targetSound, playMagic, playWhoosh]);

  // Check if round is complete (all matching stars caught or all stars gone)
  useEffect(() => {
    const matchingStarsLeft = stars.filter(s => s.word.sound === targetSound).length;
    if (stars.length > 0 && matchingStarsLeft === 0 && caught > 0) {
      setTimeout(() => {
        playSuccess();
        celebrateRef.current("You caught all the stars!");
        setTimeout(() => {
          hasInitialized.current = false;
          generateRound();
        }, 1200);
      }, 300);
    }
  }, [stars, targetSound, caught, generateRound, playSuccess]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  const targetCategory = soundCategories.find(c => c.sound === targetSound);
  const matchingCount = stars.filter(s => s.word.sound === targetSound).length;

  return (
    <div className="star-game" style={{ background: `linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)` }}>
      <div className="star-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <h1>⭐ Star Catcher</h1>
        <div className="star-score">{score} ⭐</div>
      </div>

      <div className="star-target">
        <motion.div
          className="target-instruction"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ borderColor: targetCategory?.color }}
        >
          Catch the <span className="sound-letter" style={{ color: targetCategory?.color }}>{targetSound}</span> stars!
          <span className="remaining">({matchingCount} left)</span>
        </motion.div>
      </div>

      <div className="star-sky">
        <div className="background-stars">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="bg-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>
        
        <AnimatePresence>
          {stars.map((star) => (
            <motion.button
              key={star.id}
              className="falling-star"
              onClick={() => handleStarClick(star)}
              initial={{ y: -100, x: `${star.x}%`, opacity: 0, scale: 0 }}
              animate={{ 
                y: '100vh', 
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.5],
                rotate: [0, 360],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 4,
                delay: star.delay,
                ease: 'linear',
              }}
              style={{ 
                left: `${star.x}%`,
                backgroundColor: star.word.color + '44',
                borderColor: star.word.color,
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
            >
              <span className="star-emoji">{star.word.emoji}</span>
            </motion.button>
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
