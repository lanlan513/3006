import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  X,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Compass,
  Star,
  Heart,
  Lock,
  Unlock,
  CloudSun,
  Info,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import WeatherPanel from '@/components/WeatherPanel';
import WeatherEffects from '@/components/WeatherEffects';
import { useStoryStore } from '@/store/storyStore';
import { WEATHER_INFO, type Region, type WeatherType } from '@/types';

interface MapRegion {
  id: Region;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  color: string;
  glowColor: string;
  icon: string;
  description: string;
}

const MAP_REGIONS: MapRegion[] = [
  {
    id: '丹麦',
    name: '丹麦',
    nameEn: 'Denmark',
    x: 520,
    y: 105,
    color: '#A5D8FF',
    glowColor: 'rgba(165, 216, 255, 0.6)',
    icon: '🧜',
    description: '安徒生童话的故乡，小美人鱼在海边守望',
  },
  {
    id: '德国',
    name: '德国',
    nameEn: 'Germany',
    x: 520,
    y: 140,
    color: '#FFB6C1',
    glowColor: 'rgba(255, 182, 193, 0.6)',
    icon: '🏰',
    description: '格林兄弟的魔法森林，白雪公主与灰姑娘的家园',
  },
  {
    id: '法国',
    name: '法国',
    nameEn: 'France',
    x: 485,
    y: 155,
    color: '#FF9A9E',
    glowColor: 'rgba(255, 154, 158, 0.6)',
    icon: '🌹',
    description: '浪漫的国度，美女与野兽、穿靴子的猫的传奇诞生地',
  },
  {
    id: '英国',
    name: '英国',
    nameEn: 'United Kingdom',
    x: 455,
    y: 115,
    color: '#7EC8E3',
    glowColor: 'rgba(126, 200, 227, 0.6)',
    icon: '🫅',
    description: '维多利亚时代的奇幻乐园，爱丽丝与彼得潘的仙境',
  },
  {
    id: '北欧',
    name: '北欧',
    nameEn: 'Nordic',
    x: 555,
    y: 75,
    color: '#DDA0DD',
    glowColor: 'rgba(221, 160, 221, 0.6)',
    icon: '🦢',
    description: '冰雪与极光的土地，豌豆公主与尼尔斯骑鹅的神奇世界',
  },
  {
    id: '俄罗斯',
    name: '俄罗斯',
    nameEn: 'Russia',
    x: 650,
    y: 85,
    color: '#5DADE2',
    glowColor: 'rgba(93, 173, 226, 0.6)',
    icon: '🐟',
    description: '广袤的童话大地，渔夫与金鱼、雪姑娘的温馨传说',
  },
  {
    id: '中国',
    name: '中国',
    nameEn: 'China',
    x: 780,
    y: 175,
    color: '#FF6B6B',
    glowColor: 'rgba(255, 107, 107, 0.6)',
    icon: '🐉',
    description: '东方古国的千年传说，龙与凤的故事',
  },
  {
    id: '日本',
    name: '日本',
    nameEn: 'Japan',
    x: 870,
    y: 185,
    color: '#FFB7B2',
    glowColor: 'rgba(255, 183, 178, 0.6)',
    icon: '🌸',
    description: '樱花纷飞的岛屿，桃太郎与辉夜姬的浪漫物语',
  },
  {
    id: '印度',
    name: '印度',
    nameEn: 'India',
    x: 695,
    y: 240,
    color: '#F8C291',
    glowColor: 'rgba(248, 194, 145, 0.6)',
    icon: '🪔',
    description: '神秘的东方古国，罗摩与哈奴曼的伟大史诗',
  },
  {
    id: '阿拉伯',
    name: '阿拉伯',
    nameEn: 'Arabia',
    x: 600,
    y: 210,
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    icon: '🧞',
    description: '一千零一夜的神秘沙漠，神灯与飞毯的奇遇',
  },
  {
    id: '古希腊',
    name: '古希腊',
    nameEn: 'Ancient Greece',
    x: 545,
    y: 180,
    color: '#B5EAD7',
    glowColor: 'rgba(181, 234, 215, 0.6)',
    icon: '🏛️',
    description: '众神与英雄的史诗，神话传说中的智慧',
  },
];

const CONTINENT_PATHS = [
  {
    id: 'europe',
    d: 'M440,60 L470,45 L510,50 L545,55 L560,70 L570,90 L565,110 L555,130 L540,145 L520,155 L500,150 L480,140 L460,130 L445,115 L435,95 L430,75 Z',
  },
  {
    id: 'asia',
    d: 'M560,50 L610,40 L660,45 L710,55 L760,70 L800,90 L830,120 L840,155 L830,185 L810,210 L780,230 L740,240 L700,235 L660,220 L630,200 L600,180 L580,160 L565,135 L555,110 L550,80 Z',
  },
  {
    id: 'africa',
    d: 'M470,180 L510,170 L550,180 L570,210 L575,250 L565,290 L545,330 L520,350 L490,345 L465,320 L450,285 L445,250 L450,220 L455,195 Z',
  },
  {
    id: 'northAmerica',
    d: 'M80,55 L130,40 L180,45 L220,60 L250,85 L260,120 L255,155 L240,185 L220,210 L190,225 L155,220 L120,200 L95,170 L80,135 L70,100 L75,70 Z',
  },
  {
    id: 'southAmerica',
    d: 'M170,240 L200,230 L225,245 L240,275 L245,310 L235,345 L220,375 L200,395 L175,400 L155,385 L140,355 L135,320 L140,285 L150,260 Z',
  },
  {
    id: 'oceania',
    d: 'M780,290 L830,280 L870,295 L890,320 L885,350 L860,370 L825,375 L790,360 L770,335 L765,310 Z',
  },
];

