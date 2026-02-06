import { motion } from 'framer-motion';
import type { Progress } from '../types';
import { soundCategories } from '../data/words';
import './ParentDashboard.css';

interface ParentDashboardProps {
  progress: Progress;
  onBack: () => void;
  onReset: () => void;
}

export function ParentDashboard({ progress, onBack, onReset }: ParentDashboardProps) {
  const totalPractice = Object.values(progress.soundsPracticed).reduce((a, b) => a + b, 0);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onReset();
    }
  };

  return (
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ← Back
        </motion.button>
        <div className="dashboard-title">Progress Dashboard</div>
        <div className="placeholder" />
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-emoji">📊</div>
            <div className="stat-value">{totalPractice}</div>
            <div className="stat-label">Words Practiced</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">🎯</div>
            <div className="stat-value">{progress.wordsCompleted.length}</div>
            <div className="stat-label">Unique Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">⭐</div>
            <div className="stat-value">{progress.stickersEarned.length}</div>
            <div className="stat-label">Stickers Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">🎮</div>
            <div className="stat-value">{progress.totalSessions}</div>
            <div className="stat-label">Sessions</div>
          </div>
        </div>

        <div className="sounds-progress">
          <h3>Sound Practice</h3>
          <div className="sound-bars">
            {soundCategories.map(category => {
              const count = progress.soundsPracticed[category.sound] || 0;
              const maxCount = Math.max(...Object.values(progress.soundsPracticed), 1);
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={category.sound} className="sound-bar-row">
                  <div className="sound-bar-label" style={{ color: category.color }}>
                    {category.sound}
                  </div>
                  <div className="sound-bar-container">
                    <motion.div
                      className="sound-bar-fill"
                      style={{ backgroundColor: category.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                  <div className="sound-bar-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="therapy-tips">
          <h3>💡 Tips for Parents</h3>
          <ul>
            <li>Practice in short sessions (3-5 minutes) to maintain engagement</li>
            <li>Celebrate every attempt, not just correct pronunciations</li>
            <li>Model the correct sound by saying it slowly and clearly</li>
            <li>Focus on one sound at a time until comfortable</li>
            <li>Make it playful - no pressure!</li>
            <li>Point to your mouth when making the sound so they can see</li>
          </ul>
        </div>

        <div className="actions">
          <motion.button
            className="reset-button"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset All Progress
          </motion.button>
        </div>
      </div>
    </div>
  );
}
