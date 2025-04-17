export interface ReviewScenario {
  id: string;
  title: string;
  description: string;
  code: string;
  correctTechnique: string;
}

export interface ReviewTechnique {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const reviewScenarios: ReviewScenario[] = [
  {
    id: 'scenario-1',
    title: 'Code Style Violation',
    description: 'The code has inconsistent indentation and naming conventions.',
    code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
    correctTechnique: 'style-review'
  },
  {
    id: 'scenario-2',
    title: 'Security Issue',
    description: 'The code contains a potential SQL injection vulnerability.',
    code: `function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}`,
    correctTechnique: 'security-review'
  },
  {
    id: 'scenario-3',
    title: 'Performance Problem',
    description: 'The code has an inefficient nested loop that could be optimized.',
    code: `function findDuplicates(array) {
  const duplicates = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i !== j && array[i] === array[j]) {
        duplicates.push(array[i]);
      }
    }
  }
  return duplicates;
}`,
    correctTechnique: 'performance-review'
  }
];

export const reviewTechniques: ReviewTechnique[] = [
  {
    id: 'style-review',
    name: 'Style Review',
    description: 'Review code for consistent formatting, naming conventions, and style guidelines.',
    icon: '🎨'
  },
  {
    id: 'security-review',
    name: 'Security Review',
    description: 'Check for potential security vulnerabilities and best practices.',
    icon: '🔒'
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Analyze code for efficiency, resource usage, and optimization opportunities.',
    icon: '⚡'
  }
]; 