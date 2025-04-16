
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { managementGames } from '@/data/gameData';
import GameCard from './GameCard';
import GameHUD from './GameHUD';

const BossBattleMode: React.FC = () => {
  const [playerStats] = useState({
    level: 1,
    xp: 0,
    maxXp: 100,
    lives: 3,
    score: 0
  });
  
  // Mock completed games (would normally come from player progress)
  const completedGames: string[] = [];
  
  // Enhanced games with completion status
  const gamesWithStatus = managementGames.map(game => ({
    ...game,
    completed: completedGames.includes(game.id)
  }));

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Product Management"
        time={0}
        score={playerStats.score}
        lives={playerStats.lives}
        level={playerStats.level}
        attempts={0}
        xp={playerStats.xp}
        maxXp={playerStats.maxXp}
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyber-secondary cyber-text-glow">
            UNIT-5: BOSS BATTLE MODE
          </h1>
          
          <Link to="/game-modes" className="cyber-button text-sm py-2">
            RETREAT
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8 border-cyber-secondary">
          <h2 className="text-xl font-bold text-cyber-terminal-yellow mb-4">
            THREAT ASSESSMENT
          </h2>
          <p className="text-gray-300 mb-4">
            Welcome to the Product Management battleground, agent. Here you'll face challenging scenarios 
            that test your ability to handle risks, create management plans, and navigate product releases.
          </p>
          <p className="text-gray-300 mb-6">
            These boss battles require advanced strategy and decision-making skills. Prepare for
            high-pressure situations that simulate real-world product management challenges.
          </p>
          <div className="flex space-x-2">
            <div className="cyber-badge bg-cyber-secondary/20 text-cyber-secondary">
              {playerStats.xp} XP EARNED
            </div>
            <div className="cyber-badge bg-cyber-muted text-white">
              {completedGames.length}/{managementGames.length} BOSSES DEFEATED
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-yellow">BOSS ENCOUNTERS</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {gamesWithStatus.map(game => (
              <div key={game.id} className="cyber-container p-1">
                <div className={`h-full ${game.completed ? 'border-green-500' : ''}`}>
                  <GameCard
                    title={game.title}
                    description={game.description}
                    image={game.imageUrl}
                    path={game.path}
                    difficulty={game.difficulty}
                    xpReward={game.xpReward}
                    completed={game.completed}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cyber-container p-6 border-cyber-accent mt-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-cyber-terminal-red mb-2">MEGA BOSS: PRODUCT CRISIS</h3>
              <p className="text-gray-400 text-sm">
                Defeat all Product Management bosses to unlock the ultimate challenge
              </p>
            </div>
            
            <button 
              className={`cyber-button-accent ${
                completedGames.length < managementGames.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={completedGames.length < managementGames.length}
            >
              {completedGames.length < managementGames.length ? 'LOCKED' : 'FACE MEGA BOSS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossBattleMode;
