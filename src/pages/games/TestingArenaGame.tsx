
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameHUD from '@/components/game/GameHUD';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';
import CodeBlock from '@/components/game/CodeBlock';

interface TestingStrategy {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
  color: string;
}

interface TestingScenario {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  correctStrategyId: string;
  explanation: string;
  secondaryStrategyId?: string;
  difficultyLevel: number;
}

const TestingArenaGame = () => {
  const { player, updatePlayerXP, completeGame, unlockBadge } = usePlayer();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'partial'>('success');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Testing strategies
  const testingStrategies: TestingStrategy[] = [
    {
      id: 'unit',
      name: 'Unit Testing',
      description: 'Testing individual units or components of a software in isolation',
      characteristics: [
        'Tests smallest parts of an application in isolation',
        'Fast execution and feedback',
        'Typically written by developers',
        'White-box testing approach'
      ],
      examples: [
        'Testing a single function',
        'Testing a class method',
        'Testing a small component'
      ],
      color: 'text-green-400'
    },
    {
      id: 'integration',
      name: 'Integration Testing',
      description: 'Testing how multiple units work together as a group',
      characteristics: [
        'Tests interaction between components',
        'Identifies interface defects',
        'Medium scope and complexity',
        'Can be white-box or black-box'
      ],
      examples: [
        'Testing API endpoints',
        'Testing database interactions',
        'Testing component interactions'
      ],
      color: 'text-blue-400'
    },
    {
      id: 'validation',
      name: 'Validation Testing',
      description: 'Verifying that the software meets specified requirements',
      characteristics: [
        'Focuses on meeting requirements',
        'Verifies the "right product" is built',
        'Often involves stakeholders',
        'Black-box testing approach'
      ],
      examples: [
        'User acceptance testing',
        'Business requirement validation',
        'Feature verification'
      ],
      color: 'text-yellow-400'
    },
    {
      id: 'system',
      name: 'System Testing',
      description: 'Testing the complete integrated system as a whole',
      characteristics: [
        'End-to-end testing of the entire application',
        'Tests complete workflows',
        'Highest level of testing',
        'Black-box testing approach'
      ],
      examples: [
        'End-to-end user flows',
        'Performance testing',
        'Security testing',
        'Cross-browser testing'
      ],
      color: 'text-purple-400'
    }
  ];

  // Testing scenarios
  const testingScenarios: TestingScenario[] = [
    {
      id: 'scenario-1',
      title: 'Authentication Function',
      description: 'A developer has written a new function to validate user credentials against a database.',
      codeSnippet: `async function validateCredentials(username, password) {
  try {
    const user = await database.findUser(username);
    if (!user) return false;
    
    const passwordMatch = await bcrypt.compare(
      password, user.passwordHash
    );
    
    return passwordMatch;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}`,
      correctStrategyId: 'unit',
      explanation: 'Unit testing is most appropriate here to test the function in isolation, mocking the database and bcrypt dependencies.',
      difficultyLevel: 1
    },
    {
      id: 'scenario-2',
      title: 'User Registration Flow',
      description: 'A new user registration process involves account creation, email verification, and profile setup across multiple services.',
      correctStrategyId: 'integration',
      explanation: 'Integration testing is ideal because we need to test how multiple components interact in the registration flow.',
      secondaryStrategyId: 'system',
      difficultyLevel: 2
    },
    {
      id: 'scenario-3',
      title: 'Payment Processing System',
      description: 'An e-commerce application\'s complete payment processing system that handles credit card transactions, shipping calculations, and inventory updates.',
      correctStrategyId: 'system',
      explanation: 'System testing is needed to verify the entire payment workflow functions correctly in the complete application environment.',
      difficultyLevel: 3
    },
    {
      id: 'scenario-4',
      title: 'Feature Requirement Verification',
      description: 'A client has specific requirements for a new reporting dashboard that should display financial data in particular formats and allow specific interactions.',
      correctStrategyId: 'validation',
      explanation: 'Validation testing ensures the implementation meets the specific requirements laid out by the client.',
      difficultyLevel: 2
    },
    {
      id: 'scenario-5',
      title: 'Data Processing Algorithm',
      description: 'An engineer has implemented a complex data transformation algorithm that processes user data before visualization.',
      codeSnippet: `function processDataForVisualization(rawData) {
  // Filter out invalid entries
  const validData = rawData.filter(
    entry => entry.value != null && entry.timestamp
  );
  
  // Group by category
  const groupedData = validData.reduce((groups, item) => {
    const group = groups[item.category] || [];
    group.push(item);
    groups[item.category] = group;
    return groups;
  }, {});
  
  // Calculate aggregates
  return Object.keys(groupedData).map(category => ({
    category,
    average: calculateAverage(groupedData[category]),
    max: findMaxValue(groupedData[category]),
    min: findMinValue(groupedData[category])
  }));
}`,
      correctStrategyId: 'unit',
      explanation: 'Unit testing is most appropriate for testing this algorithm function in isolation with various input test cases.',
      difficultyLevel: 2
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

  const handleStrategySelect = (strategyId: string) => {
    const currentScenario = testingScenarios[scenarioIndex];
    setSelectedStrategy(strategyId);
    setAttempts(attempts + 1);
    
    // Check if selection is correct
    if (strategyId === currentScenario.correctStrategyId) {
      // Correct strategy!
      setFeedbackType('success');
      const newScore = score + 10;
      setScore(newScore);
      setCurrentXp(Math.min(currentXp + 5, 100));
      
      toast.success(`Correct! ${testingStrategies.find(s => s.id === strategyId)?.name} is the ideal strategy.`);
      setShowFeedback(true);
      
      // Move to next scenario after delay
      setTimeout(() => {
        if (scenarioIndex < testingScenarios.length - 1) {
          setScenarioIndex(scenarioIndex + 1);
          setSelectedStrategy(null);
          setShowFeedback(false);
        } else {
          // Game completed!
          setGameCompleted(true);
          completeGame('testing-arena', newScore, 300 - timeLeft);
          
          // Unlock badge if score is high enough
          if (newScore >= 40) {
            unlockBadge('test-champion');
          }
          
          setModalContent({
            title: 'Testing Arena Complete!',
            message: `Congratulations! You've successfully completed all testing scenarios with a score of ${newScore} points.`,
            type: 'success'
          });
          setShowModal(true);
        }
      }, 2000);
    } else if (strategyId === currentScenario.secondaryStrategyId) {
      // Partially correct (secondary acceptable strategy)
      setFeedbackType('partial');
      const newScore = score + 5;
      setScore(newScore);
      setCurrentXp(Math.min(currentXp + 2, 100));
      
      toast.info(`Good approach! ${testingStrategies.find(s => s.id === strategyId)?.name} works, but there's a better choice.`);
      setShowFeedback(true);
      
      // Move to next scenario after delay
      setTimeout(() => {
        if (scenarioIndex < testingScenarios.length - 1) {
          setScenarioIndex(scenarioIndex + 1);
          setSelectedStrategy(null);
          setShowFeedback(false);
        } else {
          // Game completed!
          setGameCompleted(true);
          completeGame('testing-arena', newScore, 300 - timeLeft);
          
          setModalContent({
            title: 'Testing Arena Complete!',
            message: `Congratulations! You've successfully completed all testing scenarios with a score of ${newScore} points.`,
            type: 'success'
          });
          setShowModal(true);
        }
      }, 2000);
    } else {
      // Incorrect strategy
      setFeedbackType('error');
      const newLives = lives - 1;
      setLives(newLives);
      toast.error(`Incorrect. ${testingStrategies.find(s => s.id === strategyId)?.name} is not the best strategy for this scenario.`);
      setShowFeedback(true);
      
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

  const restartGame = () => {
    setTimeLeft(300);
    setScore(0);
    setLives(3);
    setAttempts(0);
    setCurrentXp(0);
    setScenarioIndex(0);
    setSelectedStrategy(null);
    setShowFeedback(false);
    setShowModal(false);
    setGameCompleted(false);
  };

  const currentScenario = testingScenarios[scenarioIndex];

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Testing Strategies"
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
            TESTING ARENA
          </h1>
          
          <Link to="/campaign" className="cyber-button text-sm py-2">
            EXIT ARENA
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-cyber-terminal-green mb-2">
                MISSION: CHOOSE THE OPTIMAL TESTING STRATEGY
              </h2>
              <p className="text-gray-300 mb-2">
                For each scenario, select the most appropriate testing approach.
              </p>
              <div className="cyber-badge bg-cyber-muted text-cyber-terminal-blue inline-block">
                DIFFICULTY: {Array(currentScenario.difficultyLevel).fill('★').join('')}
              </div>
            </div>
            
            <div className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
              SCENARIO {scenarioIndex + 1}/{testingScenarios.length}
            </div>
          </div>
        </div>
        
        {/* Scenario */}
        <div className="cyber-container p-6 mb-8 border-cyber-secondary">
          <h3 className="text-lg font-bold text-cyber-terminal-blue mb-2">
            SCENARIO: {currentScenario.title}
          </h3>
          <p className="text-gray-200 mb-4">
            {currentScenario.description}
          </p>
          
          {currentScenario.codeSnippet && (
            <div className="mb-6 mt-4">
              <h4 className="text-sm font-bold text-cyber-terminal-yellow mb-2">
                CODE TO TEST
              </h4>
              <CodeBlock 
                code={currentScenario.codeSnippet} 
                language="javascript"
              />
            </div>
          )}
          
          {showFeedback && (
            <div className={`cyber-container p-4 mt-4 border-2 ${
              feedbackType === 'success' ? 'border-green-500' : 
              feedbackType === 'partial' ? 'border-yellow-500' :
              'border-red-500'
            }`}>
              <h4 className={`font-bold ${
                feedbackType === 'success' ? 'text-green-400' : 
                feedbackType === 'partial' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {feedbackType === 'success' ? 'CORRECT STRATEGY' : 
                 feedbackType === 'partial' ? 'ACCEPTABLE STRATEGY' :
                 'INCORRECT STRATEGY'}
              </h4>
              <p className="text-gray-300 text-sm mt-2">
                {currentScenario.explanation}
              </p>
            </div>
          )}
        </div>
        
        {/* Testing Strategies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {testingStrategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => !showFeedback && handleStrategySelect(strategy.id)}
              disabled={showFeedback}
              className={`cyber-container p-5 text-left transition-all ${
                selectedStrategy === strategy.id 
                  ? feedbackType === 'success' 
                    ? 'border-green-500 border-2' 
                    : feedbackType === 'partial'
                      ? 'border-yellow-500 border-2'
                      : 'border-red-500 border-2'
                  : 'hover:border-cyber-terminal-blue'
              } ${showFeedback ? 'opacity-80' : ''}`}
            >
              <h3 className={`text-lg font-bold ${strategy.color} mb-2`}>
                {strategy.name}
              </h3>
              
              <p className="text-gray-300 text-sm mb-3">
                {strategy.description}
              </p>
              
              <div className="space-y-1.5 text-xs text-gray-400 mb-3">
                <h4 className="text-white text-xs uppercase mb-1">Characteristics:</h4>
                {strategy.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-1 mt-0.5">•</span>
                    <span>{char}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-1 text-xs text-gray-400">
                <h4 className="text-white text-xs uppercase mb-1">Examples:</h4>
                {strategy.examples.map((example, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-1 mt-0.5">•</span>
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
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

export default TestingArenaGame;
