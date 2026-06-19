import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wand2 } from 'lucide-react';
import { useStoryStore } from '@/store/storyStore';

interface SearchBarProps {
  size?: 'sm' | 'lg';
}

export default function SearchBar({ size = 'lg' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const setSearchQuery = useStoryStore((state) => state.setSearchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    navigate('/stories');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-fairy rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        <div
          className={`relative flex items-center bg-white/90 backdrop-blur-sm rounded-full border-2 border-fairy-purple/30 shadow-fairy group-hover:border-fairy-purple group-hover:shadow-fairy-lg transition-all duration-300 ${
            size === 'lg' ? 'pl-6 pr-4 py-4' : 'pl-4 pr-3 py-2'
          }`}
        >
          <Wand2
            className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-fairy-purple mr-3 group-hover:rotate-45 transition-transform duration-300`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={size === 'lg' ? '搜索你喜欢的童话故事...' : '搜索...'}
            className={`flex-1 bg-transparent outline-none font-body text-gray-700 placeholder-gray-400 ${
              size === 'lg' ? 'text-lg' : 'text-sm'
            }`}
          />
          <button
            type="submit"
            className={`${
              size === 'lg'
                ? 'fairy-button px-6 py-2'
                : 'px-4 py-1.5 rounded-full bg-gradient-fairy text-white text-sm font-body'
            } flex items-center gap-2 ml-2`}
          >
            <Search className={`${size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
            {size === 'lg' && '搜索'}
          </button>
        </div>
      </div>
    </form>
  );
}
