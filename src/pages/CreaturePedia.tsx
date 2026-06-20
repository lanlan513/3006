import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Sparkles,
  BookOpen,
  MapPin,
  Zap,
  Shield,
  Search,
  Filter,
  Trophy,
  Crown,
  Star,
  Eye,
  Lock,
  HelpCircle,
  ScrollText,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import CreatureCard, { CreatureDetailModal } from '@/components/CreatureCard';
import {
  useStoryStore,
  getFilteredCreatures,
} from '@/store/storyStore';
import {
  CREATURE_HABITATS,
  CREATURE_ABILITIES,
  DANGER_LEVELS,
  DANGER_COLORS,
  RARITY_COLORS,
  type Creature,
  type CreatureHabitat,
  type CreatureAbilityType,
  type DangerLevel,
} from '@/types';
import { cn } from '@/lib/utils';

const habitatIcons: Record<string, string> = {
  '全部': '✨',
  '天空': '☁️',
  '海洋': '🌊',
  '森林': '🌲',
  '山脉': '⛰️',
  '地底': '🕳️',
  '沼泽': '🐊',
  '极地': '❄️',
  '沙漠': '🏜️',
  '仙境': '🌈',
};

const abilityIcons: Record<string, string> = {
  '全部': '✨',
  '飞行': '🪽',
  '魔法': '🔮',
  '变形': '🌀',
  '治愈': '💚',
  '预知': '👁️',
  '力量': '💪',
  '速度': '⚡',
  '幻术': '🎭',
  '永生': '♾️',
};

const dangerIcons: Record<string, string> = {
  '全部': '✨',
  '温和': '💚',
  '中立': '💙',
  '危险': '🧡',
  '极度危险': '❤️',
};

