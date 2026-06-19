import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles, Crown, Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CharacterCard from '@/components/CharacterCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getFilteredCharacters } from '@/store/storyStore';
import { CHARACTER_TYPES, type CharacterType } from '@/types';

const typeIcons: Record<string, string> = {
  '全部': '✨',
  '公主': '👸',
  '王子': '🤴',
  '巫师': '🧙',
  '巨龙': '🐉',
  '精灵': '🧝',
  '动物': '🦊',
  '女巫': '🧙‍♀️',
  '国王': '👑',
  '王后': '👸',
  '矮人': '⛏️',
  '人鱼': '🧜',
  '猎人': '🏹',
  '仙女': '🧚',
  '其他': '📚',
};

export default function CharacterHall() {
  const allCharacters = useStoryStore((state) => state.characters);
  const selectedType = useStoryStore((state) => state.selectedCharacterType);
  const setSelectedType = useStoryStore((state) => state.setSelectedCharacterType);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = useMemo(() => {
    let result = getFilteredCharacters(allCharacters, selectedType);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.type.toLowerCase().includes(query) ||
          c.storyTitle.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.traits.some((t) => t.toLowerCase().includes(query))
      );
    }
    return result;
  }, [allCharacters, selectedType, searchQuery]);

  const protagonists = useMemo(() => {
    return allCharacters.filter((c) => c.isProtagonist).slice(0, 4);
  }, [allCharacters]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': allCharacters.length };
    CHARACTER_TYPES.forEach((type) => {
      if (type !== '全部') {
        counts[type] = allCharacters.filter((c) => c.type === type).length;
      }
    });
    return counts;
  }, [allCharacters]);

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
            <span className="text-gray-700">角色大厅</span>
          </div>
        </div>

        <section className="container mx-auto px-4 py-8 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-fairy-purple/20 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-fairy-gold animate-twinkle" />
            <span className="text-sm font-body text-gray-600">探索童话世界的精彩角色</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-fairy mb-6">
            <span className="text-gradient-fairy">角色大厅</span>
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto mb-8">
            走进童话世界，认识那些陪伴我们成长的经典角色。
            从善良的公主到勇敢的王子，从神秘的巫师到可爱的动物，每一个角色都有动人的故事。
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索角色名称、故事或特征..."
              className="fairy-input pl-12 pr-4 w-full"
            />
          </div>
        </section>

        {protagonists.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">人气主角</h2>
                <p className="text-sm text-gray-500 font-body">故事中最受欢迎的主角们</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {protagonists.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-rainbow flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">按类型筛选</h2>
              <p className="text-sm text-gray-500 font-body">找到你喜欢的角色类型</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {CHARACTER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as CharacterType)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-gradient-fairy text-white shadow-fairy scale-105'
                    : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-fairy-purple hover:text-fairy-purple'
                }`}
              >
                <span>{typeIcons[type] || '📖'}</span>
                <span>{type}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedType === type ? 'bg-white/20' : 'bg-fairy-purple/10 text-fairy-purple'
                  }`}
                >
                  {typeCounts[type] || 0}
                </span>
              </button>
            ))}
          </div>

          {filteredCharacters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h2 className="text-2xl font-fairy text-gray-700 mb-2">没有找到相关角色</h2>
              <p className="text-gray-500 font-body mb-6">试试其他关键词或筛选条件吧</p>
              <button
                onClick={() => {
                  setSelectedType('全部');
                  setSearchQuery('');
                }}
                className="fairy-button inline-flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                查看全部角色
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
