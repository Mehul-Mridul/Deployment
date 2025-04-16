
import React from 'react';
import { Link } from 'react-router-dom';
import { initialPlayerState, badges } from '@/data/gameData';
import Badge from './Badge';
import { 
  Trophy, Bug, Code, ClipboardCheck, Shield, FileText, Package, ShieldCheck
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'Bug': <Bug size={24} />,
  'Code': <Code size={24} />,
  'ClipboardCheck': <ClipboardCheck size={24} />,
  'ShieldCheck': <ShieldCheck size={24} />,
  'Shield': <Shield size={24} />,
  'FileText': <FileText size={24} />,
  'Package': <Package size={24} />,
  'Trophy': <Trophy size={24} />
};

const ProfilePage: React.FC = () => {
  // Mock player data (would normally come from state/context)
  const player = initialPlayerState;
  
  // Mock stats (would normally be calculated from game progress)
  const stats = {
    gamesCompleted: 0,
    totalScore: 0,
    highestScore: 0,
    fastestCompletion: '00:00',
    accuracy: '0%'
  };

  // Calculate level progress percentage
  const levelProgress = (player.xp / player.maxXp) * 100;
  
  return (
    <div className="min-h-screen bg-cyber-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            AGENT PROFILE
          </h1>
          
          <Link to="/" className="cyber-button text-sm py-2">
            RETURN TO MAIN
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Information */}
          <div className="lg:col-span-1">
            <div className="cyber-container p-6 h-full">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-cyber-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-cyber-primary cyber-text-glow">
                    {player.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{player.name}</h2>
                <div className="cyber-badge bg-cyber-muted inline-block">
                  <span className="text-cyber-terminal-green">Level {player.level}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-cyber-terminal-purple uppercase">Experience</span>
                  <span className="text-xs text-white">{player.xp}/{player.maxXp} XP</span>
                </div>
                <div className="cyber-progress-bar">
                  <div 
                    className="cyber-progress-value" 
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round(player.maxXp - player.xp)} XP needed for next level
                </p>
              </div>
              
              <div className="border-t border-cyber-border pt-4">
                <h3 className="text-sm font-bold text-cyber-terminal-blue uppercase mb-4">
                  Stats
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Games Completed</span>
                    <span className="text-white">{stats.gamesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Score</span>
                    <span className="text-white">{stats.totalScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Score</span>
                    <span className="text-white">{stats.highestScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fastest Completion</span>
                    <span className="text-white">{stats.fastestCompletion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="text-white">{stats.accuracy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="lg:col-span-2">
            <div className="cyber-container p-6 h-full">
              <h2 className="text-xl font-bold text-cyber-terminal-purple mb-6">
                ACHIEVEMENT BADGES
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <Badge
                    key={badge.id}
                    name={badge.name}
                    icon={iconMap[badge.iconName]}
                    description={badge.description}
                    unlocked={badge.unlocked}
                  />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Complete missions and challenges to unlock more badges!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress by Unit */}
          <div className="cyber-container p-6">
            <h2 className="text-lg font-bold text-cyber-terminal-green mb-4">
              UNIT PROGRESS
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-cyber-terminal-blue">Unit 4: Software Construction</span>
                  <span className="text-xs text-white">0/4 Complete</span>
                </div>
                <div className="cyber-progress-bar">
                  <div 
                    className="cyber-progress-value bg-cyber-primary" 
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-cyber-terminal-yellow">Unit 5: Product Management</span>
                  <span className="text-xs text-white">0/4 Complete</span>
                </div>
                <div className="cyber-progress-bar">
                  <div 
                    className="cyber-progress-value bg-cyber-secondary" 
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="cyber-container p-6">
            <h2 className="text-lg font-bold text-cyber-terminal-purple mb-4">
              RECENT ACTIVITY
            </h2>
            
            <div className="space-y-4">
              <div className="cyber-terminal text-cyber-terminal-green text-sm">
                {'> No recent activity found'}
              </div>
              <div className="cyber-terminal text-cyber-terminal-green text-sm">
                {'> Begin your mission to record activity'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
