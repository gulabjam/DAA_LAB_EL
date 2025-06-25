import { MinimaxNode } from '../types/game';
import { checkWinner, isBoardFull, getAvailableMoves, evaluateBoard, makeMove } from './gameLogic';

let nodeCounter = 0;
let decisionTree: MinimaxNode | null = null;

export const resetNodeCounter = () => {
  nodeCounter = 0;
  decisionTree = null;
};

export const getDecisionTree = () => decisionTree;

export const minimax = (
  board: (string | null)[][],
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity,
  maxDepth: number = 8,
  parentNode: MinimaxNode | null = null,
  move: { row: number; col: number } | null = null
): { score: number; move: { row: number; col: number } | null; node: MinimaxNode } => {
  const nodeId = `node-${nodeCounter++}`;
  
  const node: MinimaxNode = {
    id: nodeId,
    move,
    score: 0,
    depth,
    alpha,
    beta,
    isMaximizing,
    children: [],
    bestMove: false,
    pruned: false
  };

  if (parentNode) {
    parentNode.children.push(node);
  } else {
    decisionTree = node;
  }

  const winner = checkWinner(board);
  if (winner || isBoardFull(board) || depth >= maxDepth) {
    const baseScore = evaluateBoard(board);
    // Adjust score based on depth to prefer quicker wins and slower losses
    if (winner === 'O') {
      node.score = baseScore - depth;
    } else if (winner === 'X') {
      node.score = baseScore + depth;
    } else {
      node.score = baseScore;
    }
    return { score: node.score, move, node };
  }

  const availableMoves = getAvailableMoves(board);
  let bestMove: { row: number; col: number } | null = null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (const moveOption of availableMoves) {
      const newBoard = makeMove(board, moveOption.row, moveOption.col, 'O');
      const result = minimax(newBoard, depth + 1, false, alpha, beta, maxDepth, node, moveOption);
      
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = moveOption;
      }
      
      alpha = Math.max(alpha, result.score);
      node.alpha = alpha;
      
      if (beta <= alpha) {
        // Mark remaining children as pruned
        for (let i = availableMoves.indexOf(moveOption) + 1; i < availableMoves.length; i++) {
          const prunedNode: MinimaxNode = {
            id: `pruned-${nodeCounter++}`,
            move: availableMoves[i],
            score: 0,
            depth: depth + 1,
            alpha,
            beta,
            isMaximizing: false,
            children: [],
            bestMove: false,
            pruned: true
          };
          node.children.push(prunedNode);
        }
        break;
      }
    }
    
    node.score = maxEval;
  } else {
    let minEval = Infinity;
    
    for (const moveOption of availableMoves) {
      const newBoard = makeMove(board, moveOption.row, moveOption.col, 'X');
      const result = minimax(newBoard, depth + 1, true, alpha, beta, maxDepth, node, moveOption);
      
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = moveOption;
      }
      
      beta = Math.min(beta, result.score);
      node.beta = beta;
      
      if (beta <= alpha) {
        // Mark remaining children as pruned
        for (let i = availableMoves.indexOf(moveOption) + 1; i < availableMoves.length; i++) {
          const prunedNode: MinimaxNode = {
            id: `pruned-${nodeCounter++}`,
            move: availableMoves[i],
            score: 0,
            depth: depth + 1,
            alpha,
            beta,
            isMaximizing: true,
            children: [],
            bestMove: false,
            pruned: true
          };
          node.children.push(prunedNode);
        }
        break;
      }
    }
    
    node.score = minEval;
  }

  // Mark the best move
  if (bestMove) {
    const bestChild = node.children.find(child => 
      child.move?.row === bestMove?.row && child.move?.col === bestMove?.col
    );
    if (bestChild) {
      bestChild.bestMove = true;
    }
  }

  return { score: node.score, move: bestMove, node };
};

export const getBestMove = (
  board: (string | null)[][],
  maxDepth: number = 8,
  mistakeChance: number = 0
): { row: number; col: number } | null => {
  resetNodeCounter();
  
  // Introduce mistakes for easier difficulty levels
  if (mistakeChance > 0 && Math.random() < mistakeChance) {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length > 0) {
      // Make a random move instead of the best move
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
  }
  
  const result = minimax(board, 0, true, -Infinity, Infinity, maxDepth);
  return result.move;
};