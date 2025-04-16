
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameHUD from '@/components/game/GameHUD';
import CodeBlock from '@/components/game/CodeBlock';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

interface Bug {
  id: number;
  lineNumber: number;
  description: string;
  hint: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  code: string;
  bugs: Bug[];
  difficultyLevel: number;
}

const DebugChallengeGame = () => {
  const { player, updatePlayerXP, completeGame, unlockBadge } = usePlayer();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Debug challenges data
  const debugChallenges: Challenge[] = [
    {
      id: 'debug-1',
      title: 'Array Index Bug',
      description: 'This function should return the sum of array elements, but it has a bug.',
      code: `function sumArray(arr) {
  let sum = 0;
  // Bug: Incorrect loop boundary
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Test case
const numbers = [1, 2, 3, 4, 5];
console.log(sumArray(numbers)); // Should output 15`,
      bugs: [
        {
          id: 1,
          lineNumber: 4,
          description: 'Array index out of bounds error',
          hint: 'Check the loop boundary condition'
        }
      ],
      difficultyLevel: 1
    },
    {
      id: 'debug-2',
      title: 'Closure Bug',
      description: 'This code creates buttons with event handlers, but all buttons show the same value when clicked.',
      code: `function createButtons() {
  const container = document.getElementById('container');
  
  // Bug: Variable capture in closure
  for (var i = 0; i < 5; i++) {
    const button = document.createElement('button');
    button.textContent = 'Button ' + i;
    
    button.addEventListener('click', function() {
      alert('Clicked button ' + i);
    });
    
    container.appendChild(button);
  }
}`,
      bugs: [
        {
          id: 1,
          lineNumber: 4,
          description: 'Variable capture issue in the closure',
          hint: 'The problem is with how the variable is declared and captured'
        }
      ],
      difficultyLevel: 2
    },
    {
      id: 'debug-3',
      title: 'Async Operation Bug',
      description: 'This function uses promises, but the error handling is incorrect.',
      code: `async function fetchUserData(userId) {
  try {
    const response = await fetch('https://api.example.com/users/' + userId);
    const data = response.json();  // Bug: Missing await
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Usage
fetchUserData(123)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    // This catch won't receive the JSON parsing error
    console.error('Caught:', err);
  });`,
      bugs: [
        {
          id: 1,
          lineNumber: 4,
          description: 'Missing await for asynchronous operation',
          hint: 'Check the promise handling in the try block'
        }
      ],
      difficultyLevel: 3
    }
  ];

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

  const handleLineClick = (lineNumber: number) => {
    const currentChallenge = debugChallenges[challengeIndex];
    setAttempts(attempts + 1);
    
    // Check if line is already selected
    if (selectedLines.includes(lineNumber)) {
      setSelectedLines(selectedLines.filter(line => line !== lineNumber));
      return;
    }
    
    // Check if clicked line contains a bug
    const bugOnLine = currentChallenge.bugs.find(bug => bug.lineNumber === lineNumber);
    
    if (bugOnLine) {
      // Found a bug!
      setSelectedLines([...selectedLines, lineNumber]);
      const newScore = score + 10;
      setScore(newScore);
      setCurrentXp(Math.min(currentXp + 5, 100));
      
      toast.success(`Bug found! ${bugOnLine.description}`);
      
      // Check if all bugs found
      if (selectedLines.length + 1 === currentChallenge.bugs.length) {
        // All bugs found
        if (challengeIndex < debugChallenges.length - 1) {
          // Move to next challenge
          setTimeout(() => {
            setModalContent({
              title: 'Challenge Complete!',
              message: `Great job finding all bugs in "${currentChallenge.title}". Moving to next challenge...`,
              type: 'success'
            });
            setShowModal(true);
            setChallengeIndex(challengeIndex + 1);
            setSelectedLines([]);
            setShowHint(false);
          }, 1000);
        } else {
          // Game completed!
          setGameCompleted(true);
          completeGame('debug-mission', newScore, 600 - timeLeft);
          
          // Unlock badge if score is high enough
          if (newScore >= 25) {
            unlockBadge('bug-hunter');
          }
          
          setModalContent({
            title: 'Debug Mission Complete!',
            message: `Congratulations! You've successfully completed all debugging challenges with a score of ${newScore} points.`,
            type: 'success'
          });
          setShowModal(true);
        }
      }
    } else {
      // Wrong line - not a bug
      const newLives = lives - 1;
      setLives(newLives);
      toast.error('No bug on this line. Try again!');
      
      if (newLives <= 0) {
        setModalContent({
          title: 'Game Over',
          message: 'You\'ve run out of lives. Would you like to try again?',
          type: 'error'
        });
        setShowModal(true);
      }
    }
  };

  const showBugHint = () => {
    setShowHint(true);
    // Small penalty for using hint
    const newScore = Math.max(0, score - 2);
    setScore(newScore);
    toast.info('Used a hint (-2 points)');
  };

  const restartGame = () => {
    setTimeLeft(600);
    setScore(0);
    setLives(3);
    setAttempts(0);
    setCurrentXp(0);
    setChallengeIndex(0);
    setSelectedLines([]);
    setShowHint(false);
    setShowModal(false);
    setGameCompleted(false);
  };

  const currentChallenge = debugChallenges[challengeIndex];

  // Split code into lines for interactive clicking
  const codeLines = currentChallenge.code.split('\n');

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Debugging"
        time={timeLeft}
        score={score}
        lives={lives}
        level={player.level}
        attempts={attempts}
        xp={currentXp}
        maxXp={100}
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            DEBUG MISSION
          </h1>
          
          <Link to="/campaign" className="cyber-button text-sm py-2">
            EXIT MISSION
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-cyber-terminal-green mb-2">
                CHALLENGE {challengeIndex + 1}: {currentChallenge.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {currentChallenge.description}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <div className="cyber-badge bg-cyber-muted text-cyber-terminal-blue">
                DIFFICULTY: {Array(currentChallenge.difficultyLevel).fill('★').join('')}
              </div>
              <div className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
                BUGS: {selectedLines.length}/{currentChallenge.bugs.length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Interactive Code Area */}
          <div className="lg:col-span-2 cyber-container p-4 border-cyber-primary">
            <h3 className="text-lg font-bold text-cyber-terminal-red mb-4">
              DEBUG CONSOLE
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Click on the line that contains a bug.
            </p>
            
            <div className="bg-gray-900 rounded-md p-2 overflow-auto max-h-[500px]">
              {codeLines.map((line, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleLineClick(idx + 1)}
                  className={`font-mono text-sm py-1 px-2 flex cursor-pointer hover:bg-gray-800 ${
                    selectedLines.includes(idx + 1) ? 'bg-red-900/30 border-l-4 border-red-500' : ''
                  }`}
                >
                  <span className="text-gray-500 w-8 text-right mr-3">{idx + 1}</span>
                  <span className="text-gray-200">{line}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Debugging Tools */}
          <div className="cyber-container p-4 border-cyber-muted flex flex-col">
            <h3 className="text-lg font-bold text-cyber-terminal-blue mb-4">
              DEBUG TOOLS
            </h3>
            
            {showHint ? (
              <div className="cyber-container p-3 mb-4 bg-cyber-muted/30">
                <h4 className="text-sm font-bold text-cyber-terminal-yellow mb-2">
                  HINT
                </h4>
                <p className="text-sm text-gray-300">
                  {currentChallenge.bugs[0].hint}
                </p>
              </div>
            ) : (
              <button
                onClick={showBugHint}
                className="cyber-button-accent mb-4 text-sm"
              >
                Request Hint (-2 pts)
              </button>
            )}
            
            <div className="cyber-container p-3 mb-4 bg-cyber-muted/30">
              <h4 className="text-sm font-bold text-cyber-terminal-green mb-2">
                COMMON BUGS
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Off-by-one errors in loops</li>
                <li>• Unhandled null/undefined values</li>
                <li>• Incorrect variable scope</li>
                <li>• Missing await for async operations</li>
                <li>• Logic errors in conditionals</li>
              </ul>
            </div>
            
            <div className="cyber-container p-3 mt-auto bg-cyber-muted/30">
              <h4 className="text-sm font-bold text-cyber-terminal-purple mb-2">
                DEBUG STRATEGY
              </h4>
              <p className="text-sm text-gray-300">
                Read the code carefully line by line. Look for common pitfalls and edge cases. Consider what values variables might contain at each step.
              </p>
            </div>
          </div>
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
              {modalContent.type === 'success' && !gameCompleted ? (
                <button 
                  onClick={() => setShowModal(false)}
                  className="cyber-button-primary flex-1"
                >
                  Continue
                </button>
              ) : (
                <>
                  <button 
                    onClick={restartGame}
                    className="cyber-button-primary flex-1"
                  >
                    Try Again
                  </button>
                  <Link 
                    to="/campaign"
                    className="cyber-button flex-1 text-center"
                  >
                    Exit Game
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugChallengeGame;
