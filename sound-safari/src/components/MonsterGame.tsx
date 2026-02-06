import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './MonsterGame.css';

interface MonsterGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

const monsters = ['👾', '👻', '🐲', '🦖', '🐸', '🐵'];

export function MonsterGame({ onBack, onComplete, onEarnSticker }: MonsterGameProps) {
  const [score, setScore] = useState(0);
  const [currentMonster, setCurrentMonster] = useState(monsters[0]);
  const [targetWord, setTargetWord] = useState<WordCardType | null>(null);
  const [options, setOptions] = useState<WordCardType[]>([]);
  const [isEating, setIsEating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);
  const [monsterMood, setMonsterMood] = useState<'happy' | 'waiting' | 'eating'>('waiting');

  const { speakWord, speak, celebrate } = useSpeech();
  const { playChomp, playSuccess } = useSoundEffects();

  // Refs to avoid re-render loops
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

  // Memoize allWords to prevent infinite loops
  const allWords = useMemo(() => soundCategories.flatMap(cat => cat.words), []);

  const generateRound = useCallback(() => {
    // Pick random words for options (4 options)
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const roundOptions = shuffled.slice(0, 4);
    const target = roundOptions[Math.floor(Math.random() * roundOptions.length)];
    
    setOptions(roundOptions);
    setTargetWord(target);
    setMonsterMood('waiting');
    
    // Monster asks for the item
    setTimeout(() => {
      speakRef.current(`I want ${target.word}!`, { rate: 0.8, pitch: 0.8 });
    }, 500);
  }, [allWords]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      generateRound();
      setCurrentMonster(monsters[Math.floor(Math.random() * monsters.length)]);
    }
  }, [generateRound]);

  const handleOptionClick = useCallback((word: WordCardType) => {
    if (isEating) return;

    if (word.id === targetWord?.id) {
      // Correct!
      setIsEating(true);
      setMonsterMood('eating');
      playChomp();
      
      setTimeout(() => {
        playSuccess();
        setMonsterMood('happy');
        onCompleteRef.current(word.id);
        
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore % 5 === 0) {
            const sticker = onEarnStickerRef.current();
            setEarnedSticker(sticker);
            setShowCelebration(true);
          } else {
            // Reinforce the word - say it after a beat
            setTimeout(() => {
              speakWordRef.current(word.word, word.sound);
            }, 500);
          }
          return newScore;
        });
        
        // Next round after delay
        setTimeout(() => {
          setIsEating(false);
          setCurrentMonster(monsters[Math.floor(Math.random() * monsters.length)]);
          generateRound();
        }, 1500);
      }, 500);
    } else {
      // Wrong - speak what it was, encourage
      speakWordRef.current(word.word, word.sound);
      setTimeout(() => {
        speakRef.current("Try again!", { rate: 0.9 });
      }, 1500);
    }
  }, [isEating, targetWord?.id, playChomp, playSuccess, generateRound]);

  const handleTargetTap = useCallback(() => {
    if (targetWord) {
      speakWordRef.current(targetWord.word, targetWord.sound);
    }
  }, [targetWord]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  return (
    <div className="monster-game">
      <div className="monster-game-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <div className="game-title">👾 Feed the Monster!</div>
        <div className="game-score">
          {score} 🍴
        </div>
      </div>

      <div className="monster-area">
        <motion.div
          className="monster"
          animate={{
            scale: monsterMood === 'eating' ? [1, 1.3, 1] : 1,
            rotate: monsterMood === 'happy' ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {currentMonster}
        </motion.div>
        
        <motion.div
          className="speech-bubble"
          onClick={handleTargetTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {targetWord && (
            <>
              <div className="want-text">I want...</div>
              <div className="wanted-item">
                <span className="wanted-emoji">{targetWord.emoji}</span>
                <span className="wanted-word">
                  <span className="wanted-sound">{targetWord.word[0]}</span>
                  {targetWord.word.slice(1)}!
                </span>
              </div>
              <div className="tap-hint">👆 Tap to hear</div>
            </>
          )}
        </motion.div>
      </div>

      <div className="food-options">
        <AnimatePresence>
          {options.map((word, index) => (
            <motion.button
              key={word.id}
              className="food-option"
              style={{ backgroundColor: word.color + '33' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(word)}
              disabled={isEating}
            >
              <span className="option-emoji">{word.emoji}</span>
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
