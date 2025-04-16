
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, GameProgress, Badge } from '@/types/game';
import { badges, initialPlayerState } from '@/data/gameData';
import { useToast } from '@/hooks/use-toast';

interface PlayerContextType {
  player: Player;
  updatePlayerXP: (amount: number) => void;
  completeGame: (gameId: string, score: number, timeSpent: number) => void;
  unlockBadge: (badgeId: string) => void;
  resetProgress: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toast } = useToast();
  
  // Try to load player data from localStorage
  const [player, setPlayer] = useState<Player>(() => {
    const savedPlayer = localStorage.getItem('playerData');
    return savedPlayer ? JSON.parse(savedPlayer) : initialPlayerState;
  });

  // Save player data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerData', JSON.stringify(player));
  }, [player]);

  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 100) + 1;
  };

  // Update player XP and possibly level up
  const updatePlayerXP = (amount: number) => {
    const newXp = player.xp + amount;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > player.level;
    
    setPlayer({
      ...player,
      xp: newXp,
      level: newLevel,
      maxXp: newLevel * 100
    });
    
    if (leveledUp) {
      // Show level up notification
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}!`,
        variant: "success"
      });
    }
  };

  // Mark a game as completed
  const completeGame = (gameId: string, score: number, timeSpent: number) => {
    if (player.completedGames.includes(gameId)) {
      // Game already completed, update progress
      toast({
        title: "Game Replayed",
        description: "You've improved your score!",
        variant: "default"
      });
      
      setPlayer({
        ...player,
        completedGames: [...player.completedGames]
      });
    } else {
      // New game completion
      toast({
        title: "Mission Complete!",
        description: "New mission completed! +25 XP awarded.",
        variant: "success"
      });
      
      setPlayer({
        ...player,
        completedGames: [...player.completedGames, gameId]
      });
      
      // Award XP for completion
      updatePlayerXP(25);
    }
  };

  // Unlock a badge
  const unlockBadge = (badgeId: string) => {
    const badgeAlreadyUnlocked = player.badges.some(
      badge => badge.id === badgeId && badge.unlocked
    );
    
    if (!badgeAlreadyUnlocked) {
      const updatedBadges = player.badges.map(badge => 
        badge.id === badgeId ? { ...badge, unlocked: true } : badge
      );
      
      setPlayer({
        ...player,
        badges: updatedBadges
      });
    }
  };

  // Reset all progress
  const resetProgress = () => {
    toast({
      title: "Progress Reset",
      description: "All progress has been reset.",
      variant: "destructive"
    });
    
    setPlayer(initialPlayerState);
    localStorage.removeItem('playerData');
  };

  return (
    <PlayerContext.Provider value={{
      player,
      updatePlayerXP,
      completeGame,
      unlockBadge,
      resetProgress
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
