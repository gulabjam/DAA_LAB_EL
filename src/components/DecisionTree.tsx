import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MinimaxNode } from '../types/game';
import Tree from 'react-d3-tree';

interface DecisionTreeProps {
  tree: MinimaxNode | null;
  maxDepth: number;
}

interface TreeNodeProps {
  node: MinimaxNode;
  isExpanded: boolean;
  onToggle: () => void;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isExpanded, onToggle, level }) => {
  const getNodeColor = () => {
    if (node.pruned) return 'bg-gray-100 border-gray-300';
    if (node.bestMove) return 'bg-green-100 border-green-400';
    if (node.isMaximizing) return 'bg-blue-100 border-blue-300';
    return 'bg-slate-100 border-slate-300';
  };

  const getScoreColor = () => {
    if (node.pruned) return 'text-gray-500';
    if (node.bestMove) return 'text-green-700';
    return 'text-gray-800';
  };

  return (
    <div className={`ml-${level * 4}`}>
      <div
        className={`
          p-3 rounded-lg border-2 mb-2 transition-all duration-200 cursor-pointer
          ${getNodeColor()}
          hover:shadow-md
        `}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {node.children.length > 0 && (
              <div className="text-gray-500">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
            <span className="font-medium text-gray-700">
              {node.move ? `Move (${node.move.row},${node.move.col})` : 'Root (AI Turn)'}
              {node.bestMove && ' ✓'}
              {node.pruned && ' (Pruned)'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`font-bold ${getScoreColor()}`}>
              Score: {node.score.toFixed(2)}
            </span>
            <span className="text-gray-500">Depth: {node.depth}</span>
            {!node.pruned && (
              <span className="text-xs text-gray-400">
                α={node.alpha === -Infinity ? '-∞' : node.alpha.toFixed(1)}, 
                β={node.beta === Infinity ? '+∞' : node.beta.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate positions for each node in the tree
interface PositionedNode extends MinimaxNode {
  x: number;
  y: number;
  children: PositionedNode[];
}

const NODE_WIDTH = 60;
const NODE_HEIGHT = 40;
const HORIZONTAL_SPACING = 100; // Increased for more horizontal space
const VERTICAL_SPACING = 80;

function layoutTree(node: MinimaxNode, depth = 0, xOffset = 0): [PositionedNode, number] {
  if (!node.children.length) {
    return [{ ...node, x: xOffset, y: depth * VERTICAL_SPACING, children: [] }, xOffset + NODE_WIDTH + HORIZONTAL_SPACING];
  }
  let x = xOffset;
  const children: PositionedNode[] = [];
  for (const child of node.children) {
    const [childNode, nextX] = layoutTree(child, depth + 1, x);
    children.push(childNode);
    x = nextX;
  }
  // Center parent above its children
  const minX = children[0].x;
  const maxX = children[children.length - 1].x;
  const parentX = (minX + maxX) / 2;
  return [
    { ...node, x: parentX, y: depth * VERTICAL_SPACING, children },
    x
  ];
}

function layoutTreeWithExpand(node: MinimaxNode, expandedNodes: Set<string>, depth = 0, xOffset = 0): [PositionedNode, number] {
  let children: PositionedNode[] = [];
  let x = xOffset;
  if (expandedNodes.has(node.id) && node.children.length) {
    for (const child of node.children) {
      const [childNode, nextX] = layoutTreeWithExpand(child, expandedNodes, depth + 1, x);
      children.push(childNode);
      x = nextX;
    }
  }
  if (!children.length) {
    return [{ ...node, x: xOffset, y: depth * VERTICAL_SPACING, children: [] }, xOffset + NODE_WIDTH + HORIZONTAL_SPACING];
  }
  // Center parent above its children
  const minX = children[0].x;
  const maxX = children[children.length - 1].x;
  const parentX = (minX + maxX) / 2;
  return [
    { ...node, x: parentX, y: depth * VERTICAL_SPACING, children },
    x
  ];
}

function getTreeWidth(node: PositionedNode): number {
  if (!node.children.length) return NODE_WIDTH;
  return node.children.reduce((sum, child) => sum + getTreeWidth(child) + HORIZONTAL_SPACING, -HORIZONTAL_SPACING);
}

function getTreeBounds(node: PositionedNode): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = node.x, maxX = node.x + NODE_WIDTH, minY = node.y, maxY = node.y + NODE_HEIGHT;
  for (const child of node.children) {
    const bounds = getTreeBounds(child);
    minX = Math.min(minX, bounds.minX);
    maxX = Math.max(maxX, bounds.maxX);
    minY = Math.min(minY, bounds.minY);
    maxY = Math.max(maxY, bounds.maxY);
  }
  return { minX, maxX, minY, maxY };
}

// Helper to convert your tree to react-d3-tree format
function convertToD3Tree(node: MinimaxNode, expandedNodes: Set<string>): any {
  const isExpanded = expandedNodes.has(node.id);
  return {
    name: node.move ? `(${node.move.row},${node.move.col})` : 'Root',
    attributes: {
      Score: node.score.toFixed(2),
      Depth: node.depth,
      Pruned: node.pruned ? 'Yes' : 'No',
      Best: node.bestMove ? '✓' : '',
    },
    _collapsed: !isExpanded,
    children: isExpanded ? node.children.map(child => convertToD3Tree(child, expandedNodes)) : [],
    raw: node,
  };
}

// Custom node rendering for react-d3-tree
const renderCustomNode = ({ nodeDatum, toggleNode }: any) => {
  const n = nodeDatum.raw;
  const fill = n.pruned ? '#f3f4f6' : n.bestMove ? '#bbf7d0' : n.isMaximizing ? '#dbeafe' : '#f1f5f9';
  const stroke = n.pruned ? '#d1d5db' : n.bestMove ? '#22c55e' : n.isMaximizing ? '#60a5fa' : '#94a3b8';
  return (
    <g onClick={toggleNode} style={{ cursor: n.children.length ? 'pointer' : 'default' }}>
      <rect x={-30} y={-20} width={60} height={40} rx={10} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={0} y={-2} textAnchor="middle" fontSize={12} fill="#222">
        {nodeDatum.name}
      </text>
      <text x={0} y={14} textAnchor="middle" fontSize={10} fill="#666">
        {n.score.toFixed(1)}
      </text>
      {n.children.length > 0 && (
        <text x={24} y={-10} fontSize={16} fill="#888" pointerEvents="none">
          {nodeDatum._collapsed ? '▶' : '▼'}
        </text>
      )}
    </g>
  );
};

export const DecisionTree: React.FC<DecisionTreeProps> = ({ tree, maxDepth }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['node-0']));
  const [expandAll, setExpandAll] = useState(false);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedNodes(new Set());
    } else {
      const allNodeIds = new Set<string>();
      const collectNodeIds = (node: MinimaxNode) => {
        allNodeIds.add(node.id);
        node.children.forEach(collectNodeIds);
      };
      if (tree) collectNodeIds(tree);
      setExpandedNodes(allNodeIds);
    }
    setExpandAll(!expandAll);
  };

  const renderNode = (node: MinimaxNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <div key={node.id}>
        <TreeNode
          node={node}
          isExpanded={isExpanded}
          onToggle={() => toggleNode(node.id)}
          level={level}
        />
        {isExpanded && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  // D3 tree rendering
  let d3Tree = null;
  let aiExplanation = null;
  let pruningExplanation = null;
  if (tree) {
    // Explanation for the root move
    let explanation = '';
    if (tree.move) {
      explanation = `AI chose move (${tree.move.row}, ${tree.move.col}) with score ${tree.score.toFixed(2)} because it maximizes its chance of winning or minimizes loss based on the minimax evaluation.`;
    } else {
      explanation = 'AI is evaluating possible moves using the minimax algorithm with alpha-beta pruning.';
    }
    aiExplanation = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
        <strong>AI Decision Explanation:</strong> {explanation}
      </div>
    );
    const alpha = tree.alpha === -Infinity ? '-∞' : tree.alpha.toFixed(2);
    const beta = tree.beta === Infinity ? '+∞' : tree.beta.toFixed(2);
    pruningExplanation = (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-900 text-sm">
        <strong>Alpha-Beta Pruning:</strong> At the root, <b>alpha</b> = {alpha}, <b>beta</b> = {beta}.<br/>
        Alpha is the best value that the maximizer currently can guarantee at that level or above. Beta is the best value that the minimizer currently can guarantee at that level or above. These values are updated as the tree is explored, and branches are pruned when alpha ≥ beta.
      </div>
    );
    const d3Data = convertToD3Tree(tree, expandedNodes);
    d3Tree = (
      <div style={{ width: '100%', height: 500 }} className="mb-6 border rounded-lg bg-gray-50 p-4">
        <Tree
          data={d3Data}
          orientation="vertical"
          translate={{ x: 300, y: 50 }}
          nodeSize={{ x: 120, y: 100 }}
          renderCustomNodeElement={renderCustomNode}
          collapsible={false}
          zoomable={true}
        />
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Decision Tree</h2>
        <p className="text-gray-500">Make a move to see the AI's decision process...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">AI Decision Tree</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleExpandAll}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>
      {aiExplanation}
      {pruningExplanation}
      <div className="mb-4 text-sm text-gray-600">
        <p>Minimax algorithm with alpha-beta pruning. Each node shows the evaluation score and best move.</p>
        <div className="mt-2 flex flex-wrap gap-4">
          <span><strong>Max Depth:</strong> {maxDepth}</span>
          <span><strong>Pruning:</strong> <span className="text-green-600">Enabled</span></span>
          <span><strong>Heuristic:</strong> Position + Lines</span>
          <span><strong>Win Condition:</strong> 4-in-a-row</span>
        </div>
      </div>
      {d3Tree}
      <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {renderNode(tree)}
      </div>
    </div>
  );
};