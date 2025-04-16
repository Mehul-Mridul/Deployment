
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { usePlayer } from '@/context/PlayerContext';
import GameHUD from '@/components/game/GameHUD';
import { Badge } from 'lucide-react';

interface ReleaseDecision {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    outcome: string;
    impact: {
      quality: number;
      time: number;
      budget: number;
      customerSatisfaction: number;
    }
  }[];
}

interface ReleasePhase {
  id: string;
  title: string;
  description: string;
  decisions: ReleaseDecision[];
}

const ProductReleaseGame = () => {
  const { player, updatePlayerXP, unlockBadge } = usePlayer();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentDecision, setCurrentDecision] = useState(0);
  const [gameMetrics, setGameMetrics] = useState({
    quality: 70,
    time: 100,
    budget: 100,
    customerSatisfaction: 50
  });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Simulated countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      // Time's up
      setGameOver(true);
      setFeedbackMessage("Time's up! Your product release was incomplete.");
    }
  }, [timeLeft, gameCompleted, gameOver]);

  // Check for game over conditions
  useEffect(() => {
    if (!gameOver) {
      if (gameMetrics.quality <= 0) {
        setGameOver(true);
        setFeedbackMessage("Product quality is too low - release failed!");
      } else if (gameMetrics.budget <= 0) {
        setGameOver(true);
        setFeedbackMessage("You've exhausted your budget!");
      } else if (gameMetrics.customerSatisfaction <= 0) {
        setGameOver(true);
        setFeedbackMessage("Customer satisfaction has dropped too low!");
      }
    }
  }, [gameMetrics, gameOver]);

  const handleDecision = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowOutcome(true);
    
    const decision = releasePhases[currentPhase].decisions[currentDecision];
    const option = decision.options[optionIndex];
    
    // Update metrics
    setGameMetrics(prev => ({
      quality: Math.min(100, Math.max(0, prev.quality + option.impact.quality)),
      time: Math.min(100, Math.max(0, prev.time + option.impact.time)),
      budget: Math.min(100, Math.max(0, prev.budget + option.impact.budget)),
      customerSatisfaction: Math.min(100, Math.max(0, prev.customerSatisfaction + option.impact.customerSatisfaction))
    }));
    
    // Update score
    const impactScore = option.impact.quality + option.impact.customerSatisfaction;
    const newScore = score + (impactScore > 0 ? impactScore : 0);
    setScore(newScore);
  };

  const nextDecision = () => {
    setShowOutcome(false);
    setSelectedOption(null);
    
    // Move to next decision or phase
    if (currentDecision < releasePhases[currentPhase].decisions.length - 1) {
      setCurrentDecision(currentDecision + 1);
    } else if (currentPhase < releasePhases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setCurrentDecision(0);
      // Phase completion bonus
      const phaseBonus = 20;
      setScore(prev => prev + phaseBonus);
      toast.success(`Phase completed! +${phaseBonus} points`);
    } else {
      // Game completed
      completeGame();
    }
  };

  const completeGame = () => {
    setGameCompleted(true);
    
    // Calculate final score with bonuses
    const timeBonus = Math.floor(timeLeft / 10);
    const qualityBonus = Math.floor(gameMetrics.quality / 2);
    const finalScore = score + timeBonus + qualityBonus;
    
    setScore(finalScore);
    
    // Award XP
    updatePlayerXP(finalScore);
    
    // Unlock badge if score is high enough
    if (finalScore >= 200) {
      unlockBadge('product-guru');
      toast.success('Badge unlocked: Product Guru!');
    }
    
    setFeedbackMessage(`Congratulations! You've successfully released and maintained your product with a score of ${finalScore}!`);
  };

  const restartGame = () => {
    setTimeLeft(600);
    setScore(0);
    setLives(3);
    setCurrentPhase(0);
    setCurrentDecision(0);
    setGameMetrics({
      quality: 70,
      time: 100,
      budget: 100,
      customerSatisfaction: 50
    });
    setGameCompleted(false);
    setShowOutcome(false);
    setSelectedOption(null);
    setGameOver(false);
    setFeedbackMessage('');
  };

  // Product release phases and decisions
  const releasePhases: ReleasePhase[] = [
    {
      id: 'planning',
      title: 'Planning Phase',
      description: 'Prepare for the product release by making critical planning decisions.',
      decisions: [
        {
          id: 'release-schedule',
          title: 'Release Schedule',
          description: 'How should you schedule your product release?',
          options: [
            {
              text: 'Aggressive Timeline (Ship faster with less testing)',
              outcome: 'You shipped quickly but encountered more issues in production.',
              impact: { quality: -20, time: 20, budget: 10, customerSatisfaction: -15 }
            },
            {
              text: 'Balanced Approach (Moderate timeline with standard testing)',
              outcome: 'You maintained a good balance between speed and quality.',
              impact: { quality: 0, time: 0, budget: 0, customerSatisfaction: 5 }
            },
            {
              text: 'Quality-Focused (Extended timeline with comprehensive testing)',
              outcome: 'The product launched with high quality but took longer than competitors.',
              impact: { quality: 20, time: -20, budget: -10, customerSatisfaction: 10 }
            }
          ]
        },
        {
          id: 'testing-strategy',
          title: 'Testing Strategy',
          description: 'Which testing approach will you prioritize before release?',
          options: [
            {
              text: 'Developer Testing Only (Faster but less thorough)',
              outcome: 'Several user-facing bugs made it to production.',
              impact: { quality: -15, time: 15, budget: 10, customerSatisfaction: -20 }
            },
            {
              text: 'Automated Test Suite (Good balance of coverage and speed)',
              outcome: 'Automation caught most issues while maintaining reasonable timeline.',
              impact: { quality: 10, time: -5, budget: -10, customerSatisfaction: 10 }
            },
            {
              text: 'Full QA Team Testing (Thorough but expensive and time-consuming)',
              outcome: 'Product released with minimal bugs but significantly delayed.',
              impact: { quality: 25, time: -25, budget: -20, customerSatisfaction: 15 }
            }
          ]
        },
        {
          id: 'feature-scope',
          title: 'Feature Scope',
          description: 'What feature scope will you commit to for this release?',
          options: [
            {
              text: 'Minimum Viable Product (Core features only)',
              outcome: 'Product shipped with minimal features but on time and stable.',
              impact: { quality: 10, time: 15, budget: 15, customerSatisfaction: -10 }
            },
            {
              text: 'Balanced Feature Set (Core + some enhancements)',
              outcome: 'Product offers good value while maintaining reasonable quality.',
              impact: { quality: 0, time: 0, budget: -5, customerSatisfaction: 10 }
            },
            {
              text: 'Full Feature Set (Everything promised plus extras)',
              outcome: 'Customers loved the features but development was strained.',
              impact: { quality: -15, time: -20, budget: -25, customerSatisfaction: 25 }
            }
          ]
        }
      ]
    },
    {
      id: 'release',
      title: 'Release Phase',
      description: 'Your product is ready for release. Make final critical decisions.',
      decisions: [
        {
          id: 'deployment-strategy',
          title: 'Deployment Strategy',
          description: 'How will you deploy your product?',
          options: [
            {
              text: 'Big Bang Deployment (All at once)',
              outcome: 'Issues affected all users simultaneously but were resolved quickly.',
              impact: { quality: -10, time: 10, budget: 0, customerSatisfaction: -15 }
            },
            {
              text: 'Phased Rollout (Gradual release to user segments)',
              outcome: 'Early issues were contained and fixed before wider release.',
              impact: { quality: 5, time: -5, budget: -5, customerSatisfaction: 10 }
            },
            {
              text: 'Canary Deployment (Test with small % of users first)',
              outcome: 'Early feedback helped improve the product for most users.',
              impact: { quality: 15, time: -15, budget: -10, customerSatisfaction: 5 }
            }
          ]
        },
        {
          id: 'support-plan',
          title: 'Support Plan',
          description: 'What level of post-release support will you provide?',
          options: [
            {
              text: 'Basic Support (Email only, standard hours)',
              outcome: 'Users were frustrated by slow response times.',
              impact: { quality: 0, time: 10, budget: 15, customerSatisfaction: -20 }
            },
            {
              text: 'Standard Support (Email + chat, extended hours)',
              outcome: 'Most issues were resolved in a timely manner.',
              impact: { quality: 5, time: 0, budget: -10, customerSatisfaction: 10 }
            },
            {
              text: 'Premium Support (24/7 all channels + dedicated team)',
              outcome: 'Users were extremely satisfied with the support experience.',
              impact: { quality: 10, time: -5, budget: -25, customerSatisfaction: 25 }
            }
          ]
        },
        {
          id: 'monitoring',
          title: 'Monitoring Strategy',
          description: 'How will you monitor your product after release?',
          options: [
            {
              text: 'Basic Monitoring (Server uptime only)',
              outcome: 'Several issues went undetected until reported by users.',
              impact: { quality: -15, time: 5, budget: 10, customerSatisfaction: -20 }
            },
            {
              text: 'Standard Monitoring (Performance + error tracking)',
              outcome: 'Most issues were detected and fixed promptly.',
              impact: { quality: 10, time: -5, budget: -10, customerSatisfaction: 15 }
            },
            {
              text: 'Advanced Monitoring (Full observability + user analytics)',
              outcome: 'Issues were detected and resolved before most users noticed.',
              impact: { quality: 20, time: -10, budget: -20, customerSatisfaction: 20 }
            }
          ]
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Maintenance Phase',
      description: 'Your product is live. Now make decisions about maintaining and improving it.',
      decisions: [
        {
          id: 'update-frequency',
          title: 'Update Frequency',
          description: 'How often will you update your product?',
          options: [
            {
              text: 'Infrequent Major Updates (Every few months)',
              outcome: 'Users appreciated stability but wanted faster improvements.',
              impact: { quality: 5, time: 10, budget: 10, customerSatisfaction: -5 }
            },
            {
              text: 'Regular Scheduled Updates (Monthly)',
              outcome: 'Good balance of stability and new features kept users engaged.',
              impact: { quality: 10, time: 0, budget: -5, customerSatisfaction: 15 }
            },
            {
              text: 'Continuous Deployment (Multiple times per week)',
              outcome: 'Rapid improvements delighted users but created some instability.',
              impact: { quality: -5, time: -15, budget: -15, customerSatisfaction: 10 }
            }
          ]
        },
        {
          id: 'bug-prioritization',
          title: 'Bug Prioritization',
          description: 'How will you prioritize bug fixes?',
          options: [
            {
              text: 'Fix only critical bugs',
              outcome: 'Major issues were resolved but minor frustrations accumulated.',
              impact: { quality: -10, time: 15, budget: 15, customerSatisfaction: -15 }
            },
            {
              text: 'Balance bug fixes with new features',
              outcome: 'Users appreciated both stability improvements and new capabilities.',
              impact: { quality: 10, time: -5, budget: -10, customerSatisfaction: 10 }
            },
            {
              text: 'Fix all reported bugs before new features',
              outcome: 'Product became very stable but fell behind competitors in features.',
              impact: { quality: 25, time: -20, budget: -15, customerSatisfaction: 5 }
            }
          ]
        },
        {
          id: 'user-feedback',
          title: 'User Feedback Integration',
          description: 'How will you handle user feedback for future improvements?',
          options: [
            {
              text: 'Minimal feedback collection',
              outcome: 'Product evolved based mainly on internal vision, missing some user needs.',
              impact: { quality: -5, time: 10, budget: 10, customerSatisfaction: -20 }
            },
            {
              text: 'Standard feedback channels with periodic review',
              outcome: 'Most important user needs were identified and addressed.',
              impact: { quality: 10, time: -5, budget: -10, customerSatisfaction: 15 }
            },
            {
              text: 'Comprehensive user research and co-creation',
              outcome: 'Users felt deeply involved in product evolution and very satisfied.',
              impact: { quality: 15, time: -15, budget: -25, customerSatisfaction: 30 }
            }
          ]
        }
      ]
    }
  ];

  const currentPhaseData = releasePhases[currentPhase];
  const currentDecisionData = currentPhaseData?.decisions[currentDecision];

  // Calculate progress percentage
  const totalDecisions = releasePhases.reduce((sum, phase) => sum + phase.decisions.length, 0);
  const completedDecisions = releasePhases.slice(0, currentPhase).reduce((sum, phase) => sum + phase.decisions.length, 0) + currentDecision;
  const progressPercentage = (completedDecisions / totalDecisions) * 100;

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="Product Release & Maintenance"
        time={timeLeft}
        score={score}
        lives={lives}
        level={player.level}
        attempts={0}
        xp={player.xp}
        maxXp={player.maxXp}
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyber-primary cyber-text-glow">
            PRODUCT RELEASE SIMULATOR
          </h1>
          
          <Link to="/boss-battle" className="cyber-button text-sm py-2">
            EXIT SIMULATION
          </Link>
        </div>

        {/* Phase and progress indicator */}
        <div className="cyber-container p-4 mb-6 border-cyber-accent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Badge className="text-cyber-terminal-yellow" />
              <h2 className="text-lg font-bold text-cyber-terminal-yellow">{currentPhaseData?.title}</h2>
            </div>
            <div className="text-sm text-cyber-terminal-blue">
              Decision {currentDecision + 1}/{currentPhaseData?.decisions.length} | Phase {currentPhase + 1}/{releasePhases.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-800 h-2 rounded-full">
            <div 
              className="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Game metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="cyber-container p-3 border-cyber-primary">
            <div className="text-xs text-cyber-terminal-blue mb-1">QUALITY</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-800 h-2 rounded-full mr-2">
                <div 
                  className={`h-full rounded-full ${gameMetrics.quality > 60 ? 'bg-green-500' : gameMetrics.quality > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${gameMetrics.quality}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono">{gameMetrics.quality}%</span>
            </div>
          </div>

          <div className="cyber-container p-3 border-cyber-primary">
            <div className="text-xs text-cyber-terminal-blue mb-1">TIME</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-800 h-2 rounded-full mr-2">
                <div 
                  className={`h-full rounded-full ${gameMetrics.time > 60 ? 'bg-green-500' : gameMetrics.time > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${gameMetrics.time}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono">{gameMetrics.time}%</span>
            </div>
          </div>

          <div className="cyber-container p-3 border-cyber-primary">
            <div className="text-xs text-cyber-terminal-blue mb-1">BUDGET</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-800 h-2 rounded-full mr-2">
                <div 
                  className={`h-full rounded-full ${gameMetrics.budget > 60 ? 'bg-green-500' : gameMetrics.budget > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${gameMetrics.budget}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono">{gameMetrics.budget}%</span>
            </div>
          </div>

          <div className="cyber-container p-3 border-cyber-primary">
            <div className="text-xs text-cyber-terminal-blue mb-1">CUSTOMER SATISFACTION</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-800 h-2 rounded-full mr-2">
                <div 
                  className={`h-full rounded-full ${gameMetrics.customerSatisfaction > 60 ? 'bg-green-500' : gameMetrics.customerSatisfaction > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${gameMetrics.customerSatisfaction}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono">{gameMetrics.customerSatisfaction}%</span>
            </div>
          </div>
        </div>

        {/* Main game content */}
        {!gameCompleted && !gameOver ? (
          <div className="cyber-container p-6 mb-6 border-cyber-secondary">
            {!showOutcome ? (
              <div>
                <h3 className="text-xl font-bold text-cyber-terminal-green mb-4">
                  {currentDecisionData?.title}
                </h3>
                <p className="text-gray-300 mb-6">{currentDecisionData?.description}</p>
                
                <div className="space-y-4">
                  {currentDecisionData?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleDecision(index)}
                      className="cyber-container w-full p-4 text-left hover:border-cyber-primary transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-cyber-terminal-blue font-bold mb-2">{option.text}</div>
                          <div className="text-xs text-gray-400">Click to select this option</div>
                        </div>
                        <div className="cyber-badge bg-cyber-muted text-xs">OPTION {index + 1}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-cyber-terminal-purple mb-4">
                  Decision Outcome
                </h3>
                
                <div className="cyber-container p-4 mb-6 border-cyber-muted">
                  <div className="text-sm text-cyber-terminal-blue mb-2">YOUR CHOICE:</div>
                  <div className="text-white mb-4">{currentDecisionData?.options[selectedOption!].text}</div>
                  
                  <div className="text-sm text-cyber-terminal-blue mb-2">OUTCOME:</div>
                  <div className="text-white mb-4">{currentDecisionData?.options[selectedOption!].outcome}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-cyber-terminal-blue mb-1">IMPACT ON METRICS:</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Quality:</span>
                          <span className={`text-xs ${currentDecisionData?.options[selectedOption!].impact.quality > 0 ? 'text-green-400' : currentDecisionData?.options[selectedOption!].impact.quality < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {currentDecisionData?.options[selectedOption!].impact.quality > 0 ? '+' : ''}{currentDecisionData?.options[selectedOption!].impact.quality}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Time:</span>
                          <span className={`text-xs ${currentDecisionData?.options[selectedOption!].impact.time > 0 ? 'text-green-400' : currentDecisionData?.options[selectedOption!].impact.time < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {currentDecisionData?.options[selectedOption!].impact.time > 0 ? '+' : ''}{currentDecisionData?.options[selectedOption!].impact.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs invisible mb-1">IMPACT ON METRICS:</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Budget:</span>
                          <span className={`text-xs ${currentDecisionData?.options[selectedOption!].impact.budget > 0 ? 'text-green-400' : currentDecisionData?.options[selectedOption!].impact.budget < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {currentDecisionData?.options[selectedOption!].impact.budget > 0 ? '+' : ''}{currentDecisionData?.options[selectedOption!].impact.budget}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Satisfaction:</span>
                          <span className={`text-xs ${currentDecisionData?.options[selectedOption!].impact.customerSatisfaction > 0 ? 'text-green-400' : currentDecisionData?.options[selectedOption!].impact.customerSatisfaction < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {currentDecisionData?.options[selectedOption!].impact.customerSatisfaction > 0 ? '+' : ''}{currentDecisionData?.options[selectedOption!].impact.customerSatisfaction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={nextDecision}
                  className="cyber-button-primary"
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="cyber-container p-6 mb-6 border-cyber-accent">
            <h3 className={`text-xl font-bold mb-4 ${gameCompleted ? 'text-cyber-terminal-green' : 'text-cyber-terminal-red'}`}>
              {gameCompleted ? 'SIMULATION COMPLETE' : 'SIMULATION FAILED'}
            </h3>
            <p className="text-gray-300 mb-6">{feedbackMessage}</p>
            
            <div className="mb-6">
              <h4 className="text-cyber-terminal-yellow mb-2 text-sm">FINAL METRICS:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="cyber-container p-3">
                  <div className="text-xs text-cyber-terminal-blue mb-1">QUALITY</div>
                  <div className="text-2xl font-mono">{gameMetrics.quality}%</div>
                </div>
                <div className="cyber-container p-3">
                  <div className="text-xs text-cyber-terminal-blue mb-1">CUSTOMER SATISFACTION</div>
                  <div className="text-2xl font-mono">{gameMetrics.customerSatisfaction}%</div>
                </div>
                <div className="cyber-container p-3">
                  <div className="text-xs text-cyber-terminal-blue mb-1">REMAINING BUDGET</div>
                  <div className="text-2xl font-mono">{gameMetrics.budget}%</div>
                </div>
                <div className="cyber-container p-3">
                  <div className="text-xs text-cyber-terminal-blue mb-1">REMAINING TIME</div>
                  <div className="text-2xl font-mono">{gameMetrics.time}%</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={restartGame}
                className="cyber-button-primary flex-1"
              >
                TRY AGAIN
              </button>
              <Link 
                to="/boss-battle"
                className="cyber-button flex-1 text-center"
              >
                EXIT SIMULATION
              </Link>
            </div>
          </div>
        )}

        {/* Hint panel */}
        <div className="cyber-container p-4 border-cyber-border">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              PRODUCT MANAGEMENT TIP
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            {currentPhase === 0 ? (
              "Planning is crucial for successful product releases. Consider quality, timeline, and scope tradeoffs carefully."
            ) : currentPhase === 1 ? (
              "Your deployment strategy can significantly impact user experience. Gradual releases often mitigate risks better than all-at-once approaches."
            ) : (
              "Maintenance is not an afterthought - it's a critical part of the product lifecycle that determines long-term success."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductReleaseGame;
