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
  Users,
  GitBranch,
  RotateCcw,
  Play,
  Heart as HeartFilled,
  CloudRain,
  HelpCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoryCard from '@/components/StoryCard';
import CharacterCard from '@/components/CharacterCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import StoryTree from '@/components/StoryTree';
import {
  useStoryStore,
  getStoryById,
  getCharactersByStoryId,
  getInteractiveStoryByStoryId,
} from '@/store/storyStore';
import type { StoryNode, EndingType } from '@/types';

type ReadingMode = 'classic' | 'interactive';

const getEndingIcon = (type?: EndingType) => {
  switch (type) {
    case 'happy':
      return HeartFilled;
    case 'sad':
      return CloudRain;
    case 'neutral':
      return HelpCircle;
    case 'secret':
      return Sparkles;
    default:
      return Sparkles;
  }
};

const getEndingGradient = (type?: EndingType) => {
  switch (type) {
    case 'happy':
      return 'from-pink-400 via-rose-400 to-red-400';
    case 'sad':
      return 'from-blue-400 via-indigo-400 to-purple-400';
    case 'neutral':
      return 'from-gray-400 via-slate-400 to-zinc-400';
    case 'secret':
      return 'from-amber-400 via-yellow-400 to-orange-400';
    default:
      return 'from-fairy-purple via-fairy-pink to-fairy-gold';
  }
};

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stories = useStoryStore((state) => state.stories);
  const allCharacters = useStoryStore((state) => state.characters);
  const interactiveStories = useStoryStore((state) => state.interactiveStories);
  const storyProgress = useStoryStore((state) => state.storyProgress);
  const likedStories = useStoryStore((state) => state.likedStories);
  const toggleLike = useStoryStore((state) => state.toggleLike);
  const initStoryProgress = useStoryStore((state) => state.initStoryProgress);
  const setCurrentNode = useStoryStore((state) => state.setCurrentNode);
  const recordChoice = useStoryStore((state) => state.recordChoice);
  const addVisitedNode = useStoryStore((state) => state.addVisitedNode);
  const addDiscoveredEnding = useStoryStore((state) => state.addDiscoveredEnding);
  const resetStoryProgress = useStoryStore((state) => state.resetStoryProgress);

  const story = useMemo(() => getStoryById(stories, id || ''), [stories, id]);
  const interactiveStory = useMemo(
    () => (id ? getInteractiveStoryByStoryId(interactiveStories, id) : undefined),
    [interactiveStories, id]
  );
  const isLiked = useMemo(() => (id ? likedStories.has(id) : false), [likedStories, id]);
  const storyCharacters = useMemo(
    () => (id ? getCharactersByStoryId(allCharacters, id) : []),
    [allCharacters, id]
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>('classic');
  const [showStoryTree, setShowStoryTree] = useState(false);
  const [showEndingModal, setShowEndingModal] = useState(false);
  const [endingNode, setEndingNode] = useState<StoryNode | null>(null);

  const progress = interactiveStory ? storyProgress[interactiveStory.id] : undefined;
  const currentInteractiveNode = useMemo(() => {
    if (!interactiveStory || !progress) return null;
    return interactiveStory.nodes[progress.currentNodeId] || null;
  }, [interactiveStory, progress]);

  useEffect(() => {
    setCurrentPage(0);
    setReadingMode('classic');
    setShowStoryTree(false);
    setShowEndingModal(false);
    setEndingNode(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (interactiveStory && readingMode === 'interactive') {
      initStoryProgress(interactiveStory.id, interactiveStory.startNodeId);
    }
  }, [interactiveStory, readingMode, initStoryProgress]);

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

  const handleChoice = (choiceId: string, nextNodeId: string) => {
    if (!interactiveStory || !progress || !currentInteractiveNode) return;

    recordChoice(interactiveStory.id, progress.currentNodeId, choiceId);

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentNode(interactiveStory.id, nextNodeId);
      addVisitedNode(interactiveStory.id, nextNodeId);

      const nextNode = interactiveStory.nodes[nextNodeId];
      if (nextNode && nextNode.type === 'ending') {
        addDiscoveredEnding(interactiveStory.id, nextNodeId);
        setEndingNode(nextNode);
        setTimeout(() => setShowEndingModal(true), 400);
      }

      setIsAnimating(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 300);
  };

  const handleRestartStory = () => {
    if (!interactiveStory) return;
    resetStoryProgress(interactiveStory.id, interactiveStory.startNodeId);
    setShowEndingModal(false);
    setEndingNode(null);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleTreeNodeClick = (nodeId: string) => {
    if (!interactiveStory || !progress) return;
    if (!progress.visitedNodes.includes(nodeId)) return;
    setCurrentNode(interactiveStory.id, nodeId);
    setShowStoryTree(false);
  };

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

                  {interactiveStory && (
                    <div className="w-full mt-2 p-1 bg-fairy-purple/10 rounded-full flex">
                      <button
                        onClick={() => setReadingMode('classic')}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                          readingMode === 'classic'
                            ? 'bg-white shadow-md text-fairy-purple'
                            : 'text-gray-600 hover:text-fairy-purple'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        经典阅读
                      </button>
                      <button
                        onClick={() => setReadingMode('interactive')}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                          readingMode === 'interactive'
                            ? 'bg-gradient-fairy shadow-md text-white'
                            : 'text-gray-600 hover:text-fairy-purple'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        命运选择器
                      </button>
                    </div>
                  )}

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

          {readingMode === 'classic' ? (
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
          ) : (
            interactiveStory && progress && currentInteractiveNode && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-fairy flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-fairy text-gray-800">{interactiveStory.title}</h2>
                    <p className="text-sm text-gray-500 font-body">
                      已探索 {progress.visitedNodes.length} 个节点 · 发现 {progress.discoveredEndings.length} 个结局
                    </p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => setShowStoryTree(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-fairy-purple/30 text-fairy-purple font-body text-sm hover:bg-fairy-purple hover:text-white transition-all duration-300"
                    >
                      <GitBranch className="w-4 h-4" />
                      剧情地图
                    </button>
                    <button
                      onClick={handleRestartStory}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-fairy-purple/30 text-fairy-purple font-body text-sm hover:bg-fairy-purple hover:text-white transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重新开始
                    </button>
                  </div>
                </div>

                <div className="page-content relative overflow-hidden min-h-[300px]">
                  <div
                    className={`transition-all duration-300 ${
                      isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}
                  >
                    {currentInteractiveNode.type === 'ending' ? (
                      <div className="text-center py-4">
                        <div
                          className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${getEndingGradient(
                            currentInteractiveNode.endingType
                          )} flex items-center justify-center shadow-xl`}
                        >
                          {(() => {
                            const Icon = getEndingIcon(currentInteractiveNode.endingType);
                            return <Icon className="w-10 h-10 text-white" />;
                          })()}
                        </div>
                        <h3 className="text-3xl font-fairy text-gradient-fairy mb-4">
                          {currentInteractiveNode.endingTitle}
                        </h3>
                        <p className="text-gray-500 font-body text-sm mb-6">
                          {currentInteractiveNode.endingType === 'happy' && '✨ 恭喜你达成了快乐结局！'}
                          {currentInteractiveNode.endingType === 'sad' && '💧 这是一个悲伤的结局...'}
                          {currentInteractiveNode.endingType === 'neutral' && '📖 故事在此告一段落'}
                          {currentInteractiveNode.endingType === 'secret' && '🌟 你发现了隐藏结局！'}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-fairy-purple/10 text-fairy-purple text-xs font-body mb-4">
                          {currentInteractiveNode.type === 'start' && '📖 故事开始'}
                          {currentInteractiveNode.type === 'normal' && '📜 剧情发展'}
                          {currentInteractiveNode.type === 'choice' && '🔀 命运抉择'}
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-gray-700 font-body leading-loose text-lg ${
                        currentInteractiveNode.type === 'start' ? 'drop-cap' : ''
                      }`}
                    >
                      {currentInteractiveNode.content}
                    </p>
                  </div>
                </div>

                {currentInteractiveNode.choices && currentInteractiveNode.choices.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-fairy text-gray-700 mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-fairy-purple" />
                      做出你的选择
                    </h4>
                    <div className="grid gap-3">
                      {currentInteractiveNode.choices.map((choice, index) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id, choice.nextNodeId)}
                          disabled={isAnimating}
                          className="group w-full text-left p-4 rounded-2xl bg-white/80 border-2 border-fairy-purple/20 hover:border-fairy-purple hover:bg-gradient-to-r hover:from-fairy-purple/5 hover:to-fairy-pink/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-fairy flex items-center justify-center text-white font-body font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <p className="flex-1 text-gray-700 font-body leading-relaxed group-hover:text-fairy-purple transition-colors duration-300">
                              {choice.text}
                            </p>
                            <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-fairy-purple group-hover:translate-x-1 transition-all duration-300 mt-0.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentInteractiveNode.type === 'ending' && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleRestartStory}
                      className="fairy-button inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      重新探索故事
                    </button>
                    <button
                      onClick={() => setShowStoryTree(true)}
                      className="fairy-button-outline inline-flex items-center gap-2"
                    >
                      <GitBranch className="w-5 h-5" />
                      查看剧情地图
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {storyCharacters.length > 0 && (
            <div className="mt-16 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-rainbow flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-fairy text-gray-800">故事角色</h2>
                  <p className="text-sm text-gray-500 font-body">《{story.title}》中的精彩角色</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {storyCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} variant="compact" />
                ))}
              </div>
            </div>
          )}

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

      {showStoryTree && interactiveStory && progress && (
        <StoryTree
          interactiveStory={interactiveStory}
          visitedNodes={progress.visitedNodes}
          currentNodeId={progress.currentNodeId}
          discoveredEndings={progress.discoveredEndings}
          onNodeClick={handleTreeNodeClick}
          onClose={() => setShowStoryTree(false)}
        />
      )}

      {showEndingModal && endingNode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="fairy-card w-full max-w-lg overflow-hidden animate-bounce-soft">
            <div
              className={`h-32 bg-gradient-to-br ${getEndingGradient(endingNode.endingType)} flex items-center justify-center relative`}
            >
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-white/30 animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${12 + Math.random() * 16}px`,
                      height: `${12 + Math.random() * 16}px`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10">
                {(() => {
                  const Icon = getEndingIcon(endingNode.endingType);
                  return <Icon className="w-12 h-12 text-white" />;
                })()}
              </div>
            </div>

            <div className="p-8 text-center">
              <div className="inline-block px-4 py-1 rounded-full bg-fairy-purple/10 text-fairy-purple text-sm font-body mb-4">
                {endingNode.endingType === 'happy' && '🎊 快乐结局'}
                {endingNode.endingType === 'sad' && '😢 悲伤结局'}
                {endingNode.endingType === 'neutral' && '📖 普通结局'}
                {endingNode.endingType === 'secret' && '🌟 隐藏结局！'}
              </div>
              <h3 className="text-3xl font-fairy text-gray-800 mb-4">{endingNode.endingTitle}</h3>
              <p className="text-gray-600 font-body leading-relaxed mb-6">{endingNode.content}</p>

              {interactiveStory && progress && (
                <p className="text-sm text-gray-500 font-body mb-6">
                  你已发现 {progress.discoveredEndings.length}/
                  {Object.values(interactiveStory.nodes).filter((n) => n.type === 'ending').length} 个结局
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleRestartStory} className="fairy-button inline-flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  再次探索
                </button>
                <button
                  onClick={() => {
                    setShowEndingModal(false);
                    setShowStoryTree(true);
                  }}
                  className="fairy-button-outline inline-flex items-center gap-2"
                >
                  <GitBranch className="w-5 h-5" />
                  查看剧情地图
                </button>
              </div>

              <button
                onClick={() => setShowEndingModal(false)}
                className="mt-4 text-gray-500 font-body text-sm hover:text-fairy-purple transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
