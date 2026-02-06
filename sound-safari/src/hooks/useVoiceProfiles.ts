import { useState, useEffect, useCallback, useRef } from 'react';

// Phrases that can be recorded by parents
export const RECORDABLE_PHRASES = [
  { id: 'great_job', text: 'Great job!', category: 'celebration' },
  { id: 'you_did_it', text: 'You did it!', category: 'celebration' },
  { id: 'amazing', text: 'Amazing!', category: 'celebration' },
  { id: 'wonderful', text: 'Wonderful!', category: 'celebration' },
  { id: 'try_again', text: 'Try again!', category: 'encouragement' },
  { id: 'try_another', text: 'Try another one!', category: 'encouragement' },
  { id: 'find_matches', text: 'Find the matching pictures!', category: 'instruction' },
  { id: 'pop_bubbles', text: 'Pop the bubbles!', category: 'instruction' },
  { id: 'catch_stars', text: 'Catch the stars!', category: 'instruction' },
  { id: 'feed_monster', text: 'I want...', category: 'instruction' },
] as const;

export type PhraseId = typeof RECORDABLE_PHRASES[number]['id'];

export interface VoiceProfile {
  id: string;
  name: string;
  emoji: string;
  recordings: Record<PhraseId, string>; // phrase id -> blob URL or base64
}

const DB_NAME = 'sound-safari-voices';
const DB_VERSION = 1;
const STORE_NAME = 'voice-profiles';
const ACTIVE_PROFILE_KEY = 'active-voice-profile';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export function useVoiceProfiles() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dbRef = useRef<IDBDatabase | null>(null);

  // Load profiles on mount
  useEffect(() => {
    async function load() {
      try {
        const db = await openDB();
        dbRef.current = db;
        
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
          setProfiles(request.result || []);
          
          // Load active profile from localStorage
          const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_KEY);
          if (savedActiveId && request.result?.some((p: VoiceProfile) => p.id === savedActiveId)) {
            setActiveProfileId(savedActiveId);
          }
          
          setIsLoading(false);
        };
        
        request.onerror = () => {
          console.error('Failed to load voice profiles');
          setIsLoading(false);
        };
      } catch (error) {
        console.error('Failed to open database:', error);
        setIsLoading(false);
      }
    }
    
    load();
  }, []);

  const saveProfile = useCallback(async (profile: VoiceProfile) => {
    if (!dbRef.current) return;
    
    const tx = dbRef.current.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(profile);
    
    setProfiles(prev => {
      const existing = prev.findIndex(p => p.id === profile.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = profile;
        return updated;
      }
      return [...prev, profile];
    });
  }, []);

  const deleteProfile = useCallback(async (profileId: string) => {
    if (!dbRef.current) return;
    
    const tx = dbRef.current.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(profileId);
    
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }, [activeProfileId]);

  const setActiveProfile = useCallback((profileId: string | null) => {
    setActiveProfileId(profileId);
    if (profileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }, []);

  const createProfile = useCallback(async (name: string, emoji: string): Promise<VoiceProfile> => {
    const profile: VoiceProfile = {
      id: `profile-${Date.now()}`,
      name,
      emoji,
      recordings: {} as Record<PhraseId, string>,
    };
    await saveProfile(profile);
    return profile;
  }, [saveProfile]);

  const saveRecording = useCallback(async (profileId: string, phraseId: PhraseId, audioBlob: Blob) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    // Convert blob to base64 for storage
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(audioBlob);
    });
    
    const updatedProfile: VoiceProfile = {
      ...profile,
      recordings: {
        ...profile.recordings,
        [phraseId]: base64,
      },
    };
    
    await saveProfile(updatedProfile);
  }, [profiles, saveProfile]);

  const deleteRecording = useCallback(async (profileId: string, phraseId: PhraseId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const { [phraseId]: _, ...remainingRecordings } = profile.recordings;
    
    const updatedProfile: VoiceProfile = {
      ...profile,
      recordings: remainingRecordings as Record<PhraseId, string>,
    };
    
    await saveProfile(updatedProfile);
  }, [profiles, saveProfile]);

  const getActiveProfile = useCallback(() => {
    if (!activeProfileId) return null;
    return profiles.find(p => p.id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  const getRecording = useCallback((phraseId: PhraseId): string | null => {
    const profile = getActiveProfile();
    if (!profile) return null;
    return profile.recordings[phraseId] || null;
  }, [getActiveProfile]);

  const hasRecording = useCallback((phraseId: PhraseId): boolean => {
    return getRecording(phraseId) !== null;
  }, [getRecording]);

  return {
    profiles,
    activeProfileId,
    isLoading,
    createProfile,
    deleteProfile,
    setActiveProfile,
    saveRecording,
    deleteRecording,
    getActiveProfile,
    getRecording,
    hasRecording,
  };
}

// Hook for playing voice - with fallback to TTS
export function useVoicePlayback(voiceProfiles: ReturnType<typeof useVoiceProfiles>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPhrase = useCallback(async (
    phraseId: PhraseId, 
    fallbackSpeak: (text: string) => void
  ): Promise<void> => {
    const recording = voiceProfiles.getRecording(phraseId);
    
    if (recording) {
      // Play the custom recording
      return new Promise((resolve) => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audio = new Audio(recording);
        audioRef.current = audio;
        
        audio.onended = () => resolve();
        audio.onerror = () => {
          // Fallback to TTS on error
          const phrase = RECORDABLE_PHRASES.find(p => p.id === phraseId);
          if (phrase) fallbackSpeak(phrase.text);
          resolve();
        };
        
        audio.play().catch(() => {
          const phrase = RECORDABLE_PHRASES.find(p => p.id === phraseId);
          if (phrase) fallbackSpeak(phrase.text);
          resolve();
        });
      });
    } else {
      // Use TTS fallback
      const phrase = RECORDABLE_PHRASES.find(p => p.id === phraseId);
      if (phrase) fallbackSpeak(phrase.text);
    }
  }, [voiceProfiles]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { playPhrase, stop };
}
