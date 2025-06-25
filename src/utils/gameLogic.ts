import { GameState, MinimaxNode } from '../types/game';

export const createEmptyBoard = (): (string | null)[][] => {
  return Array(4).fill(null).map(() => Array(4).fill(null));
};

export const checkWinner = (board: (string | null)[][]): string | null => {
  // Check rows (4 in a row)
  for (let row = 0; row < 4; row++) {
    if (board[row][0] && 
        board[row][0] === board[row][1] && 
        board[row][0] === board[row][2] && 
        board[row][0] === board[row][3]) {
      return board[row][0];
    }
  }

  // Check columns (4 in a column)
  for (let col = 0; col < 4; col++) {
    if (board[0][col] && 
        board[0][col] === board[1][col] && 
        board[0][col] === board[2][col] && 
        board[0][col] === board[3][col]) {
      return board[0][col];
    }
  }

  // Check main diagonal (top-left to bottom-right)
  if (board[0][0] && 
      board[0][0] === board[1][1] && 
      board[0][0] === board[2][2] && 
      board[0][0] === board[3][3]) {
    return board[0][0];
  }

  // Check anti-diagonal (top-right to bottom-left)
  if (board[0][3] && 
      board[0][3] === board[1][2] && 
      board[0][3] === board[2][1] && 
      board[0][3] === board[3][0]) {
    return board[0][3];
  }

  return null;
};

export const isBoardFull = (board: (string | null)[][]): boolean => {
  return board.every(row => row.every(cell => cell !== null));
};

export const getAvailableMoves = (board: (string | null)[][]): { row: number; col: number }[] => {
  const moves: { row: number; col: number }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
};

export const evaluateBoard = (board: (string | null)[][]): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 100;
  if (winner === 'X') return -100;
  
  // Add positional scoring for better gameplay
  let score = 0;
  
  // Center positions are more valuable
  const centerPositions = [[1, 1], [1, 2], [2, 1], [2, 2]];
  centerPositions.forEach(([row, col]) => {
    if (board[row][col] === 'O') score += 3;
    if (board[row][col] === 'X') score -= 3;
  });
  
  // Corner positions are also valuable
  const cornerPositions = [[0, 0], [0, 3], [3, 0], [3, 3]];
  cornerPositions.forEach(([row, col]) => {
    if (board[row][col] === 'O') score += 2;
    if (board[row][col] === 'X') score -= 2;
  });
  
  return score;
};

export const makeMove = (
  board: (string | null)[][],
  row: number,
  col: number,
  player: 'X' | 'O'
): (string | null)[][] => {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
};