export default function CreaturePedia() {
  const allCreatures = useStoryStore((state) => state.creatures);
  const unlockedCreatures = useStoryStore((state) => state.unlockedCreatures);
  const selectedHabitat = useStoryStore((state) => state.selectedCreatureHabitat);
  const selectedAbility = useStoryStore((state) => state.selectedCreatureAbility);
  const selectedDanger = useStoryStore((state) => state.selectedCreatureDanger);
  const setSelectedHabitat = useStoryStore((state) => state.setSelectedCreatureHabitat);
  const setSelectedAbility = useStoryStore((state) => state.setSelectedCreatureAbility);
  const setSelectedDanger = useStoryStore((state) => state.setSelectedCreatureDanger);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showLockedOnly, setShowLockedOnly] = useState(false);

  const filteredCreatures = useMemo(() => {
    let result = getFilteredCreatures(allCreatures, selectedHabitat, selectedAbility, selectedDanger, searchQuery);
    if (showLockedOnly) {
      result = result.filter((c) => !unlockedCreatures.has(c.id));
    }
    return result;
  }, [allCreatures, selectedHabitat, selectedAbility, selectedDanger, searchQuery, unlockedCreatures, showLockedOnly]);

  const unlockedCount = unlockedCreatures.size;
  const totalCount = allCreatures.length;
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const habitatCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allCreatures.length };
    CREATURE_HABITATS.forEach((h) => {
      if (h !== '全部') {
        counts[h] = allCreatures.filter((c) => c.habitat === h).length;
      }
    });
    return counts;
  }, [allCreatures]);

  const abilityCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allCreatures.length };
    CREATURE_ABILITIES.forEach((a) => {
      if (a !== '全部') {
        counts[a] = allCreatures.filter((c) => c.abilityTypes.includes(a as Exclude<CreatureAbilityType, '全部'>)).length;
      }
    });
    return counts;
  }, [allCreatures]);

  const dangerCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allCreatures.length };
    DANGER_LEVELS.forEach((d) => {
      if (d !== '全部') {
        counts[d] = allCreatures.filter((c) => c.dangerLevel === d).length;
      }
    });
    return counts;
  }, [allCreatures]);

  const rareCreatures = useMemo(
    () => allCreatures.filter((c) => c.rarity === '传说' || c.rarity === '神话').slice(0, 4),
    [allCreatures]
  );

  const getCompletionMessage = () => {
    if (completionPercent === 0) return '开始你的冒险，解锁第一个神秘生物吧！';
    if (completionPercent < 30) return '探索之旅刚刚开始，还有更多生物等待发现！';
    if (completionPercent < 60) return '图鉴已初见规模，继续加油冒险者！';
    if (completionPercent < 90) return '你已成为资深冒险者，接近完整图鉴！';
    if (completionPercent < 100) return '就差几个了，完美收集近在咫尺！';
    return '🎉 恭喜！你已收集全部童话生物图鉴！';
  };

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-body mb-6">
            <Link to="/" className="flex items-center gap-1 hover:text-fairy-purple transition-colors">
              <Home className="w-4 h-4" />
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-700">童话生物图鉴</span>
          </div>
        </div>

        <section className="container mx-auto px-4 py-8 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-fairy-purple/20 shadow-sm mb-6">
            <ScrollText className="w-4 h-4 text-fairy-gold animate-twinkle" />
            <span className="text-sm font-body text-gray-600">记录童话世界的神秘生灵</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-fairy mb-6">
            <span className="text-gradient-fairy">童话生物图鉴</span>
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto mb-8">
            从翱翔天际的巨龙到深海沉睡的海妖，从森林深处的精灵到沙漠中重生的凤凰。
            探索并解锁这些神秘生物，记录它们的外貌、习性与传说。
          </p>

          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索生物名称、能力或特征..."
              className="fairy-input pl-12 pr-4 w-full"
            />
          </div>

          <div className="inline-block">
            <button
              onClick={() => setShowProgressModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-br from-fairy-gold via-pink-400 to-fairy-purple text-white font-body shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3"
            >
              <Trophy className="w-5 h-5" />
              <span>图鉴完成度</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">
                {unlockedCount}/{totalCount}
              </span>
            </button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 mb-8">
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-fairy-gold/20 via-fairy-pink/15 to-fairy-purple/20 border border-fairy-gold/30 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-6 left-6 text-5xl opacity-20 animate-float-slow">📖</div>
              <div className="absolute bottom-6 right-6 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fairy-gold via-pink-400 to-fairy-purple flex items-center justify-center shadow-lg relative">
                    <Trophy className="w-8 h-8 text-white" />
                    <Sparkles className="w-5 h-5 text-fairy-gold absolute -top-1 -right-1 animate-twinkle" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">冒险者手册进度</h2>
                    <p className="text-sm text-gray-600 font-body">{getCompletionMessage()}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-5xl font-fairy text-gradient-fairy mb-1">
                    {Math.round(completionPercent)}%
                  </div>
                  <p className="text-sm text-gray-500 font-body">已解锁 {unlockedCount} / {totalCount} 种生物</p>
                </div>
              </div>

              <div className="h-4 bg-white/50 rounded-full overflow-hidden mb-6 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-fairy-gold via-pink-400 to-fairy-purple transition-all duration-700 rounded-full relative overflow-hidden"
                  style={{ width: `${completionPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['普通', '稀有', '史诗', '传说', '神话'] as const).slice(0, 5).map((rarity) => {
                  const colors = RARITY_COLORS[rarity];
                  const total = allCreatures.filter((c) => c.rarity === rarity).length;
                  const unlocked = allCreatures.filter((c) => c.rarity === rarity && unlockedCreatures.has(c.id)).length;
                  return (
                    <div
                      key={rarity}
                      className="rounded-2xl bg-white/60 backdrop-blur-sm p-4 border border-white/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn('w-6 h-6 rounded-lg bg-gradient-to-r flex items-center justify-center', colors.bg)}>
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                        <span className={cn('font-body text-sm font-medium', colors.text)}>{rarity}</span>
                      </div>
                      <div className="text-2xl font-fairy text-gray-800">
                        {unlocked}<span className="text-sm text-gray-400">/{total}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full bg-gradient-to-r', colors.bg)}
                          style={{ width: total > 0 ? (unlocked / total) * 100 : 0 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {rareCreatures.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">传说级生物</h2>
                <p className="text-sm text-gray-500 font-body">童话世界中最强大的神秘存在</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rareCreatures.map((creature) => (
                <CreatureCard
                  key={creature.id}
                  creature={creature}
                  onClick={() => setSelectedCreature(creature)}
                  onViewDetail={() => setSelectedCreature(creature)}
                  showDetailButton
                />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-rainbow flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">图鉴目录</h2>
                <p className="text-sm text-gray-500 font-body">
                  共 {filteredCreatures.length} 种生物
                  {showLockedOnly && filteredCreatures.length > 0 && `（未解锁 ${filteredCreatures.filter(c => !unlockedCreatures.has(c.id)).length} 种）`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLockedOnly(!showLockedOnly)}
              className={cn(
                'px-4 py-2 rounded-full font-body text-sm transition-all flex items-center gap-2',
                showLockedOnly
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md'
                  : 'bg-white/70 border border-gray-300 text-gray-600 hover:bg-gray-100'
              )}
            >
              <Lock className="w-4 h-4" />
              只看未解锁
            </button>
          </div>

          <div className="space-y-4 mb-10">
            <div>
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 text-gray-500 font-body text-sm border border-gray-200">
                  <MapPin className="w-4 h-4" />
                  栖息地：
                </span>
                {CREATURE_HABITATS.map((habitat) => (
                  <button
                    key={habitat}
                    onClick={() => setSelectedHabitat(habitat as CreatureHabitat)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                      selectedHabitat === habitat
                        ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                        : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-fairy-purple hover:text-fairy-purple'
                    )}
                  >
                    <span>{habitatIcons[habitat] || '📍'}</span>
                    <span>{habitat}</span>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        selectedHabitat === habitat ? 'bg-white/20' : 'bg-fairy-purple/10 text-fairy-purple'
                      )}
                    >
                      {habitatCounts[habitat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 text-gray-500 font-body text-sm border border-gray-200">
                  <Zap className="w-4 h-4" />
                  能力类型：
                </span>
                {CREATURE_ABILITIES.map((ability) => (
                  <button
                    key={ability}
                    onClick={() => setSelectedAbility(ability as CreatureAbilityType)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                      selectedAbility === ability
                        ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                        : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-fairy-purple hover:text-fairy-purple'
                    )}
                  >
                    <span>{abilityIcons[ability] || '✨'}</span>
                    <span>{ability}</span>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        selectedAbility === ability ? 'bg-white/20' : 'bg-fairy-purple/10 text-fairy-purple'
                      )}
                    >
                      {abilityCounts[ability] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 text-gray-500 font-body text-sm border border-gray-200">
                  <Shield className="w-4 h-4" />
                  危险等级：
                </span>
                {DANGER_LEVELS.map((danger) => {
                  const colors = DANGER_COLORS[danger];
                  return (
                    <button
                      key={danger}
                      onClick={() => setSelectedDanger(danger as DangerLevel)}
                      className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                        selectedDanger === danger
                          ? `bg-gradient-to-r ${colors.bg} text-white shadow-md scale-105`
                          : 'bg-white/70 border border-gray-200 text-gray-600 hover:border-gray-400'
                      )}
                    >
                      <span>{dangerIcons[danger] || '⚠️'}</span>
                      <span>{danger}</span>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          selectedDanger === danger ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {dangerCounts[danger] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {filteredCreatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreatures.map((creature) => (
                <CreatureCard
                  key={creature.id}
                  creature={creature}
                  variant={unlockedCreatures.has(creature.id) ? 'default' : 'locked'}
                  onClick={() => setSelectedCreature(creature)}
                  onViewDetail={() => setSelectedCreature(creature)}
                  showDetailButton={unlockedCreatures.has(creature.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h2 className="text-2xl font-fairy text-gray-700 mb-2">没有找到相关生物</h2>
              <p className="text-gray-500 font-body mb-6">试试其他关键词或筛选条件吧</p>
              <button
                onClick={() => {
                  setSelectedHabitat('全部');
                  setSelectedAbility('全部');
                  setSelectedDanger('全部');
                  setSearchQuery('');
                  setShowLockedOnly(false);
                }}
                className="fairy-button inline-flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                重置所有筛选
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedCreature && (
        <CreatureDetailModal creature={selectedCreature} onClose={() => setSelectedCreature(null)} />
      )}

      {showProgressModal && (
        <ProgressDetailModal
          creatures={allCreatures}
          unlockedCreatures={unlockedCreatures}
          onClose={() => setShowProgressModal(false)}
          onSelectCreature={(c) => {
            setShowProgressModal(false);
            setSelectedCreature(c);
          }}
        />
      )}
    </div>
  );
}

interface ProgressDetailModalProps {
  creatures: Creature[];
  unlockedCreatures: Set<string>;
  onClose: () => void;
  onSelectCreature: (creature: Creature) => void;
}

function ProgressDetailModal({ creatures, unlockedCreatures, onClose, onSelectCreature }: ProgressDetailModalProps) {
  const unlockedCount = unlockedCreatures.size;
  const totalCount = creatures.length;
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fairy-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-fairy-purple/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fairy-gold via-pink-400 to-fairy-purple flex items-center justify-center relative">
              <Trophy className="w-6 h-6 text-white" />
              <Sparkles className="w-4 h-4 text-fairy-gold absolute -top-1 -right-1 animate-twinkle" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-fairy text-gray-800">图鉴完成度</h3>
              <p className="text-sm text-gray-500 font-body">冒险者收集进度</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-2 bg-gradient-to-r from-fairy-gold/10 via-pink-400/10 to-fairy-purple/10">
          <div className="p-4 md:p-6 text-center">
            <div className="text-6xl md:text-7xl font-fairy text-gradient-fairy mb-2">
              {Math.round(completionPercent)}%
            </div>
            <p className="text-gray-600 font-body mb-4">
              已解锁 <span className="font-bold text-fairy-purple">{unlockedCount}</span> / {totalCount} 种童话生物
            </p>
            <div className="h-4 bg-white/70 rounded-full overflow-hidden mx-auto max-w-md">
              <div
                className="h-full bg-gradient-to-r from-fairy-gold via-pink-400 to-fairy-purple transition-all duration-700 rounded-full relative overflow-hidden"
                style={{ width: `${completionPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {creatures.map((creature) => {
              const isUnlocked = unlockedCreatures.has(creature.id);
              const colors = RARITY_COLORS[creature.rarity];
              return (
                <div
                  key={creature.id}
                  onClick={() => onSelectCreature(creature)}
                  className={cn(
                    'rounded-2xl p-3 border-2 transition-all cursor-pointer',
                    isUnlocked
                      ? 'bg-white border-fairy-purple/20 hover:border-fairy-purple hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 border-dashed'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl',
                        isUnlocked ? '' : 'bg-gray-200 grayscale'
                      )}
                      style={isUnlocked ? { backgroundColor: creature.coverColor + '30' } : {}}
                    >
                      {isUnlocked ? creature.emoji : <HelpCircle className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className={cn('w-3 h-3 rounded bg-gradient-to-r', colors.bg)} />
                        <span
                          className={cn(
                            'text-xs font-body',
                            isUnlocked ? 'text-gray-700 truncate' : 'text-gray-400'
                          )}
                        >
                          {isUnlocked ? creature.name : '???'}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-body flex items-center gap-1',
                          isUnlocked ? 'text-green-600' : 'text-gray-400'
                        )}
                      >
                        {isUnlocked ? (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            已解锁
                          </>
                        ) : (
                          <>
                            <Lock className="w-2.5 h-2.5" />
                            未解锁
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-fairy-purple/10 bg-fairy-purple/5 text-center">
          <button
            onClick={onClose}
            className="fairy-button inline-flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            继续探索图鉴
          </button>
        </div>
      </div>
    </div>
  );
}
