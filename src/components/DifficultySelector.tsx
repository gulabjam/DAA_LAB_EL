import React from 'react';
import { Brain, Zap, Target, Crown } from 'lucide-react';
import { DifficultyLevel } from '../types/game';
import { difficultyConfigs } from '../utils/difficulty';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  disabled?: boolean;
}

const difficultyIcons = {
  easy: Brain,
  medium: Zap,
  hard: Target,
  expert: Crown
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
  disabled = false
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Difficulty Level</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {(Object.keys(difficultyConfigs) as DifficultyLevel[]).map((level) => {
          const config = difficultyConfigs[level];
          const Icon = difficultyIcons[level];
          const isSelected = currentDifficulty === level;
          
          return (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected 
                  ? `${config.bgColor} border-current ${config.color} shadow-md` 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isSelected ? config.bgColor : 'bg-gray-200'}
                `}>
                  <Icon className={`w-5 h-5 ${isSelected ? config.color : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <div className={`font-semibold ${isSelected ? config.color : 'text-gray-800'}`}>
                    {config.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {config.description}
                  </div>
                </div>
                
                {isSelected && (
                  <div className={`w-3 h-3 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Current:</strong> {difficultyConfigs[currentDifficulty].name}
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Max Depth: {difficultyConfigs[currentDifficulty].maxDepth} • 
          Think Time: {difficultyConfigs[currentDifficulty].thinkingTime}ms
        </div>
      </div>
    </div>
  );
};