import { useState, useMemo } from 'react';
import {
  X,
  Cloud,
  CloudSnow,
  Stars,
  Sparkles,
  Flower2,
  Moon,
  Rainbow,
  Sun,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw,
  Info,
  MapPin,
  Shield,
  Lock,
  Unlock,
} from 'lucide-react';
import { useStoryStore } from '@/store/storyStore';
import { WEATHER_INFO, WEATHER_TYPES, type WeatherType, type Region, REGIONS } from '@/types';

const getWeatherIcon = (weather: WeatherType, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  switch (weather) {
    case '晴朗':
      return <Sun className={`${sizeClass}`} />;
    case '白雪':
      return <CloudSnow className={`${sizeClass}`} />;
    case '流星雨':
      return <Stars className={`${sizeClass}`} />;
    case '魔法极光':
      return <Sparkles className={`${sizeClass}`} />;
    case '糖果风暴':
      return <Zap className={`${sizeClass}`} />;
    case '花瓣雨':
      return <Flower2 className={`${sizeClass}`} />;
    case '月光夜':
      return <Moon className={`${sizeClass}`} />;
    case '彩虹桥':
      return <Rainbow className={`${sizeClass}`} />;
    default:
      return <Cloud className={`${sizeClass}`} />;
  }
};

interface WeatherPanelProps {
  region?: Region;
  onClose?: () => void;
  compact?: boolean;
}

