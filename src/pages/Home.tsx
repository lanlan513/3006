import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Heart, BookMarked, Users, Crown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import StoryCard from '@/components/StoryCard';
import CharacterCard from '@/components/CharacterCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getHotStories } from '@/store/storyStore';

export default function Home() {
  const allStories = useStoryStore((state) => state.stories);
  const allCharacters = useStoryStore((state) => state.characters);
  const hotStories = useMemo(() => getHotStories(allStories), [allStories]);
  const featuredCharacters = useMemo(
    () => allCharacters.filter((c) => c.isProtagonist).slice(0, 4),
    [allCharacters]
  );

  const shelfBooks = allStories.slice(0, 7);
  const shelfBooksRow2 = allStories.slice(7, 10);

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-fairy-purple/20 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-fairy-gold animate-twinkle" />
            <span className="text-sm font-body text-gray-600">欢迎来到梦幻童话世界</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-fairy mb-6">
            <span className="text-gradient-fairy">童话图书馆</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-body max-w-2xl mx-auto mb-10">
            收集世界各地经典童话故事，让每一个故事都带你进入梦幻的世界。
            适合儿童和成人共同浏览的温馨阅读空间。
          </p>

          <SearchBar size="lg" />

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/stories" className="fairy-button inline-flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              开始阅读
            </Link>
            <Link to="/characters" className="fairy-button-outline inline-flex items-center gap-2">
              <Crown className="w-5 h-5" />
              角色大厅
            </Link>
            <a href="#bookshelf" className="fairy-button-outline inline-flex items-center gap-2">
              <BookMarked className="w-5 h-5" />
              浏览书架
            </a>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-sunset flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">热门童话</h2>
                <p className="text-sm text-gray-500 font-body">大家都在读的精彩故事</p>
              </div>
            </div>
            <Link
              to="/stories"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotStories.slice(0, 4).map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          <Link
            to="/stories"
            className="md:hidden mt-6 flex items-center justify-center gap-1 text-fairy-purple font-body"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-rainbow flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">角色大厅</h2>
                <p className="text-sm text-gray-500 font-body">认识童话世界的精彩角色</p>
              </div>
            </div>
            <Link
              to="/characters"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          <Link
            to="/characters"
            className="md:hidden mt-6 flex items-center justify-center gap-1 text-fairy-purple font-body"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section id="bookshelf" className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-mint flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">梦幻书架</h2>
              <p className="text-sm text-gray-500 font-body">精心收藏的世界经典童话</p>
            </div>
          </div>

          <div className="relative py-8 px-4 md:px-8">
            <div className="relative bg-gradient-bookshelf rounded-2xl p-6 md:p-10 shadow-fairy-lg">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/20 to-transparent rounded-t-2xl" />

              <div className="flex items-end justify-center gap-3 md:gap-6 flex-wrap mb-6">
                {shelfBooks.map((story) => (
                  <StoryCard key={story.id} story={story} variant="shelf" />
                ))}
              </div>

              <div className="bookshelf-shelf mb-10" />

              <div className="flex items-end justify-center gap-3 md:gap-6 flex-wrap mb-6">
                {shelfBooksRow2.map((story) => (
                  <StoryCard key={story.id} story={story} variant="shelf" />
                ))}
                <div className="w-24 h-36 md:w-28 md:h-44 rounded-r-lg bg-gradient-to-br from-amber-800 to-amber-950 shadow-book flex items-center justify-center opacity-60">
                  <span className="text-white/60 font-fairy text-sm rotate-180 writing-mode-vertical">
                    更多故事
                  </span>
                </div>
              </div>

              <div className="bookshelf-shelf" />
            </div>

            <div className="text-center mt-8">
              <Link to="/stories" className="fairy-button inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                探索更多故事
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-16 py-12 bg-white/50 backdrop-blur-sm border-t border-fairy-purple/20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-fairy flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-fairy text-xl text-gradient-fairy">童话图书馆</span>
            </div>
            <p className="text-sm text-gray-500 font-body">
              用故事编织梦想，让阅读点亮童心 ✨
            </p>
            <p className="text-xs text-gray-400 font-body mt-2">
              © 2024 Fairy Tale Library. Made with ❤️ for dreamers of all ages.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
