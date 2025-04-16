
import React from 'react';

interface BadgeProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  unlocked: boolean;
}

const Badge: React.FC<BadgeProps> = ({ name, icon, description, unlocked }) => {
  return (
    <div className={`cyber-container p-4 ${unlocked ? 'border-cyber-primary' : 'border-cyber-muted opacity-60'}`}>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          unlocked ? 'bg-cyber-primary/20 text-cyber-primary cyber-text-glow' : 'bg-cyber-muted/40 text-gray-500'
        }`}>
          {icon}
        </div>
        <h3 className={`font-bold ${unlocked ? 'text-cyber-primary cyber-text-glow' : 'text-gray-400'}`}>
          {name}
        </h3>
        <p className="text-xs text-gray-400">{description}</p>
        <div className={`cyber-badge ${unlocked ? 'bg-cyber-primary/20 text-cyber-primary' : 'bg-cyber-muted text-gray-500'}`}>
          {unlocked ? 'UNLOCKED' : 'LOCKED'}
        </div>
      </div>
    </div>
  );
};

export default Badge;
