
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePlayer } from '@/context/PlayerContext';
import GameHUD from '@/components/game/GameHUD';
import { Code, Check, X, HelpCircle, ChevronRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CodeStandardsQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { player, updatePlayerXP, completeGame, unlockBadge } = usePlayer();
  
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentXp, setCurrentXp] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // Quiz questions
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which naming convention is recommended for JavaScript variables?',
      options: ['camelCase', 'snake_case', 'PascalCase', 'kebab-case'],
      correctAnswer: 0,
      explanation: 'camelCase is the standard convention for variables in JavaScript. It starts with a lowercase letter and each subsequent word starts with an uppercase letter.'
    },
    {
      id: 'q2',
      question: 'What is the recommended indentation size for most coding standards?',
      options: ['2 spaces', '4 spaces', '8 spaces', 'Tab character'],
      correctAnswer: 0,
      explanation: '2 spaces is commonly recommended in modern JavaScript style guides like those from Airbnb and Google, though 4 spaces is also acceptable in many organizations.'
    },
    {
      id: 'q3',
      question: 'Which of the following is NOT a benefit of consistent coding standards?',
      options: ['Increased code efficiency at runtime', 'Easier maintenance', 'Better team collaboration', 'Faster onboarding for new developers'],
      correctAnswer: 0,
      explanation: 'Coding standards improve readability and maintainability but don\'t directly impact runtime performance. The other options are all legitimate benefits of consistent standards.'
    },
    {
      id: 'q4',
      question: 'Which convention should be used for naming React components?',
      options: ['PascalCase', 'camelCase', 'snake_case', 'ALL_CAPS'],
      correctAnswer: 0,
      explanation: 'React components should use PascalCase (starting with a capital letter) to distinguish them from regular JavaScript functions and HTML elements.'
    },
    {
      id: 'q5',
      question: 'How should you format comments that explain code functionality?',
      options: [
        'Use // for single-line comments and /* */ for multi-line comments',
        'Always use JSDoc format for all comments',
        'Only use inline comments after the code',
        'Comments are discouraged as code should be self-explanatory'
      ],
      correctAnswer: 0,
      explanation: 'Single-line comments (// comment) are best for brief explanations, while multi-line comments (/* comment */) are appropriate for longer explanations spanning multiple lines.'
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
    setShowExplanation(true);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      // Correct answer
      const pointsGained = 5;
      setScore(score + pointsGained);
      setCurrentXp(currentXp + 5);
      
      toast({
        title: "Correct!",
        description: `+${pointsGained} points`,
        variant: "success"
      });
    } else {
      // Incorrect answer
      const newLives = lives - 1;
      setLives(newLives);
      setAttempts(attempts + 1);
      
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

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      handleGameCompleted();
    }
  };

  const handleGameCompleted = () => {
    setGameCompleted(true);
    
    // Award XP to player
    updatePlayerXP(currentXp);
    
    // Mark game as completed
    completeGame('code-standards-quiz', score, 180 - timeLeft);
    
    setModalContent({
      title: 'Quiz Completed!',
      message: `Congratulations! You've completed the Coding Standards Quiz with a score of ${score}`,
      type: 'success'
    });
    setShowModal(true);
  };

  const restartGame = () => {
    setTimeLeft(180);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentXp(0);
    setAttempts(0);
    setLives(3);
    setGameCompleted(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Coding Standards"
        time={timeLeft}
        score={score}
        lives={lives}
        level={currentQuestion + 1}
        attempts={attempts}
        xp={currentXp}
        maxXp={100}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            CODE STANDARDS QUIZ
          </h1>
          
          <Link to="/mini-games" className="cyber-button text-sm py-2">
            EXIT QUIZ
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyber-terminal-green">
              QUESTION {currentQuestion + 1}/{questions.length}
            </h2>
            <div className="cyber-badge bg-cyber-muted text-white">
              {score} POINTS
            </div>
          </div>
          
          <div className="bg-cyber-muted/20 p-4 rounded-md mb-6">
            <p className="text-lg text-gray-100 mb-2">
              {questions[currentQuestion].question}
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-md border-2 transition-colors ${
                  selectedOption === null 
                    ? 'border-cyber-muted hover:border-cyber-primary bg-cyber-muted/10' 
                    : selectedOption === index 
                      ? index === questions[currentQuestion].correctAnswer 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-red-500 bg-red-900/20'
                      : index === questions[currentQuestion].correctAnswer && showExplanation 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-cyber-muted bg-cyber-muted/10'
                }`}
              >
                <div className="flex items-center">
                  {selectedOption !== null && (
                    <span className="mr-2">
                      {index === questions[currentQuestion].correctAnswer ? (
                        <Check className="text-green-500" size={20} />
                      ) : selectedOption === index ? (
                        <X className="text-red-500" size={20} />
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
                <HelpCircle className="text-cyber-secondary mr-2 flex-shrink-0 mt-1" size={18} />
                <h3 className="text-cyber-secondary font-semibold">Explanation:</h3>
              </div>
              <p className="text-gray-300 text-sm pl-6">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
          
          {selectedOption !== null && (
            <div className="flex justify-center">
              <button 
                onClick={handleNextQuestion}
                className="cyber-button-primary flex items-center space-x-2 py-2 px-6"
              >
                <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
        
        <div className="cyber-container p-4 border-cyber-border mb-6">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              MENTOR HINT
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            Coding standards vary slightly between organizations, but most modern JavaScript
            projects follow similar conventions for naming, formatting, and structure.
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
                Exit Quiz
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeStandardsQuiz;
