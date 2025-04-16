
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { usePlayer } from '@/context/PlayerContext';
import GameHUD from '@/components/game/GameHUD';

interface RiskItem {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  category: 'technical' | 'schedule' | 'operational' | 'external';
  mitigated: boolean;
}

interface MitigationStrategy {
  id: string;
  name: string;
  description: string;
  effectiveness: number;
  cost: number;
  applicableRiskIds: string[];
}

interface MonitoringStrategy {
  id: string;
  name: string;
  description: string;
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly';
  applicableRiskIds: string[];
}

interface ManagementStrategy {
  id: string;
  name: string;
  description: string;
  applicableRiskIds: string[];
}

const RMMMPlanGame: React.FC = () => {
  const { player, updatePlayerXP, unlockBadge } = usePlayer();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gamePhase, setGamePhase] = useState<'identify' | 'mitigate' | 'monitor' | 'manage' | 'complete'>('identify');
  const [selectedRisks, setSelectedRisks] = useState<RiskItem[]>([]);
  const [selectedMitigations, setSelectedMitigations] = useState<{[riskId: string]: string}>({});
  const [selectedMonitoring, setSelectedMonitoring] = useState<{[riskId: string]: string}>({});
  const [selectedManagement, setSelectedManagement] = useState<{[riskId: string]: string}>({});
  const [planQuality, setPlanQuality] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentRiskIndex, setCurrentRiskIndex] = useState(0);

  // Simulated countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      // Time's up
      toast.error("Time's up! RMMM plan incomplete.");
      setGamePhase('complete');
      calculateFinalScore();
    }
  }, [timeLeft, gameCompleted]);

  // Risk pool (would typically be larger in a real game)
  const availableRisks: RiskItem[] = [
    {
      id: 'risk1',
      name: 'Requirements Volatility',
      description: 'Frequent changes to requirements causing scope creep and delays.',
      probability: 0.7,
      impact: 0.8,
      category: 'technical',
      mitigated: false
    },
    {
      id: 'risk2',
      name: 'Staff Turnover',
      description: 'Key team members leaving the project unexpectedly.',
      probability: 0.5,
      impact: 0.9,
      category: 'operational',
      mitigated: false
    },
    {
      id: 'risk3',
      name: 'Technical Complexity',
      description: 'Solution requires untested or complex technical approaches.',
      probability: 0.6,
      impact: 0.7,
      category: 'technical',
      mitigated: false
    },
    {
      id: 'risk4',
      name: 'Dependency Delays',
      description: 'External dependencies not delivered on time.',
      probability: 0.8,
      impact: 0.6,
      category: 'schedule',
      mitigated: false
    },
    {
      id: 'risk5',
      name: 'Budget Constraints',
      description: 'Project funding reduced or inadequate.',
      probability: 0.4,
      impact: 0.8,
      category: 'operational',
      mitigated: false
    },
    {
      id: 'risk6',
      name: 'Regulatory Changes',
      description: 'Changes in regulations or compliance requirements.',
      probability: 0.3,
      impact: 0.9,
      category: 'external',
      mitigated: false
    },
    {
      id: 'risk7',
      name: 'Technology Obsolescence',
      description: 'Technology becoming outdated during project lifecycle.',
      probability: 0.4,
      impact: 0.5,
      category: 'technical',
      mitigated: false
    },
    {
      id: 'risk8',
      name: 'Resource Unavailability',
      description: 'Required resources not available when needed.',
      probability: 0.6,
      impact: 0.7,
      category: 'operational',
      mitigated: false
    }
  ];

  // Mitigation strategies
  const mitigationStrategies: MitigationStrategy[] = [
    {
      id: 'mit1',
      name: 'Change Control Process',
      description: 'Implement a formal change control process with stakeholder approval.',
      effectiveness: 0.8,
      cost: 0.4,
      applicableRiskIds: ['risk1']
    },
    {
      id: 'mit2',
      name: 'Knowledge Transfer',
      description: 'Regular documentation and knowledge sharing sessions.',
      effectiveness: 0.7,
      cost: 0.3,
      applicableRiskIds: ['risk2', 'risk8']
    },
    {
      id: 'mit3',
      name: 'Technical Prototyping',
      description: 'Build prototypes to test complex technical solutions early.',
      effectiveness: 0.9,
      cost: 0.6,
      applicableRiskIds: ['risk3', 'risk7']
    },
    {
      id: 'mit4',
      name: 'Buffer Time',
      description: 'Add buffer time to schedule for external dependencies.',
      effectiveness: 0.6,
      cost: 0.2,
      applicableRiskIds: ['risk4']
    },
    {
      id: 'mit5',
      name: 'Phased Implementation',
      description: 'Break project into phases with separate budgets.',
      effectiveness: 0.7,
      cost: 0.3,
      applicableRiskIds: ['risk5']
    },
    {
      id: 'mit6',
      name: 'Compliance Monitoring',
      description: 'Regular monitoring of regulatory changes and updates.',
      effectiveness: 0.8,
      cost: 0.5,
      applicableRiskIds: ['risk6']
    },
    {
      id: 'mit7',
      name: 'Technology Assessment',
      description: 'Regular assessment of technology currency and alternatives.',
      effectiveness: 0.7,
      cost: 0.4,
      applicableRiskIds: ['risk7']
    },
    {
      id: 'mit8',
      name: 'Cross-training',
      description: 'Train team members on multiple roles to provide backup.',
      effectiveness: 0.8,
      cost: 0.5,
      applicableRiskIds: ['risk2', 'risk8']
    }
  ];

  // Monitoring strategies
  const monitoringStrategies: MonitoringStrategy[] = [
    {
      id: 'mon1',
      name: 'Requirements Traceability Matrix',
      description: 'Track requirements changes through a traceability matrix.',
      frequency: 'weekly',
      applicableRiskIds: ['risk1']
    },
    {
      id: 'mon2',
      name: 'Team Satisfaction Surveys',
      description: 'Regular surveys to gauge team satisfaction and retention risk.',
      frequency: 'monthly',
      applicableRiskIds: ['risk2']
    },
    {
      id: 'mon3',
      name: 'Technical Debt Tracking',
      description: 'Monitor technical debt and complexity indicators.',
      frequency: 'weekly',
      applicableRiskIds: ['risk3', 'risk7']
    },
    {
      id: 'mon4',
      name: 'Dependency Status Updates',
      description: 'Regular updates from external dependency owners.',
      frequency: 'weekly',
      applicableRiskIds: ['risk4']
    },
    {
      id: 'mon5',
      name: 'Budget Burn Rate Analysis',
      description: 'Track project spending against budget allocations.',
      frequency: 'weekly',
      applicableRiskIds: ['risk5']
    },
    {
      id: 'mon6',
      name: 'Regulatory Update Notifications',
      description: 'Subscribe to regulatory update services or newsletters.',
      frequency: 'monthly',
      applicableRiskIds: ['risk6']
    },
    {
      id: 'mon7',
      name: 'Technology Radar',
      description: 'Maintain a technology radar to track emerging technologies.',
      frequency: 'monthly',
      applicableRiskIds: ['risk7']
    },
    {
      id: 'mon8',
      name: 'Resource Utilization Dashboard',
      description: 'Track resource allocation and availability.',
      frequency: 'daily',
      applicableRiskIds: ['risk8']
    }
  ];

  // Management strategies
  const managementStrategies: ManagementStrategy[] = [
    {
      id: 'man1',
      name: 'Stakeholder Review Meetings',
      description: 'Regular meetings with stakeholders to review and approve changes.',
      applicableRiskIds: ['risk1']
    },
    {
      id: 'man2',
      name: 'Team Building Activities',
      description: 'Regular team building and recognition to improve retention.',
      applicableRiskIds: ['risk2']
    },
    {
      id: 'man3',
      name: 'Architecture Review Board',
      description: 'Expert panel to review and approve technical approaches.',
      applicableRiskIds: ['risk3', 'risk7']
    },
    {
      id: 'man4',
      name: 'Vendor Management Process',
      description: 'Formal vendor management with penalties for delays.',
      applicableRiskIds: ['risk4']
    },
    {
      id: 'man5',
      name: 'Budget Contingency Fund',
      description: 'Set aside contingency funds for unexpected expenses.',
      applicableRiskIds: ['risk5']
    },
    {
      id: 'man6',
      name: 'Legal/Compliance Consultant',
      description: 'Engage legal experts to advise on regulatory changes.',
      applicableRiskIds: ['risk6']
    },
    {
      id: 'man7',
      name: 'Technology Roadmap',
      description: 'Maintain a technology roadmap with upgrade plans.',
      applicableRiskIds: ['risk7']
    },
    {
      id: 'man8',
      name: 'Resource Backup Plan',
      description: 'Identify backup resources or contractors for critical roles.',
      applicableRiskIds: ['risk8']
    }
  ];

  const selectRisk = (risk: RiskItem) => {
    if (selectedRisks.some(r => r.id === risk.id)) {
      setSelectedRisks(selectedRisks.filter(r => r.id !== risk.id));
    } else {
      setSelectedRisks([...selectedRisks, risk]);
    }
  };

  const assignMitigation = (riskId: string, mitigationId: string) => {
    setSelectedMitigations({
      ...selectedMitigations,
      [riskId]: mitigationId
    });
    
    // Update score
    const risk = availableRisks.find(r => r.id === riskId);
    const mitigation = mitigationStrategies.find(m => m.id === mitigationId);
    
    if (risk && mitigation) {
      const scoreIncrease = Math.round(risk.probability * risk.impact * mitigation.effectiveness * 100);
      setScore(prevScore => prevScore + scoreIncrease);
      toast.success(`+${scoreIncrease} points for mitigation strategy!`);
    }
  };

  const assignMonitoring = (riskId: string, monitoringId: string) => {
    setSelectedMonitoring({
      ...selectedMonitoring,
      [riskId]: monitoringId
    });
    
    // Update score
    const risk = availableRisks.find(r => r.id === riskId);
    if (risk) {
      const scoreIncrease = Math.round((risk.probability + risk.impact) * 50);
      setScore(prevScore => prevScore + scoreIncrease);
      toast.success(`+${scoreIncrease} points for monitoring strategy!`);
    }
  };

  const assignManagement = (riskId: string, managementId: string) => {
    setSelectedManagement({
      ...selectedManagement,
      [riskId]: managementId
    });
    
    // Update score
    const risk = availableRisks.find(r => r.id === riskId);
    if (risk) {
      const scoreIncrease = Math.round((risk.probability + risk.impact) * 50);
      setScore(prevScore => prevScore + scoreIncrease);
      toast.success(`+${scoreIncrease} points for management strategy!`);
    }
  };

  const moveToNextPhase = () => {
    if (gamePhase === 'identify') {
      if (selectedRisks.length < 3) {
        toast.error('You need to identify at least 3 risks!');
        return;
      }
      setGamePhase('mitigate');
    } else if (gamePhase === 'mitigate') {
      const unmitigatedRisks = selectedRisks.filter(risk => !selectedMitigations[risk.id]);
      if (unmitigatedRisks.length > 0) {
        toast.error('All risks must have mitigation strategies!');
        return;
      }
      setGamePhase('monitor');
    } else if (gamePhase === 'monitor') {
      const unmonitoredRisks = selectedRisks.filter(risk => !selectedMonitoring[risk.id]);
      if (unmonitoredRisks.length > 0) {
        toast.error('All risks must have monitoring strategies!');
        return;
      }
      setGamePhase('manage');
    } else if (gamePhase === 'manage') {
      const unmanagedRisks = selectedRisks.filter(risk => !selectedManagement[risk.id]);
      if (unmanagedRisks.length > 0) {
        toast.error('All risks must have management strategies!');
        return;
      }
      setGamePhase('complete');
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    // Calculate plan quality based on risk coverage and strategy effectiveness
    let qualityScore = 0;
    
    for (const risk of selectedRisks) {
      let riskScore = risk.probability * risk.impact * 100;
      
      // Check if we have complete RMMM for this risk
      if (selectedMitigations[risk.id] && selectedMonitoring[risk.id] && selectedManagement[risk.id]) {
        // Find the effectiveness of the mitigation
        const mitigation = mitigationStrategies.find(m => m.id === selectedMitigations[risk.id]);
        if (mitigation) {
          riskScore *= mitigation.effectiveness;
        }
        
        // Bonus for complete coverage
        riskScore *= 1.2;
      }
      
      qualityScore += riskScore;
    }
    
    // Normalize to 0-100 scale
    const normalizedQuality = Math.min(100, Math.round(qualityScore / 10));
    setPlanQuality(normalizedQuality);
    
    // Calculate final score with time bonus
    const timeBonus = Math.round(timeLeft / 10);
    const finalScore = score + timeBonus + normalizedQuality;
    setScore(finalScore);
    
    // Award XP
    updatePlayerXP(finalScore);
    
    // Unlock badge if score is high enough
    if (finalScore >= 200) {
      unlockBadge('plan-master');
      toast.success('Badge unlocked: Plan Master!');
    }
    
    setGameCompleted(true);
  };

  const nextRisk = () => {
    if (currentRiskIndex < selectedRisks.length - 1) {
      setCurrentRiskIndex(currentRiskIndex + 1);
    }
  };

  const prevRisk = () => {
    if (currentRiskIndex > 0) {
      setCurrentRiskIndex(currentRiskIndex - 1);
    }
  };

  const restartGame = () => {
    setTimeLeft(600);
    setScore(0);
    setLives(3);
    setGamePhase('identify');
    setSelectedRisks([]);
    setSelectedMitigations({});
    setSelectedMonitoring({});
    setSelectedManagement({});
    setPlanQuality(0);
    setGameCompleted(false);
    setCurrentRiskIndex(0);
  };

  return (
    <div className="min-h-screen bg-cyber-background pt-16">
      {/* Game HUD */}
      <GameHUD 
        topic="RMMM Planning"
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
            RMMM PLAN BUILDER
          </h1>
          
          <Link to="/boss-battle" className="cyber-button text-sm py-2">
            EXIT BUILDER
          </Link>
        </div>
        
        {/* Phase indicator */}
        <div className="cyber-container p-4 mb-6">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${gamePhase === 'identify' || gamePhase === 'complete' ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gamePhase === 'identify' ? 'bg-cyber-primary' : gamePhase === 'mitigate' || gamePhase === 'monitor' || gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}>
                1
              </div>
              <div className="text-xs mt-1">Identify</div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${gamePhase === 'mitigate' || gamePhase === 'monitor' || gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${gamePhase === 'mitigate' || gamePhase === 'complete' ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gamePhase === 'mitigate' ? 'bg-cyber-primary' : gamePhase === 'monitor' || gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}>
                2
              </div>
              <div className="text-xs mt-1">Mitigate</div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${gamePhase === 'monitor' || gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${gamePhase === 'monitor' || gamePhase === 'complete' ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gamePhase === 'monitor' ? 'bg-cyber-primary' : gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}>
                3
              </div>
              <div className="text-xs mt-1">Monitor</div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${gamePhase === 'manage' || gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${gamePhase === 'manage' || gamePhase === 'complete' ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gamePhase === 'manage' ? 'bg-cyber-primary' : gamePhase === 'complete' ? 'bg-green-500' : 'bg-cyber-muted'}`}>
                4
              </div>
              <div className="text-xs mt-1">Manage</div>
            </div>
          </div>
        </div>
        
        {gamePhase === 'identify' && (
          <div className="cyber-container p-6 mb-6 border-cyber-secondary">
            <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
              RISK IDENTIFICATION PHASE
            </h2>
            <p className="text-gray-300 mb-6">
              Identify potential risks that could affect your project. Select at least 3 risks to proceed.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {availableRisks.map(risk => (
                <div 
                  key={risk.id}
                  onClick={() => selectRisk(risk)}
                  className={`cyber-container p-4 cursor-pointer ${selectedRisks.some(r => r.id === risk.id) ? 'border-cyber-primary' : 'border-cyber-muted'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cyber-terminal-blue font-bold">{risk.name}</h3>
                    <div className={`cyber-badge ${
                      risk.category === 'technical' ? 'bg-blue-500/20 text-blue-400' :
                      risk.category === 'schedule' ? 'bg-yellow-500/20 text-yellow-400' :
                      risk.category === 'operational' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.category.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{risk.description}</p>
                  
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-cyber-terminal-blue">Probability:</span>
                      <span className="ml-1">{risk.probability * 100}%</span>
                    </div>
                    <div>
                      <span className="text-cyber-terminal-blue">Impact:</span>
                      <span className="ml-1">{risk.impact * 100}%</span>
                    </div>
                    <div>
                      <span className="text-cyber-terminal-blue">Risk Score:</span>
                      <span className="ml-1">{Math.round(risk.probability * risk.impact * 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="cyber-badge bg-cyber-muted text-white">
                {selectedRisks.length} RISKS SELECTED
              </div>
              
              <button 
                onClick={moveToNextPhase}
                className={`cyber-button-primary ${selectedRisks.length < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={selectedRisks.length < 3}
              >
                PROCEED TO MITIGATION
              </button>
            </div>
          </div>
        )}
        
        {gamePhase === 'mitigate' && (
          <div className="cyber-container p-6 mb-6 border-cyber-secondary">
            <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
              RISK MITIGATION PHASE
            </h2>
            <p className="text-gray-300 mb-6">
              Assign mitigation strategies to each identified risk.
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={prevRisk}
                className={`cyber-button text-sm ${currentRiskIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === 0}
              >
                PREVIOUS RISK
              </button>
              
              <div className="text-cyber-terminal-blue">
                Risk {currentRiskIndex + 1} of {selectedRisks.length}
              </div>
              
              <button 
                onClick={nextRisk}
                className={`cyber-button text-sm ${currentRiskIndex === selectedRisks.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === selectedRisks.length - 1}
              >
                NEXT RISK
              </button>
            </div>
            
            <div className="cyber-container p-4 mb-6 border-cyber-muted">
              <h3 className="text-cyber-terminal-blue font-bold mb-2">{selectedRisks[currentRiskIndex]?.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{selectedRisks[currentRiskIndex]?.description}</p>
              
              <div className="flex justify-between text-xs mb-2">
                <div>
                  <span className="text-cyber-terminal-blue">Probability:</span>
                  <span className="ml-1">{selectedRisks[currentRiskIndex]?.probability * 100}%</span>
                </div>
                <div>
                  <span className="text-cyber-terminal-blue">Impact:</span>
                  <span className="ml-1">{selectedRisks[currentRiskIndex]?.impact * 100}%</span>
                </div>
                <div>
                  <span className="text-cyber-terminal-blue">Risk Score:</span>
                  <span className="ml-1">{Math.round(selectedRisks[currentRiskIndex]?.probability * selectedRisks[currentRiskIndex]?.impact * 100)}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-cyber-terminal-yellow mb-4">
              SELECT MITIGATION STRATEGY
            </h3>
            
            <div className="space-y-4 mb-6">
              {mitigationStrategies
                .filter(m => m.applicableRiskIds.includes(selectedRisks[currentRiskIndex]?.id))
                .map(strategy => (
                  <div 
                    key={strategy.id}
                    onClick={() => assignMitigation(selectedRisks[currentRiskIndex].id, strategy.id)}
                    className={`cyber-container p-4 cursor-pointer ${selectedMitigations[selectedRisks[currentRiskIndex]?.id] === strategy.id ? 'border-cyber-primary' : 'border-cyber-muted'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyber-terminal-blue font-bold">{strategy.name}</h4>
                      <div className="cyber-badge bg-cyber-muted text-xs">
                        EFFECTIVENESS: {strategy.effectiveness * 100}%
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                    
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-cyber-terminal-blue">Cost:</span>
                        <span className="ml-1">{strategy.cost * 100}%</span>
                      </div>
                      <div>
                        <span className="text-cyber-terminal-blue">Value Score:</span>
                        <span className="ml-1">{Math.round((strategy.effectiveness / strategy.cost) * 10)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setGamePhase('identify')}
                className="cyber-button"
              >
                BACK TO IDENTIFICATION
              </button>
              
              <button 
                onClick={moveToNextPhase}
                className="cyber-button-primary"
              >
                PROCEED TO MONITORING
              </button>
            </div>
          </div>
        )}
        
        {gamePhase === 'monitor' && (
          <div className="cyber-container p-6 mb-6 border-cyber-secondary">
            <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
              RISK MONITORING PHASE
            </h2>
            <p className="text-gray-300 mb-6">
              Assign monitoring strategies to each identified risk.
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={prevRisk}
                className={`cyber-button text-sm ${currentRiskIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === 0}
              >
                PREVIOUS RISK
              </button>
              
              <div className="text-cyber-terminal-blue">
                Risk {currentRiskIndex + 1} of {selectedRisks.length}
              </div>
              
              <button 
                onClick={nextRisk}
                className={`cyber-button text-sm ${currentRiskIndex === selectedRisks.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === selectedRisks.length - 1}
              >
                NEXT RISK
              </button>
            </div>
            
            <div className="cyber-container p-4 mb-6 border-cyber-muted">
              <h3 className="text-cyber-terminal-blue font-bold mb-2">{selectedRisks[currentRiskIndex]?.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{selectedRisks[currentRiskIndex]?.description}</p>
              
              <div className="text-xs mt-2 text-cyber-terminal-green">
                <span className="font-bold">Selected Mitigation:</span>
                <span className="ml-1">{mitigationStrategies.find(m => m.id === selectedMitigations[selectedRisks[currentRiskIndex]?.id])?.name}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-cyber-terminal-yellow mb-4">
              SELECT MONITORING STRATEGY
            </h3>
            
            <div className="space-y-4 mb-6">
              {monitoringStrategies
                .filter(m => m.applicableRiskIds.includes(selectedRisks[currentRiskIndex]?.id))
                .map(strategy => (
                  <div 
                    key={strategy.id}
                    onClick={() => assignMonitoring(selectedRisks[currentRiskIndex].id, strategy.id)}
                    className={`cyber-container p-4 cursor-pointer ${selectedMonitoring[selectedRisks[currentRiskIndex]?.id] === strategy.id ? 'border-cyber-primary' : 'border-cyber-muted'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyber-terminal-blue font-bold">{strategy.name}</h4>
                      <div className={`cyber-badge ${
                        strategy.frequency === 'continuous' ? 'bg-green-500/20 text-green-400' :
                        strategy.frequency === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                        strategy.frequency === 'weekly' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {strategy.frequency.toUpperCase()}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm">{strategy.description}</p>
                  </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setGamePhase('mitigate')}
                className="cyber-button"
              >
                BACK TO MITIGATION
              </button>
              
              <button 
                onClick={moveToNextPhase}
                className="cyber-button-primary"
              >
                PROCEED TO MANAGEMENT
              </button>
            </div>
          </div>
        )}
        
        {gamePhase === 'manage' && (
          <div className="cyber-container p-6 mb-6 border-cyber-secondary">
            <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
              RISK MANAGEMENT PHASE
            </h2>
            <p className="text-gray-300 mb-6">
              Assign management strategies to each identified risk.
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={prevRisk}
                className={`cyber-button text-sm ${currentRiskIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === 0}
              >
                PREVIOUS RISK
              </button>
              
              <div className="text-cyber-terminal-blue">
                Risk {currentRiskIndex + 1} of {selectedRisks.length}
              </div>
              
              <button 
                onClick={nextRisk}
                className={`cyber-button text-sm ${currentRiskIndex === selectedRisks.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentRiskIndex === selectedRisks.length - 1}
              >
                NEXT RISK
              </button>
            </div>
            
            <div className="cyber-container p-4 mb-6 border-cyber-muted">
              <h3 className="text-cyber-terminal-blue font-bold mb-2">{selectedRisks[currentRiskIndex]?.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{selectedRisks[currentRiskIndex]?.description}</p>
              
              <div className="space-y-1 mt-2 text-xs">
                <div className="text-cyber-terminal-green">
                  <span className="font-bold">Selected Mitigation:</span>
                  <span className="ml-1">{mitigationStrategies.find(m => m.id === selectedMitigations[selectedRisks[currentRiskIndex]?.id])?.name}</span>
                </div>
                <div className="text-cyber-terminal-yellow">
                  <span className="font-bold">Selected Monitoring:</span>
                  <span className="ml-1">{monitoringStrategies.find(m => m.id === selectedMonitoring[selectedRisks[currentRiskIndex]?.id])?.name}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-cyber-terminal-yellow mb-4">
              SELECT MANAGEMENT STRATEGY
            </h3>
            
            <div className="space-y-4 mb-6">
              {managementStrategies
                .filter(m => m.applicableRiskIds.includes(selectedRisks[currentRiskIndex]?.id))
                .map(strategy => (
                  <div 
                    key={strategy.id}
                    onClick={() => assignManagement(selectedRisks[currentRiskIndex].id, strategy.id)}
                    className={`cyber-container p-4 cursor-pointer ${selectedManagement[selectedRisks[currentRiskIndex]?.id] === strategy.id ? 'border-cyber-primary' : 'border-cyber-muted'}`}
                  >
                    <h4 className="text-cyber-terminal-blue font-bold mb-2">{strategy.name}</h4>
                    <p className="text-gray-400 text-sm">{strategy.description}</p>
                  </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setGamePhase('monitor')}
                className="cyber-button"
              >
                BACK TO MONITORING
              </button>
              
              <button 
                onClick={moveToNextPhase}
                className="cyber-button-primary"
              >
                FINALIZE RMMM PLAN
              </button>
            </div>
          </div>
        )}
        
        {gamePhase === 'complete' && (
          <div className="cyber-container p-6 mb-6 border-cyber-accent">
            <h2 className="text-xl font-bold text-cyber-terminal-green mb-4">
              RMMM PLAN COMPLETE
            </h2>
            <p className="text-gray-300 mb-6">
              You've successfully created an RMMM (Risk Mitigation, Monitoring, and Management) Plan!
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-cyber-terminal-yellow mb-4">
                PLAN QUALITY ASSESSMENT
              </h3>
              
              <div className="flex items-center mb-4">
                <div className="w-full bg-gray-800 h-4 rounded-full mr-2">
                  <div 
                    className={`h-full rounded-full ${planQuality > 80 ? 'bg-green-500' : planQuality > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${planQuality}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-mono font-bold">{planQuality}%</span>
              </div>
              
              <div className="cyber-container p-4 border-cyber-muted">
                <h4 className="text-cyber-terminal-blue mb-2 font-bold">PLAN COVERAGE</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risks Identified:</span>
                    <span className="font-bold">{selectedRisks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Risks with Complete RMMM:</span>
                    <span className="font-bold">
                      {selectedRisks.filter(risk => 
                        selectedMitigations[risk.id] && selectedMonitoring[risk.id] && selectedManagement[risk.id]
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-bold">{score}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cyber-container p-4 mb-6 border-cyber-muted">
              <h3 className="text-lg font-bold text-cyber-terminal-green mb-4">
                PLAN SUMMARY
              </h3>
              
              <div className="space-y-4">
                {selectedRisks.map(risk => (
                  <div key={risk.id} className="cyber-container p-3 border-cyber-muted">
                    <h4 className="text-cyber-terminal-blue font-bold mb-1">{risk.name}</h4>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-cyber-terminal-green mb-1">MITIGATION</div>
                        <div className="text-gray-300">
                          {mitigationStrategies.find(m => m.id === selectedMitigations[risk.id])?.name || 'None'}
                        </div>
                      </div>
                      <div>
                        <div className="text-cyber-terminal-yellow mb-1">MONITORING</div>
                        <div className="text-gray-300">
                          {monitoringStrategies.find(m => m.id === selectedMonitoring[risk.id])?.name || 'None'}
                        </div>
                      </div>
                      <div>
                        <div className="text-cyber-terminal-blue mb-1">MANAGEMENT</div>
                        <div className="text-gray-300">
                          {managementStrategies.find(m => m.id === selectedManagement[risk.id])?.name || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={restartGame}
                className="cyber-button-primary flex-1"
              >
                CREATE NEW PLAN
              </button>
              <Link 
                to="/boss-battle"
                className="cyber-button flex-1 text-center"
              >
                EXIT BUILDER
              </Link>
            </div>
          </div>
        )}
        
        {/* Hint panel */}
        <div className="cyber-container p-4 border-cyber-border">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-cyber-terminal-blue mr-2 animate-pulse"></div>
            <h3 className="text-sm font-bold text-cyber-terminal-blue">
              RMMM TIP
            </h3>
          </div>
          <p className="text-gray-300 text-sm">
            {gamePhase === 'identify' ? (
              "Identifying the right risks is the foundation of a good RMMM plan. Focus on risks with high probability and impact."
            ) : gamePhase === 'mitigate' ? (
              "Effective mitigation strategies should reduce either the probability or impact of a risk, or both."
            ) : gamePhase === 'monitor' ? (
              "The best monitoring strategies allow for early detection of risk before it materializes into problems."
            ) : gamePhase === 'manage' ? (
              "Management strategies define what you'll do if a risk occurs despite mitigation efforts."
            ) : (
              "A complete RMMM plan addresses all three aspects: how to prevent risks, how to detect them, and how to handle them if they occur."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RMMMPlanGame;
