
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameHUD from '@/components/game/GameHUD';
import RiskScenario from '@/components/game/RiskScenario';

const RiskAdventureGame = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [riskProfile, setRiskProfile] = useState({
    proactive: 0,
    reactive: 0,
    mitigation: 0,
    avoidance: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Risk scenarios data
  const riskScenarios = [
    {
      id: 'risk-1',
      title: 'Shifting Requirements',
      description: 'The client has been changing requirements frequently throughout the project.',
      impact: 'High',
      probability: 'High',
      options: [
        {
          text: 'Implement agile methodologies to embrace change',
          type: 'proactive',
          mitigationLevel: 'high',
          points: 10,
          feedback: 'Excellent choice! Agile methodologies allow for adaptive planning and can handle changing requirements better than rigid approaches.'
        },
        {
          text: 'Set up a formal change request process with additional costs',
          type: 'reactive',
          mitigationLevel: 'medium',
          points: 5,
          feedback: 'This is a reasonable approach, but might cause friction with the client and doesn\'t address the root cause.'
        },
        {
          text: 'Ignore minor changes and focus on the original requirements',
          type: 'reactive',
          mitigationLevel: 'low',
          points: 0,
          feedback: 'This approach will likely lead to client dissatisfaction and a product that doesn\'t meet their needs.'
        }
      ]
    },
    {
      id: 'risk-2',
      title: 'Technical Debt',
      description: 'The development team is accumulating technical debt due to tight deadlines.',
      impact: 'Medium',
      probability: 'High',
      options: [
        {
          text: 'Allocate time for refactoring in each sprint',
          type: 'proactive',
          mitigationLevel: 'high',
          points: 10,
          feedback: 'Great choice! Regular refactoring prevents technical debt from getting out of hand.'
        },
        {
          text: 'Plan a dedicated "tech debt sprint" after major milestones',
          type: 'reactive',
          mitigationLevel: 'medium',
          points: 5,
          feedback: 'This can work, but allows debt to accumulate for longer periods, which might make it harder to address.'
        },
        {
          text: 'Focus on feature delivery and address tech debt only if it causes issues',
          type: 'reactive',
          mitigationLevel: 'low',
          points: 0,
          feedback: 'This approach will compound technical debt over time, leading to serious maintenance issues and slowed development pace.'
        }
      ]
    },
    {
      id: 'risk-3',
      title: 'Team Member Departure',
      description: 'A key developer has given notice and will leave in two weeks.',
      impact: 'High',
      probability: 'Confirmed',
      options: [
        {
          text: 'Implement pair programming and knowledge sharing sessions immediately',
          type: 'proactive',
          mitigationLevel: 'high',
          points: 10,
          feedback: 'Excellent strategy! This helps distribute knowledge across the team before the developer leaves.'
        },
        {
          text: 'Request detailed documentation of their current work before they leave',
          type: 'reactive',
          mitigationLevel: 'medium',
          points: 5,
          feedback: 'Documentation is helpful, but may not capture all the tacit knowledge the developer has.'
        },
        {
          text: 'Begin recruiting immediately to replace them as soon as possible',
          type: 'reactive',
          mitigationLevel: 'low',
          points: 3,
          feedback: 'While necessary, this doesn\'t address the immediate knowledge transfer needed and onboarding will take time.'
        }
      ]
    },
    {
      id: 'risk-4',
      title: 'Third-party API Reliability',
      description: 'Your application relies heavily on a third-party API that has had occasional outages.',
      impact: 'High',
      probability: 'Medium',
      options: [
        {
          text: 'Implement a fallback mechanism and caching strategy',
          type: 'proactive',
          mitigationLevel: 'high',
          points: 10,
          feedback: 'Perfect! This ensures your system can continue functioning even during API outages.'
        },
        {
          text: 'Set up monitoring to detect outages and alert the team',
          type: 'reactive',
          mitigationLevel: 'medium',
          points: 5,
          feedback: 'This helps you respond quickly, but doesn\'t prevent the impact on users during an outage.'
        },
        {
          text: 'Contact the API provider to discuss their reliability improvements',
          type: 'reactive',
          mitigationLevel: 'low',
          points: 2,
          feedback: 'While good for long-term improvement, this doesn\'t address your immediate vulnerability.'
        }
      ]
    },
    {
      id: 'risk-5',
      title: 'Security Vulnerability',
      description: 'A security audit has identified potential vulnerabilities in your authentication system.',
      impact: 'Critical',
      probability: 'Medium',
      options: [
        {
          text: 'Immediately prioritize fixing the vulnerabilities and conduct a follow-up audit',
          type: 'proactive',
          mitigationLevel: 'high',
          points: 10,
          feedback: 'The best approach for a critical security issue - address it immediately and verify the fix.'
        },
        {
          text: 'Implement additional monitoring to detect potential exploits while planning fixes',
          type: 'reactive',
          mitigationLevel: 'medium',
          points: 4,
          feedback: 'This helps detect breaches but doesn\'t prevent them, which is risky for authentication systems.'
        },
        {
          text: 'Schedule the fixes for the next planned release cycle',
          type: 'reactive',
          mitigationLevel: 'low',
          points: 0,
          feedback: 'For critical security issues, delayed action significantly increases organizational risk.'
        }
      ]
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

  const handleOptionSelect = (option: any) => {
    // Update risk profile based on selected option
    setRiskProfile({
      ...riskProfile,
      [option.type]: riskProfile[option.type as keyof typeof riskProfile] + 1,
      [option.mitigationLevel === 'high' ? 'mitigation' : 'avoidance']: 
        riskProfile[option.mitigationLevel === 'high' ? 'mitigation' : 'avoidance' as keyof typeof riskProfile] + 1
    });

    // Update score
    const newScore = score + option.points;
    setScore(newScore);
    setCurrentXp(Math.min(currentXp + option.points, 100));
    setAttempts(attempts + 1);
    
    // Check if game is completed
    if (currentScenarioIndex >= riskScenarios.length - 1) {
      setGameCompleted(true);
      setModalContent({
        title: 'Risk Adventure Completed!',
        message: `Congratulations! You've assessed all risk scenarios and earned ${newScore} points. Your risk management profile: ${getRiskProfile()}`,
        type: 'success'
      });
      setShowModal(true);
    } else {
      // Show feedback and move to next scenario
      setModalContent({
        title: 'Risk Assessment Result',
        message: option.feedback,
        type: option.mitigationLevel === 'high' ? 'success' : option.mitigationLevel === 'medium' ? 'info' : 'error'
      });
      setShowModal(true);
      
      // Move to next scenario
      setTimeout(() => {
        setShowModal(false);
        setCurrentScenarioIndex(currentScenarioIndex + 1);
      }, 3000);
    }
  };

  const getRiskProfile = () => {
    if (riskProfile.proactive > riskProfile.reactive) {
      return 'Proactive Risk Manager';
    } else {
      return 'Reactive Risk Responder';
    }
  };

  const restartGame = () => {
    setTimeLeft(600);
    setScore(0);
    setLives(3);
    setAttempts(0);
    setCurrentXp(0);
    setCurrentScenarioIndex(0);
    setRiskProfile({
      proactive: 0,
      reactive: 0,
      mitigation: 0,
      avoidance: 0
    });
    setShowModal(false);
    setGameCompleted(false);
  };

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Risk Management"
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
          <h1 className="text-3xl font-bold text-cyber-secondary cyber-text-glow">
            RISK ADVENTURE MAP
          </h1>
          
          <Link to="/boss-battle" className="cyber-button text-sm py-2">
            EXIT GAME
          </Link>
        </div>
        
        <div className="cyber-container p-6 mb-8 border-cyber-secondary">
          <h2 className="text-xl font-bold text-cyber-terminal-yellow mb-4">
            RISK MANAGEMENT SIMULATOR
          </h2>
          <p className="text-gray-300 mb-4">
            Navigate through potential project risks and make decisions on how to handle them.
            Your choices will impact your risk management profile and score.
          </p>
          <div className="flex space-x-3">
            <div className="cyber-badge bg-cyber-secondary/20 text-cyber-secondary">
              {score} POINTS
            </div>
            <div className="cyber-badge bg-cyber-muted text-white">
              {currentScenarioIndex + 1}/{riskScenarios.length} SCENARIOS
            </div>
            <div className="cyber-badge bg-cyber-accent/20 text-cyber-accent">
              {getRiskProfile()}
            </div>
          </div>
        </div>
        
        {/* Current Risk Scenario */}
        {currentScenarioIndex < riskScenarios.length && (
          <RiskScenario 
            scenario={riskScenarios[currentScenarioIndex]}
            onOptionSelect={handleOptionSelect}
          />
        )}
        
        {/* Risk Management Tips */}
        <div className="cyber-container p-4 border-cyber-border mt-8 mb-6">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              RISK ADVISOR HINT
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            Remember that proactive risk management is generally more effective than 
            reactive approaches. Consider both the probability and impact of each risk.
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
            {gameCompleted || modalContent.type === 'error' ? (
              <div className="flex space-x-4">
                <button 
                  onClick={restartGame}
                  className="cyber-button-primary flex-1"
                >
                  Try Again
                </button>
                <Link 
                  to="/boss-battle"
                  className="cyber-button flex-1 text-center"
                >
                  Exit Game
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAdventureGame;
