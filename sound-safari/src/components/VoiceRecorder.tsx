import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceProfiles, RECORDABLE_PHRASES, type PhraseId, type VoiceProfile } from '../hooks/useVoiceProfiles';
import './VoiceRecorder.css';

interface VoiceRecorderProps {
  voiceProfiles: ReturnType<typeof useVoiceProfiles>;
}

const PROFILE_EMOJIS = ['👩', '👨', '👧', '👦', '👴', '👵', '🧑'];

export function VoiceRecorder({ voiceProfiles }: VoiceRecorderProps) {
  const { 
    profiles, 
    activeProfileId, 
    createProfile, 
    deleteProfile, 
    setActiveProfile, 
    saveRecording,
    deleteRecording,
  } = voiceProfiles;

  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👩');
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile | null>(null);
  const [recordingPhraseId, setRecordingPhraseId] = useState<PhraseId | null>(null);
  const [playingPhraseId, setPlayingPhraseId] = useState<PhraseId | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;
    
    const profile = await createProfile(newProfileName.trim(), selectedEmoji);
    setIsAddingProfile(false);
    setNewProfileName('');
    setSelectedProfile(profile);
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Delete this voice profile and all recordings?')) {
      await deleteProfile(profileId);
      if (selectedProfile?.id === profileId) {
        setSelectedProfile(null);
      }
    }
  };

  const startRecording = useCallback(async (phraseId: PhraseId) => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (selectedProfile && audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await saveRecording(selectedProfile.id, phraseId, audioBlob);
        }
        
        setRecordingPhraseId(null);
      };
      
      mediaRecorder.start();
      setRecordingPhraseId(phraseId);
      
      // Auto-stop after 4 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 4000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not access microphone. Please allow microphone access.');
    }
  }, [selectedProfile, saveRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const playRecording = useCallback((phraseId: PhraseId) => {
    if (!selectedProfile) return;
    
    const recording = selectedProfile.recordings[phraseId];
    if (!recording) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(recording);
    audioRef.current = audio;
    
    audio.onended = () => setPlayingPhraseId(null);
    audio.onerror = () => setPlayingPhraseId(null);
    
    setPlayingPhraseId(phraseId);
    audio.play();
  }, [selectedProfile]);

  const handleDeleteRecording = useCallback(async (phraseId: PhraseId) => {
    if (!selectedProfile) return;
    await deleteRecording(selectedProfile.id, phraseId);
  }, [selectedProfile, deleteRecording]);

  // Update selectedProfile when profiles change
  const currentSelectedProfile = selectedProfile 
    ? profiles.find(p => p.id === selectedProfile.id) || null
    : null;

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-header">
        <h3>🎙️ Custom Voice Recordings</h3>
        <p className="voice-recorder-description">
          Record your own voice for encouragement phrases! These will play instead of the computer voice.
        </p>
      </div>

      {/* Profile List */}
      <div className="profile-list">
        <div className="profile-buttons">
          {profiles.map(profile => (
            <motion.button
              key={profile.id}
              className={`profile-button ${activeProfileId === profile.id ? 'active' : ''} ${currentSelectedProfile?.id === profile.id ? 'selected' : ''}`}
              onClick={() => setSelectedProfile(profile)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="profile-emoji">{profile.emoji}</span>
              <span className="profile-name">{profile.name}</span>
              {activeProfileId === profile.id && <span className="active-badge">✓</span>}
            </motion.button>
          ))}
          
          <motion.button
            className="add-profile-button"
            onClick={() => setIsAddingProfile(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add Voice
          </motion.button>
        </div>
      </div>

      {/* Add Profile Modal */}
      <AnimatePresence>
        {isAddingProfile && (
          <motion.div
            className="add-profile-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="add-profile-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h4>Add Voice Profile</h4>
              
              <div className="emoji-selector">
                {PROFILE_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    className={`emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <input
                type="text"
                placeholder="Name (e.g., Mom, Dad)"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="profile-name-input"
                maxLength={20}
              />
              
              <div className="modal-buttons">
                <button className="cancel-button" onClick={() => setIsAddingProfile(false)}>
                  Cancel
                </button>
                <button className="save-button" onClick={handleCreateProfile}>
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Profile Recordings */}
      {currentSelectedProfile && (
        <div className="profile-recordings">
          <div className="profile-recordings-header">
            <h4>{currentSelectedProfile.emoji} {currentSelectedProfile.name}'s Recordings</h4>
            <div className="profile-actions">
              <button
                className={`use-voice-button ${activeProfileId === currentSelectedProfile.id ? 'active' : ''}`}
                onClick={() => setActiveProfile(
                  activeProfileId === currentSelectedProfile.id ? null : currentSelectedProfile.id
                )}
              >
                {activeProfileId === currentSelectedProfile.id ? '✓ Using this voice' : 'Use this voice'}
              </button>
              <button
                className="delete-profile-button"
                onClick={() => handleDeleteProfile(currentSelectedProfile.id)}
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="phrase-list">
            {RECORDABLE_PHRASES.map(phrase => {
              const hasRecording = !!currentSelectedProfile.recordings[phrase.id];
              const isRecording = recordingPhraseId === phrase.id;
              const isPlaying = playingPhraseId === phrase.id;

              return (
                <div key={phrase.id} className="phrase-item">
                  <div className="phrase-text">
                    <span className="phrase-category">{phrase.category}</span>
                    "{phrase.text}"
                  </div>
                  
                  <div className="phrase-actions">
                    {hasRecording && (
                      <>
                        <motion.button
                          className={`play-button ${isPlaying ? 'playing' : ''}`}
                          onClick={() => playRecording(phrase.id)}
                          whileTap={{ scale: 0.9 }}
                          disabled={isRecording}
                        >
                          {isPlaying ? '🔊' : '▶️'}
                        </motion.button>
                        <motion.button
                          className="delete-recording-button"
                          onClick={() => handleDeleteRecording(phrase.id)}
                          whileTap={{ scale: 0.9 }}
                          disabled={isRecording}
                        >
                          ✕
                        </motion.button>
                      </>
                    )}
                    
                    <motion.button
                      className={`record-button ${isRecording ? 'recording' : ''}`}
                      onClick={() => isRecording ? stopRecording() : startRecording(phrase.id)}
                      whileTap={{ scale: 0.9 }}
                      animate={isRecording ? {
                        boxShadow: ['0 0 0 0 rgba(255,0,0,0.4)', '0 0 0 10px rgba(255,0,0,0)', '0 0 0 0 rgba(255,0,0,0.4)']
                      } : {}}
                      transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
                    >
                      {isRecording ? '⏹️' : (hasRecording ? '🔄' : '🎤')}
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {profiles.length === 0 && (
        <div className="no-profiles">
          <p>No voice profiles yet. Add one to start recording!</p>
        </div>
      )}
    </div>
  );
}
