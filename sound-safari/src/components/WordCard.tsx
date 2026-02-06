import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCard as WordCardType } from '../types';
import { useSpeech, useSoundEffects, useRecording } from '../hooks/useAudio';
import './WordCard.css';

interface WordCardProps {
  word: WordCardType;
  onComplete: () => void;
  size?: 'normal' | 'large';
}

export function WordCard({ word, onComplete, size = 'normal' }: WordCardProps) {
  const { speakWord } = useSpeech();
  const { playPop, playSuccess } = useSoundEffects();
  const { startRecording, stopRecording, playRecording, hasRecording, clearRecording } = useRecording();
  
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTap = () => {
    playPop();
    speakWord(word.word, word.sound);
    
    // Auto-complete after speech has time to finish
    setTimeout(onComplete, 3000);
  };

  const handleRecordTap = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isRecording) {
      // Stop recording
      await stopRecording();
      setIsRecording(false);
      setHasRecorded(true);
      playSuccess();
    } else {
      // Start recording
      playPop();
      // Clear any previous recording
      clearRecording();
      setHasRecorded(false);
      
      const started = await startRecording();
      if (started) {
        setIsRecording(true);
        // Auto-stop after 3 seconds
        setTimeout(async () => {
          if (isRecording) {
            await stopRecording();
            setIsRecording(false);
            setHasRecorded(true);
            playSuccess();
          }
        }, 3000);
      }
    }
  }, [isRecording, startRecording, stopRecording, clearRecording, playPop, playSuccess]);

  const handlePlayTap = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!hasRecording()) return;
    
    playPop();
    setIsPlaying(true);
    try {
      await playRecording();
    } catch (error) {
      console.error('Playback error:', error);
    }
    setIsPlaying(false);
  }, [playRecording, hasRecording, playPop]);

  return (
    <motion.div
      className={`word-card ${size}`}
      style={{ backgroundColor: word.color + '33', borderColor: word.color }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label={`Say ${word.word}`}
    >
      <motion.div
        className="word-emoji"
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {word.emoji}
      </motion.div>
      
      <div className="word-text">
        <span className="word-sound">{word.word[0]}</span>
        {word.word.slice(1)}
      </div>
      
      <div className="word-card-actions">
        <motion.div
          className="tap-indicator"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          👆
        </motion.div>
        
        <motion.button
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={handleRecordTap}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={isRecording ? { 
            scale: [1, 1.2, 1],
            boxShadow: ['0 0 0 0 rgba(255,0,0,0.4)', '0 0 0 15px rgba(255,0,0,0)', '0 0 0 0 rgba(255,0,0,0.4)']
          } : {}}
          transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
        >
          {isRecording ? '⏹️' : '🎤'}
        </motion.button>
        
        <AnimatePresence>
          {hasRecorded && (
            <motion.button
              className={`play-button ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayTap}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? '🔊' : '▶️'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
