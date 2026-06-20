import { X, Zap, BookOpen, Sparkles, Star } from 'lucide-react';
import type { MagicItem } from '@/types';
import { RARITY_COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface MagicItemCardProps {
  item: MagicItem;
  variant?: 'default' | 'compact' | 'slot';
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onRemove?: () => void;
  draggable?: boolean;
  selected?: boolean;
}

export default function MagicItemCard({
  item,
  variant = 'default',
  onClick,
  onDragStart,
  onDragEnd,
  onRemove,
  draggable = false,
  selected = false,
}: MagicItemCardProps) {
  const rarityColors = RARITY_COLORS[item.rarity];

  if (variant === 'slot') {
    return (
      <div
        className={cn(
          'fairy-card p-3 relative group cursor-pointer transition-all duration-300',
          'border-2',
          rarityColors.border,
          selected && 'ring-4 ring-fairy-purple/30 scale-105'
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <div
          className={cn(
            'w-full h-20 rounded-xl flex items-center justify-center mb-2 relative overflow-hidden'
          )}
          style={{ backgroundColor: item.coverColor }}
        >
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </span>
          {item.isCustom && (
            <Sparkles className="absolute top-1 right-1 w-3 h-3 text-fairy-gold animate-twinkle" />
          )}
        </div>
        <div className="text-center">
          <h4 className="font-fairy text-sm text-gray-800 line-clamp-1 mb-1">{item.name}</h4>
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded-full text-[10px] font-body text-white bg-gradient-to-r',
              rarityColors.bg
            )}
          >
            {item.rarity}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'fairy-card p-3 flex gap-3 cursor-pointer group',
          'border-2',
          rarityColors.border,
          selected && 'ring-4 ring-fairy-purple/30 scale-105',
          draggable && 'cursor-grab active:cursor-grabbing'
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div
          className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300 relative"
          style={{ backgroundColor: item.coverColor }}
        >
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {item.emoji}
          </div>
          {item.isCustom && (
            <Sparkles className="absolute top-0.5 right-0.5 w-3 h-3 text-fairy-gold animate-twinkle" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-fairy text-base text-gray-800 group-hover:text-fairy-purple transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-body text-white bg-gradient-to-r flex-shrink-0',
                rarityColors.bg
              )}
            >
              {item.rarity}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-body">{item.category} · {item.storyTitle}</span>
          <p className="text-xs text-gray-600 mt-1 line-clamp-1 font-body">{item.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fairy-card overflow-hidden group cursor-pointer',
        'border-2',
        rarityColors.border,
        selected && 'ring-4 ring-fairy-purple/30 scale-105',
        draggable && 'cursor-grab active:cursor-grabbing'
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: item.coverColor }}
        />
        <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
          {item.emoji}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-body text-white bg-gradient-to-r shadow-md',
              rarityColors.bg
            )}
          >
            {item.rarity}
          </span>
          {item.isCustom && (
            <span className="px-3 py-1 rounded-full text-xs font-body text-white bg-gradient-to-r from-fairy-gold to-orange-400 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              自制
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="fairy-tag text-xs bg-white/20 backdrop-blur-sm text-white border-white/30">
              {item.category}
            </span>
          </div>
          <h3 className="font-fairy text-xl text-white drop-shadow-lg">{item.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {item.storyTitle}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-body text-gray-500 flex items-center gap-1">
              <Zap className="w-3 h-3" /> 魔力等级
            </span>
            <span className="text-xs font-body font-medium text-fairy-purple">{item.powerLevel}/100</span>
          </div>
          <div className="h-2 bg-fairy-purple/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full bg-gradient-to-r transition-all duration-500 rounded-full', rarityColors.bg)}
              style={{ width: `${item.powerLevel}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 font-body line-clamp-2 mb-3">{item.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="fairy-tag text-[10px] bg-fairy-purple/5 text-gray-600">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="fairy-tag text-[10px] bg-gray-100 text-gray-500">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface MagicItemDetailModalProps {
  item: MagicItem;
  onClose: () => void;
}

export function MagicItemDetailModal({ item, onClose }: MagicItemDetailModalProps) {
  const rarityColors = RARITY_COLORS[item.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fairy-card max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors z-10 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="relative h-56" style={{ backgroundColor: item.coverColor }}>
            <div className="w-full h-full flex items-center justify-center text-9xl">
              {item.emoji}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r shadow-lg',
                  rarityColors.bg
                )}
              >
                {item.rarity}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-body text-white bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg">
                {item.category}
              </span>
              {item.isCustom && (
                <span className="px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r from-fairy-gold to-orange-400 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  自制道具
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 -mt-8 relative">
            <h2 className="text-3xl md:text-4xl font-fairy text-gray-800 mb-2">{item.name}</h2>
            <p className="text-sm text-gray-500 font-body mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              出自《{item.storyTitle}》 · {item.storyAuthor} · {item.storyRegion}
            </p>

            {item.parentIds && item.parentIds.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-fairy-gold/10 to-fairy-purple/10 border border-fairy-purple/20">
                <p className="text-sm font-body text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fairy-gold" />
                  <span className="font-medium">融合产物：</span>
                  由 {item.parentIds.length} 件道具组合诞生
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-fairy-gold" />
                <h3 className="font-fairy text-xl text-gray-800">详细介绍</h3>
              </div>
              <p className="text-gray-700 font-body leading-relaxed bg-white/50 rounded-2xl p-4">
                {item.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-fairy-purple" />
                <h3 className="font-fairy text-xl text-gray-800">出处故事</h3>
              </div>
              <p className="text-gray-700 font-body leading-relaxed bg-white/50 rounded-2xl p-4 page-content">
                {item.originStory}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-fairy text-xl text-gray-800">能力说明</h3>
              </div>
              <div className="space-y-3">
                {item.abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-gradient-to-r from-fairy-purple/5 to-fairy-pink/5 border border-fairy-purple/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-fairy text-lg text-fairy-purple">{ability.name}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        {ability.manaCost !== undefined && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-body">
                            💎 消耗 {ability.manaCost}
                          </span>
                        )}
                        {ability.cooldown && (
                          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 font-body">
                            ⏱ 冷却 {ability.cooldown}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 font-body text-sm">{ability.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-body text-gray-500 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  魔力等级
                </span>
                <span className="text-lg font-fairy font-medium text-fairy-purple">
                  {item.powerLevel}/100
                </span>
              </div>
              <div className="h-4 bg-fairy-purple/10 rounded-full overflow-hidden">
                <div
                  className={cn('h-full bg-gradient-to-r transition-all duration-500 rounded-full', rarityColors.bg)}
                  style={{ width: `${item.powerLevel}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="fairy-tag text-sm bg-fairy-purple/5 text-gray-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
