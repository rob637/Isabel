import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './MemoryGame.css';

interface MemoryGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

interface MemoryCard {
  id: string;
  word: WordCardType;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame({ onBack, onComplete, onEarnSticker }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const { speakWord, speak, celebrate } = useSpeech();
  const { playPop, playSuccess, playWhoosh } = useSoundEffects();

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

  const initializeGame = useCallback(() => {
    // Pick 4 random words (will create 8 cards - pairs)
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 4);
    
    // Create pairs
    const gamecards: MemoryCard[] = [];
    selectedWords.forEach((word) => {
      gamecards.push({ id: `${word.id}-a`, word, isFlipped: false, isMatched: false });
      gamecards.push({ id: `${word.id}-b`, word, isFlipped: false, isMatched: false });
    });
    
    // Shuffle cards
    gamecards.sort(() => Math.random() - 0.5);
    setCards(gamecards);
    setFlippedCards([]);
  }, [allWords]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeGame();
      // Intro voice for non-readers
      setTimeout(() => {
        speakRef.current("Find the matching pictures!", { rate: 0.85 });
      }, 300);
    }
  }, [initializeGame]);

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playPop();
    speakWordRef.current(card.word.word, card.word.sound);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      setTimeout(() => {
        if (firstCard && secondCard && firstCard.word.id === secondCard.word.id) {
          // Match!
          playSuccess();
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          onCompleteRef.current(firstCard.word.id);
          
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore % 3 === 0) {
              const sticker = onEarnStickerRef.current();
              setEarnedSticker(sticker);
              setShowCelebration(true);
            } else {
              // Reinforce the matched word
              setTimeout(() => {
                speakWordRef.current(firstCard.word.word, firstCard.word.sound);
              }, 500);
            }
            return newScore;
          });
        } else {
          // No match - flip back
          playWhoosh();
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 700);
    }
  }, [cards, flippedCards, isChecking, playPop, playSuccess, playWhoosh]);

  // Check if all cards are matched
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => {
        celebrateRef.current("You found all the matches!");
        setTimeout(() => {
          hasInitialized.current = false;
          initializeGame();
        }, 1200);
      }, 300);
    }
  }, [cards, initializeGame]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  return (
    <div className="memory-game">
      <div className="memory-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <h1>🧠 Memory Match</h1>
        <div className="memory-score">{score} Matches</div>
      </div>

      <div className="memory-instructions">
        Find the matching pairs!
      </div>

      <div className="memory-grid">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="card-back" style={{ backgroundColor: card.word.color + '44' }}>
                <span className="card-emoji">{card.word.emoji}</span>
                <span className="card-word">{card.word.word}</span>
              </div>
            ) : (
              <div className="card-front">
                <span className="card-question">?</span>
              </div>
            )}
          </motion.div>
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
