import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Moon,
  Sparkles,
  Eye,
  Heart,
  ShieldAlert,
  Map,
  Clock,
  Star,
  ArrowLeft,
  ChevronRight,
  Lock,
  Unlock,
  Zap,
  Users,
  BookOpen,
  Crown,
  X,
  Info,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import { useStoryStore } from '@/store/storyStore';
import { getCharacterTypeDreamTheme } from '@/data/dreamWorld';
import type {
  DreamLocation,
  InnerWish,
  InnerFear,
  DreamMemory,
  DreamEncounter,
  DreamEncounterOption,
} from '@/types';

const MOOD_COLORS = {
  '甜蜜': 'from-pink-200 via-rose-200 to-fuchsia-200',
  '奇幻': 'from-purple-200 via-indigo-200 to-blue-200',
  '忧郁': 'from-blue-200 via-slate-200 to-gray-200',
  '诡异': 'from-slate-300 via-purple-300 to-violet-300',
  '壮丽': 'from-amber-200 via-orange-200 to-red-200',
  '迷幻': 'from-fuchsia-200 via-violet-200 to-indigo-200',
};

const ENCOUNTER_OUTCOME_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  'positive': { bg: 'bg-emerald-500/20', border: 'border-emerald-400/40', text: 'text-emerald-200', label: '积极' },
  'negative': { bg: 'bg-rose-500/20', border: 'border-rose-400/40', text: 'text-rose-200', label: '消极' },
  'neutral': { bg: 'bg-slate-500/20', border: 'border-slate-400/40', text: 'text-slate-200', label: '中性' },
  'revelation': { bg: 'bg-violet-500/20', border: 'border-violet-400/40', text: 'text-violet-200', label: '启示' },
};

const FEAR_INTENSITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  '轻微': { bg: 'bg-emerald-100/90', border: 'border-emerald-300', text: 'text-emerald-700' },
  '中等': { bg: 'bg-amber-100/90', border: 'border-amber-300', text: 'text-amber-700' },
  '强烈': { bg: 'bg-orange-100/90', border: 'border-orange-300', text: 'text-orange-700' },
  '极致': { bg: 'bg-red-100/90', border: 'border-red-300', text: 'text-red-700' },
};

