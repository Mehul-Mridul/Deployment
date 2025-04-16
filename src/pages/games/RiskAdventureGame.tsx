
import React from 'react';
import GameSample from '@/components/game/GameSample';

const RiskAdventureGame = () => {
  return (
    <GameSample 
      gameId="risk-adventure"
      title="Risk Adventure Map"
      category="management"
      returnPath="/boss-battle"
    />
  );
};

export default RiskAdventureGame;
