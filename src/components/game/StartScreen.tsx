
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface StartScreenProps {
  title: string;
  subtitle?: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const [typedTitle, setTypedTitle] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

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

  return (
    <div className="min-h-screen bg-cyber-background cyber-grid flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center mb-12">
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
        
        <div className="cyber-container p-6 mt-8 bg-opacity-90 backdrop-blur-sm">
          <div className="mb-8">
            <p className="text-cyber-terminal-green cyber-terminal mb-4">
              {'> INITIALIZING SIMULATION...'}
            </p>
            <p className="text-cyber-terminal-green cyber-terminal mb-4">
              {'> LOADING MODULES: UNIT-4, UNIT-5... COMPLETE'}
            </p>
            <p className="text-cyber-terminal-green cyber-terminal mb-4">
              {'> SYSTEM READY. AWAITING USER INPUT...'}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/game-modes')}
            className="cyber-button-primary text-xl font-bold py-4 px-8 w-64 mx-auto block"
          >
            BEGIN MISSION
          </button>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/profile')}
              className="cyber-button text-cyber-terminal-blue text-sm"
            >
              AGENT PROFILE
            </button>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="cyber-button text-cyber-terminal-blue text-sm"
            >
              LEADERBOARD
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-gray-500 text-xs cyber-terminal absolute bottom-4">
        POWERED BY SEPM SIMULATION ENGINE v1.0.4
      </div>
    </div>
  );
};

export default StartScreen;
