import { useMemo, useState } from 'react';
import type { InteractiveStory, StoryNode, EndingType, EndingRoute } from '@/types';
import { buildStoryTree } from '@/store/storyStore';
import { X, GitBranch, Star, Sparkles, Heart, CloudRain, HelpCircle, Route, Eye } from 'lucide-react';

interface StoryTreeProps {
  interactiveStory: InteractiveStory;
  visitedNodes: string[];
  currentNodeId: string;
  discoveredEndings: string[];
  endingRoutes: Record<string, EndingRoute>;
  onNodeClick?: (nodeId: string) => void;
  onViewEndingPath?: (endingNodeId: string) => void;
  onClose: () => void;
}

const getEndingColor = (type?: EndingType) => {
  switch (type) {
    case 'happy':
      return { bg: 'from-pink-400 to-rose-500', border: 'border-pink-400', icon: Heart, text: 'text-pink-600' };
    case 'sad':
      return { bg: 'from-blue-400 to-indigo-500', border: 'border-blue-400', icon: CloudRain, text: 'text-blue-600' };
    case 'neutral':
      return { bg: 'from-gray-400 to-gray-500', border: 'border-gray-400', icon: HelpCircle, text: 'text-gray-600' };
    case 'secret':
      return { bg: 'from-amber-400 to-yellow-500', border: 'border-amber-400', icon: Sparkles, text: 'text-amber-600' };
    default:
      return { bg: 'from-purple-400 to-fairy-purple', border: 'border-fairy-purple', icon: Star, text: 'text-fairy-purple' };
  }
};

const getNodeStyle = (node: StoryNode, isVisited: boolean, isCurrent: boolean, isOnPath: boolean) => {
  if (isCurrent) {
    return {
      bg: 'bg-gradient-to-br from-fairy-purple to-fairy-pink',
      border: 'border-2 border-fairy-purple',
      shadow: 'shadow-lg shadow-fairy-purple/40',
      text: 'text-white',
      scale: 'scale-110',
    };
  }
  if (isOnPath && isVisited) {
    return {
      bg: 'bg-gradient-to-br from-fairy-purple/30 to-fairy-pink/30',
      border: 'border-2 border-fairy-purple/60',
      shadow: 'shadow-md',
      text: 'text-gray-800',
      scale: 'scale-100',
    };
  }
  if (isVisited) {
    return {
      bg: 'bg-white',
      border: 'border-2 border-green-400',
      shadow: 'shadow-sm',
      text: 'text-gray-700',
      scale: 'scale-100',
    };
  }
  return {
    bg: 'bg-gray-100',
    border: 'border-2 border-gray-300',
    shadow: 'shadow-none',
    text: 'text-gray-400',
    scale: 'scale-100',
  };
};

