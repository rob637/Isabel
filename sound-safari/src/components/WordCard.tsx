import { useState, useCallback, useRef } from 'react';
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
  const { startRecording, stopRecording, playRecording, audioBlob } = useRecording();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const autoStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  const handleTap = () => {
    playPop();
    speakWord(word.word, word.sound);
    
    // Auto-complete after speech has time to finish
    setTimeout(onComplete, 3000);
  };

  const handleRecordTap = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecordError(null);
    
    if (isRecording) {
      // Stop recording
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      setIsRecording(false);
      const blob = await stopRecording();
      if (blob) {
        recordedBlobRef.current = blob;
        playSuccess();
      }
    } else {
      // Start recording
      playPop();
      recordedBlobRef.current = null;
      
      try {
        const started = await startRecording();
        if (started) {
          setIsRecording(true);
          // Auto-stop after 3 seconds
          autoStopTimeoutRef.current = setTimeout(async () => {
            setIsRecording(false);
            const blob = await stopRecording();
            if (blob) {
              recordedBlobRef.current = blob;
              playSuccess();
            }
          }, 3000);
        } else {
          setRecordError('Mic access denied');
        }
      } catch (err) {
        console.error('Recording error:', err);
        setRecordError('Recording failed');
      }
    }
  }, [isRecording, startRecording, stopRecording, playPop, playSuccess]);

  // Use audioBlob from hook or our local ref
  const hasRecorded = audioBlob !== null || recordedBlobRef.current !== null;

  const handlePlayTap = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const blobToPlay = recordedBlobRef.current || audioBlob;
    if (!blobToPlay) return;
    
    playPop();
    setIsPlaying(true);
    try {
      await playRecording(blobToPlay);
    } catch (error) {
      console.error('Playback error:', error);
    }
    setIsPlaying(false);
  }, [playRecording, audioBlob, playPop]);

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
        
        {recordError && (
          <div className="record-error">{recordError}</div>
        )}
      </div>
    </motion.div>
  );
}
