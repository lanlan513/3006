import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Clock,
  Trophy,
  History,
  Globe2,
  Zap,
  Shield,
  Star,
  Target,
  Gift,
  Crown,
  TrendingUp,
  Award,
  Calendar,
  Users,
  Swords,
  BookOpen,
  Gem,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore } from '@/store/storyStore';
import { getCosmicEventById } from '@/data/cosmicEvents';
import type { CosmicEventTab, CosmicEvent, ActiveCosmicEvent } from '@/types';
import { COSMIC_EVENT_SEVERITIES, RARITY_COLORS } from '@/types';

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

const getSeverityInfo = (severity: string) => {
  return COSMIC_EVENT_SEVERITIES.find((s) => s.severity === severity) || COSMIC_EVENT_SEVERITIES[0];
};

export default function CosmicEvents() {
  const selectedTab = useStoryStore((state) => state.selectedEventTab);
  const setSelectedTab = useStoryStore((state) => state.setSelectedEventTab);
  const activeEvents = useStoryStore((state) => state.activeEvents);
  const cosmicEvents = useStoryStore((state) => state.cosmicEvents);
  const worldState = useStoryStore((state) => state.worldState);
  const eventLeaderboard = useStoryStore((state) => state.eventLeaderboard);
  const eventHistory = useStoryStore((state) => state.eventHistory);
  const playerEventScore = useStoryStore((state) => state.playerEventScore);
  const playerEventsParticipated = useStoryStore((state) => state.playerEventsParticipated);
  const playerEventsCompleted = useStoryStore((state) => state.playerEventsCompleted);
  const triggerRandomEvent = useStoryStore((state) => state.triggerRandomEvent);
  const endEvent = useStoryStore((state) => state.endEvent);

  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs: { id: CosmicEventTab; label: string; icon: typeof Sparkles }[] = [
    { id: 'current', label: '当前事件', icon: Zap },
    { id: 'history', label: '历史记录', icon: History },
    { id: 'leaderboard', label: '事件排行', icon: Trophy },
    { id: 'worldState', label: '世界状态', icon: Globe2 },
  ];

  const activeEventsWithData = useMemo(() => {
    return activeEvents
      .map((ae) => {
        const event = getCosmicEventById(ae.eventId);
        return { activeEvent: ae, event };
      })
      .filter((item): item is { activeEvent: ActiveCosmicEvent; event: CosmicEvent } => item.event !== undefined);
  }, [activeEvents]);

  const handleTriggerEvent = () => {
    triggerRandomEvent();
  };

  const handleEndEvent = (eventId: string, outcome: 'success' | 'partial' | 'failure') => {
    endEvent(eventId, outcome);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fairy-purple/20 via-fairy-pink/20 to-fairy-gold/20 backdrop-blur-sm border border-fairy-purple/30 mb-4">
              <Sparkles className="w-4 h-4 text-fairy-purple animate-twinkle" />
              <span className="text-sm font-body text-fairy-purple">宇宙级动态系统</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-fairy text-gradient-fairy mb-3">
              童话宇宙事件
            </h1>
            <p className="text-gray-600 font-body max-w-xl mx-auto">
              童话世界不断演化，神秘事件周期性降临。参与事件，改变世界，书写属于你的传奇！
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="fairy-card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-fairy flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-fairy text-fairy-purple mb-1">{playerEventScore}</div>
              <div className="text-sm text-gray-500 font-body">事件积分</div>
            </div>
            <div className="fairy-card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-fairy text-amber-600 mb-1">{playerEventsParticipated}</div>
              <div className="text-sm text-gray-500 font-body">参与事件</div>
            </div>
            <div className="fairy-card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-fairy text-green-600 mb-1">{playerEventsCompleted}</div>
              <div className="text-sm text-gray-500 font-body">完成事件</div>
            </div>
            <div className="fairy-card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-fairy text-purple-600 mb-1">Lv.{worldState.worldLevel}</div>
              <div className="text-sm text-gray-500 font-body">世界等级</div>
            </div>
          </div>

          <div className="fairy-card p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-body text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-gradient-fairy text-white shadow-fairy'
                        : 'text-gray-600 hover:bg-fairy-purple/10 hover:text-fairy-purple'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTab === 'current' && (
            <div className="space-y-6">
              {activeEventsWithData.length === 0 ? (
                <div className="fairy-card p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-fairy-purple" />
                  </div>
                  <h3 className="text-2xl font-fairy text-gray-800 mb-3">暂无进行中的事件</h3>
                  <p className="text-gray-500 font-body mb-6">
                    童话世界目前风平浪静，但神秘事件随时可能降临……
                  </p>
                  <button
                    onClick={handleTriggerEvent}
                    className="fairy-button inline-flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    触发随机事件
                  </button>
                </div>
              ) : (
                <>
                  {activeEventsWithData.map(({ activeEvent, event }) => {
                    const severityInfo = getSeverityInfo(event.severity);
                    const timeLeft = Math.max(0, activeEvent.endTime - Date.now());
                    const totalDuration = event.duration * 1000;
                    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
                    const completedCount = activeEvent.completedObjectives.length;
                    const totalObjectives = event.objectives.length;

                    return (
                      <div
                        key={event.id}
                        className="fairy-card overflow-hidden relative"
                      >
                        <div
                          className="h-2 absolute top-0 left-0 right-0"
                          style={{ backgroundColor: severityInfo.color + '30' }}
                        >
                          <div
                            className="h-full transition-all duration-1000"
                            style={{
                              width: `${100 - progress}%`,
                              backgroundColor: severityInfo.color,
                            }}
                          />
                        </div>

                        <div className="p-6 md:p-8 pt-8">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                              <div
                                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-5xl md:text-6xl shadow-lg relative overflow-hidden"
                                style={{ backgroundColor: event.coverColor + '20' }}
                              >
                                <span className="relative z-10 animate-bounce-soft">{event.emoji}</span>
                                <div className="absolute inset-0 opacity-30">
                                  {[...Array(8)].map((_, i) => (
                                    <Sparkles
                                      key={i}
                                      className="absolute text-white animate-twinkle"
                                      style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: `${8 + Math.random() * 12}px`,
                                        animationDelay: `${Math.random() * 2}s`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">
                                  {event.name}
                                </h2>
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-body font-bold text-white"
                                  style={{ backgroundColor: severityInfo.color }}
                                >
                                  {severityInfo.name}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-fairy-purple/10 text-fairy-purple text-xs font-body">
                                  {event.type}
                                </span>
                              </div>

                              <p className="text-gray-600 font-body mb-4 leading-relaxed">
                                {event.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body mb-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  剩余时间：{formatDuration(timeLeft)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {activeEvent.participantCount} 人参与
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  目标：{completedCount}/{totalObjectives}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {event.effects.map((effect, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-body border border-amber-200"
                                  >
                                    <Sparkles className="w-3 h-3 inline mr-1" />
                                    {effect.description}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-fairy-purple/10">
                            <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                              <Target className="w-5 h-5 text-fairy-purple" />
                              事件目标
                            </h3>
                            <div className="grid gap-3">
                              {event.objectives.map((obj, idx) => {
                                const currentProgress = activeEvent.progress[obj.id] || 0;
                                const isCompleted = activeEvent.completedObjectives.includes(obj.id);
                                const progressPercent = Math.min(100, (currentProgress / obj.target) * 100);

                                return (
                                  <div
                                    key={obj.id}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                      isCompleted
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-white/60 border-fairy-purple/20'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`font-body ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                                        {isCompleted && <Check className="w-4 h-4 inline mr-1" />}
                                        目标 {idx + 1}：{obj.description}
                                      </span>
                                      <span className={`text-sm font-body font-bold ${
                                        isCompleted ? 'text-green-600' : 'text-fairy-purple'
                                      }`}>
                                        +{obj.reward} 积分
                                      </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          isCompleted ? 'bg-green-400' : 'bg-gradient-fairy'
                                        }`}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                    <div className="text-xs text-gray-500 font-body mt-1 text-right">
                                      {currentProgress} / {obj.target}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-fairy-purple/10">
                            <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                              <Gift className="w-5 h-5 text-fairy-gold" />
                              事件奖励
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {event.rewards.map((reward, idx) => {
                                const rarityColor = RARITY_COLORS[reward.rarity];
                                const isClaimed = activeEvent.claimedRewards.includes(`reward-${idx}`);

                                return (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-xl text-center relative ${
                                      isClaimed
                                        ? 'bg-gray-100 opacity-60'
                                        : `bg-gradient-to-br ${rarityColor.bg} bg-opacity-10`
                                    }`}
                                    style={{
                                      border: `2px solid ${
                                        isClaimed ? '#E5E7EB' : rarityColor.border
                                      }`,
                                    }}
                                  >
                                    <div className="text-3xl mb-2">{reward.emoji}</div>
                                    <div className={`font-fairy text-sm ${isClaimed ? 'text-gray-400' : 'text-gray-800'}`}>
                                      {reward.name}
                                    </div>
                                    <div
                                      className="text-xs font-body mt-1"
                                      style={{ color: isClaimed ? '#9CA3AF' : rarityColor.text }}
                                    >
                                      {reward.rarity}
                                    </div>
                                    {isClaimed && (
                                      <div className="absolute top-2 right-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3 justify-end">
                            <button
                              onClick={() => handleEndEvent(event.id, 'success')}
                              className="px-4 py-2 rounded-full bg-green-500 text-white font-body text-sm hover:bg-green-600 transition-colors"
                            >
                              标记成功
                            </button>
                            <button
                              onClick={() => handleEndEvent(event.id, 'partial')}
                              className="px-4 py-2 rounded-full bg-amber-500 text-white font-body text-sm hover:bg-amber-600 transition-colors"
                            >
                              部分完成
                            </button>
                            <button
                              onClick={() => handleEndEvent(event.id, 'failure')}
                              className="px-4 py-2 rounded-full bg-red-500 text-white font-body text-sm hover:bg-red-600 transition-colors"
                            >
                              事件失败
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              <div className="mt-8">
                <h3 className="text-xl font-fairy text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-fairy-purple" />
                  所有事件图鉴
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cosmicEvents.map((event) => {
                    const severityInfo = getSeverityInfo(event.severity);
                    const isActive = activeEvents.some((ae) => ae.eventId === event.id);

                    return (
                      <div
                        key={event.id}
                        className={`fairy-card p-4 relative transition-all hover:shadow-fairy-lg ${
                          isActive ? 'ring-2 ring-fairy-purple' : ''
                        }`}
                      >
                        {isActive && (
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-fairy-purple text-white text-xs rounded-full font-body animate-pulse">
                            进行中
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: event.coverColor + '20' }}
                          >
                            {event.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-fairy text-gray-800 mb-1">{event.name}</h4>
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-body font-bold text-white mb-2"
                              style={{ backgroundColor: severityInfo.color }}
                            >
                              {severityInfo.name}
                            </span>
                            <p className="text-xs text-gray-500 font-body line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-fairy-purple/10 flex items-center justify-between text-xs text-gray-500 font-body">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(event.duration * 1000)}
                          </span>
                          <span>
                            {event.region}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'history' && (
            <div className="space-y-4">
              {eventHistory.length === 0 ? (
                <div className="fairy-card p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <History className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-fairy text-gray-800 mb-3">暂无历史记录</h3>
                  <p className="text-gray-500 font-body">
                    参与宇宙事件后，记录将保存在这里
                  </p>
                </div>
              ) : (
                eventHistory.map((record) => {
                  const severityInfo = getSeverityInfo(record.severity);
                  const outcomeColors = {
                    success: 'text-green-600 bg-green-50 border-green-200',
                    partial: 'text-amber-600 bg-amber-50 border-amber-200',
                    failure: 'text-red-600 bg-red-50 border-red-200',
                  };
                  const outcomeLabels = {
                    success: '圆满成功',
                    partial: '部分完成',
                    failure: '未能成功',
                  };

                  return (
                    <div key={record.eventId} className="fairy-card p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                            style={{ backgroundColor: severityInfo.color + '20' }}
                          >
                            {record.emoji}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-body font-bold border ${
                              outcomeColors[record.outcome]
                            }`}
                          >
                            {outcomeLabels[record.outcome]}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-fairy text-gray-800">
                              {record.eventName}
                            </h3>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-body text-white"
                              style={{ backgroundColor: severityInfo.color }}
                            >
                              {severityInfo.name}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 font-body mb-3">
                            {record.worldImpact}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-body">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(record.startTime).toLocaleDateString('zh-CN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {record.totalParticipants} 人参与
                            </span>
                            {record.playerParticipated && record.playerScore !== undefined && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500" />
                                获得 {record.playerScore} 积分
                              </span>
                            )}
                            {record.playerParticipated && record.playerRank !== undefined && (
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-amber-500" />
                                排名 #{record.playerRank}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {selectedTab === 'leaderboard' && (
            <div className="fairy-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-fairy-gold/20 via-fairy-pink/20 to-fairy-purple/20 border-b border-fairy-purple/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-fairy flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-fairy text-gray-800">宇宙事件排行榜</h2>
                    <p className="text-sm text-gray-500 font-body">所有冒险者的事件积分排名</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-fairy-purple/10">
                {eventLeaderboard.map((entry) => {
                  const rankColors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];
                  const rankBg = ['bg-amber-50', 'bg-gray-50', 'bg-amber-50/50'];
                  const isTop3 = entry.rank <= 3;

                  return (
                    <div
                      key={entry.rank}
                      className={`p-4 flex items-center gap-4 ${
                        isTop3 ? rankBg[entry.rank - 1] : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-fairy text-lg font-bold ${
                          isTop3 ? rankColors[entry.rank - 1] : 'text-gray-400'
                        }`}
                      >
                        {entry.rank === 1 && <Crown className="w-6 h-6" />}
                        {entry.rank !== 1 && `#${entry.rank}`}
                      </div>

                      <div className="w-12 h-12 rounded-full bg-gradient-fairy flex items-center justify-center text-2xl">
                        {entry.avatarEmoji}
                      </div>

                      <div className="flex-1">
                        <div className="font-fairy text-gray-800">{entry.playerName}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.titles.slice(0, 2).map((title, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full bg-fairy-purple/10 text-fairy-purple text-[10px] font-body"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-fairy text-xl text-fairy-purple">{entry.score}</div>
                        <div className="text-xs text-gray-500 font-body">
                          参与 {entry.eventsParticipated} · 完成 {entry.eventsCompleted}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTab === 'worldState' && (
            <div className="space-y-6">
              <div className="fairy-card p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-fairy opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-fairy flex items-center justify-center text-4xl shadow-fairy">
                      {worldState.eraEmoji}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-body mb-1">当前时代</div>
                      <h2 className="text-3xl font-fairy text-gradient-fairy">
                        {worldState.era}
                      </h2>
                      <div className="text-sm text-gray-500 font-body mt-1">
                        世界等级 Lv.{worldState.worldLevel}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 font-body leading-relaxed">
                    {worldState.currentEraDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="fairy-card p-6">
                  <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    世界稳定性
                  </h3>
                  <div className="mb-2 flex justify-between text-sm font-body">
                    <span className="text-gray-600">稳定度</span>
                    <span className="text-blue-600 font-bold">{worldState.worldStability}%</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        worldState.worldStability >= 70
                          ? 'bg-green-400'
                          : worldState.worldStability >= 40
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${worldState.worldStability}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-body mt-2">
                    成功完成事件可提升世界稳定性，失败则会降低
                  </p>
                </div>

                <div className="fairy-card p-6">
                  <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-500" />
                    魔法浓度
                  </h3>
                  <div className="mb-2 flex justify-between text-sm font-body">
                    <span className="text-gray-600">浓度指数</span>
                    <span className="text-purple-600 font-bold">{worldState.magicDensity}%</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-fairy transition-all duration-500"
                      style={{ width: `${worldState.magicDensity}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-body mt-2">
                    魔法浓度越高，稀有事件和道具出现概率越大
                  </p>
                </div>
              </div>

              <div className="fairy-card p-6">
                <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-green-500" />
                  已解锁地区
                </h3>
                <div className="flex flex-wrap gap-2">
                  {worldState.unlockedRegions.map((region) => (
                    <span
                      key={region}
                      className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-body border border-green-200"
                    >
                      ✨ {region}
                    </span>
                  ))}
                </div>
              </div>

              {worldState.globalBuffs.length > 0 && (
                <div className="fairy-card p-6">
                  <h3 className="text-lg font-fairy text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    世界增益
                  </h3>
                  <div className="grid gap-3">
                    {worldState.globalBuffs.map((buff) => (
                      <div
                        key={buff.id}
                        className="p-4 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{buff.emoji}</span>
                          <div className="flex-1">
                            <div className="font-fairy text-amber-800">{buff.name}</div>
                            <div className="text-sm text-amber-600 font-body">
                              {buff.description}
                            </div>
                          </div>
                          <div className="text-xs text-amber-500 font-body">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDuration(buff.duration * 1000)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="fairy-card p-6">
                <h3 className="text-lg font-fairy text-gray-800 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-fairy-gold" />
                  时代历史
                </h3>
                <div className="relative">
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-fairy-purple via-fairy-pink to-fairy-gold" />
                  <div className="space-y-6">
                    {[...worldState.eraHistory].reverse().map((era, idx) => (
                      <div key={idx} className="relative pl-14">
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-4 border-fairy-purple/30 flex items-center justify-center text-xl shadow-md">
                          {era.eraEmoji}
                        </div>
                        <div className="fairy-card p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-fairy text-gray-800">{era.era}</h4>
                            <span className="text-xs text-gray-500 font-body">
                              {new Date(era.startedAt).toLocaleDateString('zh-CN')}
                              {era.endedAt && ` - ${new Date(era.endedAt).toLocaleDateString('zh-CN')}`}
                              {!era.endedAt && ' - 至今'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-body mb-2">
                            {era.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {era.majorEvents.map((event, eIdx) => (
                              <span
                                key={eIdx}
                                className="px-2 py-0.5 rounded-full bg-fairy-purple/10 text-fairy-purple text-xs font-body"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
