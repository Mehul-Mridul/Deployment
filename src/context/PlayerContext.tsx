import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, GameProgress, Badge } from '@/types/game';
import { badges, initialPlayerState } from '@/data/gameData';
import { toast } from '@/components/ui/use-toast';

interface PlayerContextType {
  player: typeof initialPlayerState;
  updatePlayerXP: (amount: number) => void;
  completeGame: (gameId: string, score: number, timeSpent: number) => void;
  unlockBadge: (badgeId: string) => void;
  resetProgress: () => void;
  getGameProgress: (gameId: string) => GameProgress | null;
  updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    const savedData = localStorage.getItem('playerData');
    return savedData ? JSON.parse(savedData) : {
      ...initialPlayerState,
      badges: badges.map(badge => ({
        ...badge,
        unlocked: false
      }))
    };
  });

  // Save player data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerData', JSON.stringify(player));
  }, [player]);

  // Update player XP and handle level up
  const updatePlayerXP = (amount: number) => {
    const newXp = player.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    const newMaxXp = newLevel * 100;
    
    setPlayer(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      maxXp: newMaxXp,
      stats: {
        ...prev.stats,
        totalScore: prev.stats.totalScore + amount
      }
    }));

    if (newLevel > player.level) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}!`,
        variant: "default"
      });
    }
  };

  // Mark a game as completed and update progress
  const completeGame = (gameId: string, score: number, timeSpent: number) => {
    const existingProgress = player.gameProgress[gameId];
    const isNewCompletion = !player.completedGames.includes(gameId);
    const isPerfectScore = score === 1000;
    
    const newProgress: GameProgress = {
      gameId,
      score: Math.max(score, existingProgress?.score || 0),
      completed: true,
      attemptsUsed: (existingProgress?.attemptsUsed || 0) + 1,
      timeSpent: Math.min(timeSpent, existingProgress?.timeSpent || Infinity)
    };

    setPlayer(prev => {
      const updatedCompletedGames = isNewCompletion 
        ? [...prev.completedGames, gameId] 
        : prev.completedGames;
      
      return {
        ...prev,
        completedGames: updatedCompletedGames,
        gameProgress: {
          ...prev.gameProgress,
          [gameId]: newProgress
        },
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + 1,
          totalTimePlayed: prev.stats.totalTimePlayed + timeSpent,
          perfectGames: isPerfectScore ? prev.stats.perfectGames + 1 : prev.stats.perfectGames,
          averageScore: ((prev.stats.averageScore * prev.stats.gamesPlayed) + score) / (prev.stats.gamesPlayed + 1)
        }
      };
    });

    // Check for badge unlocks
    checkBadgeUnlocks(gameId, score, isNewCompletion);

    if (isNewCompletion) {
      toast({
        title: "Mission Complete!",
        description: "New mission completed! +25 XP awarded.",
        variant: "default"
      });
      updatePlayerXP(25);
    } else {
      toast({
        title: "Game Replayed",
        description: "You've improved your score!",
        variant: "default"
      });
    }
  };

  // Check and unlock badges based on game progress
  const checkBadgeUnlocks = (gameId: string, score: number, isNewCompletion: boolean) => {
    const badgesToCheck = player.badges.filter(badge => !badge.unlocked);
    
    badgesToCheck.forEach(badge => {
      const { requirements } = badge;
      
      if (requirements.gameId && requirements.gameId !== gameId) return;
      
      let shouldUnlock = false;
      
      switch (requirements.type) {
        case 'score':
          shouldUnlock = score >= requirements.value;
          break;
        case 'completion':
          shouldUnlock = isNewCompletion;
          break;
        case 'time':
          shouldUnlock = player.stats.totalTimePlayed >= requirements.value;
          break;
        case 'combo':
          shouldUnlock = player.stats.perfectGames >= requirements.value;
          break;
      }
      
      if (shouldUnlock) {
        unlockBadge(badge.id);
      }
    });
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
      
      setPlayer(prev => ({
        ...prev,
        badges: updatedBadges
      }));

      const badge = badges.find(b => b.id === badgeId);
      if (badge) {
        toast({
          title: "Badge Unlocked!",
          description: `You've earned the ${badge.name} badge!`,
          variant: "default"
        });
      }
    }
  };

  // Get game progress
  const getGameProgress = (gameId: string) => {
    return player.gameProgress[gameId] || null;
  };

  // Update game progress
  const updateGameProgress = (gameId: string, progress: Partial<GameProgress>) => {
    setPlayer(prev => ({
      ...prev,
      gameProgress: {
        ...prev.gameProgress,
        [gameId]: {
          ...prev.gameProgress[gameId],
          ...progress
        }
      }
    }));
  };

  // Reset all progress
  const resetProgress = () => {
    setPlayer({
      ...initialPlayerState,
      badges: badges.map(badge => ({
        ...badge,
        unlocked: false
      }))
    });
    localStorage.removeItem('playerData');
  };

  return (
    <PlayerContext.Provider value={{
      player,
      updatePlayerXP,
      completeGame,
      unlockBadge,
      resetProgress,
      getGameProgress,
      updateGameProgress
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
