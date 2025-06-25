import React from 'react';

interface GameBoardProps {
  board: (string | null)[][];
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, disabled }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">4×4 Game Board</h2>
        <span className="text-sm text-gray-500">Move {board.flat().filter(Boolean).length} of 16</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={disabled || cell !== null}
              className={`
                w-16 h-16 rounded-lg border-2 font-bold text-xl transition-all duration-200
                ${cell === null 
                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-gray-50' 
                  : 'border-gray-300'
                }
                ${cell === 'X' ? 'text-blue-600 bg-blue-50' : ''}
                ${cell === 'O' ? 'text-red-500 bg-red-50' : ''}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                hover:scale-105 active:scale-95
              `}
            >
              {cell}
            </button>
          ))
        )}
      </div>
    </div>
  );
};