const WISH_DEPTH_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  '表面': { bg: 'bg-sky-100/90', border: 'border-sky-300', text: 'text-sky-700' },
  '深层': { bg: 'bg-indigo-100/90', border: 'border-indigo-300', text: 'text-indigo-700' },
  '潜意识': { bg: 'bg-violet-100/90', border: 'border-violet-300', text: 'text-violet-700' },
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatTimeShort(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h${m}m`;
  if (m > 0) return `${m}m`;
  return '<1m';
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}时${m}分${s}秒`;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

export default function DreamWorld() {
  const navigate = useNavigate();
  const allCharacters = useStoryStore((state) => state.characters);
  const activeDreamCharacterId = useStoryStore((state) => state.activeDreamCharacterId);
  const activeDreamLocationId = useStoryStore((state) => state.activeDreamLocationId);
  const selectedDreamTab = useStoryStore((state) => state.selectedDreamTab);
  const setSelectedDreamTab = useStoryStore((state) => state.setSelectedDreamTab);
  const characterDreamStates = useStoryStore((state) => state.characterDreamStates);
  const dreamLocations = useStoryStore((state) => state.dreamLocations);
  const currentDreamEncounter = useStoryStore((state) => state.currentDreamEncounter);
  const distortionLevel = useStoryStore((state) => state.distortionLevel);
  const enterDream = useStoryStore((state) => state.enterDream);
  const exitDream = useStoryStore((state) => state.exitDream);
  const travelToDreamLocation = useStoryStore((state) => state.travelToDreamLocation);
  const triggerDreamEncounter = useStoryStore((state) => state.triggerDreamEncounter);
  const resolveDreamEncounter = useStoryStore((state) => state.resolveDreamEncounter);
  const closeDreamEncounter = useStoryStore((state) => state.closeDreamEncounter);
  const wishProgress = useStoryStore((state) => state.wishProgress);
  const fearProgress = useStoryStore((state) => state.fearProgress);

  const protagonistCharacters = useMemo(
    () => allCharacters.filter((c) => c.isProtagonist),
    [allCharacters]
  );

  const currentCharacter = useMemo(
    () => allCharacters.find((c) => c.id === activeDreamCharacterId),
    [allCharacters, activeDreamCharacterId]
  );

  const currentDreamState = useMemo(() => {
    if (!activeDreamCharacterId) return undefined;
    return characterDreamStates[activeDreamCharacterId];
  }, [characterDreamStates, activeDreamCharacterId]);

  const currentLocation = useMemo(() => {
    return dreamLocations.find((l) => l.id === activeDreamLocationId);
  }, [dreamLocations, activeDreamLocationId]);

  const characterTheme = useMemo(() => {
    if (!currentCharacter) return { color: '#9F7AEA', icon: '💫', description: '神秘梦境' };
    return getCharacterTypeDreamTheme(currentCharacter.type);
  }, [currentCharacter]);

  const [encounterResult, setEncounterResult] = useState<{
    optionId: string;
    impact: string;
    outcome: string;
    outcomeType: string;
  } | null>(null);

  const handleSelectOption = (optionId: string) => {
    if (!currentDreamEncounter) return;
    const option = currentDreamEncounter.options.find((o) => o.id === optionId);
    if (!option) return;
    const outcomeLabels: Record<string, string> = {
      positive: '梦境变得更加明亮',
      negative: '阴影笼罩了梦境',
      neutral: '梦境悄然流转',
      revelation: '内心的真相浮现',
    };
    setEncounterResult({
      optionId,
      impact: option.impactDescription,
      outcome: outcomeLabels[option.outcome] || '梦境继续流转……',
      outcomeType: option.outcome,
    });
    resolveDreamEncounter(optionId);
  };

  const handleCloseEncounter = () => {
    closeDreamEncounter();
    setEncounterResult(null);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeDreamCharacterId) {
      interval = setInterval(() => {
        const state = useStoryStore.getState().characterDreamStates[activeDreamCharacterId];
        if (state) {
          useStoryStore.setState((s) => ({
            characterDreamStates: {
              ...s.characterDreamStates,
              [activeDreamCharacterId]: {
                ...state,
                totalDreamTime: state.totalDreamTime + 1,
              },
            },
          }));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeDreamCharacterId]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: currentCharacter
            ? `linear-gradient(135deg, ${characterTheme.color}15 0%, #1a1040 40%, #2d1b4e 70%, ${characterTheme.color}10 100%)`
            : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-amber-200 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <FloatingDecorations />
      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-6 pb-16">
          <div className="flex items-center gap-2 text-sm font-body text-white/50 mb-4">
            <Link to="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <Home className="w-4 h-4" />
              首页
            </Link>
            <span>/</span>
            <span className="text-white/80 flex items-center gap-1">
              <Moon className="w-4 h-4" />
              童话梦境层
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <Moon className="w-4 h-4 text-amber-300 animate-twinkle" />
              <span className="text-sm font-body text-white/70">
                Dream Realm · 夜幕降临，梦境开启
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-fairy mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-pink-300 to-violet-300">
                童话梦境层
              </span>
            </h1>
            <p className="text-base md:text-lg font-body max-w-2xl mx-auto text-white/60">
              当夜幕降临，每个角色都将进入梦境世界。
              在扭曲的城堡与镜像森林之间，探索他们内心深处隐藏的愿望与恐惧。
              梦境地图会随着每一次经历，悄然改变……
            </p>
          </div>

          {!activeDreamCharacterId ? (
            <CharacterSelectPanel
              characters={protagonistCharacters}
              characterDreamStates={characterDreamStates}
              onEnterDream={enterDream}
            />
          ) : (
            <>
              <DreamHeader
                character={currentCharacter!}
                dreamState={currentDreamState}
                location={currentLocation}
                distortionLevel={distortionLevel}
                onExit={exitDream}
                theme={characterTheme}
              />

              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {[
                  { id: 'overview', label: '梦境总览', icon: Eye },
                  { id: 'map', label: '梦境地图', icon: Map },
                  { id: 'wishes', label: '内心愿望', icon: Heart },
                  { id: 'fears', label: '深层恐惧', icon: ShieldAlert },
                  { id: 'memories', label: '梦境记忆', icon: BookOpen },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = selectedDreamTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedDreamTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body transition-all duration-300 backdrop-blur-sm border ${
                        active
                          ? 'bg-white/20 border-white/40 text-white shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {selectedDreamTab === 'overview' && currentDreamState && (
                <OverviewPanel
                  character={currentCharacter!}
                  dreamState={currentDreamState}
                  currentLocation={currentLocation}
                  locations={dreamLocations}
                  onTriggerEncounter={triggerDreamEncounter}
                  onTravel={travelToDreamLocation}
                  distortionLevel={distortionLevel}
                />
              )}

              {selectedDreamTab === 'map' && currentDreamState && (
                <DreamMapPanel
                  locations={dreamLocations}
                  currentLocationId={activeDreamLocationId}
                  discoveredIds={currentDreamState.discoveredLocationIds}
                  onTravel={travelToDreamLocation}
                />
              )}

              {selectedDreamTab === 'wishes' && currentDreamState && (
                <WishesPanel
                  wishes={currentDreamState.innerWishes}
                  progress={wishProgress}
                />
              )}

              {selectedDreamTab === 'fears' && currentDreamState && (
                <FearsPanel
                  fears={currentDreamState.innerFears}
                  progress={fearProgress}
                />
              )}

              {selectedDreamTab === 'memories' && currentDreamState && (
                <MemoriesPanel
                  memories={currentDreamState.dreamMemories}
                  locations={dreamLocations}
                />
              )}
            </>
          )}
        </div>
      </div>

      {currentDreamEncounter && (
        <EncounterModal
          encounter={currentDreamEncounter}
          onSelectOption={handleSelectOption}
          result={encounterResult}
          onClose={handleCloseEncounter}
        />
      )}
    </div>
  );
}

function CharacterSelectPanel({
  characters,
  characterDreamStates,
  onEnterDream,
}: {
  characters: any[];
  characterDreamStates: Record<string, any>;
  onEnterDream: (id: string) => void;
}) {
  if (characters.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="fairy-card p-8 md:p-12 bg-white/5 backdrop-blur-md border-white/10 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 border border-white/10 flex items-center justify-center">
            <Users className="w-12 h-12 text-white/40" />
          </div>
          <h2 className="text-2xl font-fairy text-white mb-3">角色尚未准备好入梦</h2>
          <p className="text-white/50 font-body mb-6">
            请先前往"童话剧场"或"故事书架"，让故事中的角色诞生……
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-body hover:scale-105 transition-transform shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            浏览故事书架
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="fairy-card p-6 md:p-8 bg-white/5 backdrop-blur-md border-white/10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg relative overflow-hidden">
            <Moon className="w-7 h-7 text-white relative z-10" />
            <div className="absolute inset-0 animate-pulse-soft opacity-40 bg-white/20" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-fairy text-white">选择入梦的角色</h2>
            <p className="text-sm text-white/50 font-body">
              每个角色都拥有独特的梦境世界，点击"进入梦境"开始探索
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {characters.map((char) => {
            const theme = getCharacterTypeDreamTheme(char.type);
            const ds = characterDreamStates[char.id];
            return (
              <div
                key={char.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  boxShadow: `0 10px 40px ${theme.color}20`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                  style={{
                    background: `linear-gradient(135deg, ${theme.color}40 0%, transparent 60%)`,
                  }}
                />
                <div className="relative z-10 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform border border-white/10"
                      style={{ backgroundColor: char.coverColor }}
                    >
                      <img
                        src={char.coverImage}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{theme.icon}</span>
                        <h3 className="font-fairy text-lg text-white truncate">{char.name}</h3>
                      </div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 mb-2">
                        {char.type}
                      </span>
                      <p className="text-xs text-white/50 font-body line-clamp-2">{char.storyTitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/40 font-body italic mb-4 line-clamp-2">
                    "{theme.description}"
                  </p>

                  {ds ? (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs font-body">
                        <span className="text-white/50 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-300" />
                          梦境等级
                        </span>
                        <span className="text-amber-300 font-medium">Lv.{ds.dreamLevel}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-body">
                        <span className="text-white/50 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-emerald-300" />
                          区域发现
                        </span>
                        <span className="text-emerald-300 font-medium">
                          {ds.discoveredLocationIds.length}/8
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-body">
                        <span className="text-white/50 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-300" />
                          梦境时长
                        </span>
                        <span className="text-sky-300 font-medium">{formatTimeShort(ds.totalDreamTime)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 mb-4 text-center rounded-xl bg-white/5 border border-dashed border-white/10">
                      <Sparkles className="w-5 h-5 text-white/30 mx-auto mb-1" />
                      <p className="text-xs text-white/40 font-body">尚未进入梦境</p>
                    </div>
                  )}

                  <button
                    onClick={() => onEnterDream(char.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body text-white transition-all duration-300 hover:scale-[1.02] shadow-md relative overflow-hidden group/btn"
                    style={{
                      background: `linear-gradient(135deg, ${theme.color}cc 0%, ${theme.color}88 100%)`,
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <Moon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">
                      {ds ? '继续梦境' : '进入梦境'}
                    </span>
                    <ArrowRight className="w-4 h-4 relative z-10" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DreamHeader({
  character,
  dreamState,
  location,
  distortionLevel,
  onExit,
  theme,
}: any) {
  const formatBarColor = (value: number, invert = false) => {
    const v = invert ? 100 - value : value;
    if (v >= 70) return 'from-emerald-400 to-green-500';
    if (v >= 40) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  return (
    <div className="fairy-card p-5 md:p-6 bg-white/5 backdrop-blur-md border-white/10 mb-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 10% 50%, ${theme.color}40 0%, transparent 50%)`,
        }}
      />
      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border-2 border-white/20 relative"
            style={{ backgroundColor: character.coverColor }}
          >
            <img
              src={character.coverImage}
              alt={character.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-amber-300" />
                <span className="text-[10px] font-body text-white/80">睡眠中</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{theme.icon}</span>
              <h2 className="text-2xl md:text-3xl font-fairy text-white">{character.name} 的梦境</h2>
            </div>
            <p className="text-sm text-white/50 font-body mb-2 italic">"{theme.description}"</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 font-body">
                <Star className="w-3 h-3" />
                Lv.{dreamState?.dreamLevel || 1}
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-violet-400/20 border border-violet-300/30 text-violet-200 font-body">
                <LayersIcon />
                第{dreamState?.unlockedDreamLayers || 1}层梦境
              </span>
              {location && (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 font-body">
                  <Map className="w-3 h-3" />
                  {location.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBar
            label="清醒度"
            value={dreamState?.lucidity || 0}
            icon={<Eye className="w-4 h-4" />}
            gradient={formatBarColor(dreamState?.lucidity || 0)}
          />
          <StatBar
            label="稳定度"
            value={dreamState?.dreamStability || 0}
            icon={<ShieldAlert className="w-4 h-4" />}
            gradient={formatBarColor(dreamState?.dreamStability || 0)}
          />
          <StatBar
            label="扭曲度"
            value={distortionLevel}
            icon={<Sparkles className="w-4 h-4" />}
            gradient={formatBarColor(distortionLevel, true)}
            invert
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50 font-body flex items-center gap-1">
                <Clock className="w-4 h-4" />
                累计梦境
              </span>
            </div>
            <div className="text-xl font-fairy text-white">
              {formatTimeShort(dreamState?.totalDreamTime || 0)}
            </div>
            <button
              onClick={onExit}
              className="mt-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body bg-rose-500/20 border border-rose-400/30 text-rose-200 hover:bg-rose-500/30 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              离开梦境
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function StatBar({
  label,
  value,
  icon,
  gradient,
  invert = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  invert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50 font-body flex items-center gap-1">
          {icon}
          {label}
        </span>
        <span className={`text-sm font-medium ${invert ? (value >= 50 ? 'text-rose-300' : 'text-emerald-300') : value >= 50 ? 'text-emerald-300' : 'text-rose-300'}`}>
          {value}%
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function OverviewPanel({
  character,
  dreamState,
  currentLocation,
  locations,
  onTriggerEncounter,
  onTravel,
  distortionLevel,
}: any) {
  const wishesProgress = dreamState.innerWishes.map((w: InnerWish) => ({
    wish: w,
    progress: w.granted ? 100 : 0,
  }));
  const fearsProgress = dreamState.innerFears.map((f: InnerFear) => ({
    fear: f,
    progress: f.confronted ? 100 : 0,
  }));
  const grantedCount = dreamState.innerWishes.filter((w: InnerWish) => w.granted).length;
  const confrontedCount = dreamState.innerFears.filter((f: InnerFear) => f.confronted).length;

  const connectedLocations = currentLocation
    ? locations.filter(
        (l: DreamLocation) =>
          currentLocation.connectedLocationIds?.includes(l.id) ||
          dreamState.discoveredLocationIds.includes(l.id)
      )
    : [];

  const getLocationEmoji = (type: string) => {
    return (
      { '扭曲城堡': '🏰', '镜像森林': '🌲', '梦境海洋': '🌊', '星空草原': '🌌', '遗忘迷宫': '🌀', '心灵花园': '🌸', '恐惧深渊': '🕳️', '愿望之巅': '⭐' } as Record<string, string>
    )[type] || '❓';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="fairy-card p-5 bg-white/5 backdrop-blur-md border-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: currentLocation?.color || '#9F7AEA' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                  style={{
                    backgroundColor: (currentLocation?.color || '#9F7AEA') + '40',
                    border: `1px solid ${currentLocation?.color || '#9F7AEA'}60`,
                  }}
                >
                  {getLocationEmoji(currentLocation?.type)}
                </div>
                <div>
                  <h3 className="font-fairy text-xl text-white">{currentLocation?.name || '未知之地'}</h3>
                  <p className="text-xs text-white/50 font-body">{currentLocation?.type}</p>
                </div>
              </div>
              <button
                onClick={onTriggerEncounter}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body text-white transition-all hover:scale-105 shadow-lg relative overflow-hidden group/btn"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #8B5CF6 100%)',
                }}
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                <Zap className="w-4 h-4 relative z-10" />
                <span className="relative z-10">深入探索</span>
              </button>
            </div>

            <div
              className="rounded-2xl p-5 mb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${currentLocation?.color || '#9F7AEA'}20 0%, transparent 60%)`,
                border: `1px solid ${currentLocation?.color || '#9F7AEA'}30`,
              }}
            >
              <p className="text-white/80 font-body leading-relaxed mb-3">
                {currentLocation?.description}
              </p>
              {distortionLevel > 40 && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-pink-200/80 font-body italic flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-pink-300 flex-shrink-0 mt-0.5 animate-twinkle" />
                    <span>扭曲效果：{currentLocation?.twistedDescription}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-body text-white/60 mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                相邻的梦境
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connectedLocations.slice(0, 4).map((loc: DreamLocation) => {
                  const discovered = dreamState.discoveredLocationIds.includes(loc.id);
                  const isCurrent = loc.id === currentLocation?.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => !isCurrent && onTravel(loc.id)}
                      disabled={isCurrent}
                      className={`group flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 border backdrop-blur-sm ${
                        isCurrent
                          ? 'bg-white/20 border-white/40 shadow-lg'
                          : discovered
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          : 'bg-white/5 border-dashed border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                          discovered ? '' : 'grayscale opacity-60'
                        }`}
                        style={{
                          backgroundColor: loc.color + '40',
                        }}
                      >
                        {discovered ? (
                          getLocationEmoji(loc.type)
                        ) : (
                          <Lock className="w-4 h-4 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-body">
                              当前
                            </span>
                          )}
                          <span className={`font-fairy text-sm truncate ${discovered ? 'text-white' : 'text-white/50'}`}>
                            {discovered ? loc.name : '未知之地'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40 font-body truncate">
                          {discovered ? loc.type : '需要探索'}
                        </p>
                      </div>
                      {!isCurrent && discovered && (
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="fairy-card p-5 bg-white/5 backdrop-blur-md border-white/10">
          <h3 className="font-fairy text-xl text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-300" />
            象征解读
          </h3>
          <p className="text-sm text-white/60 font-body leading-relaxed">
            {currentLocation?.symbolism || '此地的含义尚未显现……'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="fairy-card p-5 bg-white/5 backdrop-blur-md border-white/10">
          <h3 className="font-fairy text-lg text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-300" />
            内心愿望
            <span className="ml-auto text-xs font-body text-white/40">
              {grantedCount}/{dreamState.innerWishes.length}
            </span>
          </h3>
          <div className="space-y-3">
            {wishesProgress.slice(0, 3).map(({ wish }: { wish: InnerWish }) => (
              <div key={wish.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm text-white font-body">{wish.title}</h4>
                  {wish.granted ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-white/30" />
                  )}
                </div>
                <p className="text-xs text-white/40 font-body line-clamp-1">{wish.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fairy-card p-5 bg-white/5 backdrop-blur-md border-white/10">
          <h3 className="font-fairy text-lg text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
            深层恐惧
            <span className="ml-auto text-xs font-body text-white/40">
              {confrontedCount}/{dreamState.innerFears.length}
            </span>
          </h3>
          <div className="space-y-3">
            {fearsProgress.slice(0, 3).map(({ fear }: { fear: InnerFear }) => (
              <div key={fear.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm text-white font-body">{fear.title}</h4>
                  {fear.confronted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  ) : (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-body ${
                        FEAR_INTENSITY_COLORS[fear.intensity].bg
                      } ${FEAR_INTENSITY_COLORS[fear.intensity].text}`}
                    >
                      {fear.intensity}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 font-body line-clamp-1">{fear.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fairy-card p-5 bg-white/5 backdrop-blur-md border-white/10">
          <h3 className="font-fairy text-lg text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-300" />
            梦境统计
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              icon={<Compass className="w-4 h-4" />}
              value={`${dreamState.discoveredLocationIds.length}/8`}
              label="发现区域"
            />
            <MiniStat
              icon={<Users className="w-4 h-4" />}
              value={`${dreamState.encounteredCreatureIds.length}`}
              label="遇见生灵"
            />
            <MiniStat
              icon={<BookOpen className="w-4 h-4" />}
              value={`${dreamState.dreamMemories.length}`}
              label="梦境记忆"
            />
            <MiniStat
              icon={<Crown className="w-4 h-4" />}
              value={`Lv.${dreamState.dreamLevel}`}
              label="梦境等级"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-amber-300 mb-1.5">
        {icon}
      </div>
      <div className="text-lg font-fairy text-white">{value}</div>
      <div className="text-[11px] text-white/40 font-body">{label}</div>
    </div>
  );
}

function DreamMapPanel({
  locations,
  currentLocationId,
  discoveredIds,
  onTravel,
}: any) {
  const WIDTH = 1000;
  const HEIGHT = 550;

  const connections: { from: DreamLocation; to: DreamLocation }[] = [];
  locations.forEach((loc: DreamLocation) => {
    (loc.connectedLocationIds || []).forEach((toId: string) => {
      const toLoc = locations.find((l: DreamLocation) => l.id === toId);
      if (toLoc && loc.id < toId) {
        connections.push({ from: loc, to: toLoc });
      }
    });
  });

  const getLocationEmoji = (type: string) => {
    return (
      { '扭曲城堡': '🏰', '镜像森林': '🌲', '梦境海洋': '🌊', '星空草原': '🌌', '遗忘迷宫': '🌀', '心灵花园': '🌸', '恐惧深渊': '🕳️', '愿望之巅': '⭐' } as Record<string, string>
    )[type] || '❓';
  };

  return (
    <div className="fairy-card p-5 md:p-6 bg-white/5 backdrop-blur-md border-white/10">
      <h3 className="font-fairy text-2xl text-white mb-4 flex items-center gap-3">
        <Map className="w-6 h-6 text-violet-300" />
        梦境地图
      </h3>
      <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ background: 'radial-gradient(ellipse at center, #2d1b4e 0%, #0f0c29 100%)' }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          style={{ minHeight: 400 }}
        >
          <defs>
            <filter id="dreamGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[...Array(40)].map((_, i) => (
            <circle
              key={`bg-star-${i}`}
              cx={Math.random() * WIDTH}
              cy={Math.random() * HEIGHT}
              r={Math.random() * 1.5 + 0.5}
              fill="white"
              opacity={0.2 + Math.random() * 0.3}
            >
              <animate
                attributeName="opacity"
                values={`${0.2 + Math.random() * 0.3};${0.1};${0.2 + Math.random() * 0.3}`}
                dur={`${2 + Math.random() * 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {connections.map((conn, i) => {
            const bothDiscovered =
              discoveredIds.includes(conn.from.id) && discoveredIds.includes(conn.to.id);
            return (
              <g key={`conn-${i}`}>
                <line
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  stroke={bothDiscovered ? conn.from.color : '#ffffff20'}
                  strokeWidth={bothDiscovered ? 2 : 1}
                  strokeDasharray={bothDiscovered ? '0' : '6 6'}
                  opacity={bothDiscovered ? 0.6 : 0.3}
                />
                {bothDiscovered && (
                  <circle r="3" fill={conn.from.color} opacity="0.8">
                    <animateMotion
                      dur={`${4 + Math.random() * 3}s`}
                      repeatCount="indefinite"
                      path={`M${conn.from.x},${conn.from.y} L${conn.to.x},${conn.to.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {locations.map((loc: DreamLocation) => {
            const discovered = discoveredIds.includes(loc.id);
            const isCurrent = loc.id === currentLocationId;
            return (
              <g
                key={loc.id}
                className={discovered ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => discovered && onTravel(loc.id)}
                transform={`translate(${loc.x}, ${loc.y})`}
              >
                {isCurrent && (
                  <>
                    <circle r="50" fill="none" stroke={loc.color} strokeWidth="2" opacity="0.4">
                      <animate attributeName="r" values="30;60;30" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="40" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3">
                      <animate attributeName="r" values="25;50;25" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {discovered && (
                  <circle r="30" fill={loc.color} opacity="0.2" filter="url(#dreamGlow)">
                    <animate attributeName="r" values="28;35;28" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                <circle
                  r={discovered ? 22 : 16}
                  fill={discovered ? loc.color : '#ffffff10'}
                  stroke={discovered ? (isCurrent ? '#fff' : loc.color) : '#ffffff30'}
                  strokeWidth={isCurrent ? 3 : 1.5}
                  opacity={discovered ? 0.95 : 0.6}
                />

                <text
                  y={discovered ? 7 : 5}
                  textAnchor="middle"
                  fontSize={discovered ? 20 : 14}
                  opacity={discovered ? 1 : 0.5}
                >
                  {discovered ? getLocationEmoji(loc.type) : '🔒'}
                </text>

                <text
                  y={discovered ? 48 : 36}
                  textAnchor="middle"
                  fontSize={discovered ? 13 : 11}
                  fill={discovered ? loc.color : '#ffffff60'}
                  fontWeight="600"
                  opacity={discovered ? 1 : 0.5}
                  style={{ paintOrder: 'stroke' }}
                  stroke={discovered ? '#00000040' : 'transparent'}
                  strokeWidth="2"
                >
                  {discovered ? loc.name : '???'}
                </text>

                {discovered && (
                  <text
                    y={64}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#ffffff60"
                  >
                    {loc.type}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {locations.map((loc: DreamLocation) => {
          const discovered = discoveredIds.includes(loc.id);
          return (
            <span
              key={loc.id}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-body ${
                discovered
                  ? 'bg-white/10 border-white/20 text-white/80'
                  : 'bg-white/5 border-dashed border-white/10 text-white/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: discovered ? loc.color : '#ffffff40' }} />
              {discovered ? loc.name : '???'}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function WishesPanel({ wishes, progress }: { wishes: InnerWish[]; progress: Record<string, number> }) {
  return (
    <div className="fairy-card p-5 md:p-8 bg-white/5 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-400 to-violet-500 flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-fairy text-2xl text-white">内心深处的愿望</h3>
          <p className="text-sm text-white/50 font-body">
            有些愿望连他们自己都未曾察觉，但梦境从不说谎
          </p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-body">
            <Unlock className="w-4 h-4" />
            已实现 {wishes.filter((w) => w.granted).length}/{wishes.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {wishes.map((wish) => {
          const prog = wish.granted ? 100 : Math.min(100, progress[wish.id] || 0);
          const colors = WISH_DEPTH_COLORS[wish.depth];
          return (
            <div
              key={wish.id}
              className={`relative rounded-2xl p-5 border transition-all duration-300 overflow-hidden ${
                wish.granted
                  ? 'bg-emerald-500/10 border-emerald-400/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              {wish.granted && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/30 text-emerald-200 text-[11px] font-body">
                  <Sparkles className="w-3 h-3 animate-twinkle" />
                  已实现
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                  <Star className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h4 className="font-fairy text-lg text-white mb-1">{wish.title}</h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-body ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {wish.depth}愿望
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70 font-body leading-relaxed mb-4">{wish.description}</p>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50 font-body">愿望进度</span>
                  <span className={`text-xs font-medium ${wish.granted ? 'text-emerald-300' : 'text-white/60'}`}>
                    {prog}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      wish.granted
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        : 'bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400'
                    }`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/40 font-body flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="italic">{wish.unlockCondition}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FearsPanel({ fears, progress }: { fears: InnerFear[]; progress: Record<string, number> }) {
  return (
    <div className="fairy-card p-5 md:p-8 bg-white/5 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-fairy text-2xl text-white">内心深处的恐惧</h3>
          <p className="text-sm text-white/50 font-body">
            那些在深夜里低语的名字，唯有直面才能消散
          </p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-body">
            <CheckCircle2 className="w-4 h-4" />
            已克服 {fears.filter((f) => f.confronted).length}/{fears.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fears.map((fear) => {
          const prog = fear.confronted ? 100 : Math.min(100, progress[fear.id] || 0);
          const colors = FEAR_INTENSITY_COLORS[fear.intensity];
          return (
            <div
              key={fear.id}
              className={`relative rounded-2xl p-5 border transition-all duration-300 overflow-hidden ${
                fear.confronted
                  ? 'bg-violet-500/10 border-violet-400/40'
                  : fear.intensity === '极致' || fear.intensity === '强烈'
                  ? 'bg-rose-950/20 border-rose-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              {fear.confronted && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-400/30 text-violet-200 text-[11px] font-body">
                  <Star className="w-3 h-3" />
                  已克服
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                  <AlertCircle className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h4 className="font-fairy text-lg text-white mb-1">{fear.title}</h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-body ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {fear.intensity}恐惧
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70 font-body leading-relaxed mb-4">{fear.description}</p>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50 font-body">面对进度</span>
                  <span className={`text-xs font-medium ${fear.confronted ? 'text-violet-300' : 'text-white/60'}`}>
                    {prog}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      fear.confronted
                        ? 'bg-gradient-to-r from-violet-400 to-purple-500'
                        : 'bg-gradient-to-r from-amber-400 via-rose-400 to-red-500'
                    }`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/40 font-body flex items-start gap-1.5">
                  <Compass className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="italic">{fear.confrontationHint}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemoriesPanel({
  memories,
  locations,
}: {
  memories: DreamMemory[];
  locations: DreamLocation[];
}) {
  const typeMeta: Record<string, { icon: string; label: string; color: string }> = {
    encounter: { icon: '✨', label: '梦境相遇', color: 'text-sky-300 bg-sky-500/20 border-sky-400/30' },
    revelation: { icon: '💡', label: '启示瞬间', color: 'text-violet-300 bg-violet-500/20 border-violet-400/30' },
    confrontation: { icon: '⚔️', label: '直面恐惧', color: 'text-rose-300 bg-rose-500/20 border-rose-400/30' },
    wish_granted: { icon: '🌟', label: '愿望实现', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30' },
    discovery: { icon: '🗺️', label: '新的发现', color: 'text-amber-300 bg-amber-500/20 border-amber-400/30' },
  };

  return (
    <div className="fairy-card p-5 md:p-8 bg-white/5 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-fairy text-2xl text-white">梦境记忆</h3>
          <p className="text-sm text-white/50 font-body">
            每一段梦境都会留下印记，拼凑出角色真实的内心
          </p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-body">
            <Clock className="w-4 h-4" />
            共 {memories.length} 段记忆
          </span>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white/20" />
          </div>
          <p className="text-white/50 font-body mb-2">梦境尚无记忆留存</p>
          <p className="text-sm text-white/30 font-body italic">回到"梦境总览"，开始探索吧……</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-violet-400/50 via-white/30 to-transparent" />
          <div className="space-y-4">
            {[...memories]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((mem) => {
                const meta = typeMeta[mem.type] || typeMeta.encounter;
                const loc = locations.find((l) => l.id === mem.locationId);
                return (
                  <div key={mem.id} className="relative pl-16">
                    <div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl border backdrop-blur-sm ${meta.color}`}
                    >
                      {meta.icon}
                    </div>
                    <div className="rounded-2xl p-4 bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-fairy text-lg text-white">{mem.title}</h4>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-body ${meta.color}`}>
                          {meta.label}
                        </span>
                        {loc && (
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-full font-body text-white/60 bg-white/10 border border-white/10 flex items-center gap-1"
                            style={{ boxShadow: `0 0 0 1px ${loc.color}30 inset` }}
                          >
                            <Map className="w-3 h-3" />
                            {loc.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/65 font-body leading-relaxed mb-2">
                        {mem.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/40 font-body">
                        <span>{formatDate(mem.timestamp)}</span>
                        {typeof mem.impactOnDream === 'number' && (
                          <span className={mem.impactOnDream >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                            {mem.impactOnDream >= 0 ? '+' : ''}{mem.impactOnDream} 梦境影响
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function EncounterModal({
  encounter,
  onSelectOption,
  result,
  onClose,
}: {
  encounter: DreamEncounter;
  onSelectOption: (optionId: string) => void;
  result: { optionId: string; impact: string; outcome: string; outcomeType: string } | null;
  onClose: () => void;
}) {
  const outcomeColors = result ? (ENCOUNTER_OUTCOME_COLORS[result.outcomeType] || ENCOUNTER_OUTCOME_COLORS.neutral) : null;
  const typeGradients: Record<string, string> = {
    creature: 'from-amber-200 via-pink-200 to-violet-200',
    memory: 'from-sky-200 via-indigo-200 to-violet-200',
    symbol: 'from-fuchsia-200 via-violet-200 to-indigo-200',
    wish: 'from-pink-200 via-rose-200 to-amber-200',
    fear: 'from-slate-200 via-purple-200 to-rose-200',
  };
  const typeLabels: Record<string, string> = {
    creature: '梦境生灵',
    memory: '记忆碎片',
    symbol: '梦境象征',
    wish: '愿望低语',
    fear: '恐惧浮现',
  };
  const gradientClass = typeGradients[encounter.type] || typeGradients.symbol;
  const typeLabel = typeLabels[encounter.type] || '梦境遭遇';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={!result ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-2xl animate-[fadeIn_0.3s_ease-out]">
        <div className="fairy-card bg-gradient-to-br from-slate-900/95 via-violet-950/95 to-slate-900/95 backdrop-blur-xl border-white/20 overflow-hidden shadow-2xl">
          <div className={`relative h-2 bg-gradient-to-r ${gradientClass}`} />
          
          <div className="relative p-6 md:p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 bg-gradient-to-br ${gradientClass}`}>
                {encounter.visualEmoji || '✨'}
              </div>
              <div className="flex-1 pr-10">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 font-body">
                    {typeLabel}
                  </span>
                </div>
                <h2 className="font-fairy text-2xl md:text-3xl text-white mb-2">
                  {encounter.title}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-white/5 border border-white/10 mb-6">
              <p className="text-white/85 font-body leading-relaxed text-base">
                {encounter.narrative}
              </p>
            </div>

            {!result ? (
              <div className="space-y-3">
                <h3 className="text-sm font-fairy text-white/70 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  你要如何回应？
                </h3>
                {encounter.options.map((opt: DreamEncounterOption, idx: number) => {
                  const optColors = ENCOUNTER_OUTCOME_COLORS[opt.outcome] || ENCOUNTER_OUTCOME_COLORS.neutral;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg group relative overflow-hidden ${optColors.bg} ${optColors.border} hover:brightness-110`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-fairy flex-shrink-0 ${optColors.bg} border ${optColors.border} shadow-md`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-body font-medium mb-1 ${optColors.text}`}>
                            {opt.text}
                          </h4>
                          <p className={`text-xs opacity-75 ${optColors.text}`}>
                            清醒度{opt.lucidityChange >= 0 ? '+' : ''}{opt.lucidityChange} · 稳定度{opt.stabilityChange >= 0 ? '+' : ''}{opt.stabilityChange}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${optColors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <div className={`rounded-2xl p-5 border-2 ${outcomeColors!.bg} ${outcomeColors!.border}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${outcomeColors!.bg} border ${outcomeColors!.border}`}>
                      {result.outcomeType === 'positive' ? (
                        <CheckCircle2 className={`w-5 h-5 ${outcomeColors!.text}`} />
                      ) : result.outcomeType === 'negative' ? (
                        <AlertCircle className={`w-5 h-5 ${outcomeColors!.text}`} />
                      ) : result.outcomeType === 'revelation' ? (
                        <Brain className={`w-5 h-5 ${outcomeColors!.text}`} />
                      ) : (
                        <Info className={`w-5 h-5 ${outcomeColors!.text}`} />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-body ${outcomeColors!.text} uppercase tracking-wide opacity-75`}>
                        {outcomeColors!.label}结果
                      </span>
                      <h3 className={`font-fairy text-xl ${outcomeColors!.text}`}>
                        {result.outcome}
                      </h3>
                    </div>
                  </div>
                  <p className={`text-sm ${outcomeColors!.text} opacity-90 font-body leading-relaxed`}>
                    {result.impact}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-body transition-all duration-300 hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  继续梦境
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}