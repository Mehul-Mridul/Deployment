import React from 'react';
import { Link } from 'react-router-dom';
import { initialPlayerState, badges, constructionGames, managementGames } from '@/data/gameData';
import Badge from './Badge';
import { 
  Trophy, Bug, Code, ClipboardCheck, Shield, FileText, Package, ShieldCheck,
  Star, Clock, Target, Award, RefreshCw
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from '@/components/ui/use-toast';

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
  const { player, resetProgress } = usePlayer();
  
  // Calculate level progress percentage
  const levelProgress = (player.xp / player.maxXp) * 100;

  // Calculate unit progress
  const constructionProgress = constructionGames.reduce((acc, game) => {
    const progress = player.gameProgress[game.id];
    if (progress?.completed) acc.completed++;
    if (progress?.score === 1000) acc.perfect++;
    return acc;
  }, { completed: 0, perfect: 0 });

  const managementProgress = managementGames.reduce((acc, game) => {
    const progress = player.gameProgress[game.id];
    if (progress?.completed) acc.completed++;
    if (progress?.score === 1000) acc.perfect++;
    return acc;
  }, { completed: 0, perfect: 0 });

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
      toast({
        title: "Progress Reset",
        description: "All progress has been reset to initial state.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-cyber-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            AGENT PROFILE
          </h1>
          
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="cyber-button text-sm py-2 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              RESET PROGRESS
            </button>
            <Link to="/" className="cyber-button text-sm py-2">
              RETURN TO MAIN
            </Link>
          </div>
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
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="text-cyber-primary w-4 h-4" />
                      <span className="text-xs text-gray-300">Total Score</span>
                    </div>
                    <span className="text-xs text-white">{player.stats.totalScore}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="text-cyber-secondary w-4 h-4" />
                      <span className="text-xs text-gray-300">Games Played</span>
                    </div>
                    <span className="text-xs text-white">{player.stats.gamesPlayed}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="text-cyber-accent w-4 h-4" />
                      <span className="text-xs text-gray-300">Perfect Games</span>
                    </div>
                    <span className="text-xs text-white">{player.stats.perfectGames}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-cyber-terminal-yellow w-4 h-4" />
                      <span className="text-xs text-gray-300">Time Played</span>
                    </div>
                    <span className="text-xs text-white">
                      {Math.floor(player.stats.totalTimePlayed / 3600)}h {Math.floor((player.stats.totalTimePlayed % 3600) / 60)}m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badges and Progress */}
          <div className="lg:col-span-2">
            <div className="cyber-container p-6 h-full">
              <h2 className="text-xl font-bold text-cyber-terminal-purple mb-6">
                ACHIEVEMENT BADGES
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {player.badges.map(badge => (
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
            
            {/* Progress by Unit */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-cyber-terminal-green mb-4">
                UNIT PROGRESS
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-cyber-terminal-blue">Unit 4: Software Construction</span>
                    <span className="text-xs text-white">
                      {constructionProgress.completed}/{constructionGames.length} Complete
                      ({constructionProgress.perfect} Perfect)
                    </span>
                  </div>
                  <div className="cyber-progress-bar">
                    <div 
                      className="cyber-progress-value bg-cyber-primary" 
                      style={{ width: `${(constructionProgress.completed / constructionGames.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-cyber-terminal-yellow">Unit 5: Product Management</span>
                    <span className="text-xs text-white">
                      {managementProgress.completed}/{managementGames.length} Complete
                      ({managementProgress.perfect} Perfect)
                    </span>
                  </div>
                  <div className="cyber-progress-bar">
                    <div 
                      className="cyber-progress-value bg-cyber-secondary" 
                      style={{ width: `${(managementProgress.completed / managementGames.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
