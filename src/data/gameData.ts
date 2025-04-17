import { Game, Badge } from '@/types/game';

// Software Construction (Unit 4) Games
export const constructionGames: Game[] = [
  {
    id: 'coding-standards',
    title: 'Coding Standards Quest',
    description: 'Master coding standards through interactive challenges',
    imageUrl: '/images/games/coding-standards.jpg',
    path: '/game/coding-standards',
    category: 'construction',
    type: 'puzzle',
    difficulty: 'easy',
    xpReward: 25,
    achievements: [
      {
        id: 'cs-perfect-score',
        name: 'Code Master',
        description: 'Achieve a perfect score in Coding Standards Quest',
        requirements: {
          type: 'score',
          value: 1000
        }
      },
      {
        id: 'cs-speed-run',
        name: 'Quick Fixer',
        description: 'Complete the quest in under 5 minutes',
        requirements: {
          type: 'time',
          value: 300
        }
      }
    ]
  },
  {
    id: 'code-review',
    title: 'Code Review Challenge',
    description: 'Test your code review skills with real-world scenarios',
    imageUrl: '/images/games/code-review.jpg',
    path: '/game/code-review',
    category: 'construction',
    type: 'review',
    difficulty: 'medium',
    xpReward: 35,
    achievements: [
      {
        id: 'cr-expert',
        name: 'Review Expert',
        description: 'Complete all review scenarios with perfect accuracy',
        requirements: {
          type: 'score',
          value: 1000
        }
      },
      {
        id: 'cr-combo',
        name: 'Review Master',
        description: 'Get 5 perfect reviews in a row',
        requirements: {
          type: 'combo',
          value: 5
        }
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing Strategy Simulator',
    description: 'Learn testing techniques through practical exercises',
    imageUrl: '/images/games/testing.jpg',
    path: '/game/testing-arena',
    category: 'construction',
    type: 'testing',
    difficulty: 'medium',
    xpReward: 35,
    achievements: [
      {
        id: 'ts-complete',
        name: 'Testing Guru',
        description: 'Complete all testing scenarios',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'ts-perfect',
        name: 'Perfect Tester',
        description: 'Achieve 100% test coverage',
        requirements: {
          type: 'score',
          value: 1000
        }
      }
    ]
  },
  {
    id: 'debugging',
    title: 'Debugging Dungeon',
    description: 'Navigate through complex debugging scenarios',
    imageUrl: '/images/games/debugging.jpg',
    path: '/game/debug-mission',
    category: 'construction',
    type: 'debug',
    difficulty: 'hard',
    xpReward: 50,
    achievements: [
      {
        id: 'db-master',
        name: 'Debug Master',
        description: 'Solve all debugging challenges',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'db-speed',
        name: 'Quick Debugger',
        description: 'Solve a challenge in under 2 minutes',
        requirements: {
          type: 'time',
          value: 120
        }
      }
    ]
  }
];

// Product Management (Unit 5) Games
export const managementGames: Game[] = [
  {
    id: 'risk-assessment',
    title: 'Risk Assessment Adventure',
    description: 'Learn risk management through interactive scenarios',
    imageUrl: '/images/games/risk-assessment.jpg',
    path: '/game/risk-adventure',
    category: 'management',
    type: 'risk',
    difficulty: 'medium',
    xpReward: 35,
    achievements: [
      {
        id: 'ra-expert',
        name: 'Risk Expert',
        description: 'Complete all risk assessment scenarios',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'ra-perfect',
        name: 'Perfect Assessment',
        description: 'Achieve perfect risk assessment score',
        requirements: {
          type: 'score',
          value: 1000
        }
      }
    ]
  },
  {
    id: 'rmmm-plan',
    title: 'RMMM Plan Builder',
    description: 'Create comprehensive risk management plans',
    imageUrl: '/images/games/rmmm-plan.jpg',
    path: '/game/rmmm-builder',
    category: 'management',
    type: 'rmmm',
    difficulty: 'hard',
    xpReward: 50,
    achievements: [
      {
        id: 'rmmm-master',
        name: 'RMMM Master',
        description: 'Create a perfect RMMM plan',
        requirements: {
          type: 'score',
          value: 1000
        }
      },
      {
        id: 'rmmm-speed',
        name: 'Quick Planner',
        description: 'Complete a plan in under 10 minutes',
        requirements: {
          type: 'time',
          value: 600
        }
      }
    ]
  },
  {
    id: 'release-planning',
    title: 'Release Planning Challenge',
    description: 'Master the art of release planning',
    imageUrl: '/images/games/release-planning.jpg',
    path: '/game/product-release',
    category: 'management',
    type: 'release',
    difficulty: 'hard',
    xpReward: 50,
    achievements: [
      {
        id: 'rp-expert',
        name: 'Release Expert',
        description: 'Complete all release planning scenarios',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'rp-perfect',
        name: 'Perfect Release',
        description: 'Create a perfect release plan',
        requirements: {
          type: 'score',
          value: 1000
        }
      }
    ]
  }
];

// Mini games for quick practice
export const miniGames: Game[] = [
  {
    id: 'code-standards-quiz',
    title: 'Code Standards Quiz',
    description: 'Test your knowledge of coding standards with quick questions.',
    imageUrl: '/images/games/placeholder.svg',
    path: '/game/code-quiz',
    category: 'construction',
    type: 'puzzle',
    difficulty: 'easy',
    xpReward: 25,
    timeLimit: 180,
  },
  {
    id: 'quick-debug',
    title: 'Quick Debug Challenge',
    description: 'Find bugs in short code snippets against the clock.',
    imageUrl: '/images/games/placeholder.svg',
    path: '/game/quick-debug',
    category: 'construction',
    type: 'debug',
    difficulty: 'medium',
    xpReward: 35,
    timeLimit: 120,
  },
  {
    id: 'risk-identification',
    title: 'Risk Identification Race',
    description: 'Quickly identify potential risks in project scenarios.',
    imageUrl: '/images/games/placeholder.svg',
    path: '/game/risk-race',
    category: 'management',
    type: 'risk',
    difficulty: 'easy',
    xpReward: 30,
    timeLimit: 150,
  }
];

// All games combined
export const allGames: Game[] = [...constructionGames, ...managementGames, ...miniGames];

// Available badges
export const badges: Badge[] = [
  {
    id: 'first-game',
    name: 'First Mission',
    description: 'Complete your first game',
    iconName: 'Trophy',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1
    }
  },
  {
    id: 'code-master',
    name: 'Code Master',
    description: 'Achieve perfect score in Coding Standards',
    iconName: 'Code',
    unlocked: false,
    requirements: {
      type: 'score',
      value: 1000,
      gameId: 'coding-standards'
    }
  },
  {
    id: 'review-expert',
    name: 'Review Expert',
    description: 'Complete all code review challenges',
    iconName: 'ClipboardCheck',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1,
      gameId: 'code-review'
    }
  },
  {
    id: 'testing-guru',
    name: 'Testing Guru',
    description: 'Master all testing scenarios',
    iconName: 'Bug',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1,
      gameId: 'testing'
    }
  },
  {
    id: 'debug-master',
    name: 'Debug Master',
    description: 'Solve all debugging challenges',
    iconName: 'ShieldCheck',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1,
      gameId: 'debugging'
    }
  },
  {
    id: 'risk-expert',
    name: 'Risk Expert',
    description: 'Complete all risk assessment scenarios',
    iconName: 'Shield',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1,
      gameId: 'risk-assessment'
    }
  },
  {
    id: 'rmmm-master',
    name: 'RMMM Master',
    description: 'Create perfect RMMM plans',
    iconName: 'FileText',
    unlocked: false,
    requirements: {
      type: 'score',
      value: 1000,
      gameId: 'rmmm-plan'
    }
  },
  {
    id: 'release-expert',
    name: 'Release Expert',
    description: 'Master release planning',
    iconName: 'Package',
    unlocked: false,
    requirements: {
      type: 'completion',
      value: 1,
      gameId: 'release-planning'
    }
  }
];

