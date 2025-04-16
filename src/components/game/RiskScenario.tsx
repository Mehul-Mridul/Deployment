
import React from 'react';

interface RiskOption {
  text: string;
  type: string;
  mitigationLevel: string;
  points: number;
  feedback: string;
}

interface RiskScenarioProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    impact: string;
    probability: string;
    options: RiskOption[];
  };
  onOptionSelect: (option: RiskOption) => void;
}

const RiskScenario: React.FC<RiskScenarioProps> = ({ scenario, onOptionSelect }) => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'confirmed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="cyber-container p-6 border-cyber-primary">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-cyber-terminal-yellow">
            {scenario.title}
          </h3>
          <div className="flex space-x-2">
            <div className="cyber-badge">
              Impact: <span className={getImpactColor(scenario.impact)}>{scenario.impact}</span>
            </div>
            <div className="cyber-badge">
              Probability: <span className={getProbabilityColor(scenario.probability)}>{scenario.probability}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6">
          {scenario.description}
        </p>
        
        <div className="cyber-container bg-cyber-muted/50 p-4 mb-6">
          <h4 className="text-md font-bold text-cyber-terminal-blue mb-2">
            RISK ANALYSIS
          </h4>
          <p className="text-sm text-gray-300">
            This risk requires careful consideration. High impact risks can significantly affect the project's
            success, while high probability risks are likely to occur if not addressed.
          </p>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold text-cyber-terminal-green mb-4">
          AVAILABLE RESPONSES
        </h4>
        <div className="space-y-4">
          {scenario.options.map((option, index) => (
            <button
              key={`option-${index}`}
              className="cyber-container w-full text-left p-4 hover:border-cyber-terminal-blue transition-colors"
              onClick={() => onOptionSelect(option)}
            >
              <div className="flex items-center">
                <div className="cyber-badge bg-cyber-muted text-xs mr-3">
                  OPTION {index + 1}
                </div>
                <span className="text-white">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskScenario;
