
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { constructionGames } from '@/data/gameData';
import GameCard from './GameCard';
import GameHUD from './GameHUD';

const CampaignMode: React.FC = () => {
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
  const gamesWithStatus = constructionGames.map(game => ({
    ...game,
    completed: completedGames.includes(game.id)
  }));

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Software Construction"
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
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            UNIT-4: CAMPAIGN MODE
          </h1>
          
          <Link to="/game-modes" className="cyber-button text-sm py-2">
            EXIT CAMPAIGN
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
            MISSION BRIEFING
          </h2>
          <p className="text-gray-300 mb-4">
            Welcome to the Software Construction campaign, agent. Your mission is to master the 
            essential skills of software development through a series of specialized challenges.
          </p>
          <p className="text-gray-300 mb-6">
            Complete all missions to unlock the final exam and prove your expertise in coding standards,
            code reviews, testing strategies, and debugging.
          </p>
          <div className="flex space-x-2">
            <div className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
              {playerStats.xp} XP EARNED
            </div>
            <div className="cyber-badge bg-cyber-muted text-white">
              {completedGames.length}/{constructionGames.length} MISSIONS COMPLETED
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-blue">AVAILABLE MISSIONS</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesWithStatus.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                path={game.path}
                difficulty={game.difficulty}
                xpReward={game.xpReward}
                completed={game.completed}
              />
            ))}
          </div>
        </div>
        
        <div className="cyber-container p-6 border-cyber-accent mt-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-cyber-terminal-red mb-2">FINAL BOSS EXAM</h3>
              <p className="text-gray-400 text-sm">
                Complete all Campaign missions to unlock the Final Boss Exam
              </p>
            </div>
            
            <button 
              className={`cyber-button-accent ${
                completedGames.length < constructionGames.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={completedGames.length < constructionGames.length}
            >
              {completedGames.length < constructionGames.length ? 'LOCKED' : 'CHALLENGE BOSS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignMode;
