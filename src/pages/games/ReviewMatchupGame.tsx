
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameHUD from '@/components/game/GameHUD';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

interface ReviewTechnique {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  iconClass: string;
}

interface ReviewScenario {
  id: string;
  description: string;
  correctTechniqueId: string;
  explanation: string;
  difficultyLevel: number;
}

const ReviewMatchupGame = () => {
  const { player, updatePlayerXP, completeGame, unlockBadge } = usePlayer();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Review techniques
  const reviewTechniques: ReviewTechnique[] = [
    {
      id: 'deskcheck',
      name: 'Deskcheck',
      description: 'A quick, informal review where one developer checks another\'s code',
      characteristics: [
        'Informal and quick',
        'One-on-one review',
        'Less documentation required',
        'Good for small changes or quick fixes'
      ],
      iconClass: 'bg-green-600'
    },
    {
      id: 'walkthrough',
      name: 'Walkthrough',
      description: 'A step-by-step explanation of code by the author to a group of reviewers',
      characteristics: [
        'Author guides the review',
        'Small group review (3-5 people)',
        'Educational focus',
        'Good for knowledge sharing and mentoring'
      ],
      iconClass: 'bg-blue-600'
    },
    {
      id: 'inspection',
      name: 'Inspection',
      description: 'A formal, structured review process with defined roles and metrics',
      characteristics: [
        'Highly formal and structured',
        'Defined roles (moderator, author, reviewers)',
        'Detailed metrics and documentation',
        'Good for critical systems or large changes'
      ],
      iconClass: 'bg-purple-600'
    }
  ];

  // Review scenarios
  const reviewScenarios: ReviewScenario[] = [
    {
      id: 'scenario-1',
      description: 'A junior developer has made a simple UI change to fix a button alignment issue. They want quick feedback before submitting.',
      correctTechniqueId: 'deskcheck',
      explanation: 'A deskcheck is ideal for this scenario because it\'s a simple change that can be quickly reviewed by a single developer, requiring minimal formality.',
      difficultyLevel: 1
    },
    {
      id: 'scenario-2',
      description: 'A new algorithm has been implemented that the team will need to understand and maintain going forward. Several developers will be working with this code.',
      correctTechniqueId: 'walkthrough',
      explanation: 'A walkthrough is best here, as the author can educate the team about how the algorithm works, facilitating knowledge sharing across multiple developers.',
      difficultyLevel: 1
    },
    {
      id: 'scenario-3',
      description: 'Major changes to the payment processing system need review before deployment to production. This code handles financial transactions for thousands of customers.',
      correctTechniqueId: 'inspection',
      explanation: 'An inspection is necessary due to the critical nature of payment processing code. Formal review with defined roles and detailed documentation helps catch issues in this high-risk area.',
      difficultyLevel: 2
    },
    {
      id: 'scenario-4',
      description: 'A developer has refactored a utility function used by multiple teams. The changes improve performance but don\'t change functionality.',
      correctTechniqueId: 'walkthrough',
      explanation: 'A walkthrough is appropriate since multiple teams need to understand the refactoring. The author can explain the performance improvements without changing how the function is used.',
      difficultyLevel: 2
    },
    {
      id: 'scenario-5',
      description: 'A security fix for a critical vulnerability needs to be reviewed thoroughly with documentation of all potential side effects.',
      correctTechniqueId: 'inspection',
      explanation: 'An inspection is necessary for security-critical code. The formal process ensures thorough review and documentation of potential impacts of the security fix.',
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

  const handleTechniqueSelect = (techniqueId: string) => {
    const currentScenario = reviewScenarios[scenarioIndex];
    setSelectedTechnique(techniqueId);
    setAttempts(attempts + 1);
    
    // Check if selection is correct
    if (techniqueId === currentScenario.correctTechniqueId) {
      // Correct match!
      setFeedbackType('success');
      const newScore = score + 10;
      setScore(newScore);
      setCurrentXp(Math.min(currentXp + 5, 100));
      
      toast.success(`Correct! ${reviewTechniques.find(t => t.id === techniqueId)?.name} is the right choice.`);
      setShowFeedback(true);
      
      // Move to next scenario after delay
      setTimeout(() => {
        if (scenarioIndex < reviewScenarios.length - 1) {
          setScenarioIndex(scenarioIndex + 1);
          setSelectedTechnique(null);
          setShowFeedback(false);
        } else {
          // Game completed!
          setGameCompleted(true);
          completeGame('code-review-challenge', newScore, 300 - timeLeft);
          
          // Unlock badge if score is high enough
          if (newScore >= 40) {
            unlockBadge('review-expert');
          }
          
          setModalContent({
            title: 'Review Challenge Complete!',
            message: `Congratulations! You've successfully matched all review techniques with a score of ${newScore} points.`,
            type: 'success'
          });
          setShowModal(true);
        }
      }, 2000);
    } else {
      // Incorrect match
      setFeedbackType('error');
      const newLives = lives - 1;
      setLives(newLives);
      toast.error(`Incorrect. ${reviewTechniques.find(t => t.id === techniqueId)?.name} is not the best choice here.`);
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
    setSelectedTechnique(null);
    setShowFeedback(false);
    setShowModal(false);
    setGameCompleted(false);
  };

  const currentScenario = reviewScenarios[scenarioIndex];

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Code Reviews"
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
            CODE REVIEW CHALLENGE
          </h1>
          
          <Link to="/campaign" className="cyber-button text-sm py-2">
            EXIT CHALLENGE
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-cyber-terminal-green mb-2">
                MISSION: MATCH THE CORRECT REVIEW TECHNIQUE
              </h2>
              <p className="text-gray-300 mb-2">
                For each scenario, select the most appropriate code review technique.
              </p>
              <div className="cyber-badge bg-cyber-muted text-cyber-terminal-blue inline-block">
                DIFFICULTY: {Array(currentScenario.difficultyLevel).fill('★').join('')}
              </div>
            </div>
            
            <div className="cyber-badge bg-cyber-primary/20 text-cyber-primary">
              SCENARIO {scenarioIndex + 1}/{reviewScenarios.length}
            </div>
          </div>
        </div>
        
        {/* Scenario */}
        <div className="cyber-container p-6 mb-8 border-cyber-secondary">
          <h3 className="text-lg font-bold text-cyber-terminal-blue mb-4">
            SCENARIO
          </h3>
          <p className="text-gray-200 text-lg mb-6 cyber-terminal">
            "{currentScenario.description}"
          </p>
          
          {showFeedback && (
            <div className={`cyber-container p-4 mt-4 border-2 ${
              feedbackType === 'success' ? 'border-green-500' : 'border-red-500'
            }`}>
              <h4 className={`font-bold ${
                feedbackType === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {feedbackType === 'success' ? 'CORRECT ANALYSIS' : 'INCORRECT ANALYSIS'}
              </h4>
              <p className="text-gray-300 text-sm mt-2">
                {currentScenario.explanation}
              </p>
            </div>
          )}
        </div>
        
        {/* Review Techniques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reviewTechniques.map(technique => (
            <button
              key={technique.id}
              onClick={() => !showFeedback && handleTechniqueSelect(technique.id)}
              disabled={showFeedback}
              className={`cyber-container p-5 text-left transition-all ${
                selectedTechnique === technique.id 
                  ? feedbackType === 'success' 
                    ? 'border-green-500 border-2' 
                    : 'border-red-500 border-2'
                  : 'hover:border-cyber-terminal-blue'
              } ${showFeedback ? 'opacity-80' : ''}`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-4 h-4 rounded-full ${technique.iconClass} mr-2`}></div>
                <h3 className="text-lg font-bold text-white">
                  {technique.name}
                </h3>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                {technique.description}
              </p>
              
              <div className="space-y-1 text-xs text-gray-400">
                {technique.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="mr-1">•</span>
                    <span>{char}</span>
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

export default ReviewMatchupGame;
