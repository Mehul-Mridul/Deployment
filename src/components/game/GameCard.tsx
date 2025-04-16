
import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  completed?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  image,
  path,
  difficulty,
  xpReward,
  completed = false
}) => {
  // Different colors for difficulty levels
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };

  return (
    <Link to={path} className="block group">
      <div className="cyber-card transition-all duration-300 transform group-hover:scale-102 group-hover:shadow-lg">
        {completed && (
          <div className="absolute top-2 right-2 z-10">
            <span className="cyber-badge bg-cyber-primary text-white">
              COMPLETED
            </span>
          </div>
        )}
        
        <div className="relative overflow-hidden h-40">
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-background to-transparent z-10"></div>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <span className="cyber-badge bg-cyber-muted text-cyber-terminal-purple">
              {xpReward} XP
            </span>
          </div>
          
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${difficultyColors[difficulty]}`}>
              {difficulty.toUpperCase()}
            </span>
            
            <span className="cyber-button text-sm py-1 px-3">
              {completed ? 'REPLAY' : 'START'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