export default function WeatherPanel({ region = '全部', onClose, compact = false }: WeatherPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const weatherByRegion = useStoryStore((state) => state.regionWeathers);
  const globalWeather = useStoryStore((state) => state.currentGlobalWeather);
  const advanceWeather = useStoryStore((state) => state.advanceWeather);
  const getWeatherForecast = useStoryStore((state) => state.getWeatherForecast);
  const getWeatherEffect = useStoryStore((state) => state.getWeatherEffect);
  const isRegionUnlocked = useStoryStore((state) => state.isRegionUnlocked);
  const setRegionWeather = useStoryStore((state) => state.setRegionWeather);
  const setGlobalWeather = useStoryStore((state) => state.setGlobalWeather);

  const currentWeather = useMemo(
    () => (selectedRegion === '全部' ? globalWeather : weatherByRegion[selectedRegion as Exclude<Region, '全部'>] || '晴朗'),
    [selectedRegion, globalWeather, weatherByRegion]
  );

  const weatherInfo = WEATHER_INFO[currentWeather];
  const forecast = useMemo(() => getWeatherForecast(selectedRegion), [selectedRegion, getWeatherForecast]);
  const effect = useMemo(() => getWeatherEffect(currentWeather), [currentWeather, getWeatherEffect]);
  const regionUnlocked = useMemo(() => isRegionUnlocked(selectedRegion), [selectedRegion, isRegionUnlocked]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact && !isExpanded) {
    return (
      <div className="fairy-card p-3 cursor-pointer hover:shadow-fairy-lg transition-all" onClick={() => setIsExpanded(true)}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: weatherInfo.color }}
          >
            <span className="text-xl">{weatherInfo.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-fairy text-sm text-gray-800">{weatherInfo.type}</span>
              {selectedRegion !== '全部' && (
                <span className="text-xs text-gray-500 font-body flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedRegion}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-body line-clamp-1">{weatherInfo.description}</p>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fairy-card overflow-hidden">
      <div
        className="relative p-4 bg-gradient-to-br text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${weatherInfo.color}dd, ${weatherInfo.color}99 60%, ${weatherInfo.color}66)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-3xl">{weatherInfo.icon}</span>
              </div>
              <div>
                <h3 className="font-fairy text-2xl text-white drop-shadow">{weatherInfo.type}</h3>
                <p className="text-sm text-white/80 font-body flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedRegion === '全部' ? '王国全域' : selectedRegion}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {compact && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-white" />
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-white/90 font-body leading-relaxed mb-3">{weatherInfo.description}</p>

          <div className="flex items-center gap-3 text-xs text-white/80 font-body">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              下次变化：{formatTime(forecast.nextWeatherIn)}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
              下一步：{WEATHER_INFO[forecast.nextWeather].icon} {forecast.nextWeather}
            </div>
            {!regionUnlocked && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/40 text-white">
                <Lock className="w-3 h-3" />
                区域受限
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-fairy text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fairy-purple" />
            天气效果
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {weatherInfo.effects.map((eff, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-fairy-purple/5 to-fairy-pink/5 border border-fairy-purple/10"
              >
                <span className="w-6 h-6 rounded-full bg-fairy-purple/10 flex items-center justify-center text-xs">✨</span>
                <span className="text-xs text-gray-600 font-body">{eff}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-fairy text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-fairy-purple" />
            数值变化
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
            <div className="rounded-xl bg-amber-50 border border-amber-200/50 p-2 text-center">
              <div className="text-amber-500 mb-1">探索率</div>
              <div className="font-bold text-amber-700">
                {effect.explorationModifier >= 1 ? '+' : ''}
                {Math.round((effect.explorationModifier - 1) * 100)}%
              </div>
            </div>
            <div className="rounded-xl bg-purple-50 border border-purple-200/50 p-2 text-center">
              <div className="text-purple-500 mb-1">隐藏剧情</div>
              <div className="font-bold text-purple-700">+{effect.hiddenStoryBonus}%</div>
            </div>
            <div className="rounded-xl bg-rose-50 border border-rose-200/50 p-2 text-center">
              <div className="text-rose-500 mb-1">角色加成</div>
              <div className="font-bold text-rose-700">
                {Object.keys(effect.characterBuff).length > 0
                  ? Object.entries(effect.characterBuff).slice(0, 2).map(([k, v]) => `${k}+${v}`).join(' ')
                  : '无特殊'}
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/50 p-2 text-center">
              <div className="text-emerald-500 mb-1 flex items-center justify-center gap-1">
                {regionUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                区域
              </div>
              <div className={`font-bold ${regionUnlocked ? 'text-emerald-700' : 'text-red-600'}`}>
                {regionUnlocked ? '全部开放' : `${effect.unlockedRegions.length}个解锁`}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-fairy text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-fairy-purple" />
            天气预报
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {forecast.hourlyForecast.map((f, idx) => {
              const info = WEATHER_INFO[f.weather];
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white/60 border border-gray-100 p-2 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-[10px] text-gray-500 font-body mb-1">{f.time}</div>
                  <div
                    className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1 shadow-sm"
                    style={{ backgroundColor: info.color + '30' }}
                  >
                    <span className="text-lg">{info.icon}</span>
                  </div>
                  <div className="text-[10px] text-gray-700 font-medium">{f.weather}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-fairy text-sm text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-fairy-purple" />
            各地区天气
          </h4>
          <div className="flex flex-wrap gap-2">
            {REGIONS.filter((r) => r !== '全部').map((r) => {
              const w = weatherByRegion[r] || '晴朗';
              const info = WEATHER_INFO[w];
              const unlocked = isRegionUnlocked(r);
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                    selectedRegion === r
                      ? 'bg-gradient-fairy text-white shadow-md scale-105'
                      : unlocked
                      ? 'bg-white/70 border border-gray-200 text-gray-600 hover:bg-gray-50'
                      : 'bg-red-50 border border-red-200/50 text-red-500 hover:bg-red-100'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{r}</span>
                  {!unlocked && <Lock className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-fairy text-sm text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-fairy-purple" />
              魔法控制（调试）
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {WEATHER_TYPES.map((w) => {
              const info = WEATHER_INFO[w];
              return (
                <button
                  key={w}
                  onClick={() => {
                    if (selectedRegion === '全部') {
                      setGlobalWeather(w);
                    } else {
                      setRegionWeather(selectedRegion as Exclude<Region, '全部'>, w);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body transition-all hover:scale-105 ${
                    currentWeather === w
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={
                    currentWeather === w
                      ? { backgroundColor: info.color, boxShadow: `0 4px 14px ${info.color}50` }
                      : {}
                  }
                >
                  <span>{info.icon}</span>
                  <span>{w}</span>
                </button>
              );
            })}
            <button
              onClick={advanceWeather}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body bg-fairy-purple/10 text-fairy-purple hover:bg-fairy-purple/20 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              随机天气
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { getWeatherIcon };
