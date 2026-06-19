import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  BookOpen,
  Share2,
  Heart,
  Sparkles,
  Check,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoryCard from '@/components/StoryCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getStoryById } from '@/store/storyStore';

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stories = useStoryStore((state) => state.stories);
  const toggleLike = useStoryStore((state) => state.toggleLike);
  const isLiked = useStoryStore((state) => (id ? state.likedStories.has(id) : false));
  const story = useMemo(() => getStoryById(stories, id || ''), [stories, id]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!story) {
    return (
      <div className="min-h-screen relative">
        <FloatingDecorations />
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-fairy-purple/10 flex items-center justify-center">
            <span className="text-5xl">📖</span>
          </div>
          <h2 className="text-3xl font-fairy text-gray-700 mb-4">故事不存在</h2>
          <p className="text-gray-500 font-body mb-6">找不到你要找的童话故事</p>
          <Link to="/stories" className="fairy-button inline-flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            返回故事书架
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = story.content.length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsAnimating(false);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }, 300);
    }
  };

  const relatedStories = useMemo(() => {
    const sameRegion = stories.filter((s) => s.id !== story.id && s.region === story.region).slice(0, 3);
    if (sameRegion.length >= 3) return sameRegion;
    const additional = stories.filter((s) => s.id !== story.id && !sameRegion.includes(s)).slice(0, 3 - sameRegion.length);
    return [...sameRegion, ...additional];
  }, [stories, story]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `《${story.title}》- 童话图书馆`;
    const shareText = `来读一读${story.region}经典童话故事《${story.title}》吧！`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
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
            <Link to="/stories" className="hover:text-fairy-purple transition-colors">
              故事书架
            </Link>
            <span>/</span>
            <span className="text-gray-700 line-clamp-1">{story.title}</span>
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
                  className="w-48 h-64 md:w-56 md:h-72 rounded-2xl shadow-fairy-lg overflow-hidden relative group"
                  style={{ backgroundColor: story.coverColor }}
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="font-fairy text-2xl text-white drop-shadow-lg">{story.title}</h2>
                  </div>
                  {story.isHot && (
                    <div className="absolute top-3 right-3 bg-fairy-gold/90 text-white px-3 py-1 rounded-full text-xs font-body font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      热门
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-fairy text-gray-800 mb-4">{story.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-fairy-purple" />
                    <span className="font-body">作者：{story.author}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-fairy-purple" />
                    <span className="font-body">地区：{story.region}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-fairy-purple" />
                    <span className="font-body">共 {totalPages} 段</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {story.tags.map((tag) => (
                    <span key={tag} className="fairy-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 font-body leading-relaxed mb-6">{story.summary}</p>

                <div className="flex flex-wrap gap-3 relative">
                  <button
                    onClick={() => id && toggleLike(id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/70 border border-fairy-purple/20 text-gray-600 hover:border-red-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? '已收藏' : '收藏故事'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 border border-fairy-purple/20 text-gray-600 font-body hover:border-fairy-purple hover:text-fairy-purple transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    分享故事
                  </button>

                  {showShareToast && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-soft">
                      <Check className="w-4 h-4" />
                      <span className="font-body text-sm">链接已复制到剪贴板</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-fairy-purple" />
              <h2 className="text-2xl font-fairy text-gray-800">开始阅读</h2>
              <span className="text-sm text-gray-500 font-body ml-auto">
                第 {currentPage + 1} / {totalPages} 页
              </span>
            </div>

            <div className="page-content relative overflow-hidden">
              <div
                className={`transition-all duration-300 ${
                  isAnimating ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'
                }`}
              >
                <p
                  className={`text-gray-700 font-body leading-loose text-lg ${
                    currentPage === 0 ? 'drop-cap' : ''
                  }`}
                >
                  {story.content[currentPage]}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body transition-all duration-300 ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'fairy-button-outline'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                上一页
              </button>

              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let pageNum = i;
                  if (totalPages > 10) {
                    if (currentPage < 5) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 6) {
                      pageNum = totalPages - 10 + i;
                    } else {
                      pageNum = currentPage - 4 + i;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-full font-body text-sm transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-gradient-fairy text-white shadow-fairy'
                          : 'bg-white/70 text-gray-600 hover:bg-fairy-purple/10'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body transition-all duration-300 ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'fairy-button'
                }`}
              >
                下一页
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-fairy transition-all duration-500 rounded-full"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
          </div>

          {relatedStories.length > 0 && (
            <div className="mt-16 mb-8">
              <h2 className="text-2xl font-fairy text-gray-800 mb-6">你可能还喜欢</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedStories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