// Initial player state
export const initialPlayerState = {
  id: 'player1',
  name: 'Agent',
  level: 1,
  xp: 0,
  maxXp: 100,
  badges: badges,
  completedGames: [],
  gameProgress: {},
  stats: {
    totalScore: 0,
    gamesPlayed: 0,
    averageScore: 0,
    totalTimePlayed: 0,
    perfectGames: 0
  }
};

// Boss battle games
export const bossBattleGames = [
  {
    id: 'construction-boss',
    title: 'Construction Boss Battle',
    description: 'Final challenge for Software Construction',
    imageUrl: '/images/games/construction-boss.jpg',
    path: '/games/construction-boss',
    category: 'construction',
    type: 'puzzle',
    difficulty: 'easy',
    xpReward: 25,
    timeLimit: 1800,
    achievements: [
      {
        id: 'cb-master',
        name: 'Construction Master',
        description: 'Defeat the Construction Boss',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'cb-perfect',
        name: 'Perfect Construction',
        description: 'Achieve perfect score in boss battle',
        requirements: {
          type: 'score',
          value: 1000
        }
      }
    ]
  },
  {
    id: 'management-boss',
    title: 'Management Boss Battle',
    description: 'Final challenge for Product Management',
    imageUrl: '/images/games/management-boss.jpg',
    path: '/games/management-boss',
    category: 'construction',
    type: 'debug',
    difficulty: 'medium',
    xpReward: 35,
    timeLimit: 1800,
    achievements: [
      {
        id: 'mb-master',
        name: 'Management Master',
        description: 'Defeat the Management Boss',
        requirements: {
          type: 'completion',
          value: 1
        }
      },
      {
        id: 'mb-perfect',
        name: 'Perfect Management',
        description: 'Achieve perfect score in boss battle',
        requirements: {
          type: 'score',
          value: 1000
        }
      }
    ]
  }
];
