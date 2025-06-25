import { DifficultyLevel, DifficultyConfig } from '../types/game';

export const difficultyConfigs: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    description: 'Perfect for beginners - AI makes occasional mistakes',
    maxDepth: 3,
    thinkingTime: 300,
    mistakeChance: 0.3,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  medium: {
    name: 'Medium',
    description: 'Balanced gameplay - AI plays well but not perfectly',
    maxDepth: 5,
    thinkingTime: 600,
    mistakeChance: 0.15,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  hard: {
    name: 'Hard',
    description: 'Challenging opponent - AI rarely makes mistakes',
    maxDepth: 7,
    thinkingTime: 800,
    mistakeChance: 0.05,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  expert: {
    name: 'Expert',
    description: 'Ultimate challenge - Perfect AI play',
    maxDepth: 9,
    thinkingTime: 1000,
    mistakeChance: 0,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
};

export const getDifficultyConfig = (level: DifficultyLevel): DifficultyConfig => {
  return difficultyConfigs[level];
};