export default function StoryTree({
  interactiveStory,
  visitedNodes,
  currentNodeId,
  discoveredEndings,
  endingRoutes,
  onNodeClick,
  onViewEndingPath,
  onClose,
}: StoryTreeProps) {
  const treeData = useMemo(
    () => buildStoryTree(interactiveStory, visitedNodes, currentNodeId),
    [interactiveStory, visitedNodes, currentNodeId]
  );

  const { positioned, nodesByLevel, maxLevel, currentPath, visitedSet, nodes } = treeData;

  const paddingX = 120;
  const paddingY = 80;
  const nodeWidth = 140;
  const nodeHeight = 70;

  const allPositions = Object.values(positioned);
  const minX = Math.min(...allPositions.map((p) => p.x)) - paddingX;
  const maxX = Math.max(...allPositions.map((p) => p.x)) + paddingX;
  const minY = 0 - paddingY;
  const maxY = maxLevel * 100 + paddingY;

  const width = maxX - minX;
  const height = maxY - minY;

  const endings = Object.values(nodes).filter((n) => n.type === 'ending');
  const totalEndings = endings.length;
  const foundEndings = discoveredEndings.length;

  const renderLines = () => {
    const lines: JSX.Element[] = [];
    Object.entries(nodes).forEach(([nodeId, node]) => {
      if (node.choices) {
        node.choices.forEach((choice) => {
          const from = positioned[nodeId];
          const to = positioned[choice.nextNodeId];
          if (from && to) {
            const fromX = from.x - minX + nodeWidth / 2;
            const fromY = from.y - minY + nodeHeight;
            const toX = to.x - minX + nodeWidth / 2;
            const toY = to.y - minY;
            const midY = (fromY + toY) / 2;
            const isOnPath = currentPath.has(nodeId) && currentPath.has(choice.nextNodeId);
            const isVisitedPath = visitedSet.has(nodeId) && visitedSet.has(choice.nextNodeId);
            let strokeColor = '#e5e7eb';
            let strokeWidth = 2;
            if (isOnPath) {
              strokeColor = '#A855F7';
              strokeWidth = 3;
            } else if (isVisitedPath) {
              strokeColor = '#4ade80';
              strokeWidth = 2;
            }
            lines.push(
              <path
                key={`${nodeId}-${choice.nextNodeId}`}
                d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isOnPath ? 'none' : isVisitedPath ? 'none' : '5,5'}
                className="transition-all duration-300"
              />
            );
          }
        });
      }
    });
    return lines;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="fairy-card w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-fairy-purple/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-fairy flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-fairy text-gray-800">剧情探索地图</h3>
              <p className="text-sm text-gray-500 font-body">
                已探索 {visitedNodes.length} 个剧情节点 · 已发现 {foundEndings}/{totalEndings} 个结局
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 p-4 border-b border-fairy-purple/10 bg-fairy-purple/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-fairy-purple to-fairy-pink shadow-md" />
            <span className="text-sm font-body text-gray-600">当前节点</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border-2 border-green-400" />
            <span className="text-sm font-body text-gray-600">已探索</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-fairy-purple/30 to-fairy-pink/30 border-2 border-fairy-purple/60" />
            <span className="text-sm font-body text-gray-600">当前路径</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gray-100 border-2 border-gray-300" />
            <span className="text-sm font-body text-gray-600">未探索</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-body text-gray-600">快乐结局</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-body text-gray-600">悲伤结局</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-body text-gray-600">普通结局</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-body text-gray-600">隐藏结局</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="relative w-full h-full flex items-center justify-center min-h-[500px]">
            <svg
              width={width}
              height={height}
              className="mx-auto"
              style={{ minWidth: '100%' }}
            >
              {renderLines()}
            </svg>
            <div
              className="absolute inset-0 mx-auto"
              style={{ width: `${width}px`, maxWidth: '100%' }}
            >
              {Object.entries(positioned).map(([nodeId, pos]) => {
                const node = nodes[nodeId];
                if (!node) return null;
                const isVisited = visitedSet.has(nodeId);
                const isCurrent = nodeId === currentNodeId;
                const isOnPath = currentPath.has(nodeId);
                const style = getNodeStyle(node, isVisited, isCurrent, isOnPath);
                const isEnding = node.type === 'ending';
                const endingStyle = isEnding ? getEndingColor(node.endingType) : null;
                const EndingIcon = endingStyle?.icon || Star;
                const hasRoute = endingRoutes[nodeId];

                return (
                  <div
                    key={nodeId}
                    className={`absolute rounded-xl p-3 cursor-pointer transition-all duration-300 group ${style.bg} ${style.border} ${style.shadow} ${style.scale} hover:scale-105 hover:shadow-lg`}
                    style={{
                      left: `${pos.x - minX}px`,
                      top: `${pos.y - minY}px`,
                      width: `${nodeWidth}px`,
                      height: `${nodeHeight}px`,
                    }}
                    onClick={() => onNodeClick?.(nodeId)}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {isEnding ? (
                        <>
                          <div className={`${endingStyle?.bg} w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-md`}>
                            <EndingIcon className="w-4 h-4 text-white" />
                          </div>
                          {isVisited ? (
                            <p className={`text-xs font-body text-center leading-tight ${style.text} font-medium`}>
                              {node.endingTitle}
                            </p>
                          ) : (
                            <p className="text-xs font-body text-center text-gray-400">???</p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-current mb-1 opacity-60" />
                          <p className={`text-xs font-body text-center leading-tight ${style.text}`}>
                            {isVisited ? (node.content.length > 15 ? node.content.slice(0, 15) + '...' : node.content) : '???'}
                          </p>
                        </>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fairy-gold flex items-center justify-center shadow-md">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {isEnding && discoveredEndings.includes(nodeId) && !isCurrent && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                    {isEnding && hasRoute && (
                      <button
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white text-[10px] font-body flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md whitespace-nowrap ${endingStyle?.bg}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewEndingPath?.(nodeId);
                        }}
                      >
                        <Route className="w-3 h-3" />
                        查看路线
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-fairy-purple/20 bg-fairy-purple/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-body text-gray-500">
              点击节点可以快速跳转到该剧情（需要已探索过）
            </p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100">
                <Heart className="w-4 h-4 text-pink-500 fill-current" />
                <span className="text-sm font-body text-pink-700">
                  {endings.filter((e) => e.endingType === 'happy' && discoveredEndings.includes(e.id)).length}/
                  {endings.filter((e) => e.endingType === 'happy').length}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-body text-blue-700">
                  {endings.filter((e) => e.endingType === 'sad' && discoveredEndings.includes(e.id)).length}/
                  {endings.filter((e) => e.endingType === 'sad').length}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-body text-gray-700">
                  {endings.filter((e) => e.endingType === 'neutral' && discoveredEndings.includes(e.id)).length}/
                  {endings.filter((e) => e.endingType === 'neutral').length}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-body text-amber-700">
                  {endings.filter((e) => e.endingType === 'secret' && discoveredEndings.includes(e.id)).length}/
                  {endings.filter((e) => e.endingType === 'secret').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
