
import { Game, Badge } from '@/types/game';

// Software Construction (Unit 4) Games
export const constructionGames: Game[] = [
  {
    id: 'coding-standards',
    title: 'Coding Standards Quest',
    description: 'Master the art of clean code by applying coding standards to fix problematic code snippets.',
    imageUrl: '/placeholder.svg',
    path: '/game/coding-standards',
    category: 'construction',
    type: 'puzzle',
    difficulty: 'easy',
    xpReward: 50,
  },
  {
    id: 'code-review-challenge',
    title: 'Code Review Challenge',
    description: 'Learn to identify code issues through different review methods: Deskcheck, Walkthrough, and Inspection.',
    imageUrl: '/placeholder.svg',
    path: '/game/code-review',
    category: 'construction',
    type: 'review',
    difficulty: 'medium',
    xpReward: 75,
  },
  {
    id: 'testing-arena',
    title: 'Testing Arena',
    description: 'Battle in the testing arena by choosing the right testing strategy: Unit, Integration, Validation, or System Testing.',
    imageUrl: '/placeholder.svg',
    path: '/game/testing-arena',
    category: 'construction',
    type: 'testing',
    difficulty: 'medium',
    xpReward: 75,
  },
  {
    id: 'debug-mission',
    title: 'Debug Mission',
    description: 'Track down and eliminate bugs in complex code scenarios using systematic debugging techniques.',
    imageUrl: '/placeholder.svg',
    path: '/game/debug-mission',
    category: 'construction',
    type: 'debug',
    difficulty: 'hard',
    xpReward: 100,
  }
];

// Product Management (Unit 5) Games
export const managementGames: Game[] = [
  {
    id: 'risk-adventure',
    title: 'Risk Adventure Map',
    description: 'Navigate through a risk-filled landscape and make decisions between proactive and reactive risk management.',
    imageUrl: '/placeholder.svg',
    path: '/game/risk-adventure',
    category: 'management',
    type: 'risk',
    difficulty: 'medium',
    xpReward: 75,
  },
  {
    id: 'risk-projection',
    title: 'Risk Projection & Refinement',
    description: 'Analyze, project, and refine risks to minimize their impact on the project.',
    imageUrl: '/placeholder.svg',
    path: '/game/risk-projection',
    category: 'management',
    type: 'risk',
    difficulty: 'medium',
    xpReward: 75,
  },
  {
    id: 'rmmm-builder',
    title: 'RMMM Plan Builder',
    description: 'Build a comprehensive Risk Mitigation, Monitoring, and Management plan from scratch.',
    imageUrl: '/placeholder.svg',
    path: '/game/rmmm-builder',
    category: 'management',
    type: 'rmmm',
    difficulty: 'hard',
    xpReward: 100,
  },
  {
    id: 'product-release',
    title: 'Product Release Simulator',
    description: 'Simulate a product release and maintenance cycle, making critical decisions that impact success.',
    imageUrl: '/placeholder.svg',
    path: '/game/product-release',
    category: 'management',
    type: 'release',
    difficulty: 'hard',
    xpReward: 100,
  }
];

// All games combined
export const allGames: Game[] = [...constructionGames, ...managementGames];

// Available badges
export const badges: Badge[] = [
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Successfully completed the Debug Mission.',
    iconName: 'Bug',
    unlocked: false
  },
  {
    id: 'code-master',
    name: 'Code Master',
    description: 'Achieved perfect score in Coding Standards Quest.',
    iconName: 'Code',
    unlocked: false
  },
  {
    id: 'review-expert',
    name: 'Review Expert',
    description: 'Mastered all code review techniques.',
    iconName: 'ClipboardCheck',
    unlocked: false
  },
  {
    id: 'test-champion',
    name: 'Test Champion',
    description: 'Completed all levels in the Testing Arena.',
    iconName: 'ShieldCheck',
    unlocked: false
  },
  {
    id: 'risk-slayer',
    name: 'Risk Slayer',
    description: 'Successfully managed all risks in Risk Adventure Map.',
    iconName: 'Shield',
    unlocked: false
  },
  {
    id: 'plan-master',
    name: 'Plan Master',
    description: 'Created a perfect RMMM Plan.',
    iconName: 'FileText',
    unlocked: false
  },
  {
    id: 'product-guru',
    name: 'Product Guru',
    description: 'Successfully released and maintained a product.',
    iconName: 'Package',
    unlocked: false
  },
  {
    id: 'sepm-champion',
    name: 'SEPM Champion',
    description: 'Completed all games with perfect scores.',
    iconName: 'Trophy',
    unlocked: false
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
  completedGames: []
};
