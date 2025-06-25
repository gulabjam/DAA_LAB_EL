import React, { useState, useEffect } from 'react';
import { Brain, RotateCcw } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { DecisionTree } from './components/DecisionTree';
import { AIAnalysis } from './components/AIAnalysis';
import { DifficultySelector } from './components/DifficultySelector';
import { GameState, GameStats, MinimaxNode, DifficultyLevel } from './types/game';
import { createEmptyBoard, checkWinner, isBoardFull, makeMove } from './utils/gameLogic';
import { getBestMove, getDecisionTree } from './utils/minimax';
import { getDifficultyConfig } from './utils/difficulty';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 'X',
    gameStatus: 'playing',
    winner: null,
    moveCount: 0
  });

  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    playerWins: 0,
    aiWins: 0,
    draws: 0,
    winRate: 0
  });

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [decisionTree, setDecisionTree] = useState<MinimaxNode | null>(null);
  const [lastAIMove, setLastAIMove] = useState<{ row: number; col: number } | null>(null);
  const [thinkingTime, setThinkingTime] = useState<number>(0);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const playerMoves = gameState.board.flat().filter(cell => cell === 'X').length;
  const aiMoves = gameState.board.flat().filter(cell => cell === 'O').length;
  const difficultyConfig = getDifficultyConfig(difficulty);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board[row][col] !== null || gameState.gameStatus !== 'playing' || gameState.currentPlayer !== 'X') {
      return;
    }

    const newBoard = makeMove(gameState.board, row, col, 'X');
    const winner = checkWinner(newBoard);
    const isFull = isBoardFull(newBoard);

    setGameState({
      board: newBoard,
      currentPlayer: 'O',
      gameStatus: winner ? 'won' : isFull ? 'draw' : 'playing',
      winner,
      moveCount: gameState.moveCount + 1
    });
  };

  const makeAIMove = async () => {
    if (gameState.currentPlayer !== 'O' || gameState.gameStatus !== 'playing') {
      return;
    }

    setIsAIThinking(true);
    const startTime = Date.now();

    // Add thinking delay based on difficulty
    await new Promise(resolve => setTimeout(resolve, difficultyConfig.thinkingTime));

    const bestMove = getBestMove(
      gameState.board,
      difficultyConfig.maxDepth,
      difficultyConfig.mistakeChance
    );
    const endTime = Date.now();
    setThinkingTime(endTime - startTime);

    if (bestMove) {
      const newBoard = makeMove(gameState.board, bestMove.row, bestMove.col, 'O');
      const winner = checkWinner(newBoard);
      const isFull = isBoardFull(newBoard);

      setGameState({
        board: newBoard,
        currentPlayer: 'X',
        gameStatus: winner ? 'won' : isFull ? 'draw' : 'playing',
        winner,
        moveCount: gameState.moveCount + 1
      });

      setLastAIMove(bestMove);
      setDecisionTree(getDecisionTree());
    }

    setIsAIThinking(false);
  };

  const newGame = () => {
    const newStats = { ...gameStats };
    
    if (gameState.gameStatus === 'won') {
      newStats.gamesPlayed++;
      if (gameState.winner === 'X') {
        newStats.playerWins++;
      } else {
        newStats.aiWins++;
      }
    } else if (gameState.gameStatus === 'draw') {
      newStats.gamesPlayed++;
      newStats.draws++;
    }

    if (newStats.gamesPlayed > 0) {
      newStats.winRate = (newStats.playerWins / newStats.gamesPlayed) * 100;
    }

    setGameStats(newStats);
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      moveCount: 0
    });
    setDecisionTree(null);
    setLastAIMove(null);
    setThinkingTime(0);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    // Reset game when difficulty changes
    if (gameState.moveCount > 0) {
      newGame();
    }
  };

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.gameStatus === 'playing') {
      makeAIMove();
    }
  }, [gameState.currentPlayer, gameState.gameStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Tic-Tac-Toe</h1>
                <p className="text-sm text-gray-600">4×4 Grid with AI Decision Tree Visualization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Games: {gameStats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Win Rate: {gameStats.winRate.toFixed(0)}%</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyConfig.bgColor} ${difficultyConfig.color}`}>
                {difficultyConfig.name}
              </div>
              <button
                onClick={newGame}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RotateCcw size={16} />
                <span>New Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <GameStatus 
              gameState={gameState} 
              playerMoves={playerMoves} 
              aiMoves={aiMoves} 
            />
            <GameBoard
              board={gameState.board}
              onCellClick={handleCellClick}
              disabled={gameState.gameStatus !== 'playing' || gameState.currentPlayer !== 'X' || isAIThinking}
            />
            <DifficultySelector
              currentDifficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              disabled={isAIThinking || (gameState.gameStatus === 'playing' && gameState.moveCount > 0)}
            />
            <AIAnalysis
              tree={decisionTree}
              lastMove={lastAIMove}
              thinkingTime={thinkingTime}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <DecisionTree tree={decisionTree} maxDepth={difficultyConfig.maxDepth} />
          </div>
        </div>

        {isAIThinking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-lg font-medium">
                AI is thinking... ({difficultyConfig.name} mode)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;