import React from 'react';
import { MinimaxNode } from '../types/game';

interface AIAnalysisProps {
  tree: MinimaxNode | null;
  lastMove: { row: number; col: number } | null;
  thinkingTime: number;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ tree, lastMove, thinkingTime }) => {
  const getNodeCount = (node: MinimaxNode | null): number => {
    if (!node) return 0;
    return 1 + node.children.reduce((sum, child) => sum + getNodeCount(child), 0);
  };

  const getPrunedCount = (node: MinimaxNode | null): number => {
    if (!node) return 0;
    const currentPruned = node.pruned ? 1 : 0;
    return currentPruned + node.children.reduce((sum, child) => sum + getPrunedCount(child), 0);
  };

  const nodeCount = getNodeCount(tree);
  const prunedCount = getPrunedCount(tree);
  const efficiency = nodeCount > 0 ? ((prunedCount / nodeCount) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Nodes Evaluated</div>
            <div className="text-2xl font-bold text-blue-600">{nodeCount}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Nodes Pruned</div>
            <div className="text-2xl font-bold text-green-600">{prunedCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Pruning Efficiency</div>
            <div className="text-2xl font-bold text-purple-600">{efficiency}%</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Thinking Time</div>
            <div className="text-2xl font-bold text-orange-600">{thinkingTime}ms</div>
          </div>
        </div>

        {lastMove && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Last AI Move</div>
            <div className="text-lg font-semibold text-gray-800">
              Position ({lastMove.row}, {lastMove.col})
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Score: {tree?.score.toFixed(2) || 'N/A'}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Algorithm:</strong> Minimax with Alpha-Beta Pruning</p>
          <p><strong>Evaluation:</strong> Position value + winning lines</p>
          <p><strong>Optimization:</strong> Early termination on winning positions</p>
        </div>
      </div>
    </div>
  );
};