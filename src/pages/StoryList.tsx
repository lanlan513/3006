import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Filter, Grid3X3, List, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import StoryCard from '@/components/StoryCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getFilteredStories } from '@/store/storyStore';
import { REGIONS } from '@/types';
import type { Region } from '@/types';

export default function StoryList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const stories = useStoryStore((state) => state.stories);
  const searchQuery = useStoryStore((state) => state.searchQuery);
  const selectedRegion = useStoryStore((state) => state.selectedRegion);
  const setSelectedRegion = useStoryStore((state) => state.setSelectedRegion);
  const setSearchQuery = useStoryStore((state) => state.setSearchQuery);

  const filteredStories = useMemo(
    () => getFilteredStories(stories, searchQuery, selectedRegion),
    [stories, searchQuery, selectedRegion]
  );

  useEffect(() => {
    return () => {
      setSearchQuery('');
      setSelectedRegion('全部');
    };
  }, [setSearchQuery, setSelectedRegion]);

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-body mb-6">
            <Link to="/" className="flex items-center gap-1 hover:text-fairy-purple transition-colors">
              <Home className="w-4 h-4" />
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-700">故事书架</span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-fairy text-gradient-fairy mb-3">故事书架</h1>
            <p className="text-gray-600 font-body">浏览世界各地的经典童话故事</p>
          </div>

          <div className="mb-8">
            <SearchBar size="lg" />
          </div>

          <div className="fairy-card p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-fairy-purple" />
                <span className="font-body text-gray-700">按地区筛选：</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region as Region)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                      selectedRegion === region
                        ? 'bg-gradient-fairy text-white shadow-fairy'
                        : 'bg-white/70 text-gray-600 border border-fairy-purple/20 hover:border-fairy-purple hover:text-fairy-purple'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || selectedRegion !== '全部') && (
              <div className="mt-4 pt-4 border-t border-fairy-purple/20 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 font-body">当前筛选：</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-fairy-purple/10 text-fairy-purple text-sm font-body">
                    搜索: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-fairy-purple/20 rounded-full p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedRegion !== '全部' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-fairy-pink/20 text-fairy-purple text-sm font-body">
                    地区: {selectedRegion}
                    <button
                      onClick={() => setSelectedRegion('全部')}
                      className="hover:bg-fairy-pink/30 rounded-full p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <span className="text-sm text-gray-500 font-body ml-auto">
                  共找到 <strong className="text-fairy-purple">{filteredStories.length}</strong> 个故事
                </span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-fairy-purple/20 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-body">
                共 {filteredStories.length} 个故事
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-fairy-purple text-white'
                      : 'bg-white/50 text-gray-500 hover:text-fairy-purple'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-fairy-purple text-white'
                      : 'bg-white/50 text-gray-500 hover:text-fairy-purple'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {filteredStories.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} variant="compact" />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
              <h3 className="text-2xl font-fairy text-gray-700 mb-2">没有找到相关故事</h3>
              <p className="text-gray-500 font-body mb-6">
                试试其他搜索词或清除筛选条件吧
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('全部');
                }}
                className="fairy-button"
              >
                清除筛选条件
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
