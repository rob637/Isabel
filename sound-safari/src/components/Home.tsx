import { motion } from 'framer-motion';
import type { SoundCategory } from '../types';
import { SoundButton } from './SoundButton';
import { useSoundEffects } from '../hooks/useAudio';
import './Home.css';

interface HomeProps {
  categories: SoundCategory[];
  progress: Record<string, number>;
  onSelectSound: (category: SoundCategory) => void;
  onSelectGame: (game: 'bubbles' | 'monster' | 'memory' | 'train' | 'treasure' | 'stars') => void;
  onOpenStickers: () => void;
  onOpenDashboard: () => void;
}

export function Home({ 
  categories, 
  progress, 
  onSelectSound, 
  onSelectGame, 
  onOpenStickers, 
  onOpenDashboard 
}: HomeProps) {
  const { playPop, playMagic } = useSoundEffects();

  const handleGameSelect = (game: 'bubbles' | 'monster' | 'memory' | 'train' | 'treasure' | 'stars') => {
    playMagic();
    onSelectGame(game);
  };

  const easySounds = categories.filter(c => c.difficulty === 'easy');
  const mediumSounds = categories.filter(c => c.difficulty === 'medium');
  const hardSounds = categories.filter(c => c.difficulty === 'hard');

  return (
    <div className="home">
      <header className="home-header">
        <motion.div
          className="app-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        >
          <span className="title-emoji">🦁</span>
          <span className="title-text">Sound Safari</span>
        </motion.div>

        <div className="header-buttons">
          <motion.button
            className="header-btn stickers-btn"
            onClick={() => { playPop(); onOpenStickers(); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🏆 Stickers
          </motion.button>
          <motion.button
            className="header-btn parent-btn"
            onClick={() => { playPop(); onOpenDashboard(); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            👨‍👩‍👧 Parents
          </motion.button>
        </div>
      </header>

      <section className="games-section">
        <h2>🎮 Fun Games</h2>
        <div className="games-grid">
          <motion.button
            className="game-card bubbles"
            onClick={() => handleGameSelect('bubbles')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">🫧</span>
            <span className="game-name">Pop the Bubbles</span>
          </motion.button>
          <motion.button
            className="game-card monster"
            onClick={() => handleGameSelect('monster')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">👾</span>
            <span className="game-name">Feed the Monster</span>
          </motion.button>
          <motion.button
            className="game-card memory"
            onClick={() => handleGameSelect('memory')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">🧠</span>
            <span className="game-name">Memory Match</span>
          </motion.button>
          <motion.button
            className="game-card train"
            onClick={() => handleGameSelect('train')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">🚂</span>
            <span className="game-name">Sound Train</span>
          </motion.button>
          <motion.button
            className="game-card treasure"
            onClick={() => handleGameSelect('treasure')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">🏴‍☠️</span>
            <span className="game-name">Treasure Hunt</span>
          </motion.button>
          <motion.button
            className="game-card stars"
            onClick={() => handleGameSelect('stars')}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="game-icon">⭐</span>
            <span className="game-name">Catch the Stars</span>
          </motion.button>
        </div>
      </section>

      <section className="sounds-section">
        <h2>🔤 Practice Sounds</h2>
        
        <div className="difficulty-group">
          <h3>⭐ Easy Sounds</h3>
          <div className="sounds-grid">
            {easySounds.map((category, index) => (
              <motion.div
                key={category.sound}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SoundButton
                  category={category}
                  practiceCount={progress[category.sound] || 0}
                  onClick={() => onSelectSound(category)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="difficulty-group">
          <h3>⭐⭐ Medium Sounds</h3>
          <div className="sounds-grid">
            {mediumSounds.map((category, index) => (
              <motion.div
                key={category.sound}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <SoundButton
                  category={category}
                  practiceCount={progress[category.sound] || 0}
                  onClick={() => onSelectSound(category)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="difficulty-group">
          <h3>⭐⭐⭐ Challenge Sounds</h3>
          <div className="sounds-grid">
            {hardSounds.map((category, index) => (
              <motion.div
                key={category.sound}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <SoundButton
                  category={category}
                  practiceCount={progress[category.sound] || 0}
                  onClick={() => onSelectSound(category)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>Made with ❤️ for Isabel</p>
      </footer>
    </div>
  );
}
