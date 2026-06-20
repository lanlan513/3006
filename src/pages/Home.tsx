import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Heart, BookMarked, Users, Crown, Globe, GitBranch, Wand2, Star, Gift, ScrollText, Trophy, Film, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import StoryCard from '@/components/StoryCard';
import CharacterCard from '@/components/CharacterCard';
import CreatureCard from '@/components/CreatureCard';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore, getHotStories, getInteractiveStoryByStoryId } from '@/store/storyStore';

export default function Home() {
  const allStories = useStoryStore((state) => state.stories);
  const allCharacters = useStoryStore((state) => state.characters);
  const allCreatures = useStoryStore((state) => state.creatures);
  const unlockedCreatures = useStoryStore((state) => state.unlockedCreatures);
  const interactiveStories = useStoryStore((state) => state.interactiveStories);
  const storyProgress = useStoryStore((state) => state.storyProgress);
  const hotStories = useMemo(() => getHotStories(allStories), [allStories]);
  const featuredCharacters = useMemo(
    () => allCharacters.filter((c) => c.isProtagonist).slice(0, 4),
    [allCharacters]
  );
  const featuredCreatures = useMemo(
    () => allCreatures.slice(0, 4),
    [allCreatures]
  );

  const interactiveStoriesWithData = useMemo(() => {
    return interactiveStories
      .map((is) => {
        const story = allStories.find((s) => s.id === is.storyId);
        const progress = storyProgress[is.id];
        const endingCount = Object.values(is.nodes).filter((n) => n.type === 'ending').length;
        return {
          interactiveStory: is,
          story,
          progress,
          endingCount,
          foundCount: progress?.discoveredEndings.length || 0,
        };
      })
      .filter((item) => item.story);
  }, [interactiveStories, allStories, storyProgress]);

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
            <a href="#fate-chooser" className="fairy-button inline-flex items-center gap-2 relative overflow-hidden">
              <Wand2 className="w-5 h-5" />
              命运选择器
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                NEW
              </span>
            </a>
            <Link to="/creature-pedia" className="fairy-button inline-flex items-center gap-2 relative overflow-hidden">
              <ScrollText className="w-5 h-5" />
              生物图鉴
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-purple to-pink-500 text-white text-[10px] rounded-full font-body font-bold shadow-md animate-twinkle">
                NEW
              </span>
            </Link>
            <Link to="/fairy-theater" className="fairy-button inline-flex items-center gap-2 relative overflow-hidden">
              <Film className="w-5 h-5" />
              童话剧场
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md animate-twinkle">
                NEW
              </span>
            </Link>
            <Link to="/magic-workshop" className="fairy-button-outline inline-flex items-center gap-2 relative overflow-hidden">
              <Gift className="w-5 h-5" />
              道具工坊
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-purple to-pink-400 text-white text-[10px] rounded-full font-body font-bold shadow-md animate-twinkle">
                NEW
              </span>
            </Link>
            <Link to="/fairy-map" className="fairy-button-outline inline-flex items-center gap-2">
              <Globe className="w-5 h-5" />
              童话地图
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

        <section id="fate-chooser" className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-fairy flex items-center justify-center relative">
                <GitBranch className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                  NEW
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">童话命运选择器</h2>
                <p className="text-sm text-gray-500 font-body">你的选择，决定故事的结局</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-fairy-purple/10 via-fairy-pink/5 to-fairy-gold/10 rounded-3xl p-6 md:p-8 mb-8 border border-fairy-purple/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-fairy flex items-center justify-center shadow-fairy flex-shrink-0">
                <Wand2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-fairy text-xl md:text-2xl text-gray-800 mb-2">
                  改写经典童话，由你书写命运
                </h3>
                <p className="text-gray-600 font-body leading-relaxed">
                  当灰姑娘面临舞会的邀请，当小红帽路遇森林中的大灰狼……
                  你会做出怎样的选择？每一个决定都将开启全新的故事分支，
                  探索不同的结局，解锁隐藏剧情，绘制属于你的童话命运地图！
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {interactiveStoriesWithData.map(({ interactiveStory, story, endingCount, foundCount, progress }) => (
              <div key={interactiveStory.id} className="fairy-card p-5 group hover:shadow-fairy-lg transition-all duration-300">
                <Link to={`/stories/${story.id}?mode=interactive`} className="block">
                  <div className="flex gap-4">
                    <div
                      className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300 relative"
                      style={{ backgroundColor: story.coverColor }}
                    >
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-fairy text-white text-[10px] rounded-full font-body font-medium flex items-center gap-1 shadow-md">
                        <Wand2 className="w-3 h-3" />
                        互动
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-fairy text-lg text-gray-800 group-hover:text-fairy-purple transition-colors mb-1">
                        {interactiveStory.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-body mb-2">
                        作者：{story.author} · {story.region}
                      </p>
                      <p className="text-sm text-gray-600 font-body line-clamp-2 mb-3">
                        {story.summary}
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-body text-gray-500">结局收集</span>
                          <span className="text-xs font-body font-medium text-fairy-purple">
                            {foundCount}/{endingCount}
                          </span>
                        </div>
                        <div className="h-2 bg-fairy-purple/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-fairy transition-all duration-500 rounded-full"
                            style={{ width: `${endingCount > 0 ? (foundCount / endingCount) * 100 : 0}%` }}
                          />
                        </div>
                        {foundCount === 0 && (
                          <p className="text-xs text-fairy-purple font-body mt-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            点击开始你的第一次探索！
                          </p>
                        )}
                        {foundCount > 0 && foundCount < endingCount && (
                          <p className="text-xs text-amber-600 font-body mt-2 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            继续探索，发现更多结局
                          </p>
                        )}
                        {foundCount === endingCount && (
                          <p className="text-xs text-green-600 font-body mt-2 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            恭喜！已收集全部结局
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Fairy Theater Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-rainbow flex items-center justify-center relative">
                <Film className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                  NEW
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">童话剧场</h2>
                <p className="text-sm text-gray-500 font-body">自由编排，演出属于你的童话故事</p>
              </div>
            </div>
            <Link
              to="/fairy-theater"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              立即创作 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-amber-100/50 via-fairy-pink/30 to-fairy-purple/20 rounded-3xl p-6 md:p-8 mb-6 border border-fairy-purple/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-rainbow flex items-center justify-center shadow-fairy flex-shrink-0 relative overflow-hidden">
                <Film className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-fairy text-xl md:text-2xl text-gray-800 mb-2">
                  拖拽角色道具，亲手导演童话大戏
                </h3>
                <p className="text-gray-600 font-body leading-relaxed mb-4">
                  从丰富的资源库中选择公主、王子、女巫等角色，搭配森林、城堡、海底等梦幻背景，
                  添加魔法道具和场景元素，编写精彩对白和剧情。支持多幕剧创作、动画效果，
                  保存并随时回放你的独家童话剧！
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['🎭 丰富角色库', '🏰 8种舞台背景', '✨ 动画特效', '💬 对白编辑器', '🎬 多幕剧情', '💾 保存分享'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/70 text-sm font-body text-fairy-purple border border-fairy-purple/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '👸', title: '拖拽角色', desc: '将喜欢的童话角色拖到舞台上，自由摆放位置和大小' },
              { emoji: '🎨', title: '切换背景', desc: '魔法森林、皇家城堡、冰雪王国...8种梦幻背景随心换' },
              { emoji: '💬', title: '编写对白', desc: '为每个角色编写精彩对话，让故事生动有趣' },
            ].map((item) => (
              <div key={item.title} className="fairy-card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-fairy flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-fairy text-lg text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-body leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/fairy-theater" className="fairy-button inline-flex items-center gap-2 text-base px-8 py-4">
              <Film className="w-5 h-5" />
              开始创作童话剧
              <ArrowRight className="w-5 h-5" />
            </Link>
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

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fairy-gold via-pink-400 to-fairy-purple flex items-center justify-center relative">
                <Gift className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                  NEW
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">魔法道具工坊</h2>
                <p className="text-sm text-gray-500 font-body">收集神奇宝物，创造全新幻想</p>
              </div>
            </div>
            <Link
              to="/magic-workshop"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              进入工坊 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-fairy-purple/15 via-fairy-pink/10 to-fairy-gold/15 rounded-3xl p-6 md:p-8 border border-fairy-purple/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex gap-3">
                {['🪞', '🫘', '👠', '🧞', '💍'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-white/80 shadow-md animate-float"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <span className="text-3xl md:text-4xl">{emoji}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-fairy text-xl md:text-2xl text-gray-800 mb-2">
                  探索童话世界的神奇宝物
                </h3>
                <p className="text-gray-600 font-body leading-relaxed mb-4">
                  魔镜、魔豆、水晶鞋、飞毯、魔法戒指……收集所有童话中的经典魔法道具，
                  了解它们的出处故事和神奇能力。更可以拖拽组合多件道具，
                  创造属于你自己的全新幻想物品，生成专属的道具卡片和背景故事！
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['20+ 经典道具', '拖拽组合创造', '背景故事生成', '稀有度系统'].map((tag) => (
                    <span key={tag} className="fairy-tag text-xs bg-white/50 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/magic-workshop"
                className="fairy-button inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Wand2 className="w-5 h-5" />
                立即体验
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fairy-purple via-pink-400 to-fairy-gold flex items-center justify-center relative">
                <ScrollText className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-purple to-pink-500 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                  NEW
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">童话生物图鉴</h2>
                <p className="text-sm text-gray-500 font-body">探索神秘生物，解锁冒险者手册</p>
              </div>
            </div>
            <Link
              to="/creature-pedia"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              进入图鉴 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-fairy-purple/15 via-fairy-pink/10 to-fairy-gold/15 rounded-3xl p-6 md:p-8 border border-fairy-purple/20 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex gap-3">
                {featuredCreatures.slice(0, 5).map((creature, i) => (
                  <div
                    key={creature.id}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-white/80 shadow-md animate-float"
                    style={{
                      backgroundColor: creature.coverColor + '30',
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    <span className="text-3xl md:text-4xl">{creature.emoji}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-fairy text-xl md:text-2xl text-gray-800 mb-2">
                  探索童话世界的神秘生灵
                </h3>
                <p className="text-gray-600 font-body leading-relaxed mb-4">
                  从翱翔天际的巨龙到深海沉睡的海妖，从森林深处的精灵到沙漠中重生的凤凰。
                  点击解锁这些神秘生物，记录它们的外貌、习性与传说。
                  查看图鉴完成度，成为真正的童话冒险者！
                </p>
                <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-fairy-gold" />
                    <span className="font-body text-gray-700">
                      图鉴完成度：<span className="font-bold text-fairy-purple">{unlockedCreatures.size}/{allCreatures.length}</span>
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-fairy transition-all duration-500 rounded-full"
                      style={{ width: allCreatures.length > 0 ? (unlockedCreatures.size / allCreatures.length) * 100 : 0 }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['12+ 幻想生物', '栖息地分类', '危险等级系统', '解锁收集玩法'].map((tag) => (
                    <span key={tag} className="fairy-tag text-xs bg-white/50 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/creature-pedia"
                className="fairy-button inline-flex items-center gap-2 whitespace-nowrap"
              >
                <ScrollText className="w-5 h-5" />
                立即探索
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCreatures.map((creature) => (
              <CreatureCard
                key={creature.id}
                creature={creature}
                variant={unlockedCreatures.has(creature.id) ? 'default' : 'locked'}
              />
            ))}
          </div>

          <Link
            to="/creature-pedia"
            className="md:hidden mt-6 flex items-center justify-center gap-1 text-fairy-purple font-body"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fairy-gold via-pink-500 to-fairy-purple flex items-center justify-center relative overflow-hidden">
                <Zap className="w-6 h-6 text-white relative z-10" />
                <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-fairy-gold to-orange-400 text-white text-[10px] rounded-full font-body font-bold shadow-md">
                  NEW
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-fairy text-gray-800">童话宇宙事件</h2>
                <p className="text-sm text-gray-500 font-body">世界演化系统，定期触发神秘事件</p>
              </div>
            </div>
            <Link
              to="/cosmic-events"
              className="hidden md:inline-flex items-center gap-1 text-fairy-purple font-body hover:gap-2 transition-all"
            >
              进入事件中心 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-fairy-purple/20 via-fairy-pink/10 to-fairy-gold/20 rounded-3xl p-6 md:p-8 border border-fairy-purple/20 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute text-fairy-gold animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${8 + Math.random() * 12}px`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex gap-3">
                {['🐉', '🪞', '⏰', '⭐', '🌪️'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-white/80 shadow-md animate-float"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <span className="text-3xl md:text-4xl">{emoji}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-fairy text-xl md:text-2xl text-gray-800 mb-2">
                  见证童话世界的持续演化
                </h3>
                <p className="text-gray-600 font-body leading-relaxed mb-4">
                  巨龙苏醒、魔镜失控、时光塔崩塌、星辰坠落……
                  神秘的宇宙事件周期性降临童话世界。
                  参与事件，完成挑战，改变世界的命运，
                  获得珍稀称号与传说道具，见证时代的变迁由你书写！
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['10+ 宇宙事件', '世界等级系统', '时代演化历史', '事件排行榜'].map((tag) => (
                    <span key={tag} className="fairy-tag text-xs bg-white/50 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/cosmic-events"
                className="fairy-button inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-5 h-5" />
                进入事件中心
              </Link>
            </div>
          </div>
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
