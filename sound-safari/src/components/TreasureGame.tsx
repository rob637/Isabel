import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { soundCategories } from '../data/words';
import { useSpeech, useSoundEffects } from '../hooks/useAudio';
import { Celebration } from './Celebration';
import './TreasureGame.css';

interface TreasureGameProps {
  onBack: () => void;
  onComplete: (wordId: string) => void;
  onEarnSticker: () => { emoji: string; name: string } | null;
}

interface TreasureSpot {
  id: number;
  word: WordCardType | null;
  isRevealed: boolean;
  x: number;
  y: number;
}

export function TreasureGame({ onBack, onComplete, onEarnSticker }: TreasureGameProps) {
  const [spots, setSpots] = useState<TreasureSpot[]>([]);
  const [score, setScore] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<{ emoji: string; name: string } | null>(null);

  const { speakWord, speak, celebrate } = useSpeech();
  const { playPop, playSuccess, playMagic } = useSoundEffects();

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
    // Create 9 spots (3x3 grid)
    const shuffledWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const gameSpots: TreasureSpot[] = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      gameSpots.push({
        id: i,
        word: i < 6 ? shuffledWords[i] : null, // 6 words, 3 empty
        isRevealed: false,
        x: col,
        y: row,
      });
    }
    
    // Shuffle spots
    gameSpots.sort(() => Math.random() - 0.5);
    setSpots(gameSpots);
    setTreasuresFound(0);

    setTimeout(() => {
      speakRef.current("Tap to find the hidden treasures!", { rate: 0.8 });
    }, 300);
  }, [allWords]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      generateRound();
    }
  }, [generateRound]);

  const handleSpotClick = useCallback((spotId: number) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot || spot.isRevealed) return;

    playPop();
    setSpots(prev => prev.map(s => 
      s.id === spotId ? { ...s, isRevealed: true } : s
    ));

    if (spot.word) {
      // Found a treasure!
      setTimeout(() => {
        playMagic();
        speakWordRef.current(spot.word!.word, spot.word!.sound);
        onCompleteRef.current(spot.word!.id);
        
        setTreasuresFound(prev => prev + 1);
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore % 5 === 0) {
            const sticker = onEarnStickerRef.current();
            setEarnedSticker(sticker);
            setShowCelebration(true);
          }
          return newScore;
        });
      }, 300);
    } else {
      // Empty spot
      speakRef.current("Try another spot!", { rate: 0.9 });
    }
  }, [spots, playPop, playMagic]);

  // Check if all treasures found
  useEffect(() => {
    const totalTreasures = spots.filter(s => s.word !== null).length;
    if (totalTreasures > 0 && treasuresFound >= totalTreasures) {
      setTimeout(() => {
        playSuccess();
        celebrateRef.current("You found all the treasures!");
        setTimeout(() => {
          hasInitialized.current = false;
          generateRound();
        }, 2500);
      }, 1000);
    }
  }, [treasuresFound, spots, generateRound, playSuccess]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setEarnedSticker(null);
  }, []);

  return (
    <div className="treasure-game">
      <div className="treasure-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ← Back
        </motion.button>
        <h1>🏴‍☠️ Treasure Hunt</h1>
        <div className="treasure-score">{score} 💎</div>
      </div>

      <div className="treasure-map-container">
        <div className="treasure-map">
          <div className="map-decorations">
            <span className="decoration palm">🌴</span>
            <span className="decoration ship">⛵</span>
            <span className="decoration compass">🧭</span>
          </div>
          
          <div className="spots-grid">
            {spots.map((spot) => (
              <motion.button
                key={spot.id}
                className={`treasure-spot ${spot.isRevealed ? 'revealed' : ''}`}
                onClick={() => handleSpotClick(spot.id)}
                whileHover={{ scale: spot.isRevealed ? 1 : 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: spot.id * 0.1 }}
              >
                {!spot.isRevealed && (
                  <span className="spot-cover">❌</span>
                )}
                {spot.isRevealed && spot.word && (
                  <motion.div
                    className="treasure-found"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    style={{ backgroundColor: spot.word.color + '66' }}
                  >
                    <span className="treasure-emoji">{spot.word.emoji}</span>
                    <span className="treasure-word">{spot.word.word}</span>
                  </motion.div>
                )}
                {spot.isRevealed && !spot.word && (
                  <motion.div
                    className="empty-spot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    🏝️
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="treasure-progress">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Found: {treasuresFound} / {spots.filter(s => s.word !== null).length} treasures
        </motion.div>
      </div>

      <Celebration 
        show={showCelebration} 
        onComplete={handleCelebrationComplete}
        sticker={earnedSticker}
      />
    </div>
  );
}
