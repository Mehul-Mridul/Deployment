// Player information
export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  badges: Badge[];
  completedGames: string[];
  gameProgress: Record<string, GameProgress>;
  stats: {
    totalScore: number;
    gamesPlayed: number;
    averageScore: number;
    totalTimePlayed: number;
    perfectGames: number;
  };
}

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  requirements: {
    type: 'score' | 'completion' | 'time' | 'combo';
    value: number;
    gameId?: string;
  };
}

// Game categories
export type GameCategory = 'construction' | 'management';

// Game difficulty
export type GameDifficulty = 'easy' | 'medium' | 'hard';

// Game type
export type GameType = 
  | 'puzzle' 
  | 'debug' 
  | 'review' 
  | 'testing' 
  | 'risk' 
  | 'rmmm' 
  | 'release';

// Game definition
export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  path: string;
  category: GameCategory;
  type: GameType;
  difficulty: GameDifficulty;
  xpReward: number;
  timeLimit?: number; // in seconds
  isCompleted?: boolean;
  achievements: {
    id: string;
    name: string;
    description: string;
    requirements: {
      type: 'score' | 'completion' | 'time' | 'combo';
      value: number;
    };
  }[];
}

// Game question
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

// Game progress
export interface GameProgress {
  gameId: string;
  score: number;
  completed: boolean;
  attemptsUsed: number;
  timeSpent?: number; // in seconds
  bestScore?: number;
  fastestTime?: number;
  lastPlayed?: string; // ISO date string
  achievements?: string[]; // List of achievement IDs earned in this game
}
