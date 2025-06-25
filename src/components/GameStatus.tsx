import React from 'react';
import { GameState } from '../types/game';

interface GameStatusProps {
  gameState: GameState;
  playerMoves: number;
  aiMoves: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({ gameState, playerMoves, aiMoves }) => {
  const getStatusMessage = () => {
    if (gameState.gameStatus === 'won') {
      return gameState.winner === 'X' ? 'You Win!' : 'AI Wins!';
    }
    if (gameState.gameStatus === 'draw') {
      return 'Draw!';
    }
    return gameState.currentPlayer === 'X' ? 'Your Turn' : 'AI Turn';
  };

  const getStatusColor = () => {
    if (gameState.gameStatus === 'won') {
      return gameState.winner === 'X' ? 'bg-green-500' : 'bg-red-500';
    }
    if (gameState.gameStatus === 'draw') {
      return 'bg-yellow-500';
    }
    return gameState.currentPlayer === 'X' ? 'bg-blue-500' : 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Status</h2>
      
      <div className="flex items-center justify-center mb-6">
        <span className={`px-4 py-2 rounded-full text-white font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-1">X</div>
          <div className="text-sm text-gray-600 mb-1">You</div>
          <div className="text-lg font-semibold text-gray-800">{playerMoves} moves</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-3xl font-bold text-red-500 mb-1">O</div>
          <div className="text-sm text-gray-600 mb-1">AI Opponent</div>
          <div className="text-lg font-semibold text-gray-800">{aiMoves} moves</div>
        </div>
      </div>
    </div>
  );
};