interface Star {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  delay: number;
}

interface Meteor {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
}

interface MagicParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, () => ({
    cx: Math.random() * 1000,
    cy: Math.random() * 500,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 3,
  }));
};

const generateMeteors = (count: number): Meteor[] => {
  return Array.from({ length: count }, (_, i) => {
    const startX = Math.random() * 600 + 100;
    const startY = Math.random() * 100 + 20;
    const length = Math.random() * 150 + 100;
    return {
      id: i,
      startX,
      startY,
      endX: startX + length,
      endY: startY + length * 0.6,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 15 + i * 5,
    };
  });
};

const generateMagicParticles = (regions: MapRegion[]): MagicParticle[] => {
  const particles: MagicParticle[] = [];
  let id = 0;
  regions.forEach((region) => {
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: id++,
        x: region.x + (Math.random() - 0.5) * 60,
        y: region.y + (Math.random() - 0.5) * 60,
        size: Math.random() * 3 + 1,
        color: region.color,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 4,
      });
    }
  });
  return particles;
};

export default function FairyMap() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [activeMeteors, setActiveMeteors] = useState<number[]>([]);
  const [showWeatherPanel, setShowWeatherPanel] = useState(true);
  const stories = useStoryStore((state) => state.stories);
  const regionWeathers = useStoryStore((state) => state.regionWeathers);
  const isRegionUnlocked = useStoryStore((state) => state.isRegionUnlocked);
  const getWeatherEffect = useStoryStore((state) => state.getWeatherEffect);
  const advanceWeather = useStoryStore((state) => state.advanceWeather);
  const weatherChangeTimer = useStoryStore((state) => state.weatherChangeTimer);
  const setWeatherChangeTimer = useStoryStore.setState;
  const meteorsRef = useRef<Meteor[]>([]);

  const currentViewWeather: WeatherType = useMemo(() => {
    if (selectedRegion && selectedRegion !== '全部') {
      return regionWeathers[selectedRegion as Exclude<Region, '全部'>] || '晴朗';
    }
    return regionWeathers['北欧'] || '晴朗';
  }, [selectedRegion, regionWeathers]);

  const isDarkWeather = useMemo(() => {
    return ['流星雨', '魔法极光', '月光夜'].includes(currentViewWeather);
  }, [currentViewWeather]);

  const STAR_POSITIONS = useMemo(() => generateStars(120), []);
  const METEORS = useMemo(() => generateMeteors(8), []);
  const MAGIC_PARTICLES = useMemo(() => generateMagicParticles(MAP_REGIONS), []);

  useEffect(() => {
    meteorsRef.current = METEORS;
    const intervals: number[] = [];
    METEORS.forEach((meteor, index) => {
      const interval = window.setInterval(() => {
        setActiveMeteors((prev) => [...prev, meteor.id]);
        window.setTimeout(() => {
          setActiveMeteors((prev) => prev.filter((id) => id !== meteor.id));
        }, meteor.duration * 1000);
      }, (meteor.delay + 8) * 1000);
      intervals.push(interval);
      if (index === 0) {
        window.setTimeout(() => {
          setActiveMeteors((prev) => [...prev, meteor.id]);
          window.setTimeout(() => {
            setActiveMeteors((prev) => prev.filter((id) => id !== meteor.id));
          }, meteor.duration * 1000);
        }, meteor.delay * 1000);
      }
    });
    return () => intervals.forEach(clearInterval);
  }, [METEORS]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWeatherChangeTimer((state) => ({
        weatherChangeTimer: Math.max(0, state.weatherChangeTimer - 1),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [setWeatherChangeTimer]);

  useEffect(() => {
    if (weatherChangeTimer <= 0) {
      advanceWeather();
    }
  }, [weatherChangeTimer, advanceWeather]);

  const regionStories = useMemo(() => {
    if (!selectedRegion) return [];
    return stories.filter((s) => s.region === selectedRegion);
  }, [stories, selectedRegion]);

  const selectedRegionData = useMemo(
    () => MAP_REGIONS.find((r) => r.id === selectedRegion),
    [selectedRegion]
  );

  const handleRegionClick = useCallback((regionId: Region) => {
    setSelectedRegion((prev) => (prev === regionId ? null : regionId));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedRegion(null);
  }, []);

  const totalStories = stories.length;
  const totalRegions = MAP_REGIONS.length;
  const hotStoriesCount = stories.filter((s) => s.isHot).length;

  const weatherInfo = WEATHER_INFO[currentViewWeather];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${isDarkWeather ? '' : 'weather-light-mode'}`}>
      <WeatherEffects weather={currentViewWeather} darkMode={isDarkWeather} intensity="normal" />
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isDarkWeather
            ? 'bg-gradient-to-b from-[#0a0e27] via-[#121a4a] to-[#1a1040]'
            : `bg-gradient-to-br ${weatherInfo.bgGradient} opacity-60`
        }`}
      />
      {!isDarkWeather && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/50 pointer-events-none" />
      )}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-full h-full opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(100, 150, 255, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255, 100, 150, 0.12) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(150, 100, 255, 0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-pulse-soft"
          style={{
            background: 'radial-gradient(circle, rgba(100, 80, 200, 0.4) 0%, transparent 70%)',
            top: '-20%',
            right: '-10%',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-pulse-soft"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '-10%',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl animate-pulse-soft"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%)',
            top: '30%',
            left: '40%',
            transform: 'translateX(-50%)',
            animationDuration: '12s',
            animationDelay: '4s',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl animate-pulse-soft"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 200, 0.25) 0%, transparent 70%)',
            bottom: '30%',
            right: '20%',
            animationDuration: '9s',
            animationDelay: '1s',
          }}
        />
      </div>

      <Navbar />

      <div className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] lg:right-6 pb-4">
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setShowWeatherPanel((p) => !p)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body backdrop-blur-sm border shadow-lg transition-all ${
              isDarkWeather
                ? 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15'
                : 'bg-white/80 text-gray-700 border-white/50 hover:bg-white'
            }`}
            style={!isDarkWeather ? { boxShadow: `0 4px 20px ${weatherInfo.color}40` } : {}}
          >
            <span className="text-lg">{weatherInfo.icon}</span>
            <span className="hidden sm:inline">{currentViewWeather}</span>
            <CloudSun className="w-4 h-4 ml-1" />
          </button>
        </div>
        {showWeatherPanel && (
          <WeatherPanel
            region={selectedRegion || '全部'}
            onClose={() => setShowWeatherPanel(false)}
            compact={false}
          />
        )}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-6 pb-4">
          <div className={`flex items-center gap-2 text-sm font-body mb-4 ${isDarkWeather ? 'text-white/50' : 'text-gray-500'}`}>
            <Link to="/" className={`flex items-center gap-1 transition-colors ${isDarkWeather ? 'hover:text-white/80' : 'hover:text-gray-700'}`}>
              首页
            </Link>
            <span>/</span>
            <span className={isDarkWeather ? 'text-white/80' : 'text-gray-700'}>童话地图</span>
          </div>
        </div>

        <div className="text-center mb-6 px-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border shadow-sm mb-4 ${
            isDarkWeather
              ? 'bg-white/10 border-white/20'
              : 'bg-white/70 border-white/50'
          }`}>
            <Globe className={`w-4 h-4 ${isDarkWeather ? 'text-fairy-gold' : 'text-fairy-purple'} animate-twinkle`} />
            <span className={`text-sm font-body ${isDarkWeather ? 'text-white/70' : 'text-gray-600'}`}>探索世界童话 · Explore Fairy Tales</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body backdrop-blur-sm border mb-3 ${
            isDarkWeather
              ? 'bg-white/5 border-white/10 text-white/60'
              : 'bg-white/60 border-white/40 text-gray-500'
          }`}
          style={!isDarkWeather ? { borderColor: `${weatherInfo.color}40`, background: `${weatherInfo.color}15` } : {}}
          >
            <Info className="w-3 h-3" />
            当前视野天气：<span className="font-medium" style={{ color: isDarkWeather ? weatherInfo.color : undefined }}>{weatherInfo.icon} {currentViewWeather}</span>
            <span className="mx-1 opacity-40">·</span>
            {getWeatherEffect(currentViewWeather).hiddenStoryBonus > 0 ? (
              <span>✨ 隐藏剧情 +{getWeatherEffect(currentViewWeather).hiddenStoryBonus}%</span>
            ) : (
              <span>🗺️ 探索率 {Math.round(getWeatherEffect(currentViewWeather).explorationModifier * 100)}%</span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-fairy mb-3">
            <span className={`bg-clip-text text-transparent ${
              isDarkWeather
                ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300'
                : 'bg-gradient-to-r from-fairy-purple via-fairy-pink to-fairy-gold'
            }`}>
              童话地图
            </span>
          </h1>
          <p className={`text-base md:text-lg font-body max-w-2xl mx-auto mb-6 ${
            isDarkWeather ? 'text-white/60' : 'text-gray-600'
          }`}>
            穿越七大洲，跨越四大洋，点亮世界每个角落的童话之光
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
              isDarkWeather ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/50 shadow-sm'
            }`}>
              <Compass className={`w-4 h-4 ${isDarkWeather ? 'text-amber-300' : 'text-amber-500'}`} />
              <span className={`text-sm font-body ${isDarkWeather ? 'text-white/60' : 'text-gray-500'}`}>
                <span className={`font-medium ${isDarkWeather ? 'text-white' : 'text-gray-800'}`}>{totalRegions}</span> 个文化地区
              </span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
              isDarkWeather ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/50 shadow-sm'
            }`}>
              <BookOpen className={`w-4 h-4 ${isDarkWeather ? 'text-rose-300' : 'text-rose-500'}`} />
              <span className={`text-sm font-body ${isDarkWeather ? 'text-white/60' : 'text-gray-500'}`}>
                <span className={`font-medium ${isDarkWeather ? 'text-white' : 'text-gray-800'}`}>{totalStories}</span> 篇经典童话
              </span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
              isDarkWeather ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/50 shadow-sm'
            }`}>
              <Heart className={`w-4 h-4 ${isDarkWeather ? 'text-pink-300' : 'text-pink-500'}`} />
              <span className={`text-sm font-body ${isDarkWeather ? 'text-white/60' : 'text-gray-500'}`}>
                <span className={`font-medium ${isDarkWeather ? 'text-white' : 'text-gray-800'}`}>{hotStoriesCount}</span> 个热门故事
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className={`relative rounded-3xl overflow-hidden border backdrop-blur-sm shadow-2xl transition-colors duration-500 ${
            isDarkWeather
              ? 'border-white/10 bg-white/5'
              : 'border-white/60 bg-white/40'
          }`}>
            <div className={`absolute inset-0 bg-gradient-to-b to-transparent pointer-events-none z-10 ${
              isDarkWeather ? 'from-white/5' : 'from-white/30'
            }`} style={{ height: '60px' }} />
            <div className={`absolute inset-0 bg-gradient-to-t to-transparent pointer-events-none z-10 ${
              isDarkWeather ? 'from-black/20' : 'from-white/10'
            }`} style={{ height: '80px', bottom: 0, top: 'auto' }} />

            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto"
              style={{ minHeight: '300px' }}
            >
              <defs>
                <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 215, 0, 0.8)" />
                  <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="continentShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.3)" />
                </filter>
                <filter id="meteorGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(100, 200, 255, 0.1)" />
                  <stop offset="50%" stopColor="rgba(200, 100, 255, 0.08)" />
                  <stop offset="100%" stopColor="rgba(255, 200, 100, 0.06)" />
                </linearGradient>

                {MAP_REGIONS.map((region) => (
                  <radialGradient key={`rg-${region.id}`} id={`glow-${region.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={region.glowColor} />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                ))}
              </defs>

              <rect x="0" y="0" width="1000" height="500" fill="url(#aurora1)" />

              {STAR_POSITIONS.map((star, i) => (
                <circle
                  key={`star-${i}`}
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="white"
                  opacity={star.opacity}
                >
                  <animate
                    attributeName="opacity"
                    values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
                    dur={`${2 + star.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values={`${star.r};${star.r * 1.5};${star.r}`}
                    dur={`${3 + star.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {METEORS.map((meteor) => (
                activeMeteors.includes(meteor.id) && (
                  <g key={`meteor-${meteor.id}`} filter="url(#meteorGlow)">
                    <line
                      x1={meteor.startX}
                      y1={meteor.startY}
                      x2={meteor.endX}
                      y2={meteor.endY}
                      stroke="url(#aurora1)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="x1"
                        values={`${meteor.startX};${meteor.endX + 50}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="y1"
                        values={`${meteor.startY};${meteor.endY + 30}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="x2"
                        values={`${meteor.endX};${meteor.endX + 50}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="y2"
                        values={`${meteor.endY};${meteor.endY + 30}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0.8;0"
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                    </line>
                    <circle
                      cx={meteor.endX}
                      cy={meteor.endY}
                      r="3"
                      fill="white"
                    >
                      <animate
                        attributeName="cx"
                        values={`${meteor.endX};${meteor.endX + 50}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="cy"
                        values={`${meteor.endY};${meteor.endY + 30}`}
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0.9;0"
                        dur={`${meteor.duration}s`}
                        fill="freeze"
                      />
                    </circle>
                  </g>
                )
              ))}

              {CONTINENT_PATHS.map((continent) => (
                <path
                  key={continent.id}
                  d={continent.d}
                  fill="rgba(255, 255, 255, 0.06)"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  filter="url(#continentShadow)"
                >
                  <animate
                    attributeName="fill"
                    values="rgba(255,255,255,0.06);rgba(255,255,255,0.09);rgba(255,255,255,0.06)"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
              ))}

              <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" strokeDasharray="8 8" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" strokeDasharray="8 8" />
              <ellipse cx="500" cy="250" rx="400" ry="200" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" strokeDasharray="6 6" />
              <ellipse cx="500" cy="250" rx="250" ry="125" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" strokeDasharray="4 4" />
              <ellipse cx="500" cy="250" rx="100" ry="50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />

              {MAGIC_PARTICLES.map((particle) => (
                <circle
                  key={`particle-${particle.id}`}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.size}
                  fill={particle.color}
                  opacity="0.6"
                >
                  <animate
                    attributeName="cy"
                    values={`${particle.y};${particle.y - 20};${particle.y}`}
                    dur={`${particle.duration}s`}
                    begin={`${particle.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;0.8;0.2"
                    dur={`${particle.duration}s`}
                    begin={`${particle.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values={`${particle.size};${particle.size * 2};${particle.size}`}
                    dur={`${particle.duration}s`}
                    begin={`${particle.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {MAP_REGIONS.map((region, regionIndex) => {
                const isSelected = selectedRegion === region.id;
                const isHovered = hoveredRegion === region.id;
                const connections: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
                MAP_REGIONS.forEach((otherRegion, otherIndex) => {
                  if (regionIndex < otherIndex) {
                    const dx = Math.abs(region.x - otherRegion.x);
                    const dy = Math.abs(region.y - otherRegion.y);
                    if (dx < 200 && dy < 150) {
                      connections.push({
                        x1: region.x,
                        y1: region.y,
                        x2: otherRegion.x,
                        y2: otherRegion.y,
                        color: region.color,
                      });
                    }
                  }
                });

                return (
                  <g key={`conn-group-${region.id}`}>
                    {connections.map((conn, connIndex) => (
                      <g key={`conn-${regionIndex}-${connIndex}`}>
                        <line
                          x1={conn.x1}
                          y1={conn.y1}
                          x2={conn.x2}
                          y2={conn.y2}
                          stroke={conn.color}
                          strokeWidth="0.3"
                          strokeOpacity={isSelected || isHovered ? 0.25 : 0.08}
                          strokeDasharray="4 4"
                          className="transition-opacity duration-500"
                        />
                        {isSelected && (
                          <circle
                            r="2"
                            fill={conn.color}
                            opacity="0.6"
                          >
                            <animateMotion
                              dur="3s"
                              repeatCount="indefinite"
                              path={`M${conn.x1},${conn.y1} L${conn.x2},${conn.y2}`}
                            />
                          </circle>
                        )}
                      </g>
                    ))}
                  </g>
                );
              })}

              {MAP_REGIONS.map((region) => {
                const isSelected = selectedRegion === region.id;
                const isHovered = hoveredRegion === region.id;
                const regionWeather = regionWeathers[region.id as Exclude<Region, '全部'>] || '晴朗';
                const weatherInfo = WEATHER_INFO[regionWeather];
                const unlocked = isRegionUnlocked(region.id);

                return (
                  <g
                    key={region.id}
                    className={`${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onClick={() => unlocked && handleRegionClick(region.id)}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {!unlocked && (
                      <circle
                        cx={region.x}
                        cy={region.y}
                        r={35}
                        fill="rgba(0,0,0,0.3)"
                        stroke="rgba(255,100,100,0.5)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )}

                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={isSelected ? 60 : isHovered ? 50 : 38}
                      fill={`url(#glow-${region.id})`}
                      opacity={unlocked ? (isSelected ? 1 : isHovered ? 0.85 : 0.55) : 0.25}
                    >
                      <animate
                        attributeName="r"
                        values={isSelected ? '55;65;55' : isHovered ? '45;55;45' : '32;42;32'}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={isSelected ? 16 : isHovered ? 13 : 10}
                      fill={unlocked ? region.color : '#666'}
                      filter="url(#glow)"
                      opacity={unlocked ? (isSelected ? 1 : isHovered ? 0.92 : 0.75) : 0.4}
                    >
                      <animate
                        attributeName="r"
                        values={isSelected ? '14;18;14' : isHovered ? '11;15;11' : '8;12;8'}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={4}
                      fill="white"
                      opacity={unlocked ? 0.95 : 0.5}
                    />

                    <text
                      x={region.x}
                      y={region.y + 2}
                      textAnchor="middle"
                      fontSize="8"
                      opacity={unlocked ? (isSelected || isHovered ? 1 : 0.8) : 0.4}
                    >
                      {unlocked ? region.icon : '🔒'}
                    </text>

                    <g transform={`translate(${region.x + 18}, ${region.y - 18})`}>
                      <circle
                        r="10"
                        fill={isDarkWeather ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,1)'}
                        stroke={weatherInfo.color}
                        strokeWidth="1"
                        opacity={unlocked ? 1 : 0.5}
                      />
                      <text
                        y="3.5"
                        textAnchor="middle"
                        fontSize="10"
                      >
                        {weatherInfo.icon}
                      </text>
                    </g>

                    <text
                      x={region.x}
                      y={region.y - 28}
                      textAnchor="middle"
                      className="font-body"
                      fill={unlocked ? region.color : 'rgba(150,150,150,0.8)'}
                      fontSize="13"
                      fontWeight="600"
                      opacity={unlocked ? (isSelected || isHovered ? 1 : 0.85) : 0.6}
                      filter={unlocked ? 'url(#glow)' : undefined}
                    >
                      {region.name}
                    </text>

                    {(isSelected || isHovered) && unlocked && (
                      <>
                        <text
                          x={region.x}
                          y={region.y + 36}
                          textAnchor="middle"
                          className="font-body"
                          fill={isDarkWeather ? 'rgba(255, 255, 255, 0.55)' : 'rgba(80, 80, 80, 0.7)'}
                          fontSize="10"
                        >
                          {region.nameEn}
                        </text>
                        <text
                          x={region.x}
                          y={region.y + 50}
                          textAnchor="middle"
                          className="font-body"
                          fill={isDarkWeather ? 'rgba(255, 255, 255, 0.5)' : 'rgba(100, 100, 100, 0.6)'}
                          fontSize="9"
                        >
                          {stories.filter((s) => s.region === region.id).length} 篇故事
                        </text>
                        <text
                          x={region.x}
                          y={region.y + 64}
                          textAnchor="middle"
                          className="font-body"
                          fill={weatherInfo.color}
                          fontSize="8.5"
                          fontWeight="500"
                        >
                          {weatherInfo.icon} {regionWeather}
                        </text>
                      </>
                    )}

                    {(isSelected || isHovered) && !unlocked && (
                      <text
                        x={region.x}
                        y={region.y + 40}
                        textAnchor="middle"
                        className="font-body"
                        fill="rgba(255, 120, 120, 0.8)"
                        fontSize="10"
                        fontWeight="500"
                      >
                        🔒 需特定天气解锁
                      </text>
                    )}

                    {isSelected && unlocked && (
                      <>
                        <circle
                          cx={region.x}
                          cy={region.y}
                          r={25}
                          fill="none"
                          stroke={region.color}
                          strokeWidth="1.5"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values="20;45;20"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.6;0;0.6"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx={region.x}
                          cy={region.y}
                          r={25}
                          fill="none"
                          stroke={region.color}
                          strokeWidth="1"
                          opacity="0.4"
                        >
                          <animate
                            attributeName="r"
                            values="20;55;20"
                            dur="2.8s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.4;0;0.4"
                            dur="2.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx={region.x}
                          cy={region.y}
                          r={25}
                          fill="none"
                          stroke="white"
                          strokeWidth="0.5"
                          opacity="0.2"
                        >
                          <animate
                            attributeName="r"
                            values="20;70;20"
                            dur="3.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.2;0;0.2"
                            dur="3.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}

              <g transform="translate(960, 470)">
                <text
                  x="0"
                  y="0"
                  textAnchor="end"
                  fill={isDarkWeather ? 'rgba(255,255,255,0.25)' : 'rgba(100,100,100,0.4)'}
                  fontSize="10"
                  className="font-body"
                >
                  ✨ 童话地图 · Fairy Tale Map · 点亮世界的故事之光
                </text>
              </g>

              <g transform="translate(30, 470)">
                <CompassIcon />
              </g>
            </svg>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-20 max-w-[calc(100%-120px)]">
              {MAP_REGIONS.map((region) => {
                const count = stories.filter((s) => s.region === region.id).length;
                const regionWeather = regionWeathers[region.id as Exclude<Region, '全部'>] || '晴朗';
                const rWeatherInfo = WEATHER_INFO[regionWeather];
                const unlocked = isRegionUnlocked(region.id);
                return (
                  <button
                    key={region.id}
                    onClick={() => unlocked && handleRegionClick(region.id)}
                    disabled={!unlocked}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body transition-all duration-300 border backdrop-blur-sm ${
                      selectedRegion === region.id
                        ? isDarkWeather
                          ? 'bg-white/20 border-white/30 text-white shadow-lg scale-105'
                          : 'bg-white border-fairy-purple/30 text-fairy-purple shadow-lg scale-105'
                        : unlocked
                        ? isDarkWeather
                          ? 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/85 hover:scale-105'
                          : 'bg-white/60 border-gray-200/60 text-gray-600 hover:bg-white hover:text-gray-800 hover:scale-105'
                        : isDarkWeather
                        ? 'bg-red-500/10 border-red-400/30 text-red-300/70 cursor-not-allowed'
                        : 'bg-red-50 border-red-200/50 text-red-500/80 cursor-not-allowed'
                    }`}
                    style={selectedRegion === region.id ? { boxShadow: `0 0 20px ${region.glowColor}` } : {}}
                  >
                    <span>{unlocked ? region.icon : '🔒'}</span>
                    <span>{region.name}</span>
                    <span className="opacity-60">{rWeatherInfo.icon}</span>
                    <span className="opacity-60">·{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="absolute top-4 right-4 z-20">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body backdrop-blur-sm border ${
                isDarkWeather
                  ? 'bg-white/5 border-white/10 text-white/40'
                  : 'bg-white/70 border-white/50 text-gray-500 shadow-sm'
              }`}>
                <MapPin className="w-3 h-3" />
                点击光点探索故事
              </span>
            </div>

            <div className="absolute top-4 left-4 z-20 hidden md:block">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body backdrop-blur-sm border ${
                isDarkWeather
                  ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-amber-300/20 text-amber-200/70'
                  : 'bg-gradient-to-r from-amber-50 to-rose-50 border-amber-200/50 text-amber-700 shadow-sm'
              }`}>
                <Star className="w-3 h-3 animate-twinkle" />
                当流星划过，许个愿望吧
              </span>
            </div>
          </div>
        </div>

        {selectedRegion && selectedRegionData && (
          <div className="container mx-auto px-4 mt-6 pb-12">
            <div
              className={`relative rounded-3xl overflow-hidden border backdrop-blur-md shadow-2xl ${
                isDarkWeather
                  ? 'border-white/10 bg-white/[0.07]'
                  : 'border-white/70 bg-white/80'
              }`}
              style={{
                animation: 'fadeInUp 0.5s ease-out',
              }}
            >
              <div
                className="absolute inset-0 opacity-8"
                style={{
                  background: `radial-gradient(circle at 20% 50%, ${selectedRegionData.color}, transparent 60%)`,
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{ background: `linear-gradient(90deg, ${selectedRegionData.color}, transparent 70%)` }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative overflow-hidden"
                      style={{
                        backgroundColor: `${selectedRegionData.color}20`,
                        border: `1px solid ${selectedRegionData.color}50`,
                      }}
                    >
                      <span className="relative z-10">{selectedRegionData.icon}</span>
                      <div
                        className="absolute inset-0 opacity-30 animate-pulse-soft"
                        style={{ backgroundColor: selectedRegionData.color }}
                      />
                    </div>
                    <div>
                      <h2 className={`text-2xl md:text-3xl font-fairy flex items-center gap-2 ${
                        isDarkWeather ? 'text-white' : 'text-gray-800'
                      }`}>
                        {selectedRegionData.name}童话
                        <Sparkles className="w-5 h-5 animate-twinkle" style={{ color: selectedRegionData.color }} />
                      </h2>
                      <p className={`text-sm font-body mt-0.5 ${
                        isDarkWeather ? 'text-white/50' : 'text-gray-500'
                      }`}>
                        {selectedRegionData.nameEn} Fairy Tales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body backdrop-blur-sm"
                      style={{
                        backgroundColor: `${selectedRegionData.color}20`,
                        border: `1px solid ${selectedRegionData.color}40`,
                        color: selectedRegionData.color,
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {regionStories.length} 篇故事
                    </span>
                    <button
                      onClick={handleClose}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isDarkWeather
                          ? 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-2 flex flex-wrap items-center gap-2">
                  <p className={`font-body text-sm leading-relaxed max-w-2xl flex-1 ${
                    isDarkWeather ? 'text-white/55' : 'text-gray-600'
                  }`}>
                    {selectedRegionData.description}
                  </p>
                  {(() => {
                    const regionWeather = regionWeathers[selectedRegion as Exclude<Region, '全部'>] || '晴朗';
                    const rWeatherInfo = WEATHER_INFO[regionWeather];
                    const effect = getWeatherEffect(regionWeather);
                    return (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body backdrop-blur-sm"
                        style={{
                          backgroundColor: `${rWeatherInfo.color}20`,
                          border: `1px solid ${rWeatherInfo.color}40`,
                          color: isDarkWeather ? rWeatherInfo.color : undefined,
                        }}
                      >
                        <span>{rWeatherInfo.icon}</span>
                        <span className={isDarkWeather ? '' : 'text-gray-700'}>{regionWeather}</span>
                        {effect.hiddenStoryBonus > 0 && (
                          <span className={isDarkWeather ? 'text-white/60' : 'text-gray-500'}>
                            · 隐藏+{effect.hiddenStoryBonus}%
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="px-6 pb-6 pt-4">
                  {regionStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {regionStories.map((story) => {
                        const regionWeather = regionWeathers[selectedRegion as Exclude<Region, '全部'>] || '晴朗';
                        const storyUnlocked = useStoryStore.getState().isStoryWeatherUnlocked(
                          story.id,
                          story.region as Region,
                          story.tags
                        );
                        const cardContent = (
                          <>
                            <div className="relative h-40 overflow-hidden">
                              <div
                                className="absolute inset-0"
                                style={{ backgroundColor: story.coverColor }}
                              />
                              <img
                                src={story.coverImage}
                                alt={story.title}
                                className={`w-full h-full object-cover transition-transform duration-500 ${storyUnlocked ? 'group-hover:scale-110' : 'grayscale-[30%]'}`}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              {!storyUnlocked && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="text-center">
                                    <Lock className="w-8 h-8 text-white/70 mx-auto mb-1" />
                                    <p className="text-xs text-white/80 font-body">特定天气解锁</p>
                                  </div>
                                </div>
                              )}
                              {story.isHot && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg">
                                  <Sparkles className="w-3 h-3" />
                                  热门
                                </div>
                              )}
                              <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="font-fairy text-lg text-white drop-shadow-lg leading-tight">
                                  {story.title}
                                </h3>
                                <p className="text-[11px] text-white/60 font-body mt-1">
                                  {story.author}
                                </p>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className={`text-xs font-body line-clamp-2 mb-3 leading-relaxed ${
                                isDarkWeather ? 'text-white/55' : 'text-gray-500'
                              }`}>
                                {story.summary}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {story.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-body backdrop-blur-sm ${
                                      isDarkWeather ? 'text-white/75' : 'text-gray-600'
                                    }`}
                                    style={{
                                      backgroundColor: `${selectedRegionData.color}30`,
                                      border: `1px solid ${selectedRegionData.color}30`,
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                        return (
                        <div
                          key={story.id}
                          className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                            isDarkWeather
                              ? 'bg-white/[0.08] border-white/10 hover:border-white/20 hover:bg-white/[0.12]'
                              : 'bg-white/90 border-gray-100 hover:border-gray-200 hover:shadow-lg'
                          } ${!storyUnlocked ? 'opacity-70' : ''}`}
                          style={{
                            animation: 'fadeInUp 0.4s ease-out backwards',
                          }}
                        >
                          {storyUnlocked ? (
                            <Link to={`/stories/${story.id}`}>{cardContent}</Link>
                          ) : (
                            <div className="cursor-not-allowed">{cardContent}</div>
                          )}
                        </div>
                      );})}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isDarkWeather ? 'bg-white/10' : 'bg-gray-100'
                      }`}>
                        <BookOpen className={`w-10 h-10 ${
                          isDarkWeather ? 'text-white/30' : 'text-gray-300'
                        }`} />
                      </div>
                      <p className={`font-body mb-2 ${
                        isDarkWeather ? 'text-white/40' : 'text-gray-500'
                      }`}>暂无该地区的童话故事</p>
                      <p className={`font-body text-sm ${
                        isDarkWeather ? 'text-white/25' : 'text-gray-400'
                      }`}>敬请期待更多精彩故事...</p>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <Link
                      to="/stories"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm transition-all duration-300 backdrop-blur-sm hover:scale-105 ${
                        isDarkWeather
                          ? 'text-white/80 bg-white/10 border border-white/15 hover:bg-white/15 hover:text-white'
                          : 'text-gray-600 bg-white/70 border border-gray-200 hover:bg-white hover:text-gray-800 shadow-sm'
                      }`}
                    >
                      浏览全部故事书架
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedRegion && (
          <div className="container mx-auto px-4 mt-8 pb-12">
            <div className="text-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-fairy mb-2 ${
                isDarkWeather ? 'text-white/90' : 'text-gray-800'
              }`}>选择一个地区开始探索</h2>
              <p className={`font-body ${
                isDarkWeather ? 'text-white/50' : 'text-gray-500'
              }`}>每一个光点，都藏着无数动人的故事</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {MAP_REGIONS.map((region) => {
                const count = stories.filter((s) => s.region === region.id).length;
                const regionHotCount = stories.filter((s) => s.region === region.id && s.isHot).length;
                const regionWeather = regionWeathers[region.id as Exclude<Region, '全部'>] || '晴朗';
                const rWeatherInfo = WEATHER_INFO[regionWeather];
                const unlocked = isRegionUnlocked(region.id);
                return (
                  <button
                    key={region.id}
                    onClick={() => unlocked && handleRegionClick(region.id)}
                    disabled={!unlocked}
                    className={`group relative rounded-2xl overflow-hidden p-5 text-left transition-all duration-300 ${
                      unlocked ? 'hover:-translate-y-1.5' : 'opacity-60 cursor-not-allowed'
                    } ${
                      isDarkWeather
                        ? 'bg-white/[0.06] border border-white/10 hover:border-white/20 hover:bg-white/[0.1]'
                        : 'bg-white/80 border border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                    style={{
                      animation: 'fadeInUp 0.5s ease-out backwards',
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, ${region.color}, transparent)` }}
                    />
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative overflow-hidden"
                          style={{
                            backgroundColor: `${region.color}20`,
                            border: `1px solid ${region.color}40`,
                          }}
                        >
                          {unlocked ? region.icon : '🔒'}
                        </div>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                          style={{
                            backgroundColor: rWeatherInfo.color + '30',
                            border: `1px solid ${rWeatherInfo.color}50`,
                          }}
                          title={regionWeather}
                        >
                          {rWeatherInfo.icon}
                        </div>
                      </div>
                      {regionHotCount > 0 && (
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                          isDarkWeather
                            ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200/80'
                            : 'bg-gradient-to-r from-amber-50 to-rose-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Sparkles className="w-2.5 h-2.5" />
                          {regionHotCount}热
                        </div>
                      )}
                    </div>
                    <h3 className={`font-fairy text-xl mb-0.5 ${
                      isDarkWeather ? 'text-white' : 'text-gray-800'
                    }`}>{region.name}</h3>
                    <p className={`text-xs font-body mb-2.5 ${
                      isDarkWeather ? 'text-white/40' : 'text-gray-400'
                    }`}>{region.nameEn}</p>
                    <p className={`text-xs font-body line-clamp-2 mb-4 leading-relaxed min-h-[32px] ${
                      isDarkWeather ? 'text-white/55' : 'text-gray-500'
                    }`}>
                      {region.description}
                      {!unlocked && (
                        <span className="block mt-1 text-red-400">🔒 需要特定天气解锁</span>
                      )}
                    </p>
                    <div className={`flex items-center justify-between pt-3 border-t ${
                      isDarkWeather ? 'border-white/5' : 'border-gray-100'
                    }`}>
                      <span className="text-sm font-body" style={{ color: region.color }}>
                        {count} 篇故事
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-all ${
                        isDarkWeather
                          ? 'text-white/30 group-hover:text-white/70 group-hover:translate-x-1'
                          : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1'
                      } ${!unlocked ? 'opacity-30' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        .animate-pulse-soft {
          animation: pulse-soft ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CompassIcon() {
  return (
    <g transform="translate(0, 0)">
      <circle cx="15" cy="15" r="14" fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
      <circle cx="15" cy="15" r="10" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" />
      <polygon points="15,4 17,15 15,26 13,15" fill="rgba(255,100,100,0.5)" />
      <polygon points="15,4 17,15 15,15" fill="rgba(255,100,100,0.7)" />
      <polygon points="4,15 15,13 26,15 15,17" fill="rgba(255,215,0,0.3)" />
      <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.4)" />
      <text x="15" y="-4" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="4" className="font-body">N</text>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 15 15"
        to="360 15 15"
        dur="60s"
        repeatCount="indefinite"
      />
    </g>
  );
}
