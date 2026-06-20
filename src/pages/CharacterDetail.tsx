import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  ArrowLeft,
  User,
  BookOpen,
  Sparkles,
  Heart,
  Star,
  Eye,
  Smile,
  Moon,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CharacterCard from '@/components/CharacterCard';
import StoryCard from '@/components/StoryCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getCharacterById, getStoryById, getCharactersByStoryId } from '@/store/storyStore';

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allCharacters = useStoryStore((state) => state.characters);
  const allStories = useStoryStore((state) => state.stories);
  const enterDream = useStoryStore((state) => state.enterDream);

  const character = useMemo(() => getCharacterById(allCharacters, id || ''), [allCharacters, id]);
  const story = useMemo(
    () => (character ? getStoryById(allStories, character.storyId) : undefined),
    [allStories, character]
  );
  const relatedCharacters = useMemo(
    () => (character ? getCharactersByStoryId(allCharacters, character.storyId).filter((c) => c.id !== character.id) : []),
    [allCharacters, character]
  );

  if (!character) {
    return (
      <div className="min-h-screen relative">
        <FloatingDecorations />
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-3xl font-fairy text-gray-700 mb-4">角色不存在</h2>
          <p className="text-gray-500 font-body mb-6">找不到你要找的童话角色</p>
          <Link to="/characters" className="fairy-button inline-flex items-center gap-2">
            <User className="w-5 h-5" />
            返回角色大厅
          </Link>
        </div>
      </div>
    );
  }

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
            <Link to="/characters" className="hover:text-fairy-purple transition-colors">
              角色大厅
            </Link>
            <span>/</span>
            <span className="text-gray-700 line-clamp-1">{character.name}</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-fairy-purple/20 text-gray-600 font-body hover:text-fairy-purple hover:border-fairy-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上一页
          </button>

          <div className="fairy-card p-6 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div
                  className="w-56 h-72 md:w-64 md:h-80 rounded-2xl shadow-fairy-lg overflow-hidden relative group"
                  style={{ backgroundColor: character.coverColor }}
                >
                  <img
                    src={character.coverImage}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="font-fairy text-2xl text-white drop-shadow-lg">{character.name}</h2>
                  </div>
                  {character.isProtagonist && (
                    <div className="absolute top-3 left-3 bg-fairy-gold/90 text-white px-3 py-1 rounded-full text-xs font-body font-medium flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" />
                      主角
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-fairy text-gray-800 mb-2">{character.name}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="fairy-tag text-sm">{character.type}</span>
                      {story && (
                        <Link
                          to={`/stories/${story.id}`}
                          className="inline-flex items-center gap-1 text-sm text-fairy-purple hover:underline font-body"
                        >
                          <BookOpen className="w-4 h-4" />
                          {character.storyTitle}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-fairy flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-fairy text-xl text-gray-800">角色简介</h3>
                    </div>
                    <p className="text-gray-600 font-body leading-relaxed ml-10">{character.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-sunset flex items-center justify-center">
                        <Smile className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-fairy text-xl text-gray-800">性格特点</h3>
                    </div>
                    <p className="text-gray-600 font-body leading-relaxed ml-10">{character.personality}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-mint flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-fairy text-xl text-gray-800">外貌描写</h3>
                    </div>
                    <p className="text-gray-600 font-body leading-relaxed ml-10">{character.appearance}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-rainbow flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-fairy text-xl text-gray-800">性格标签</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-10">
                      {character.traits.map((trait) => (
                        <span key={trait} className="fairy-tag">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-fairy-purple/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-fairy text-xl text-gray-800">夜晚降临</h3>
                    </div>
                    <div className="ml-10 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          enterDream(character.id);
                          navigate('/dream-world');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-body transition-all duration-300 hover:scale-105 shadow-md"
                        style={{
                          background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #D946EF 100%)',
                        }}
                      >
                        <Moon className="w-4 h-4" />
                        进入 {character.name} 的梦境
                      </button>
                      <p className="text-xs text-gray-500 font-body flex items-center">
                        探索 {character.name} 内心隐藏的愿望与恐惧
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {story && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-fairy flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-fairy text-gray-800">所属故事</h2>
                  <p className="text-sm text-gray-500 font-body">阅读完整故事了解更多</p>
                </div>
              </div>
              <div className="max-w-md">
                <StoryCard story={story} variant="compact" />
              </div>
            </div>
          )}

          {relatedCharacters.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-sunset flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-fairy text-gray-800">同故事其他角色</h2>
                  <p className="text-sm text-gray-500 font-body">《{character.storyTitle}》中的其他角色</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedCharacters.map((c) => (
                  <CharacterCard key={c.id} character={c} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
