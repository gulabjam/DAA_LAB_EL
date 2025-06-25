export interface GameState {
  board: (string | null)[][];
  currentPlayer: 'X' | 'O';
  gameStatus: 'playing' | 'won' | 'draw';
  winner: string | null;
  moveCount: number;
}

export interface MinimaxNode {
  id: string;
  move: { row: number; col: number } | null;
  score: number;
  depth: number;
  alpha: number;
  beta: number;
  isMaximizing: boolean;
  children: MinimaxNode[];
  bestMove: boolean;
  pruned: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  playerWins: number;
  aiWins: number;
  draws: number;
  winRate: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  name: string;
  description: string;
  maxDepth: number;
  thinkingTime: number;
  mistakeChance: number;
  color: string;
  bgColor: string;
}