
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePlayer } from '@/context/PlayerContext';
import GameHUD from '@/components/game/GameHUD';
import CodeBlock from '@/components/game/CodeBlock';
import { Bug, Clock, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

interface DebugChallenge {
  id: string;
  title: string;
  description: string;
  buggedCode: string;
  bugLocation: string;
  options: string[];
  correctAnswer: number;
  fixedCode: string;
  explanation: string;
}

const QuickDebugGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { player, updatePlayerXP, completeGame } = usePlayer();
  
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2); // Only 2 lives for quick challenge
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<string | null>(null);
  const [currentXp, setCurrentXp] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Debug challenges
  const challenges: DebugChallenge[] = [
    {
      id: 'quick-debug-1',
      title: 'Array Iteration Bug',
      description: 'There\'s a bug in this array mapping function. Find the issue!',
      buggedCode: `function doubleNumbers(numbers) {
  const doubled = numbers.map(number => {
    return number * 2;
  );
  return doubled;
}

// Usage
const nums = [1, 2, 3, 4];
const result = doubleNumbers(nums);
console.log(result); // Should print [2, 4, 6, 8]`,
      bugLocation: 'Line 4',
      options: [
        'Missing closing curly brace',
        'Missing closing parenthesis', 
        'Wrong variable name', 
        'Incorrect multiplication'
      ],
      correctAnswer: 1,
      fixedCode: `function doubleNumbers(numbers) {
  const doubled = numbers.map(number => {
    return number * 2;
  });
  return doubled;
}

// Usage
const nums = [1, 2, 3, 4];
const result = doubleNumbers(nums);
console.log(result); // Should print [2, 4, 6, 8]`,
      explanation: 'The bug is a missing closing parenthesis on line 4. The closing parenthesis for the map function callback is missing, which causes a syntax error.'
    },
    {
      id: 'quick-debug-2',
      title: 'Event Handler Bug',
      description: 'This React click handler has a bug. Find what\'s wrong!',
      buggedCode: `function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count++); // Bug is here
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}`,
      bugLocation: 'Line 5',
      options: [
        'setCount(count + 1) should be used instead',
        'count++ should be wrapped in parentheses',
        'handleClick needs to be bound in the constructor',
        'The state variable declaration is incorrect'
      ],
      correctAnswer: 0,
      fixedCode: `function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1); // Fixed
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}`,
      explanation: 'The bug is that `count++` is a post-increment operation that modifies the variable directly and returns its previous value. In React, we should never modify state directly. Instead, we should use `setCount(count + 1)` to properly update the state.'
    },
    {
      id: 'quick-debug-3',
      title: 'Async Function Bug',
      description: 'Find the bug in this async function that\'s preventing it from resolving correctly.',
      buggedCode: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      bugLocation: 'Line 4',
      options: [
        'Missing await before response.json()',
        'Incorrect template string syntax',
        'try/catch block is unnecessary',
        'fetch() is being used incorrectly'
      ],
      correctAnswer: 0,
      fixedCode: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      explanation: 'The bug is that `response.json()` returns a Promise that needs to be awaited. Without the await keyword, `data` will be a Promise rather than the parsed JSON data.'
    }
  ];

  // Timer effect
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

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Already answered
    
    setSelectedOption(optionIndex);
    setHighlightedLine(challenges[currentChallenge].bugLocation);
    
    if (optionIndex === challenges[currentChallenge].correctAnswer) {
      // Correct answer
      const pointsGained = 10;
      setScore(score + pointsGained);
      setCurrentXp(currentXp + 10);
      setShowExplanation(true);
      
      toast({
        title: "Bug Found!",
        description: `+${pointsGained} points`,
        variant: "success"
      });
    } else {
      // Incorrect answer
      const newLives = lives - 1;
      setLives(newLives);
      setAttempts(attempts + 1);
      setShowExplanation(true);
      
      toast({
        title: "Incorrect!",
        description: `${newLives} lives remaining`,
        variant: "destructive"
      });
      
      if (newLives <= 0) {
        setModalContent({
          title: 'Game Over',
          message: 'You\'ve run out of lives. Would you like to try again?',
          type: 'error'
        });
        setShowModal(true);
        return;
      }
    }
  };

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setHighlightedLine(null);
    } else {
      // Game completed
      handleGameCompleted();
    }
  };

  const handleGameCompleted = () => {
    setGameCompleted(true);
    
    // Award XP to player
    updatePlayerXP(currentXp);
    
    // Mark game as completed
    completeGame('quick-debug', score, 120 - timeLeft);
    
    setModalContent({
      title: 'Debug Challenge Completed!',
      message: `Congratulations! You've completed the Quick Debug Challenge with a score of ${score}`,
      type: 'success'
    });
    setShowModal(true);
  };

  const restartGame = () => {
    setTimeLeft(120);
    setScore(0);
    setLives(2);
    setCurrentChallenge(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setHighlightedLine(null);
    setCurrentXp(0);
    setAttempts(0);
    setGameCompleted(false);
    setShowModal(false);
  };

  const currentBuggedCode = challenges[currentChallenge]?.buggedCode || '';
  const currentFixedCode = challenges[currentChallenge]?.fixedCode || '';

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Quick Debug"
        time={timeLeft}
        score={score}
        lives={lives}
        level={currentChallenge + 1}
        attempts={attempts}
        xp={currentXp}
        maxXp={100}
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            QUICK DEBUG CHALLENGE
          </h1>
          
          <Link to="/mini-games" className="cyber-button text-sm py-2">
            EXIT CHALLENGE
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <div className="flex items-center mb-4">
            <Bug className="text-red-500 mr-2" />
            <h2 className="text-xl font-bold text-cyber-terminal-red">
              {challenges[currentChallenge]?.title || 'Debug Challenge'}
            </h2>
            <div className="ml-auto flex items-center">
              <Clock className="text-yellow-500 mr-1" size={16} />
              <div className="text-yellow-500 text-sm">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">
            {challenges[currentChallenge]?.description || 'Find the bug in this code!'}
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-cyber-terminal-blue">Bugged Code:</div>
              {highlightedLine && (
                <div className="cyber-badge bg-red-900/30 text-red-400">
                  Bug in {highlightedLine}
                </div>
              )}
            </div>
            <div className="border border-red-500/30 rounded-md overflow-hidden">
              <CodeBlock code={currentBuggedCode} language="javascript" />
            </div>
          </div>
          
          {showExplanation && (
            <div className="mb-6">
              <div className="text-sm text-cyber-terminal-green mb-2">Fixed Code:</div>
              <div className="border border-green-500/30 rounded-md overflow-hidden">
                <CodeBlock code={currentFixedCode} language="javascript" />
              </div>
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            <div className="text-sm text-cyber-terminal-blue mb-2">What's the bug?</div>
            {challenges[currentChallenge]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-3 rounded-md border-2 transition-colors ${
                  selectedOption === null 
                    ? 'border-cyber-muted hover:border-cyber-primary bg-cyber-muted/10' 
                    : selectedOption === index 
                      ? index === challenges[currentChallenge].correctAnswer 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-red-500 bg-red-900/20'
                      : index === challenges[currentChallenge].correctAnswer && showExplanation 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-cyber-muted bg-cyber-muted/10'
                }`}
              >
                <div className="flex items-center">
                  {selectedOption !== null && (
                    <span className="mr-2">
                      {index === challenges[currentChallenge].correctAnswer ? (
                        <CheckCircle2 className="text-green-500" size={16} />
                      ) : selectedOption === index ? (
                        <AlertCircle className="text-red-500" size={16} />
                      ) : null}
                    </span>
                  )}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {showExplanation && (
            <div className="bg-cyber-secondary/10 border border-cyber-secondary p-4 rounded-md mb-6">
              <div className="flex items-start mb-2">
                <Terminal className="text-cyber-secondary mr-2 flex-shrink-0 mt-1" size={18} />
                <h3 className="text-cyber-secondary font-semibold">Explanation:</h3>
              </div>
              <p className="text-gray-300 text-sm pl-6">
                {challenges[currentChallenge].explanation}
              </p>
            </div>
          )}
          
          {selectedOption !== null && (
            <div className="flex justify-center">
              <button 
                onClick={handleNextChallenge}
                className="cyber-button-primary py-2 px-6"
              >
                {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'Complete Challenge'}
              </button>
            </div>
          )}
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
                  onClick={() => navigate('/mini-games')}
                  className="cyber-button-primary flex-1"
                >
                  Return to Mini-Games
                </button>
              )}
              <Link 
                to="/mini-games"
                className="cyber-button flex-1 text-center"
              >
                Exit Challenge
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickDebugGame;
