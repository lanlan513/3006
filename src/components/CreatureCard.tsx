import { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Shield,
  Zap,
  Crown,
  Info,
  BookOpen,
  Ruler,
  Clock,
  Eye,
  Lock,
  Unlock,
  ChevronRight,
  Star,
} from 'lucide-react';
import type { Creature } from '@/types';
import { DANGER_COLORS, RARITY_COLORS } from '@/types';
import { useStoryStore } from '@/store/storyStore';
import { cn } from '@/lib/utils';

interface CreatureCardProps {
  creature: Creature;
  onClick?: () => void;
  onViewDetail?: () => void;
  showDetailButton?: boolean;
  variant?: 'default' | 'compact' | 'locked';
}

export default function CreatureCard({
  creature,
  onClick,
  onViewDetail,
  showDetailButton = false,
  variant = 'default',
}: CreatureCardProps) {
  const unlockedCreatures = useStoryStore((state) => state.unlockedCreatures);
  const unlockCreature = useStoryStore((state) => state.unlockCreature);
  const isUnlocked = unlockedCreatures.has(creature.id);
  const dangerColors = DANGER_COLORS[creature.dangerLevel];
  const rarityColors = RARITY_COLORS[creature.rarity];

  const handleClick = () => {
    if (!isUnlocked) {
      unlockCreature(creature.id);
    }
    onClick?.();
  };

  if (variant === 'locked' && !isUnlocked) {
    return (
      <div
        className="fairy-card group cursor-pointer relative overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative h-40 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <Lock className="w-12 h-12 text-white/70 mb-2" />
            <span className="text-white/80 font-body text-sm">点击解锁</span>
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-body">
            ???
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-4 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fairy-card group cursor-pointer relative overflow-hidden',
        variant === 'compact' && 'hover:shadow-fairy'
      )}
      onClick={handleClick}
    >
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: creature.coverColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg animate-bounce-soft">
          {creature.emoji}
        </span>
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-body text-white bg-gradient-to-r shadow-md',
              rarityColors.bg
            )}
          >
            {creature.rarity}
          </span>
          {isUnlocked ? (
            <span className="px-2 py-1 rounded-full bg-green-500/80 backdrop-blur-sm text-white text-xs font-body flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              已解锁
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-body flex items-center gap-1">
              <Lock className="w-3 h-3" />
              待解锁
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-body text-white bg-gradient-to-r shadow-md',
              dangerColors.bg
            )}
          >
            {creature.dangerLevel}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-fairy text-lg text-gray-800 group-hover:text-fairy-purple transition-colors">
              {creature.name}
            </h3>
            <p className="text-xs text-gray-400 font-body italic">{creature.latinName}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 font-body line-clamp-2 mb-3">
          {creature.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fairy-purple/10 text-fairy-purple text-[11px] font-body">
            <MapPin className="w-3 h-3" />
            {creature.habitat}
          </span>
          {creature.abilityTypes.slice(0, 2).map((ability) => (
            <span
              key={ability}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fairy-pink/20 text-pink-600 text-[11px] font-body"
            >
              <Zap className="w-3 h-3" />
              {ability}
            </span>
          ))}
          {creature.abilityTypes.length > 2 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-body">
              +{creature.abilityTypes.length - 2}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {creature.traits.slice(0, 3).map((trait) => (
            <span
              key={trait}
              className="px-2 py-0.5 rounded-full bg-gradient-to-r from-fairy-purple/10 to-fairy-pink/10 text-gray-600 text-[11px] font-body"
            >
              #{trait}
            </span>
          ))}
        </div>
        {showDetailButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.();
            }}
            className="mt-3 w-full px-3 py-1.5 rounded-full border border-fairy-purple/30 text-fairy-purple text-sm font-body hover:bg-fairy-purple hover:text-white transition-all flex items-center justify-center gap-1 group/btn"
          >
            <Eye className="w-4 h-4" />
            查看图鉴
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

interface CreatureDetailModalProps {
  creature: Creature;
  onClose: () => void;
}

export function CreatureDetailModal({ creature, onClose }: CreatureDetailModalProps) {
  const unlockedCreatures = useStoryStore((state) => state.unlockedCreatures);
  const unlockCreature = useStoryStore((state) => state.unlockCreature);
  const isUnlocked = unlockedCreatures.has(creature.id);
  const dangerColors = DANGER_COLORS[creature.dangerLevel];
  const rarityColors = RARITY_COLORS[creature.rarity];
  const [activeTab, setActiveTab] = useState<'overview' | 'abilities' | 'origin'>('overview');

  const handleUnlock = () => {
    if (!isUnlocked) {
      unlockCreature(creature.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full max-h-[90vh] relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fairy-card overflow-hidden animate-bounce-soft flex flex-col max-h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors z-20 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative h-56 md:h-64 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: creature.coverColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute text-white/30 animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${8 + Math.random() * 16}px`,
                    height: `${8 + Math.random() * 16}px`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            {isUnlocked ? (
              <span className="text-[150px] relative z-10 animate-bounce-soft drop-shadow-2xl">
                {creature.emoji}
              </span>
            ) : (
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <button
                  onClick={handleUnlock}
                  className="px-6 py-2 rounded-full bg-white text-gray-700 font-body font-medium hover:bg-white/90 transition-colors shadow-lg"
                >
                  点击解锁图鉴
                </button>
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="flex gap-2">
                <span
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r shadow-lg flex items-center gap-1',
                    rarityColors.bg
                  )}
                >
                  <Crown className="w-4 h-4" />
                  {creature.rarity}
                </span>
                <span
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r shadow-lg flex items-center gap-1',
                    dangerColors.bg
                  )}
                >
                  <Shield className="w-4 h-4" />
                  {creature.dangerLevel}
                </span>
              </div>
              {isUnlocked && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-body w-fit">
                  <Unlock className="w-3 h-3" />
                  已解锁
                </span>
              )}
            </div>
          </div>

          <div className="px-6 pt-6 pb-2 flex-shrink-0 -mt-8 relative z-10">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-fairy text-gray-800 mb-1">
                {isUnlocked ? creature.name : '???'}
              </h2>
              <p className="text-sm text-gray-400 font-body italic">
                {isUnlocked ? creature.latinName : '未知生物'}
              </p>
            </div>

            {isUnlocked && (
              <div className="flex justify-center gap-4 mb-4 text-sm text-gray-500 font-body">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-fairy-purple" />
                  {creature.habitat}
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-fairy-purple" />
                  {creature.size}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-fairy-purple" />
                  {creature.lifespan}
                </span>
              </div>
            )}

            {isUnlocked && (
              <div className="flex justify-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < ['普通', '稀有', '史诗', '传说', '神话'].indexOf(creature.rarity) + 1
                          ? 'text-fairy-gold fill-current'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {isUnlocked && (
            <>
              <div className="px-6 flex gap-2 border-b border-fairy-purple/10 flex-shrink-0">
                {(['overview', 'abilities', 'origin'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-2 font-body text-sm transition-colors relative',
                      activeTab === tab
                        ? 'text-fairy-purple'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab === 'overview' && '基本信息'}
                    {tab === 'abilities' && `能力 (${creature.abilities.length})`}
                    {tab === 'origin' && '起源故事'}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-fairy rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <section>
                      <h4 className="font-fairy text-lg text-gray-800 mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-fairy-purple" />
                        物种介绍
                      </h4>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {creature.description}
                      </p>
                    </section>

                    <section>
                      <h4 className="font-fairy text-lg text-gray-800 mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-fairy-purple" />
                        外貌特征
                      </h4>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {creature.appearance}
                      </p>
                    </section>

                    <section>
                      <h4 className="font-fairy text-lg text-gray-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-fairy-purple" />
                        行为习性
                      </h4>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {creature.behavior}
                      </p>
                    </section>

                    <section>
                      <h4 className="font-fairy text-lg text-gray-800 mb-3">特征标签</h4>
                      <div className="flex flex-wrap gap-2">
                        {creature.traits.map((trait) => (
                          <span
                            key={trait}
                            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-fairy-purple/10 via-fairy-pink/10 to-fairy-gold/10 text-gray-700 font-body text-sm border border-fairy-purple/20"
                          >
                            #{trait}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'abilities' && (
                  <div className="space-y-4">
                    {creature.abilities.map((ability, index) => (
                      <div
                        key={ability.name}
                        className="p-4 rounded-2xl bg-gradient-to-r from-fairy-purple/5 via-fairy-pink/5 to-fairy-gold/5 border border-fairy-purple/10"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-fairy flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-fairy text-lg text-gray-800">{ability.name}</h5>
                            <span className="text-xs text-gray-400 font-body">能力 #{index + 1}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 font-body leading-relaxed ml-[52px]">
                          {ability.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'origin' && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-parchment shadow-inner">
                      <h4 className="font-fairy text-lg text-gray-800 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-fairy-purple" />
                        传说起源
                      </h4>
                      <p className="text-gray-700 font-body leading-loose drop-cap">
                        {creature.originStory}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-fairy-purple/10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-fairy flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-body">出处故事</p>
                        <p className="font-fairy text-lg text-gray-800">{creature.storyTitle}</p>
                        <p className="text-xs text-gray-400 font-body">来自 {creature.storyRegion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!isUnlocked && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-fairy text-xl text-gray-700 mb-2">图鉴未解锁</h3>
              <p className="text-gray-500 font-body mb-4">点击上方按钮解锁这个神秘生物的图鉴信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
