import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Crown,
  Star,
  RefreshCw,
  ArrowRight,
  Heart,
  Shuffle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import MagicItemCard, { MagicItemDetailModal } from '@/components/MagicItemCard';
import { useStoryStore, getAllMagicItems, getFilteredMagicItems } from '@/store/storyStore';
import { combineMagicItems, canCombineItems, hasSpecialRecipe, getSpecialRecipesCount } from '@/lib/combineMagicItems';
import type { MagicItem, MagicItemCategory, MagicItemRarity } from '@/types';
import { MAGIC_ITEM_CATEGORIES, MAGIC_ITEM_RARITIES, RARITY_COLORS } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, string> = {
  '全部': '✨',
  '神器': '🏆',
  '饰品': '💍',
  '服饰': '👗',
  '交通工具': '🧞',
  '植物': '🌱',
  '书籍': '📚',
  '容器': '🎁',
  '武器': '⚔️',
  '其他': '🎭',
};

export default function MagicWorkshop() {
  const baseItems = useStoryStore((state) => state.magicItems);
  const customItems = useStoryStore((state) => state.customMagicItems);
  const selectedCategory = useStoryStore((state) => state.selectedMagicItemCategory);
  const selectedRarity = useStoryStore((state) => state.selectedMagicItemRarity);
  const combineSlots = useStoryStore((state) => state.combineSlots);
  const setSelectedCategory = useStoryStore((state) => state.setSelectedMagicItemCategory);
  const setSelectedRarity = useStoryStore((state) => state.setSelectedMagicItemRarity);
  const setCombineSlot = useStoryStore((state) => state.setCombineSlot);
  const clearCombineSlots = useStoryStore((state) => state.clearCombineSlots);
  const addCustomMagicItem = useStoryStore((state) => state.addCustomMagicItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MagicItem | null>(null);
  const [isCombining, setIsCombining] = useState(false);
  const [combineResult, setCombineResult] = useState<MagicItem | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [combineError, setCombineError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<MagicItem | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  const [isDraggingFromList, setIsDraggingFromList] = useState(false);

  const allItems = useMemo(() => getAllMagicItems(baseItems, customItems), [baseItems, customItems]);

  const displayItems = useMemo(() => {
    const source = showCustomOnly ? customItems : allItems;
    return getFilteredMagicItems(source, selectedCategory, selectedRarity, searchQuery);
  }, [allItems, customItems, selectedCategory, selectedRarity, searchQuery, showCustomOnly]);

  const itemsInSlots = useMemo(
    () => combineSlots.filter((s): s is MagicItem => s !== null),
    [combineSlots]
  );

  const combineCheck = useMemo(() => canCombineItems(itemsInSlots), [itemsInSlots]);

  const isSpecialRecipe = useMemo(() => {
    if (itemsInSlots.length < 2) return false;
    return hasSpecialRecipe(itemsInSlots);
  }, [itemsInSlots]);

  const specialRecipesCount = getSpecialRecipesCount();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allItems.length };
    MAGIC_ITEM_CATEGORIES.forEach((cat) => {
      if (cat !== '全部') {
        counts[cat] = allItems.filter((i) => i.category === cat).length;
      }
    });
    return counts;
  }, [allItems]);

  const rarityCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allItems.length };
    MAGIC_ITEM_RARITIES.forEach((r) => {
      counts[r] = allItems.filter((i) => i.rarity === r).length;
    });
    return counts;
  }, [allItems]);

  const legendaryItems = useMemo(
    () => allItems.filter((i) => i.rarity === '传说' || i.rarity === '神话').slice(0, 4),
    [allItems]
  );

  const handleDragStart = (e: React.DragEvent, item: MagicItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  const handleSlotDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(index);
  };

  const handleSlotDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleSlotDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      setCombineSlot(index, draggedItem);
    }
    setDragOverSlot(null);
    setDraggedItem(null);
    setIsDraggingFromList(false);
  };

  const handleCardClick = (item: MagicItem) => {
    const emptySlotIndex = combineSlots.findIndex((s) => s === null);
    const alreadyInSlot = combineSlots.findIndex((s) => s?.id === item.id);

    if (alreadyInSlot !== -1) {
      setCombineSlot(alreadyInSlot, null);
    } else if (emptySlotIndex !== -1) {
      setCombineSlot(emptySlotIndex, item);
    } else {
      setCombineError('组合槽已满！请先移除一个道具');
      setTimeout(() => setCombineError(null), 3000);
    }
  };

  const handleCombine = async () => {
    if (!combineCheck.canCombine) {
      setCombineError(combineCheck.reason || '无法进行组合');
      setTimeout(() => setCombineError(null), 3000);
      return;
    }

    setIsCombining(true);
    setCombineError(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = combineMagicItems(itemsInSlots);
    setCombineResult(result);
    setIsCombining(false);
    setShowResultModal(true);
  };

  const handleSaveResult = () => {
    if (combineResult) {
      addCustomMagicItem(combineResult);
      clearCombineSlots();
      setShowResultModal(false);
      setCombineResult(null);
    }
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    setCombineResult(null);
  };

  const handleRandomFill = () => {
    clearCombineSlots();
    const shuffled = [...baseItems].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 2;
    shuffled.slice(0, count).forEach((item, idx) => {
      setCombineSlot(idx, item);
    });
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
            <span className="text-gray-700">魔法道具工坊</span>
          </div>
        </div>

        <section className="container mx-auto px-4 py-8 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-fairy-purple/20 shadow-sm mb-6">
            <Wand2 className="w-4 h-4 text-fairy-gold animate-twinkle" />
            <span className="text-sm font-body text-gray-600">收集与创造神奇物品</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-fairy mb-6">
            <span className="text-gradient-fairy">魔法道具工坊</span>
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto mb-8">
            探索童话世界中的神奇宝物，从魔镜到水晶鞋，从飞毯到神灯。
            拖拽多个道具进入组合法阵，创造属于你的全新幻想物品！
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索道具名称、能力或标签..."
              className="fairy-input pl-12 pr-4 w-full"
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 mb-8">
          <div className={cn(
            'rounded-3xl p-6 md:p-10 border relative overflow-hidden transition-all duration-500',
            isSpecialRecipe
              ? 'bg-gradient-to-br from-fairy-gold/20 via-fairy-pink/15 to-fairy-purple/20 border-fairy-gold/50 animate-glow'
              : 'bg-gradient-to-br from-fairy-purple/15 via-fairy-pink/10 to-fairy-gold/15 border-fairy-purple/20'
          )}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float-slow">✨</div>
              <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>⭐</div>
              <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-twinkle">💫</div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-fairy flex items-center justify-center shadow-fairy relative">
                    <Wand2 className="w-7 h-7 text-white" />
                    <Sparkles className="w-4 h-4 text-fairy-gold absolute -top-1 -right-1 animate-twinkle" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">融合炼金阵</h2>
                    <p className="text-sm text-gray-500 font-body">拖拽或点击道具加入组合槽（2-5件）</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRandomFill}
                    className="px-4 py-2 rounded-full font-body text-sm bg-white/70 border border-fairy-purple/30 text-fairy-purple hover:bg-fairy-purple hover:text-white transition-all flex items-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    随机搭配
                  </button>
                  <button
                    onClick={clearCombineSlots}
                    className="px-4 py-2 rounded-full font-body text-sm bg-white/70 border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
                {combineSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-28 h-32 md:w-32 md:h-36 rounded-2xl border-2 border-dashed transition-all duration-300 relative',
                        dragOverSlot === index
                          ? 'border-fairy-purple bg-fairy-purple/20 scale-110'
                          : slot
                            ? 'border-transparent'
                            : 'border-fairy-purple/40 bg-white/50 hover:bg-white/70 hover:border-fairy-purple'
                      )}
                      onDragOver={(e) => handleSlotDragOver(e, index)}
                      onDragLeave={handleSlotDragLeave}
                      onDrop={(e) => handleSlotDrop(e, index)}
                    >
                      {slot ? (
                        <MagicItemCard
                          item={slot}
                          variant="slot"
                          onRemove={() => setCombineSlot(index, null)}
                          onClick={() => setSelectedItem(slot)}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-fairy-purple/50">
                          <Plus className="w-8 h-8 mb-2" />
                          <span className="text-xs font-body">槽位 {index + 1}</span>
                        </div>
                      )}
                    </div>
                    {index < combineSlots.length - 1 && (
                      <div className="text-3xl text-fairy-purple font-fairy hidden sm:block">+</div>
                    )}
                  </div>
                ))}
              </div>

              {combineError && (
                <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-red-100 border border-red-200 flex items-center gap-2 text-red-600 font-body text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {combineError}
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-sm font-body">
                  {itemsInSlots.length > 0 ? (
                    <>
                      <span className="text-gray-500">已选择</span>
                      <span className="text-2xl font-fairy text-fairy-purple">{itemsInSlots.length}</span>
                      <span className="text-gray-500">件道具</span>
                      {combineCheck.canCombine ? (
                        <>
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            可以融合
                          </span>
                          {isSpecialRecipe && (
                            <span className="flex items-center gap-1 text-fairy-gold animate-twinkle font-bold">
                              <Sparkles className="w-4 h-4" />
                              ✨ 发现特殊配方！
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          {combineCheck.reason}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">从下方选择道具开始组合 ✨</span>
                  )}
                </div>

                <button
                  onClick={handleCombine}
                  disabled={!combineCheck.canCombine || isCombining}
                  className={cn(
                    'relative px-10 py-4 rounded-full font-fairy text-xl text-white shadow-fairy transition-all duration-300',
                    combineCheck.canCombine && !isCombining
                      ? 'bg-gradient-fairy hover:shadow-fairy-lg hover:-translate-y-1 animate-glow cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  {isCombining ? (
                    <span className="flex items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      融合中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      开始融合创造
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {legendaryItems.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">传说级宝物</h2>
                <p className="text-sm text-gray-500 font-body">童话世界中最强大的神奇物品</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {legendaryItems.map((item) => (
                <MagicItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCardClick(item)}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  draggable
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
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">全部道具收藏</h2>
                <p className="text-sm text-gray-500 font-body">
                  共 {displayItems.length} 件道具
                  {customItems.length > 0 && `（含 ${customItems.length} 件自制）`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCustomOnly(!showCustomOnly)}
              className={cn(
                'px-4 py-2 rounded-full font-body text-sm transition-all flex items-center gap-2',
                showCustomOnly
                  ? 'bg-gradient-to-r from-fairy-gold to-orange-400 text-white shadow-md'
                  : 'bg-white/70 border border-fairy-gold/50 text-amber-600 hover:bg-fairy-gold/10'
              )}
            >
              <Sparkles className="w-4 h-4" />
              只看自制道具
              {showCustomOnly ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 text-gray-500 font-body text-sm border border-gray-200">
                <Star className="w-4 h-4" />
                类别：
              </span>
              {MAGIC_ITEM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as MagicItemCategory)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                    selectedCategory === cat
                      ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                      : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-fairy-purple hover:text-fairy-purple'
                  )}
                >
                  <span>{categoryIcons[cat] || '📦'}</span>
                  <span>{cat}</span>
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full',
                      selectedCategory === cat ? 'bg-white/20' : 'bg-fairy-purple/10 text-fairy-purple'
                    )}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 text-gray-500 font-body text-sm border border-gray-200">
                <Heart className="w-4 h-4" />
                稀有度：
              </span>
              <button
                onClick={() => setSelectedRarity('全部')}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                  selectedRarity === '全部'
                    ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                    : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-fairy-purple hover:text-fairy-purple'
                )}
              >
                全部
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    selectedRarity === '全部' ? 'bg-white/20' : 'bg-fairy-purple/10 text-fairy-purple'
                  )}
                >
                  {rarityCounts['全部'] || 0}
                </span>
              </button>
              {MAGIC_ITEM_RARITIES.map((rarity) => {
                const colors = RARITY_COLORS[rarity];
                return (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity as MagicItemRarity)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300',
                      selectedRarity === rarity
                        ? `bg-gradient-to-r ${colors.bg} text-white shadow-md scale-105`
                        : 'bg-white/70 border border-gray-200 text-gray-600 hover:border-gray-400'
                    )}
                  >
                    {rarity}
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        selectedRarity === rarity ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {rarityCounts[rarity] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {displayItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayItems.map((item) => (
                <MagicItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCardClick(item)}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  draggable
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h2 className="text-2xl font-fairy text-gray-700 mb-2">没有找到相关道具</h2>
              <p className="text-gray-500 font-body mb-6">试试其他关键词或筛选条件吧</p>
              <button
                onClick={() => {
                  setSelectedCategory('全部');
                  setSelectedRarity('全部');
                  setSearchQuery('');
                  setShowCustomOnly(false);
                }}
                className="fairy-button inline-flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                查看全部道具
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedItem && (
        <MagicItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {showResultModal && combineResult && (
        <CombineResultModal
          result={combineResult}
          parentItems={itemsInSlots}
          onSave={handleSaveResult}
          onClose={handleCloseResult}
        />
      )}

      {isCombining && <CombiningOverlay items={itemsInSlots} />}
    </div>
  );
}

interface CombineResultModalProps {
  result: MagicItem;
  parentItems: MagicItem[];
  onSave: () => void;
  onClose: () => void;
}

function CombineResultModal({ result, parentItems, onSave, onClose }: CombineResultModalProps) {
  const rarityColors = RARITY_COLORS[result.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Sparkles
              key={i}
              className="w-6 h-6 text-fairy-gold animate-twinkle"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <div
          className={cn(
            'fairy-card overflow-hidden relative animate-bounce-soft',
            'border-4',
            rarityColors.border
          )}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fairy-gold to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors z-20 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative h-48 flex items-center justify-center" style={{ backgroundColor: result.coverColor }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            <span className="text-9xl animate-bounce-soft relative z-10 drop-shadow-2xl">
              {result.emoji}
            </span>
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r shadow-lg',
                  rarityColors.bg
                )}
              >
                {result.rarity}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-body text-white bg-gradient-to-r from-fairy-gold to-orange-400 shadow-lg flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                NEW!
              </span>
            </div>
          </div>

          <div className="p-6 -mt-8 relative z-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {result.isSpecialRecipe ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-sm font-body font-bold animate-twinkle">
                    <Crown className="w-4 h-4" />
                    🌟 传说配方！
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-body text-green-600 text-sm">融合成功！</span>
                  </>
                )}
              </div>
              <h2 className="text-3xl font-fairy text-gray-800 mb-2">{result.name}</h2>
              <p className="text-sm text-gray-500 font-body">{result.category} · 魔力 {result.powerLevel}</p>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-fairy-purple/5 to-fairy-pink/5 border border-fairy-purple/20">
              <p className="text-xs text-gray-500 font-body mb-2">融合材料：</p>
              <div className="flex flex-wrap gap-2">
                {parentItems.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-xs font-body text-gray-700 shadow-sm">
                    <span>{p.emoji}</span>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-700 font-body leading-relaxed mb-6 bg-white/50 rounded-2xl p-4">
              {result.description}
            </p>

            <div className="mb-6">
              <div className="h-3 bg-fairy-purple/10 rounded-full overflow-hidden">
                <div
                  className={cn('h-full bg-gradient-to-r rounded-full', rarityColors.bg)}
                  style={{ width: `${result.powerLevel}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full font-body font-medium text-gray-600 border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all"
              >
                丢弃
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-6 py-3 rounded-full font-body font-medium text-white bg-gradient-fairy shadow-fairy hover:shadow-fairy-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                收入收藏
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CombiningOverlay({ items }: { items: MagicItem[] }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-fairy-purple/30 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 rounded-full border-4 border-fairy-gold/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          <div className="absolute inset-8 rounded-full border-4 border-fairy-pink/30 animate-spin" style={{ animationDuration: '1.5s' }} />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {items.slice(0, 4).map((item, i) => (
                <div
                  key={item.id}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce-soft shadow-lg"
                  style={{
                    backgroundColor: item.coverColor,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <span className="text-3xl">{item.emoji}</span>
                </div>
              ))}
            </div>
          </div>

          <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-fairy-gold animate-twinkle" />
          <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 text-fairy-purple animate-twinkle" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-fairy-pink animate-twinkle" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-amber-400 animate-twinkle" style={{ animationDelay: '1.5s' }} />
        </div>

        <h2 className="text-3xl font-fairy text-white mb-3">正在融合中...</h2>
        <p className="text-white/80 font-body">古老的魔法正在交织，请耐心等待 ✨</p>
      </div>
    </div>
  );
}
