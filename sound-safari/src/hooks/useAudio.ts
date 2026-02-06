import { useCallback, useRef } from 'react';

// Use Web Speech API for text-to-speech
export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const getBestVoice = useCallback(() => {
    // Return cached voice if available
    if (cachedVoiceRef.current) return cachedVoiceRef.current;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    
    // Priority 1: Natural/Neural female voices (sound most human-like)
    // These are the highest quality voices available on modern systems
    const naturalVoicePatterns = [
      // Microsoft Edge/Windows 11 Neural voices (best quality)
      /Microsoft.*Jenny.*Neural/i,
      /Microsoft.*Aria.*Neural/i,
      /Microsoft.*Sara.*Neural/i,
      // Google's neural voices
      /Google.*Female/i,
      // Apple's enhanced/premium voices  
      /Samantha.*Enhanced/i,
      /Samantha.*Premium/i,
    ];
    
    for (const pattern of naturalVoicePatterns) {
      const voice = voices.find(v => pattern.test(v.name) && v.lang.includes('en'));
      if (voice) {
        cachedVoiceRef.current = voice;
        return voice;
      }
    }
    
    // Priority 2: Standard good female voices (US English)
    const femaleVoiceNames = [
      'Samantha',           // macOS/iOS - warm, friendly
      'Karen',              // macOS - Australian but clear
      'Victoria',           // macOS
      'Microsoft Zira',     // Windows 10 - US female
      'Microsoft Jenny',    // Windows 11 - US female
      'Microsoft Aria',     // Windows 11 - US female
      'Google US English Female',
    ];
    
    for (const name of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.includes(name) && 
        (v.lang.includes('en-US') || v.lang.includes('en_US') || v.lang === 'en-US')
      );
      if (voice) {
        cachedVoiceRef.current = voice;
        return voice;
      }
    }
    
    // Priority 3: Any female-sounding en-US voice
    const femaleUS = voices.find(v => 
      v.lang.includes('en-US') && 
      (v.name.toLowerCase().includes('female') || 
       /zira|jenny|aria|sara|samantha|karen|victoria/i.test(v.name))
    );
    if (femaleUS) {
      cachedVoiceRef.current = femaleUS;
      return femaleUS;
    }
    
    // Priority 4: Any en-US voice (avoid British)
    const anyUS = voices.find(v => 
      (v.lang === 'en-US' || v.lang.includes('en-US')) && 
      !v.lang.includes('en-GB') && !v.lang.includes('en-AU')
    );
    if (anyUS) {
      cachedVoiceRef.current = anyUS;
      return anyUS;
    }
    
    // Last resort: first English voice
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    cachedVoiceRef.current = anyEnglish || null;
    return anyEnglish || null;
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; emphasis?: boolean }) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Warmer, more natural settings
    utterance.rate = options?.rate ?? 0.85;  // Slightly faster but still gentle
    utterance.pitch = options?.pitch ?? 1.0; // Natural pitch (not too high)
    utterance.volume = 1;

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getBestVoice]);

  const speakWord = useCallback((word: string, sound: string) => {
    // First emphasize the initial sound, then say the full word
    const emphasis = `${sound}... ${word}!`;
    speak(emphasis, { rate: 0.8, pitch: 1.05 });  // Gentle, encouraging tone
  }, [speak]);

  const celebrate = useCallback((message: string) => {
    speak(message, { rate: 0.9, pitch: 1.1 });  // Warm, encouraging celebration
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, speakWord, celebrate, stop };
}

// Sound effects using Web Audio API
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getContext]);

  const playPop = useCallback(() => {
    playTone(800, 0.1, 'sine');
    setTimeout(() => playTone(600, 0.05, 'sine'), 50);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(523, 0.15, 'sine'); // C5
    setTimeout(() => playTone(659, 0.15, 'sine'), 100); // E5
    setTimeout(() => playTone(784, 0.3, 'sine'), 200); // G5
  }, [playTone]);

  const playMagic = useCallback(() => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine'), i * 80);
    });
  }, [playTone]);

  const playBubblePop = useCallback(() => {
    playTone(1200, 0.08, 'sine');
  }, [playTone]);

  const playChomp = useCallback(() => {
    playTone(200, 0.1, 'square');
    setTimeout(() => playTone(150, 0.1, 'square'), 80);
  }, [playTone]);

  const playWhoosh = useCallback(() => {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [getContext]);

  return { playPop, playSuccess, playMagic, playBubblePop, playChomp, playWhoosh };
}
