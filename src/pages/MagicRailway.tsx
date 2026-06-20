import React, { useState, useEffect, useMemo } from 'react';
import {
  Map,
  Train,
  Building2,
  Gem,
  History,
  Package,
  Hammer,
  Play,
  ChevronRight,
  Star,
  Clock,
  Users,
  Box,
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  MapPin,
} from 'lucide-react';
import { useStoryStore } from '@/store/storyStore';
import {
  getStationById,
  getRouteById,
  getEventById,
} from '@/data/railway';
import type { RailwayTab, RailwayStation, RailwayRoute, MagicTrain, RailwayEvent, ActiveRailwayEvent } from '@/types';

const TAB_CONFIG: { id: RailwayTab; label: string; icon: React.ReactNode }[] = [
  { id: 'map', label: '铁路地图', icon: <Map className="w-4 h-4" /> },
  { id: 'stations', label: '车站管理', icon: <Building2 className="w-4 h-4" /> },
  { id: 'trains', label: '列车调度', icon: <Train className="w-4 h-4" /> },
  { id: 'events', label: '事件记录', icon: <History className="w-4 h-4" /> },
  { id: 'resources', label: '资源仓库', icon: <Package className="w-4 h-4" /> },
  { id: 'build', label: '建设规划', icon: <Hammer className="w-4 h-4" /> },
];

const RESOURCE_ICONS: Record<string, string> = {
  '旅客': '👥',
  '魔法晶石': '💎',
  '故事素材': '📖',
  '魔法材料': '✨',
  '稀有矿石': '⛏️',
  '魔法道具': '🎁',
  '食物': '🍞',
  '魔法书籍': '📚',
};

