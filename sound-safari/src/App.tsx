import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { SoundCategory } from './types';
import { soundCategories } from './data/words';
import { useProgress } from './hooks/useProgress';
import { Home } from './components/Home';
import { SoundZoo } from './components/SoundZoo';
import { BubbleGame } from './components/BubbleGame';
import { MonsterGame } from './components/MonsterGame';
import { MemoryGame } from './components/MemoryGame';
import { TrainGame } from './components/TrainGame';
import { TreasureGame } from './components/TreasureGame';
import { StarGame } from './components/StarGame';
import { StickerBook } from './components/StickerBook';
import { ParentDashboard } from './components/ParentDashboard';
import './App.css';

type Screen = 'home' | 'soundZoo' | 'bubbles' | 'monster' | 'memory' | 'train' | 'treasure' | 'stars' | 'stickers' | 'dashboard';
type GameType = 'bubbles' | 'monster' | 'memory' | 'train' | 'treasure' | 'stars';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | null>(null);
  
  const { 
    progress, 
    stickers, 
    recordPractice, 
    earnSticker, 
    incrementSession,
    resetProgress 
  } = useProgress();

  // Load voices on mount
  useEffect(() => {
    // Trigger voice loading
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const handleSelectSound = useCallback((category: SoundCategory) => {
    setSelectedCategory(category);
    setCurrentScreen('soundZoo');
    incrementSession();
  }, [incrementSession]);

  const handleSelectGame = useCallback((game: GameType) => {
    setCurrentScreen(game);
    incrementSession();
  }, [incrementSession]);

  const handleBack = useCallback(() => {
    setCurrentScreen('home');
    setSelectedCategory(null);
  }, []);

  const handleComplete = useCallback((wordId: string) => {
    const word = soundCategories
      .flatMap(c => c.words)
      .find(w => w.id === wordId);
    if (word) {
      recordPractice(word.sound, wordId);
    }
  }, [recordPractice]);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <Home
            key="home"
            categories={soundCategories}
            progress={progress.soundsPracticed}
            onSelectSound={handleSelectSound}
            onSelectGame={handleSelectGame}
            onOpenStickers={() => setCurrentScreen('stickers')}
            onOpenDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'soundZoo' && selectedCategory && (
          <SoundZoo
            key="soundZoo"
            category={selectedCategory}
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
            practiceCount={progress.soundsPracticed[selectedCategory.sound] || 0}
          />
        )}

        {currentScreen === 'bubbles' && (
          <BubbleGame
            key="bubbles"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'monster' && (
          <MonsterGame
            key="monster"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'memory' && (
          <MemoryGame
            key="memory"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'train' && (
          <TrainGame
            key="train"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'treasure' && (
          <TreasureGame
            key="treasure"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'stars' && (
          <StarGame
            key="stars"
            onBack={handleBack}
            onComplete={handleComplete}
            onEarnSticker={earnSticker}
          />
        )}

        {currentScreen === 'stickers' && (
          <StickerBook
            key="stickers"
            stickers={stickers}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'dashboard' && (
          <ParentDashboard
            key="dashboard"
            progress={progress}
            onBack={handleBack}
            onReset={resetProgress}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
