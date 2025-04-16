
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { constructionGames } from '@/data/gameData';
import GameCard from './GameCard';
import GameHUD from './GameHUD';
import { usePlayer } from '@/context/PlayerContext';
import { Trophy, Star, Check, AlertTriangle } from 'lucide-react';

const CampaignMode: React.FC = () => {
  const { player } = usePlayer();
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Display tutorial for new players
  useEffect(() => {
    if (player.completedGames.length === 0) {
      setShowTutorial(true);
    }
  }, [player.completedGames.length]);
  
  // Enhanced games with completion status
  const gamesWithStatus = constructionGames.map(game => ({
    ...game,
    completed: player.completedGames.includes(game.id)
  }));

  // Calculate campaign progress
  const completedCount = gamesWithStatus.filter(game => game.completed).length;
  const totalGames = gamesWithStatus.length;
  const progressPercentage = (completedCount / totalGames) * 100;
  
  const bossBattleUnlocked = completedCount === totalGames;

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Software Construction"
        time={0}
        score={0}
        lives={3}
        level={player.level}
        attempts={0}
        xp={player.xp}
        maxXp={player.maxXp}
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
        
        {showTutorial && (
          <div className="cyber-container p-6 mb-8 border-cyber-accent bg-cyber-accent/10 animate-pulse">
            <div className="flex items-start">
              <AlertTriangle className="text-cyber-accent mr-3 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-cyber-accent mb-2">
                  NEW AGENT BRIEFING
                </h2>
                <p className="text-gray-300 mb-4">
                  Welcome to your first mission, agent. You must complete all four training modules to 
                  unlock the final challenge. Start with the Coding Standards Quest to learn the basics.
                </p>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="cyber-button-accent text-sm py-1 px-4"
                >
                  ACKNOWLEDGE
                </button>
              </div>
            </div>
          </div>
        )}
        
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
          
          <div className="flex flex-col md:flex-row md:items-center mb-4 space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <Star className="text-cyber-primary w-5 h-5" />
              <div className="text-sm text-gray-300">
                <span className="text-cyber-primary font-bold">{player.xp}</span> XP EARNED
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Check className="text-green-400 w-5 h-5" />
              <div className="text-sm text-gray-300">
                <span className="text-green-400 font-bold">{completedCount}/{totalGames}</span> MISSIONS COMPLETED
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Trophy className="text-cyber-secondary w-5 h-5" />
              <div className="text-sm text-gray-300">
                <span className="text-cyber-secondary font-bold">{player.badges.filter(b => b.unlocked).length}</span> BADGES UNLOCKED
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-blue">AVAILABLE MISSIONS</h2>
            <div className="flex-1 h-px bg-cyber-border ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {gamesWithStatus.map(game => (
              <div key={game.id} className="transition-all duration-300 transform hover:scale-105">
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
                !bossBattleUnlocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!bossBattleUnlocked}
            >
              {!bossBattleUnlocked ? 'LOCKED' : 'CHALLENGE BOSS'}
            </button>
          </div>
          
          {!bossBattleUnlocked && (
            <div className="mt-4 flex items-center space-x-2">
              <div className="text-xs text-cyber-terminal-yellow">
                MISSIONS REQUIRED:
              </div>
              {gamesWithStatus.map(game => (
                <div 
                  key={game.id} 
                  className={`w-3 h-3 rounded-full ${game.completed ? 'bg-green-500' : 'bg-gray-600'}`}
                  title={game.title}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignMode;