const RailwayMap: React.FC = () => {
  const {
    railwayStations,
    railwayRoutes,
    railwayProgress,
    buildStation,
    buildRoute,
    canBuildStation,
    canBuildRoute,
    selectedTrainId,
    setSelectedTrainId,
  } = useStoryStore();

  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const builtStations = useMemo(() => {
    return railwayStations.filter(s =>
      railwayProgress.builtStations.has(s.id) || s.built
    );
  }, [railwayStations, railwayProgress.builtStations]);

  const builtRoutes = useMemo(() => {
    return railwayRoutes.filter(r =>
      railwayProgress.builtRoutes.has(r.id) || r.built
    );
  }, [railwayRoutes, railwayProgress.builtRoutes]);

  const getStationPosition = (stationId: string) => {
    const station = getStationById(stationId);
    if (!station) return { x: 0, y: 0 };
    return { x: station.x, y: station.y };
  };

  const getTrainPositionOnRoute = (train: MagicTrain) => {
    if (train.status !== '行驶中' || !train.routeId || !train.departureTime || !train.arrivalTime) {
      const station = getStationById(train.currentStationId);
      return station ? { x: station.x, y: station.y, angle: 0 } : null;
    }

    const route = getRouteById(train.routeId);
    if (!route) return null;

    const now = Date.now();
    const totalDuration = train.arrivalTime - train.departureTime;
    const elapsed = now - train.departureTime;
    const progress = Math.min(1, elapsed / totalDuration);

    const start = getStationPosition(route.startStationId);
    const end = getStationPosition(route.endStationId);

    const isAtStart = train.currentStationId === route.startStationId;
    const from = isAtStart ? start : end;
    const to = isAtStart ? end : start;

    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

    return { x, y, angle };
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl overflow-hidden border border-purple-500/20">
      <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="stationGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {railwayRoutes.map(route => {
          const start = getStationPosition(route.startStationId);
          const end = getStationPosition(route.endStationId);
          const isBuilt = railwayProgress.builtRoutes.has(route.id) || route.built;
          const canBuild = canBuildRoute(route.id);
          const isHovered = hoveredRoute === route.id;

          return (
            <g key={route.id}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isBuilt ? 'url(#routeGradient)' : '#475569'}
                strokeWidth={isHovered ? 4 : isBuilt ? 3 : 2}
                strokeDasharray={isBuilt ? 'none' : '8,4'}
                opacity={isBuilt ? 1 : 0.4}
                className="cursor-pointer transition-all duration-300"
                filter={isBuilt && isHovered ? 'url(#glow)' : undefined}
                onMouseEnter={() => setHoveredRoute(route.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => {
                  if (!isBuilt && canBuild) {
                    buildRoute(route.id);
                  }
                }}
              />
              {isHovered && (
                <g>
                  <rect
                    x={(start.x + end.x) / 2 - 80}
                    y={(start.y + end.y) / 2 - 40}
                    width="160"
                    height="70"
                    rx="8"
                    fill="#1E1B4B"
                    stroke="#A78BFA"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 20}
                    textAnchor="middle"
                    fill="#E9D5FF"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {route.name}
                  </text>
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 2}
                    textAnchor="middle"
                    fill="#C4B5FD"
                    fontSize="10"
                  >
                    {route.distance}公里 · {route.travelTime}秒
                  </text>
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 + 15}
                    textAnchor="middle"
                    fill={isBuilt ? '#4ADE80' : canBuild ? '#FBBF24' : '#94A3B8'}
                    fontSize="10"
                  >
                    {isBuilt ? '✓ 已建设' : canBuild ? `💎 ${route.buildCost} 建设` : '🔒 需先建设车站'}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {railwayStations.map(station => {
          const isBuilt = railwayProgress.builtStations.has(station.id) || station.built;
          const canBuild = canBuildStation(station.id);
          const isHovered = hoveredStation === station.id;
          const isSelected = selectedStation === station.id;
          const upgradeLevel = railwayProgress.stationUpgrades[station.id] || 1;

          return (
            <g
              key={station.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredStation(station.id)}
              onMouseLeave={() => setHoveredStation(null)}
              onClick={() => {
                if (!isBuilt && canBuild) {
                  buildStation(station.id);
                } else {
                  setSelectedStation(isSelected ? null : station.id);
                }
              }}
            >
              <circle
                cx={station.x}
                cy={station.y}
                r={isHovered || isSelected ? 18 : 14}
                fill={isBuilt ? station.color : '#475569'}
                opacity={isBuilt ? 1 : 0.5}
                filter={isBuilt ? 'url(#stationGlow)' : undefined}
                className="transition-all duration-300"
                stroke={isSelected ? '#FBBF24' : isBuilt ? '#fff' : 'none'}
                strokeWidth={isSelected ? 3 : isBuilt ? 2 : 0}
              />
              <text
                x={station.x}
                y={station.y + 5}
                textAnchor="middle"
                fontSize={isHovered || isSelected ? 18 : 14}
                className="pointer-events-none select-none"
              >
                {station.icon}
              </text>
              {isBuilt && upgradeLevel > 1 && (
                <g>
                  <circle
                    cx={station.x + 10}
                    cy={station.y - 10}
                    r="8"
                    fill="#FBBF24"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={station.x + 10}
                    y={station.y - 7}
                    textAnchor="middle"
                    fill="#1F2937"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {upgradeLevel}
                  </text>
                </g>
              )}
              {isHovered && (
                <g>
                  <rect
                    x={station.x - 90}
                    y={station.y + 25}
                    width="180"
                    height={isBuilt ? 70 : 60}
                    rx="8"
                    fill="#1E1B4B"
                    stroke={station.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={station.x}
                    y={station.y + 42}
                    textAnchor="middle"
                    fill={station.color}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {station.name}
                  </text>
                  <text
                    x={station.x}
                    y={station.y + 58}
                    textAnchor="middle"
                    fill="#C4B5FD"
                    fontSize="10"
                  >
                    {station.type} · {station.region}
                  </text>
                  {isBuilt ? (
                    <text
                      x={station.x}
                      y={station.y + 75}
                      textAnchor="middle"
                      fill="#4ADE80"
                      fontSize="10"
                    >
                      ✓ 容量 {station.capacity * upgradeLevel}
                    </text>
                  ) : (
                    <text
                      x={station.x}
                      y={station.y + 75}
                      textAnchor="middle"
                      fill={canBuild ? '#FBBF24' : '#94A3B8'}
                      fontSize="10"
                    >
                      {canBuild ? `💎 ${station.buildCost} 建设` : '🔒 未解锁'}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {railwayProgress.trains.map(train => {
          const pos = getTrainPositionOnRoute(train);
          if (!pos) return null;
          const isSelected = selectedTrainId === train.id;

          return (
            <g
              key={train.id}
              transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`}
              className="cursor-pointer"
              onClick={() => setSelectedTrainId(isSelected ? null : train.id)}
            >
              {train.status === '行驶中' && (
                <ellipse
                  cx="0"
                  cy="0"
                  rx="25"
                  ry="15"
                  fill="url(#routeGradient)"
                  opacity="0.3"
                  filter="url(#glow)"
                />
              )}
              <rect
                x={isSelected ? -14 : -12}
                y={isSelected ? -9 : -7}
                width={isSelected ? 28 : 24}
                height={isSelected ? 18 : 14}
                rx="3"
                fill={train.color}
                stroke={isSelected ? '#FBBF24' : '#fff'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-200"
              />
              <rect
                x={isSelected ? 14 : 12}
                y={isSelected ? -5 : -3}
                width="8"
                height={isSelected ? 10 : 6}
                rx="2"
                fill={train.color}
                stroke="#fff"
                strokeWidth="1"
              />
              <circle cx="-8" cy="-2" r="2" fill="#FBBF24" />
              <circle cx="0" cy="-2" r="2" fill="#FBBF24" />
              {isSelected && (
                <g transform={`rotate(${-pos.angle})`}>
                  <rect
                    x="-60"
                    y="-50"
                    width="120"
                    height="35"
                    rx="6"
                    fill="#1E1B4B"
                    stroke={train.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="-32"
                    textAnchor="middle"
                    fill={train.color}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {train.name}
                  </text>
                  <text
                    x="0"
                    y="-18"
                    textAnchor="middle"
                    fill={train.status === '行驶中' ? '#4ADE80' : '#C4B5FD'}
                    fontSize="9"
                  >
                    {train.status === '行驶中' ? '🚂 行驶中' : '⏸ 停靠中'}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
        <div className="text-sm text-purple-200 mb-2 font-semibold">图例说明</div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded" />
            <span className="text-slate-300">已建设路线</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 border-t-2 border-dashed border-slate-500" />
            <span className="text-slate-400">未建设路线</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-white" />
            <span className="text-slate-300">已建设车站</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-600" />
            <span className="text-slate-400">未建设车站</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 min-w-[180px]">
        <div className="text-sm text-purple-200 mb-2 font-semibold">铁路网络</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">铁路等级</span>
            <span className="text-yellow-400 font-bold">Lv.{railwayProgress.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">已建设车站</span>
            <span className="text-green-400">{builtStations.length}/{railwayStations.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">已建设路线</span>
            <span className="text-green-400">{builtRoutes.length}/{railwayRoutes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">魔法晶石</span>
            <span className="text-cyan-400 font-bold">💎 {railwayProgress.magicCrystals}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StationPanel: React.FC = () => {
  const {
    railwayStations,
    railwayProgress,
    buildStation,
    upgradeStation,
    canBuildStation,
  } = useStoryStore();

  const [filter, setFilter] = useState<'all' | 'built' | 'unbuilt'>('all');

  const filteredStations = useMemo(() => {
    return railwayStations.filter(s => {
      const isBuilt = railwayProgress.builtStations.has(s.id) || s.built;
      if (filter === 'built') return isBuilt;
      if (filter === 'unbuilt') return !isBuilt;
      return true;
    });
  }, [railwayStations, railwayProgress.builtStations, filter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['all', 'built', 'unbuilt'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? '全部' : f === 'built' ? '已建设' : '待建设'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map(station => {
          const isBuilt = railwayProgress.builtStations.has(station.id) || station.built;
          const canBuild = canBuildStation(station.id);
          const upgradeLevel = railwayProgress.stationUpgrades[station.id] || 1;
          const upgradeCost = Math.floor(station.buildCost * upgradeLevel * 0.5);

          return (
            <div
              key={station.id}
              className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${
                isBuilt ? 'border-purple-500/30' : 'border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: station.color + '30', border: `2px solid ${station.color}` }}
                >
                  {station.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{station.name}</h3>
                  <p className="text-xs text-slate-400">{station.type} · {station.region}</p>
                  {isBuilt && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Lv.{upgradeLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3 line-clamp-2">{station.description}</p>

              {station.specialFeature && (
                <div className="bg-purple-500/10 rounded-lg p-2 mb-3 border border-purple-500/20">
                  <p className="text-xs text-purple-300">
                    <span className="font-semibold">✨ 特殊功能：</span>
                    {station.specialFeature}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-400 mb-4">
                <div className="flex justify-between">
                  <span>容量</span>
                  <span className="text-white">{station.capacity * upgradeLevel} 人</span>
                </div>
                {isBuilt && (
                  <div className="flex justify-between">
                    <span>连接路线</span>
                    <span className="text-purple-400">{station.connectedStationIds.length} 条</span>
                  </div>
                )}
                {station.storyIds && station.storyIds.length > 0 && (
                  <div className="flex justify-between">
                    <span>关联故事</span>
                    <span className="text-amber-400">{station.storyIds.length} 个</span>
                  </div>
                )}
              </div>

              {isBuilt ? (
                <button
                  onClick={() => upgradeStation(station.id)}
                  disabled={railwayProgress.magicCrystals < upgradeCost || upgradeLevel >= 5}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-sm font-medium hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {upgradeLevel >= 5 ? '已满级' : `升级 (💎 ${upgradeCost})`}
                </button>
              ) : (
                <button
                  onClick={() => buildStation(station.id)}
                  disabled={!canBuild}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    canBuild
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  {canBuild ? `建设 (💎 ${station.buildCost})` : station.unlockCondition || '未解锁'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrainPanel: React.FC = () => {
  const {
    railwayProgress,
    railwayRoutes,
    startTrain,
    completeTrainJourney,
    repairTrain,
    selectedTrainId,
    setSelectedTrainId,
    getAvailableRoutesForStation,
  } = useStoryStore();

  const [selectedRouteForTrain, setSelectedRouteForTrain] = useState<Record<string, string>>({});

  const getTrainProgress = (train: MagicTrain) => {
    if (train.status !== '行驶中' || !train.departureTime || !train.arrivalTime) return 0;
    const now = Date.now();
    const total = train.arrivalTime - train.departureTime;
    const elapsed = now - train.departureTime;
    return Math.min(100, (elapsed / total) * 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      railwayProgress.trains.forEach(train => {
        if (train.status === '行驶中' && train.arrivalTime && Date.now() >= train.arrivalTime) {
          completeTrainJourney(train.id);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [railwayProgress.trains, completeTrainJourney]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {railwayProgress.trains.map(train => {
          const isSelected = selectedTrainId === train.id;
          const progress = getTrainProgress(train);
          const currentStation = getStationById(train.currentStationId);
          const nextStation = train.nextStationId ? getStationById(train.nextStationId) : null;
          const availableRoutes = train.status === '停靠' ? getAvailableRoutesForStation(train.currentStationId) : [];
          const selectedRoute = selectedRouteForTrain[train.id];

          return (
            <div
              key={train.id}
              className={`bg-slate-800/50 rounded-xl p-5 border transition-all ${
                isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-slate-700'
              }`}
              onClick={() => setSelectedTrainId(isSelected ? null : train.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: train.color + '30', border: `2px solid ${train.color}` }}
                >
                  🚂
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">{train.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        train.status === '行驶中'
                          ? 'bg-green-500/20 text-green-400'
                          : train.status === '维修中'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {train.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{train.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{train.passengers.length}</div>
                  <div className="text-xs text-slate-400">旅客</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {train.cargo.reduce((s, c) => s + c.amount, 0)}
                  </div>
                  <div className="text-xs text-slate-400">货物</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{train.speed}km/h</div>
                  <div className="text-xs text-slate-400">时速</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">当前：</span>
                  <span className="text-white font-medium">{currentStation?.name || '未知'}</span>
                </div>
                {nextStation && (
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">前往：</span>
                    <span className="text-white font-medium">{nextStation.name}</span>
                  </div>
                )}
              </div>

              {train.status === '行驶中' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">行程进度</span>
                    <span className="text-purple-400 font-medium">{Math.floor(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {train.status === '停靠' && availableRoutes.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">选择路线</label>
                    <select
                      value={selectedRoute || ''}
                      onChange={e => setSelectedRouteForTrain({ ...selectedRouteForTrain, [train.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="">-- 请选择目的地 --</option>
                      {availableRoutes.map(route => {
                        const destId = route.startStationId === train.currentStationId ? route.endStationId : route.startStationId;
                        const dest = getStationById(destId);
                        return (
                          <option key={route.id} value={route.id}>
                            {dest?.name} ({route.travelTime}秒)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedRoute) {
                        startTrain(train.id, selectedRoute);
                        setSelectedRouteForTrain({ ...selectedRouteForTrain, [train.id]: '' });
                      }
                    }}
                    disabled={!selectedRoute}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    发车
                  </button>
                </div>
              )}

              {train.status === '维修中' && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    repairTrain(train.id);
                  }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:from-amber-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  维修列车
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventPanel: React.FC = () => {
  const {
    railwayProgress,
    currentRailwayEvent,
    resolveRailwayEvent,
    closeRailwayEvent,
  } = useStoryStore();

  const eventDetails = currentRailwayEvent ? getEventById(currentRailwayEvent.eventId) : null;

  return (
    <div className="space-y-4">
      {eventDetails && (
        <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-2xl p-6 border border-amber-500/30 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{eventDetails.emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      eventDetails.type === '奇遇'
                        ? 'bg-purple-500/20 text-purple-400'
                        : eventDetails.type === '故事触发'
                        ? 'bg-amber-500/20 text-amber-400'
                        : eventDetails.type === '资源奖励'
                        ? 'bg-green-500/20 text-green-400'
                        : eventDetails.type === '角色相遇'
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {eventDetails.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(currentRailwayEvent.startTime).toLocaleString('zh-CN')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{eventDetails.title}</h3>
              </div>
            </div>
            <button
              onClick={closeRailwayEvent}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <p className="text-slate-200 mb-6 leading-relaxed">{eventDetails.description}</p>

          {eventDetails.rewards && eventDetails.rewards.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                奖励预览
              </h4>
              <div className="flex flex-wrap gap-2">
                {eventDetails.rewards.map((reward, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-300"
                  >
                    {reward.type === '资源' && `${RESOURCE_ICONS[reward.item || ''] || '📦'} ${reward.item} +${reward.amount}`}
                    {reward.type === '经验' && `⭐ 经验 +${reward.amount}`}
                    {reward.type === '故事' && `📖 解锁故事`}
                    {reward.type === '角色' && `👤 遇见角色`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {eventDetails.choices && eventDetails.choices.length > 0 ? (
            <div className="space-y-2">
              {eventDetails.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => resolveRailwayEvent(eventDetails.id, choice.id)}
                  className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium group-hover:text-amber-300 transition-colors">
                      {choice.text}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => resolveRailwayEvent(eventDetails.id)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:from-amber-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              领取奖励
            </button>
          )}
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          历史事件记录
        </h3>
        {railwayProgress.eventHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无事件记录</p>
            <p className="text-sm">让列车在路线上行驶来触发随机事件吧！</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {railwayProgress.eventHistory.map((record, idx) => {
              const event = getEventById(record.eventId);
              if (!event) return null;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div className="text-2xl">{event.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{event.title}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${
                          event.type === '资源奖励'
                            ? 'bg-green-500/20 text-green-400'
                            : event.type === '故事触发'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    {record.outcome && (
                      <p className="text-sm text-slate-400">{record.outcome}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(record.timestamp).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ResourcePanel: React.FC = () => {
  const { railwayProgress } = useStoryStore();

  const resources = Object.entries(railwayProgress.resources) as [string, number][];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl p-5 border border-cyan-500/30">
          <div className="text-3xl mb-2">💎</div>
          <div className="text-2xl font-bold text-cyan-400">{railwayProgress.magicCrystals}</div>
          <div className="text-sm text-slate-400">魔法晶石</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-xl p-5 border border-purple-500/30">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-purple-400">Lv.{railwayProgress.level}</div>
          <div className="text-sm text-slate-400">铁路等级</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-5 border border-green-500/30">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-green-400">{railwayProgress.totalPassengersTransported}</div>
          <div className="text-sm text-slate-400">累计运送旅客</div>
        </div>
        <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-5 border border-amber-500/30">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-amber-400">{railwayProgress.totalResourcesTransported}</div>
          <div className="text-sm text-slate-400">累计运送资源</div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          资源仓库
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {resources.map(([type, amount]) => (
            <div
              key={type}
              className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-purple-500/30 transition-colors"
            >
              <div className="text-2xl mb-2">{RESOURCE_ICONS[type] || '📦'}</div>
              <div className="text-xl font-bold text-white">{amount}</div>
              <div className="text-sm text-slate-400">{type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">已遇见角色</h4>
          <div className="text-3xl font-bold text-pink-400">
            {railwayProgress.encounteredCharacters.size}
          </div>
          <p className="text-xs text-slate-500 mt-1">在旅途中相遇的故事角色</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">已完成支线故事</h4>
          <div className="text-3xl font-bold text-amber-400">
            {railwayProgress.completedSideStories.size}
          </div>
          <p className="text-xs text-slate-500 mt-1">通过事件触发的独特故事</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">已发现秘密</h4>
          <div className="text-3xl font-bold text-cyan-400">
            {railwayProgress.discoveredSecrets.size}
          </div>
          <p className="text-xs text-slate-500 mt-1">隐藏在铁路网中的神秘彩蛋</p>
        </div>
      </div>
    </div>
  );
};

const BuildPanel: React.FC = () => {
  const {
    railwayStations,
    railwayRoutes,
    railwayProgress,
    buildStation,
    buildRoute,
    canBuildStation,
    canBuildRoute,
  } = useStoryStore();

  const unbuiltStations = railwayStations.filter(
    s => !(railwayProgress.builtStations.has(s.id) || s.built)
  );
  const unbuiltRoutes = railwayRoutes.filter(
    r => !(railwayProgress.builtRoutes.has(r.id) || r.built)
  );

  const totalStationCost = unbuiltStations.reduce((sum, s) => sum + s.buildCost, 0);
  const totalRouteCost = unbuiltRoutes.reduce((sum, r) => sum + r.buildCost, 0);
  const totalCost = totalStationCost + totalRouteCost;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Hammer className="w-6 h-6" />
          建设总览
        </h3>
        <p className="text-slate-300 mb-4">规划和建设您的魔法铁路网络</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">待建车站</div>
            <div className="text-2xl font-bold text-white">
              {unbuiltStations.length}
              <span className="text-sm text-slate-500 ml-1">/ {railwayStations.length}</span>
            </div>
            <div className="text-xs text-amber-400 mt-1">💎 预计 {totalStationCost}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">待建路线</div>
            <div className="text-2xl font-bold text-white">
              {unbuiltRoutes.length}
              <span className="text-sm text-slate-500 ml-1">/ {railwayRoutes.length}</span>
            </div>
            <div className="text-xs text-amber-400 mt-1">💎 预计 {totalRouteCost}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">当前晶石</div>
            <div className="text-2xl font-bold text-cyan-400">
              💎 {railwayProgress.magicCrystals}
            </div>
            <div className={`text-xs mt-1 ${railwayProgress.magicCrystals >= totalCost ? 'text-green-400' : 'text-red-400'}`}>
              {railwayProgress.magicCrystals >= totalCost ? '✓ 足够完成全部建设' : `还需 💎 ${totalCost - railwayProgress.magicCrystals}`}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">建设优先级推荐</h3>
        <div className="space-y-3">
          {unbuiltStations
            .filter(s => canBuildStation(s.id))
            .slice(0, 5)
            .map(station => (
              <div
                key={station.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: station.color + '30' }}
                  >
                    {station.icon}
                  </div>
                  <div>
                    <div className="text-white font-medium">{station.name}</div>
                    <div className="text-xs text-slate-400">{station.type} · {station.region}</div>
                  </div>
                </div>
                <button
                  onClick={() => buildStation(station.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  <Hammer className="w-4 h-4" />
                  💎 {station.buildCost}
                </button>
              </div>
            ))}

          {unbuiltRoutes
            .filter(r => canBuildRoute(r.id))
            .slice(0, 5)
            .map(route => {
              const start = getStationById(route.startStationId);
              const end = getStationById(route.endStationId);
              return (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Train className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {start?.icon} {start?.name} → {end?.icon} {end?.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {route.distance}公里 · {route.travelTime}秒 · 事件几率 {(route.eventChance * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => buildRoute(route.id)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                  >
                    <Hammer className="w-4 h-4" />
                    💎 {route.buildCost}
                  </button>
                </div>
              );
            })}

          {unbuiltStations.filter(s => canBuildStation(s.id)).length === 0 &&
           unbuiltRoutes.filter(r => canBuildRoute(r.id)).length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无可以建设的项目</p>
              <p className="text-sm">请先建设必要的前置车站或获取更多魔法晶石</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MagicRailway: React.FC = () => {
  const { selectedRailwayTab, setSelectedRailwayTab, railwayProgress } = useStoryStore();

  const expForNextLevel = railwayProgress.level * 500;
  const expProgress = (railwayProgress.experience / expForNextLevel) * 100;

  const renderContent = () => {
    switch (selectedRailwayTab) {
      case 'map':
        return <RailwayMap />;
      case 'stations':
        return <StationPanel />;
      case 'trains':
        return <TrainPanel />;
      case 'events':
        return <EventPanel />;
      case 'resources':
        return <ResourcePanel />;
      case 'build':
        return <BuildPanel />;
      default:
        return <RailwayMap />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🚂</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                魔法铁路网络
              </h1>
              <p className="text-slate-400">建设连接各个童话王国的魔法列车线路</p>
            </div>
          </div>

          <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">铁路等级 Lv.{railwayProgress.level}</span>
              </div>
              <span className="text-sm text-purple-400">
                {railwayProgress.experience} / {expForNextLevel} EXP
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-1.5 mb-6 border border-slate-700 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedRailwayTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedRailwayTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MagicRailway;
