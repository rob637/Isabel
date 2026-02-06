import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './TrainGame.css';

interface TrainGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

export function TrainGame({ onBack, onComplete, onEarnSticker }: TrainGameProps) {
  const [targetSound, setTargetSound] = useState<string>('');
  const [trainCars, setTrainCars] = useState<WordCardType[]>([]);
  const [options, setOptions] = useState<WordCardType[]>([]);
  const [score, setScore] = useState(0);
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

    // Get words with that sound and some distractors
    const matchingWords = allWords.filter(w => w.sound === sound);
    const otherWords = allWords.filter(w => w.sound !== sound);
    
    // Pick 2 matching and 2 distractors
    const shuffledMatching = [...matchingWords].sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledOther = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 2);
    
    const roundOptions = [...shuffledMatching, ...shuffledOther].sort(() => Math.random() - 0.5);
    setOptions(roundOptions);
    setTrainCars([]);

    setTimeout(() => {
      // Speak an example word to help non-readers
      const exampleWord = shuffledMatching[0]?.word || sound;
      speakRef.current(`Find words like ${exampleWord}!`, { rate: 0.8 });
    }, 300);
  }, [allWords]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      generateRound();
    }
  }, [generateRound]);

  const handleOptionClick = useCallback((word: WordCardType) => {
    speakWordRef.current(word.word, word.sound);

    if (word.sound === targetSound) {
      // Correct! Add to train
      playMagic();
      setTrainCars(prev => [...prev, word]);
      setOptions(prev => prev.filter(w => w.id !== word.id));
      onCompleteRef.current(word.id);

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore % 4 === 0) {
          const sticker = onEarnStickerRef.current();
          setEarnedSticker(sticker);
          setShowCelebration(true);
        } else {
          // Reinforce the word after a beat
          setTimeout(() => {
            speakWordRef.current(word.word, word.sound);
          }, 1200);
        }
        return newScore;
      });
    } else {
      // Wrong
      playWhoosh();
      setTimeout(() => {
        speakRef.current("Try another one!", { rate: 0.9 });
      }, 1500);
    }
  }, [targetSound, playMagic, playWhoosh]);

  // Check if all matching words are found
  useEffect(() => {
    const matchingInOptions = options.filter(w => w.sound === targetSound);
    if (trainCars.length > 0 && matchingInOptions.length === 0) {
      setTimeout(() => {
        playSuccess();
        celebrateRef.current("Train complete! All aboard!");
        setTimeout(() => {
          hasInitialized.current = false;
          generateRound();
        }, 1200);
      }, 500);
    }
  }, [options, trainCars, targetSound, generateRound, playSuccess]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  const targetCategory = soundCategories.find(c => c.sound === targetSound);

  return (
    <div className="train-game" style={{ background: `linear-gradient(135deg, ${targetCategory?.color || '#4CAF50'}aa, ${targetCategory?.color || '#4CAF50'}dd)` }}>
      <div className="train-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <h1>🚂 Sound Train</h1>
        <div className="train-score">{score} Cars</div>
      </div>

      <div className="train-target">
        <motion.div
          className="target-sound"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Find words that start with <span className="sound-letter">{targetSound}</span>!
        </motion.div>
      </div>

      <div className="train-track">
        <div className="train">
          <motion.div 
            className="locomotive"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🚂
          </motion.div>
          <AnimatePresence>
            {trainCars.map((car) => (
              <motion.div
                key={car.id}
                className="train-car"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ backgroundColor: car.color + '88' }}
              >
                <span className="car-emoji">{car.emoji}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="train-options">
        {options.map((word) => (
          <motion.button
            key={word.id}
            className="option-button"
            onClick={() => handleOptionClick(word)}
            whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: word.color + '66', borderColor: word.color }}
          >
            <span className="option-emoji">{word.emoji}</span>
          </motion.button>
        ))}
      </div>

      <Celebration 
        show={showCelebration} 
        onComplete={handleCelebrationComplete}
        sticker={earnedSticker}
      />
    </div>
  );
}
