import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Sparkles, Menu, X } from 'lucide-react';
import { useStoryStore } from '@/store/storyStore';

export default function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const setSearchQuery = useStoryStore((state) => state.setSearchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
    navigate('/stories');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-fairy-purple/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-fairy flex items-center justify-center shadow-fairy group-hover:animate-glow transition-all duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-fairy-gold absolute -top-1 -right-1 animate-twinkle" />
            </div>
            <div>
              <h1 className="text-2xl font-fairy text-gradient-fairy leading-tight">童话图书馆</h1>
              <p className="text-xs text-gray-500 font-body">Fairy Tale Library</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-body text-gray-700 hover:text-fairy-purple transition-colors duration-300 relative group"
            >
              首页
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fairy group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/stories"
              className="font-body text-gray-700 hover:text-fairy-purple transition-colors duration-300 relative group"
            >
              故事书架
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fairy group-hover:w-full transition-all duration-300" />
            </Link>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索童话故事..."
                className="fairy-input pl-12 pr-4 w-64 text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
            </form>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-fairy-purple/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-fairy-purple" />
            ) : (
              <Menu className="w-6 h-6 text-fairy-purple" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-2">
            <Link
              to="/"
              className="block font-body text-gray-700 hover:text-fairy-purple transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              to="/stories"
              className="block font-body text-gray-700 hover:text-fairy-purple transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              故事书架
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索童话故事..."
                className="fairy-input pl-12 pr-4 w-full text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
