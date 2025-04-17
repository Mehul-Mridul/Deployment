import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  completed?: boolean;
  image?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  path,
  difficulty,
  xpReward,
  completed = false,
  image
}) => {
  // Different colors for difficulty levels
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };

  return (
    <Link to={path} className="block group">
      <div className="relative bg-cyber-background border border-cyber-border p-4 rounded-lg 
        transition-all duration-300 transform group-hover:scale-102 group-hover:shadow-lg
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyber-primary/20 before:to-transparent
        before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
        overflow-hidden">
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-cyber-primary/20 rounded-lg 
          group-hover:border-cyber-primary/40 transition-colors duration-300" />
        
        {/* XP Badge with glow effect */}
        <div className="absolute top-2 right-2 z-10">
          <span className="cyber-badge bg-cyber-primary text-white 
            group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-shadow duration-300">
            {xpReward} XP
          </span>
        </div>

        {/* Completed badge */}
        {completed && (
          <div className="absolute top-2 left-2 z-10">
            <span className="cyber-badge bg-cyber-success text-white 
              group-hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-shadow duration-300">
              COMPLETED
            </span>
          </div>
        )}

        {/* Game content */}
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-2 
            group-hover:text-cyber-primary transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${difficultyColors[difficulty]} 
              group-hover:scale-110 transition-transform duration-300`}>
              {difficulty.toUpperCase()}
            </span>
            
            <span className="cyber-button text-sm py-1 px-3
              group-hover:bg-cyber-primary group-hover:text-white transition-colors duration-300">
              {completed ? 'REPLAY' : 'START'}
            </span>
          </div>
        </div>

        {/* Animated scan line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-primary/10 to-transparent
            animate-scan h-[200%] -translate-y-1/2" />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
