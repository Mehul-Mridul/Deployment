
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { Code, Shield, Trophy, User, ChevronDown, Zap, Terminal, BookOpen, ServerCrash, BarChart } from 'lucide-react';

interface StartScreenProps {
  title: string;
  subtitle: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ title, subtitle }) => {
  const { player } = usePlayer();
  const [glitchActive, setGlitchActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  // Typing effect for subtitle
  useEffect(() => {
    if (subtitleIndex < subtitle.length) {
      const timer = setTimeout(() => {
        setTypedSubtitle(prev => prev + subtitle[subtitleIndex]);
        setSubtitleIndex(subtitleIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [subtitle, subtitleIndex]);

  // Activate glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Calculate completion percentage
  const totalGames = 8; // Total number of games in the application
  const completionPercentage = (player.completedGames.length / totalGames) * 100;

  // Get recent achievements
  const unlockedBadges = player.badges.filter(b => b.unlocked);
  const recentBadges = unlockedBadges.slice(0, 2);

  return (
    <div className="min-h-screen bg-cyber-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMzAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tOCA2aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTggNmgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <h1 className={`text-4xl md:text-6xl font-bold text-cyber-primary cyber-text-glow mb-4 ${glitchActive ? 'glitch' : ''}`}>
          {title}
        </h1>
        
        <div className="cyber-terminal mb-8 h-12">
          <p className="text-cyber-terminal-green text-xl inline-block">
            &gt; {typedSubtitle}
            <span className="animate-pulse">_</span>
          </p>
        </div>
        
        <div className="cyber-container p-4 mb-10 border-cyber-primary bg-cyber-background/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-cyber-terminal-blue mb-2">
            <User size={16} />
            <span>AGENT PROFILE:</span>
            <span className="text-cyber-terminal-yellow">{player.name.toUpperCase()}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="cyber-container p-3 bg-cyber-muted/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Zap className="text-cyber-primary" size={16} />
                <span>LEVEL</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-primary cyber-text-glow">
                {player.level}
              </div>
            </div>
            
            <div className="cyber-container p-3 bg-cyber-muted/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Code className="text-cyber-secondary" size={16} />
                <span>XP</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-secondary cyber-text-glow">
                {player.xp}/{player.maxXp}
              </div>
            </div>
            
            <div className="cyber-container p-3 bg-cyber-muted/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center space-x-2 text-sm mb-1">
                <Trophy className="text-cyber-accent" size={16} />
                <span>BADGES</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyber-accent cyber-text-glow">
                {unlockedBadges.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-cyber-muted h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full"
              style={{ width: `${(player.xp / player.maxXp) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-6 text-xs text-center text-gray-400">
            {player.xp} / {player.maxXp} XP TO NEXT LEVEL
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer cyber-container p-2 border-cyber-muted mb-2"
            onClick={() => setShowInfo(!showInfo)}
          >
            <div className="flex items-center space-x-2">
              <BarChart size={16} className="text-cyber-secondary" />
              <span className="text-sm">Mission Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-cyber-terminal-green">
                {completionPercentage.toFixed(0)}%
              </span>
              <ChevronDown size={16} className={`transition-transform ${showInfo ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {showInfo && (
            <div className="cyber-container p-3 border-cyber-muted bg-cyber-muted/10 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-cyber-terminal-blue">MISSION STATUS:</span>
                <span className="text-xs text-cyber-terminal-green">
                  {player.completedGames.length}/{totalGames} COMPLETE
                </span>
              </div>

              {player.completedGames.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {player.completedGames.map(game => (
                    <div key={game} className="cyber-badge bg-cyber-primary/20 text-cyber-primary truncate">
                      {game.replace(/-/g, ' ').toUpperCase()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 text-center">
                  No missions completed yet. Start your journey!
                </div>
              )}
              
              {recentBadges.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-cyber-terminal-blue mb-2">RECENT ACHIEVEMENTS:</div>
                  <div className="space-y-2">
                    {recentBadges.map(badge => (
                      <div key={badge.id} className="flex items-center space-x-2 text-xs">
                        <div className="text-yellow-500">★</div>
                        <span className="text-cyber-terminal-yellow">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Link 
            to="/game-modes"
            className="cyber-button-primary text-xl py-4 px-8 animate-pulse hover:animate-none w-64 relative group"
          >
            <span className="relative z-10">START MISSION</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x"></div>
          </Link>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/profile" className="cyber-button-secondary text-sm py-2 px-4 flex items-center space-x-2">
              <User size={14} />
              <span>AGENT PROFILE</span>
            </Link>
            <Link to="/leaderboard" className="cyber-button-secondary text-sm py-2 px-4 flex items-center space-x-2">
              <Trophy size={14} />
              <span>LEADERBOARD</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="cyber-terminal text-xs text-cyber-terminal-green mt-10">
        &gt; SEPM (Software Engineering & Project Management) v2.0.25
      </div>
      
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-cyber-background/90 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-cyber-background/90 to-transparent pointer-events-none"></div>
      
      {/* Visual elements for cyberpunk effect */}
      <div className="absolute top-1/4 left-8 w-8 h-20 bg-cyber-primary/10 rounded-sm blur-sm animate-pulse"></div>
      <div className="absolute bottom-1/3 right-8 w-12 h-12 bg-cyber-secondary/10 rounded-full blur-sm animate-pulse"></div>
    </div>
  );
};

export default StartScreen;
