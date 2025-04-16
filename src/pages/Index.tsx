
import React, { useState } from 'react';
import StartScreen from '@/components/game/StartScreen';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

const Index = () => {
  const { player, resetProgress } = usePlayer();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  const handleResetProgress = () => {
    if (!showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }
    
    resetProgress();
    toast.success('Agent data reset. Starting fresh!');
    setShowConfirmReset(false);
  };
  
  return (
    <div className="relative">
      <StartScreen 
        title="QUEST FOR SEPM GLORY"
        subtitle={`AGENT ${player.name.toUpperCase()} - LEVEL ${player.level}`}
      />
      
      {/* Admin panel in corner for resetting progress */}
      <div className="absolute bottom-4 right-4">
        <button 
          onClick={handleResetProgress}
          className={`text-xs ${showConfirmReset ? 'cyber-button-accent' : 'text-gray-600 hover:text-gray-400'} py-1 px-2`}
        >
          {showConfirmReset ? 'CONFIRM RESET?' : 'RESET PROGRESS'}
        </button>
      </div>
    </div>
  );
};

export default Index;
