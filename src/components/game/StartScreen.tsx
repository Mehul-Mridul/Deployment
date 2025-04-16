
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { Code, Shield, Trophy, User, ChevronDown, Zap } from 'lucide-react';

interface StartScreenProps {
  title: string;
  subtitle: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ title, subtitle }) => {
  const { player } = usePlayer();
  const [glitchActive, setGlitchActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Activate glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-background flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-6xl font-bold text-cyber-primary cyber-text-glow mb-4 ${glitchActive ? 'glitch' : ''}`}>
          {title}
        </h1>
        
        <div className="cyber-terminal mb-8">
          <p className="text-cyber-terminal-green text-xl">&gt; {subtitle}</p>
        </div>
        
        <div className="cyber-container p-4 mb-10 border-cyber-primary bg-cyber-background/80">
          <div className="flex items-center space-x-2 text-cyber-terminal-blue mb-2">
            <User size={16} />
            <span>AGENT PROFILE:</span>
            <span className="text-cyber-terminal-yellow">{player.name.toUpperCase()}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="cyber-container p-3 bg-cyber-muted/20">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Zap className="text-cyber-primary" size={16} />
                <span>LEVEL</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-primary cyber-text-glow">
                {player.level}
              </div>
            </div>
            
            <div className="cyber-container p-3 bg-cyber-muted/20">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Code className="text-cyber-secondary" size={16} />
                <span>XP</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-secondary cyber-text-glow">
                {player.xp}/{player.maxXp}
              </div>
            </div>
            
            <div className="cyber-container p-3 bg-cyber-muted/20">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Trophy className="text-cyber-accent" size={16} />
                <span>BADGES</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-accent cyber-text-glow">
                {player.badges.filter(b => b.unlocked).length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-cyber-muted h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full"
              style={{ width: `${(player.xp / player.maxXp) * 100}%` }}
            ></div>
          </div>
          
          {player.completedGames.length > 0 && (
            <div 
              className="flex items-center justify-between cursor-pointer cyber-container p-2 border-cyber-muted mb-2"
              onClick={() => setShowInfo(!showInfo)}
            >
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-cyber-secondary" />
                <span className="text-sm">Mission Progress</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showInfo ? 'rotate-180' : ''}`} />
            </div>
          )}
          
          {showInfo && (
            <div className="cyber-container p-3 border-cyber-muted bg-cyber-muted/10 mb-4">
              <div className="text-xs text-cyber-terminal-blue mb-2">COMPLETED MISSIONS:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {player.completedGames.map(game => (
                  <div key={game} className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
                    {game.replace(/-/g, ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Link 
          to="/game-modes"
          className="cyber-button-primary text-xl py-4 px-8 animate-pulse hover:animate-none"
        >
          START MISSION
        </Link>
        
        <div className="mt-6 flex justify-center space-x-6">
          <Link to="/profile" className="cyber-button-secondary text-sm py-2 px-4">
            AGENT PROFILE
          </Link>
          <Link to="/leaderboard" className="cyber-button-secondary text-sm py-2 px-4">
            LEADERBOARD
          </Link>
        </div>
      </div>
      
      <div className="cyber-terminal text-xs text-cyber-terminal-green mt-10">
        &gt; SEPM (Software Engineering & Project Management) v2.0.25
      </div>
      
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-cyber-background/90 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-cyber-background/90 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default StartScreen;
