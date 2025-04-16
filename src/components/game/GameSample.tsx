
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameHUD from './GameHUD';

interface GameSampleProps {
  gameId: string;
  title: string;
  category: 'construction' | 'management';
  returnPath: string;
}

const GameSample: React.FC<GameSampleProps> = ({
  gameId,
  title,
  category,
  returnPath
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(25);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Simulated countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up
      setModalContent({
        title: 'Time\'s Up!',
        message: 'You ran out of time. Would you like to try again?',
        type: 'error'
      });
      setShowModal(true);
    }
  }, [timeLeft]);

  // Simulated score increase
  const increaseScore = () => {
    setScore(score + 10);
    setCurrentXp(Math.min(currentXp + 5, 100));
  };

  // Simulated incorrect answer
  const decreaseLives = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setAttempts(attempts + 1);
    
    if (newLives <= 0) {
      setModalContent({
        title: 'Game Over',
        message: 'You\'ve run out of lives. Would you like to try again?',
        type: 'error'
      });
      setShowModal(true);
    }
  };

  // Simulated game completion
  const completeGame = () => {
    setModalContent({
      title: 'Mission Complete!',
      message: `Congratulations! You've completed ${title} with a score of ${score}.`,
      type: 'success'
    });
    setShowModal(true);
  };

  // Restart the game
  const restartGame = () => {
    setTimeLeft(180);
    setScore(0);
    setLives(3);
    setAttempts(0);
    setCurrentXp(25);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic={title}
        time={timeLeft}
        score={score}
        lives={lives}
        level={level}
        attempts={attempts}
        xp={currentXp}
        maxXp={100}
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${
            category === 'construction' 
              ? 'text-cyber-primary' 
              : 'text-cyber-secondary'
          } cyber-text-glow`}>
            {title}
          </h1>
          
          <Link to={returnPath} className="cyber-button text-sm py-2">
            EXIT GAME
          </Link>
        </div>
        
        {/* Sample Game Interface */}
        <div className="cyber-container p-6 mb-8">
          <div className="text-center mb-8">
            <p className="text-gray-300 mb-4">
              This is a sample game interface. In a full implementation, this area would contain
              the actual game content, challenges, and interactive elements.
            </p>
            <div className="cyber-badge bg-cyber-muted inline-block">
              Demo Purpose Only
            </div>
          </div>
          
          {/* Sample Game Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-container p-4 border-cyber-primary">
              <h3 className="text-lg font-bold text-cyber-terminal-green mb-4">
                Game Actions
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={increaseScore}
                  className="cyber-button-primary w-full"
                >
                  Correct Answer (+10 pts)
                </button>
                
                <button 
                  onClick={decreaseLives}
                  className="cyber-button-accent w-full"
                >
                  Incorrect Answer (-1 life)
                </button>
                
                <button 
                  onClick={completeGame}
                  className="cyber-button-secondary w-full"
                >
                  Complete Game
                </button>
              </div>
            </div>
            
            <div className="cyber-container p-4 border-cyber-secondary">
              <h3 className="text-lg font-bold text-cyber-terminal-blue mb-4">
                Game Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game ID:</span>
                  <span className="cyber-terminal text-cyber-terminal-green">{gameId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-yellow-400">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reward:</span>
                  <span className="text-cyber-terminal-purple">50 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game instructions or hints */}
        <div className="cyber-container p-4 border-cyber-border mb-6">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              NPC HINT
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            Remember to analyze all possible risks before making a decision. Proactive risk management
            is usually more cost-effective than reactive approaches.
          </p>
        </div>
      </div>
      
      {/* Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="cyber-container p-6 max-w-md w-full border-2 border-cyber-border">
            <h2 className={`text-xl font-bold mb-4 ${
              modalContent.type === 'success' ? 'text-cyber-terminal-green' : 
              modalContent.type === 'error' ? 'text-cyber-terminal-red' : 
              'text-cyber-terminal-blue'
            }`}>
              {modalContent.title}
            </h2>
            <p className="text-gray-300 mb-6">{modalContent.message}</p>
            <div className="flex space-x-4">
              <button 
                onClick={restartGame}
                className="cyber-button-primary flex-1"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate(returnPath)}
                className="cyber-button flex-1"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSample;
