
import React from 'react';
import StartScreen from '@/components/game/StartScreen';
import { usePlayer } from '@/context/PlayerContext';

const Index = () => {
  const { player } = usePlayer();
  
  return (
    <StartScreen 
      title="QUEST FOR SEPM GLORY"
      subtitle={`AGENT ${player.name.toUpperCase()} - LEVEL ${player.level}`}
    />
  );
};

export default Index;
