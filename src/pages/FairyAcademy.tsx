import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  Crown,
  ChevronRight,
  CheckCircle,
  Award,
  Zap,
  Clock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore } from '@/store/storyStore';
import { COURSE_CATEGORIES, RARITY_COLORS } from '@/types';
import type { Course, CourseCategory, SkillBadge, Title } from '@/types';
import { cn } from '@/lib/utils';
import { getTitleById } from '@/data/academy';

const categoryIcons: Record<string, string> = {
  '全部': '📚',
  '魔法': '🪄',
  '炼金术': '⚗️',
  '骑士精神': '⚔️',
  '龙语': '🐲',
};

const difficultyColors: Record<string, string> = {
  '入门': 'from-green-400 to-emerald-500',
  '初级': 'from-blue-400 to-cyan-500',
  '中级': 'from-orange-400 to-amber-500',
  '高级': 'from-red-400 to-rose-500',
};

function CourseCard({ course, progress, isCompleted }: { course: Course; progress: number; isCompleted: boolean }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/academy/${course.id}`)}
      className="fairy-card cursor-pointer overflow-hidden group"
    >
      <div className={`h-32 bg-gradient-to-br ${course.coverColor} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-6xl group-hover:scale-125 transition-transform duration-500">
          {course.emoji}
        </span>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.duration}
          </span>
        </div>
        <h3 className="text-lg font-fairy text-gray-800 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>学习进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${course.coverColor} transition-all duration-500 rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-fairy-gold">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{course.totalExperience} XP</span>
          </div>
          <span className="text-sm text-fairy-purple font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            开始学习 <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge, earned }: { badge: SkillBadge; earned: boolean }) {
  const rarityColor = RARITY_COLORS[badge.rarity];

  return (
    <div
      className={cn(
        'fairy-card p-4 text-center transition-all duration-300',
        !earned && 'opacity-50 grayscale'
      )}
    >
      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${rarityColor.bg} flex items-center justify-center shadow-lg ${earned ? 'animate-float' : ''}`}>
        <span className="text-3xl">{earned ? badge.emoji : '❓'}</span>
      </div>
      <h4 className="font-fairy text-gray-800 text-sm mb-1">
        {earned ? badge.name : '???'}
      </h4>
      <span className={`text-xs px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${rarityColor.bg}`}>
        {badge.rarity}
      </span>
      {earned && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{badge.description}</p>
      )}
    </div>
  );
}

function TitleCard({ title, earned, isCurrent, onSelect }: {
  title: Title;
  earned: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const rarityColor = RARITY_COLORS[title.rarity];

  return (
    <div
      onClick={() => earned && onSelect()}
      className={cn(
        'fairy-card p-4 text-center transition-all duration-300',
        earned ? 'cursor-pointer hover:scale-105' : 'opacity-50 grayscale cursor-not-allowed',
        isCurrent && 'ring-4 ring-fairy-gold ring-offset-2'
      )}
    >
      <div className={`w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br ${rarityColor.bg} flex items-center justify-center shadow-lg`}>
        <span className="text-2xl">{earned ? title.emoji : '🔒'}</span>
      </div>
      <h4 className="font-fairy text-gray-800 text-sm">
        {earned ? title.name : '???'}
      </h4>
      {earned && isCurrent && (
        <span className="text-xs text-fairy-gold font-medium mt-1 block">
          当前称号
        </span>
      )}
      {earned && !isCurrent && (
        <span className="text-xs text-gray-400 mt-1 block">
          点击装备
        </span>
      )}
    </div>
  );
}

export default function FairyAcademy() {
  const courses = useStoryStore((state) => state.academyCourses);
  const selectedCategory = useStoryStore((state) => state.selectedAcademyCategory);
  const setSelectedCategory = useStoryStore((state) => state.setSelectedAcademyCategory);
  const totalExperience = useStoryStore((state) => state.totalAcademyExperience);
  const earnedBadges = useStoryStore((state) => state.earnedBadges);
  const earnedTitles = useStoryStore((state) => state.earnedTitles);
  const currentTitle = useStoryStore((state) => state.currentTitle);
  const completedCourses = useStoryStore((state) => state.completedCourses);
  const getCourseProgress = useStoryStore((state) => state.getCourseProgress);
  const setCurrentTitle = useStoryStore((state) => state.setCurrentTitle);
  const allBadges = useStoryStore((state) => state.academyBadges);
  const allTitles = useStoryStore((state) => state.academyTitles);

  const [activeTab, setActiveTab] = useState<'courses' | 'badges' | 'titles'>('courses');

  const filteredCourses = useMemo(() => {
    if (selectedCategory === '全部') return courses;
    return courses.filter((c) => c.category === selectedCategory);
  }, [courses, selectedCategory]);

  const userLevel = useMemo(() => {
    return Math.floor(totalExperience / 500) + 1;
  }, [totalExperience]);

  const currentLevelProgress = useMemo(() => {
    return ((totalExperience % 500) / 500) * 100;
  }, [totalExperience]);

  const currentTitleData = currentTitle ? getTitleById(currentTitle) : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingDecorations />

      <div className="container mx-auto px-4 py-8">
        <div className="fairy-card p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-fairy opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-fairy opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-fairy flex items-center justify-center shadow-fairy-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-fairy text-gradient-fairy">童话学院</h1>
                <Sparkles className="w-6 h-6 text-fairy-gold animate-twinkle" />
              </div>
              <p className="text-gray-500 mb-4">探索知识，获得荣誉，成为童话世界的传奇！</p>

              {currentTitleData && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fairy-gold/20 to-fairy-purple/20 rounded-full mb-3">
                  <span className="text-xl">{currentTitleData.emoji}</span>
                  <span className="font-fairy text-fairy-purple">{currentTitleData.name}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fairy-purple to-fairy-pink flex items-center justify-center text-white font-bold text-sm">
                    Lv.{userLevel}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">学院等级</div>
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-fairy rounded-full transition-all duration-500"
                        style={{ width: `${currentLevelProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
                  <Zap className="w-5 h-5 text-fairy-gold" />
                  <span className="font-medium text-amber-700">{totalExperience} XP</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                  <Award className="w-5 h-5 text-fairy-purple" />
                  <span className="font-medium text-purple-700">{earnedBadges.size} 徽章</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full">
                  <Crown className="w-5 h-5 text-rose-500" />
                  <span className="font-medium text-rose-700">{earnedTitles.size} 称号</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'courses', label: '全部课程', icon: BookOpen },
            { id: 'badges', label: '我的徽章', icon: Award },
            { id: 'titles', label: '我的称号', icon: Crown },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2',
                activeTab === tab.id
                  ? 'bg-gradient-fairy text-white shadow-fairy'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['全部', ...COURSE_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as CourseCategory | '全部')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
                    selectedCategory === cat
                      ? 'bg-gradient-fairy text-white shadow-md'
                      : 'bg-white/70 text-gray-600 hover:bg-white'
                  )}
                >
                  <span>{categoryIcons[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={getCourseProgress(course.id)}
                  isCompleted={completedCourses.has(course.id)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'badges' && (
          <div className="fairy-card p-6">
            <h2 className="text-xl font-fairy text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-fairy-gold" />
              技能徽章收藏
              <span className="text-sm font-normal text-gray-400">
                ({earnedBadges.size}/{allBadges.length})
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadges.has(badge.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'titles' && (
          <div className="fairy-card p-6">
            <h2 className="text-xl font-fairy text-gray-800 mb-6 flex items-center gap-2">
              <Crown className="w-6 h-6 text-rose-500" />
              荣誉称号
              <span className="text-sm font-normal text-gray-400">
                ({earnedTitles.size}/{allTitles.length})
              </span>
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              完成课程获得专属称号，点击称号可以装备展示
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allTitles.map((title) => (
                <TitleCard
                  key={title.id}
                  title={title}
                  earned={earnedTitles.has(title.id)}
                  isCurrent={currentTitle === title.id}
                  onSelect={() => setCurrentTitle(currentTitle === title.id ? null : title.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
