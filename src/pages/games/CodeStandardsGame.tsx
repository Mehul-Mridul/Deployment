
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePlayer } from '@/context/PlayerContext';
import GameHUD from '@/components/game/GameHUD';
import CodeBlock from '@/components/game/CodeBlock';
import DragDropCodeFix from '@/components/game/DragDropCodeFix';

const CodeStandardsGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { player, updatePlayerXP, completeGame, unlockBadge } = usePlayer();
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showNextLevelButton, setShowNextLevelButton] = useState(false);

  // Simulated countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      // Time's up
      setModalContent({
        title: 'Time\'s Up!',
        message: 'You ran out of time. Would you like to try again?',
        type: 'error'
      });
      setShowModal(true);
    }
  }, [timeLeft, gameCompleted]);

  const handleCorrectFix = () => {
    // Only apply changes if level isn't already completed
    if (!levelCompleted) {
      const pointsGained = 10;
      const newScore = score + pointsGained;
      setScore(newScore);
      
      const xpGained = 5;
      setCurrentXp(Math.min(currentXp + xpGained, 100));
      
      // Show toast notification
      toast({
        title: "Correct Solution!",
        description: `+${pointsGained} points, +${xpGained} XP`,
        variant: "success"
      });
      
      // Mark level as completed
      setLevelCompleted(true);
      setShowNextLevelButton(true);
      
      // Check if game completed (after all 3 levels)
      if (level >= codeChallenges.length) {
        handleGameCompleted(newScore);
      }
    }
  };

  const handleNextLevel = () => {
    if (level < codeChallenges.length) {
      setLevel(level + 1);
      setLevelCompleted(false);
      setShowNextLevelButton(false);
      
      toast({
        title: "Level Up!",
        description: `Starting level ${level + 1}`,
        variant: "default"
      });
    } else {
      handleGameCompleted(score);
    }
  };

  const handleGameCompleted = (finalScore: number) => {
    setGameCompleted(true);
    
    // Award XP to player
    updatePlayerXP(currentXp);
    
    // Mark game as completed
    completeGame('coding-standards', finalScore, 300 - timeLeft);
    
    // Award badge if score is high enough
    if (finalScore >= 25) {
      unlockBadge('code-master');
      
      toast({
        title: "Badge Unlocked!",
        description: "You've earned the Code Master badge!",
        variant: "success"
      });
    }
    
    setModalContent({
      title: 'Coding Standards Mastered!',
      message: `Congratulations! You've successfully completed the Coding Standards Quest with a score of ${finalScore}`,
      type: 'success'
    });
    setShowModal(true);
  };

  const handleIncorrectFix = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setAttempts(attempts + 1);
    
    toast({
      title: "Incorrect Solution",
      description: `That's not right. ${newLives} lives remaining.`,
      variant: "destructive"
    });
    
    if (newLives <= 0) {
      setModalContent({
        title: 'Game Over',
        message: 'You\'ve run out of lives. Would you like to try again?',
        type: 'error'
      });
      setShowModal(true);
    }
  };

  const restartGame = () => {
    setTimeLeft(300);
    setScore(0);
    setLives(3);
    setLevel(1);
    setAttempts(0);
    setCurrentXp(0);
    setShowModal(false);
    setGameCompleted(false);
    setLevelCompleted(false);
    setShowNextLevelButton(false);
  };

  // Code challenge data
  const codeChallenges = [
    {
      id: 'challenge1',
      title: 'Function Naming',
      description: 'Fix the function name to follow camelCase convention',
      badCode: `function Calculate_result(a, b) {\n  return a + b;\n}`,
      fixes: ['calculateResult', 'calculate_result', 'CalculateResult'],
      correctFixIndex: 0
    },
    {
      id: 'challenge2',
      title: 'Indentation',
      description: 'Fix the indentation in this function',
      badCode: `function processData(data) {\nif (data) {\nconsole.log(data);\nreturn data;\n}\nreturn null;\n}`,
      fixes: [
        `function processData(data) {\n  if (data) {\n    console.log(data);\n    return data;\n  }\n  return null;\n}`,
        `function processData(data) {\n    if (data) {\n        console.log(data);\n        return data;\n    }\n    return null;\n}`,
        `function processData(data) {\n if (data) {\n  console.log(data);\n  return data;\n }\n return null;\n}`
      ],
      correctFixIndex: 0
    },
    {
      id: 'challenge3',
      title: 'Comments',
      description: 'Add appropriate comments to this code',
      badCode: `function validateUser(user) {\n  if (!user.name) return false;\n  if (user.age < 18) return false;\n  return true;\n}`,
      fixes: [
        `// Function to validate user data based on name and age requirements\nfunction validateUser(user) {\n  // Check if name exists\n  if (!user.name) return false;\n  // Check if user is at least 18 years old\n  if (user.age < 18) return false;\n  // User is valid\n  return true;\n}`,
        `function validateUser(user) {\n  // User must have name\n  if (!user.name) return false;\n  // User must be over 18\n  if (user.age < 18) return false;\n  return true;\n}`,
        `/** validateUser - this checks the user */\nfunction validateUser(user) {\n  if (!user.name) return false; // name check\n  if (user.age < 18) return false; // age check\n  return true; // is valid\n}`
      ],
      correctFixIndex: 0
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Coding Standards"
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
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            CODING STANDARDS QUEST
          </h1>
          
          <Link to="/campaign" className="cyber-button text-sm py-2">
            EXIT GAME
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
            MISSION BRIEFING
          </h2>
          <p className="text-gray-300 mb-4">
            Your mission is to identify and fix code that violates coding standards. 
            Drag and drop the correct solution to earn points and advance.
          </p>
          <div className="flex space-x-2">
            <div className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
              LEVEL {level}
            </div>
            <div className="cyber-badge bg-cyber-muted text-white">
              {score} POINTS
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Code Block with Problem */}
          <div className="cyber-container p-4 border-cyber-primary">
            <h3 className="text-lg font-bold text-cyber-terminal-green mb-4">
              CODE WITH ISSUES
            </h3>
            <div className="mb-4">
              <div className="cyber-badge bg-cyber-secondary/30 text-cyber-secondary mb-2">
                {codeChallenges[level - 1]?.title || 'Challenge'}
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {codeChallenges[level - 1]?.description || 'Fix the code according to coding standards'}
              </p>
            </div>
            
            <CodeBlock 
              code={codeChallenges[level - 1]?.badCode || '// No code to display'} 
              language="javascript"
            />
          </div>
          
          {/* Fix Selection Area */}
          <DragDropCodeFix 
            fixes={codeChallenges[level - 1]?.fixes || []}
            correctFixIndex={codeChallenges[level - 1]?.correctFixIndex || 0}
            onCorrectFix={handleCorrectFix}
            onIncorrectFix={handleIncorrectFix}
          />
        </div>
        
        {showNextLevelButton && level < codeChallenges.length && (
          <div className="flex justify-center mb-8">
            <button 
              onClick={handleNextLevel}
              className="cyber-button-primary py-3 px-6 animate-pulse hover:animate-none"
            >
              PROCEED TO LEVEL {level + 1}
            </button>
          </div>
        )}
        
        {showNextLevelButton && level >= codeChallenges.length && (
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => handleGameCompleted(score)}
              className="cyber-button-primary py-3 px-6 animate-pulse hover:animate-none"
            >
              COMPLETE MISSION
            </button>
          </div>
        )}
        
        <div className="cyber-container p-4 border-cyber-border mb-6">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              DEV MENTOR HINT
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            Remember that consistent coding standards improve readability and maintainability.
            Look for issues related to naming conventions, indentation, comments, and spacing.
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
              {modalContent.type === 'error' && (
                <button 
                  onClick={restartGame}
                  className="cyber-button-primary flex-1"
                >
                  Try Again
                </button>
              )}
              {modalContent.type === 'success' && (
                <button 
                  onClick={() => navigate('/campaign')}
                  className="cyber-button-primary flex-1"
                >
                  Return to Campaign
                </button>
              )}
              <Link 
                to="/campaign"
                className="cyber-button flex-1 text-center"
              >
                Exit Game
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeStandardsGame;
