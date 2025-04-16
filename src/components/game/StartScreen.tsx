
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Code, ShieldCheck, Star, Zap } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

interface StartScreenProps {
  title: string;
  subtitle?: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { player } = usePlayer();
  const [typedTitle, setTypedTitle] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Typing effect for title
  useEffect(() => {
    if (typedTitle.length < title.length) {
      const timeout = setTimeout(() => {
        setTypedTitle(title.slice(0, typedTitle.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [typedTitle, title]);

  // Occasional glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  const modules = [
    {
      title: "SOFTWARE CONSTRUCTION",
      description: "Master the foundations of reliable software through coding standards, reviews, testing, and debugging.",
      icon: <Code className="text-cyber-primary w-6 h-6" />,
      path: "/campaign",
      color: "cyber-primary"
    },
    {
      title: "PRODUCT MANAGEMENT",
      description: "Tackle challenges in risk management, planning, and product lifecycles.",
      icon: <ShieldCheck className="text-cyber-secondary w-6 h-6" />,
      path: "/boss-battle",
      color: "cyber-secondary"
    }
  ];

  const handleModuleHover = (moduleTitle: string) => {
    setSelectedModule(moduleTitle);
  };

  const completedGamesCount = player.completedGames.length;
  const totalGames = 8; // Total number of games in the application
  const progress = Math.round((completedGamesCount / totalGames) * 100);

  return (
    <div className="min-h-screen bg-cyber-background cyber-grid flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 
          className={`text-4xl md:text-6xl font-bold text-cyber-primary cyber-text-glow mb-4 ${isGlitching ? 'glitch' : ''}`}
          data-text={title}
        >
          {isComplete ? title : typedTitle}<span className="animate-pulse">|</span>
        </h1>
        
        {subtitle && (
          <p className="text-xl text-cyber-terminal-blue cyber-terminal mb-8 cyber-text-glow">
            {subtitle}
          </p>
        )}
        
        <div className="cyber-container p-4 flex flex-col md:flex-row justify-between items-stretch gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-cyber-terminal-blue text-sm mb-2">AGENT STATUS</h2>
            <div className="text-2xl font-bold text-white mb-4">
              {player.name.toUpperCase()} <span className="text-cyber-primary">LVL {player.level}</span>
            </div>
            
            <div className="flex items-center mb-2">
              <Star className="text-yellow-400 w-4 h-4 mr-2" />
              <div className="text-sm text-gray-300">XP: {player.xp}/{player.maxXp}</div>
            </div>
            
            <div className="flex items-center mb-2">
              <Award className="text-purple-400 w-4 h-4 mr-2" />
              <div className="text-sm text-gray-300">
                Badges: {player.badges.filter(b => b.unlocked).length}/{player.badges.length}
              </div>
            </div>
            
            <div className="flex items-center">
              <Zap className="text-green-400 w-4 h-4 mr-2" />
              <div className="text-sm text-gray-300">
                Progress: {progress}% Complete
              </div>
            </div>
          </div>
          
          <div className="h-40 w-px bg-cyber-border mx-4 hidden md:block"></div>
          
          <div className="cyber-container bg-opacity-90 backdrop-blur-sm flex-1 p-4">
            <div className="mb-4">
              <p className="text-cyber-terminal-green cyber-terminal mb-2 text-sm">
                {'> INITIALIZING SIMULATION...'}
              </p>
              <p className="text-cyber-terminal-green cyber-terminal mb-2 text-sm">
                {'> LOADING MODULES: UNIT-4, UNIT-5... COMPLETE'}
              </p>
              <p className="text-cyber-terminal-green cyber-terminal mb-2 text-sm">
                {'> SYSTEM READY. SELECT MISSION TYPE...'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {modules.map((module) => (
          <div 
            key={module.title}
            className={`cyber-container p-6 border-${module.color} cursor-pointer transition-all hover:transform hover:scale-105`}
            onMouseEnter={() => handleModuleHover(module.title)}
            onMouseLeave={() => setSelectedModule(null)}
            onClick={() => navigate(module.path)}
          >
            <div className="flex items-center mb-4">
              {module.icon}
              <h2 className={`text-xl font-bold ml-2 text-${module.color}`}>
                {module.title}
              </h2>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              {module.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className={`cyber-badge bg-${module.color}/20 text-${module.color}`}>
                UNIT {module.title === "SOFTWARE CONSTRUCTION" ? "4" : "5"}
              </div>
              
              <div className="text-sm text-cyber-terminal-blue flex items-center">
                <span>ENTER MODULE</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="w-full max-w-4xl flex justify-center space-x-6 mb-8">
        <button 
          onClick={() => navigate('/profile')}
          className="cyber-button text-cyber-terminal-blue text-sm py-2 px-6"
        >
          AGENT PROFILE
        </button>
        <button 
          onClick={() => navigate('/mini-games')}
          className="cyber-button-accent text-sm py-2 px-6"
        >
          MINI-GAMES
        </button>
        <button 
          onClick={() => navigate('/leaderboard')}
          className="cyber-button text-cyber-terminal-blue text-sm py-2 px-6"
        >
          LEADERBOARD
        </button>
      </div>
      
      <div className="text-gray-500 text-xs cyber-terminal">
        POWERED BY SEPM SIMULATION ENGINE v1.0.4
      </div>
    </div>
  );
};

export default StartScreen;
