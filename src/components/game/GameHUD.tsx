
import React from 'react';

interface GameHUDProps {
  topic: string;
  time: number;
  score: number;
  lives: number;
  level: number;
  attempts: number;
  xp: number;
  maxXp: number;
}

const GameHUD: React.FC<GameHUDProps> = ({
  topic,
  time,
  score,
  lives,
  level,
  attempts,
  xp,
  maxXp
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-cyber-muted border-b-2 border-cyber-border py-2 px-4 flex items-center justify-between z-50">
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-xs text-cyber-terminal-blue uppercase">TOPIC</span>
          <h3 className="text-sm font-bold text-cyber-terminal-blue cyber-text-glow">{topic}</h3>
        </div>
        
        <div className="cyber-badge bg-cyber-muted text-cyber-terminal-green">
          <span className="cyber-text-glow">LVL {level}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <span className="text-xs text-cyber-terminal-yellow uppercase">TIME</span>
          <p className="font-mono text-cyber-terminal-yellow cyber-text-glow">{formatTime(time)}</p>
        </div>
        
        <div className="text-center">
          <span className="text-xs text-cyber-terminal-purple uppercase">SCORE</span>
          <p className="font-bold text-cyber-terminal-purple cyber-text-glow">{score}</p>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-xs text-cyber-terminal-red uppercase mr-1">LIVES</span>
          {Array(lives).fill(0).map((_, i) => (
            <span key={i} className="text-cyber-terminal-red text-lg cyber-text-glow">♥</span>
          ))}
          {Array(3 - lives).fill(0).map((_, i) => (
            <span key={i} className="text-gray-600 text-lg">♥</span>
          ))}
        </div>
        
        <div className="text-center">
          <span className="text-xs text-cyber-terminal-blue uppercase">ATTEMPTS</span>
          <p className="font-bold text-white">{attempts}</p>
        </div>
      </div>

      <div className="flex flex-col w-32">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-cyber-terminal-purple uppercase">XP</span>
          <span className="text-xs text-white">{xp}/{maxXp}</span>
        </div>
        <div className="cyber-progress-bar">
          <div 
            className="cyber-progress-value" 
            style={{ width: `${(xp / maxXp) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
