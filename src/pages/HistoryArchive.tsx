import { useState, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  Users,
  Globe,
  MapPin,
  Calendar,
  Search,
  ChevronRight,
  Sparkles,
  ScrollText,
  Crown,
  Sword,
  Flame,
  Heart,
  Award,
  X,
  Star,
  BookMarked,
  Filter,
  ChevronDown,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingDecorations from '@/components/FloatingDecorations';
import {
  historicalEvents,
  historicalFigures,
  eraSummaries,
  searchHistoricalEvents,
  searchHistoricalFigures,
} from '@/data/historyEvents';
import {
  HISTORICAL_ERAS,
  HISTORICAL_EVENT_TYPES,
  EVENT_TYPE_ICONS,
  EVENT_TYPE_COLORS,
  REGIONS,
} from '@/types';
import type {
  HistoricalEvent,
  HistoricalFigure,
  HistoryArchiveTab,
  EraSummary,
  HistoricalEventType,
  HistoricalEra,
  Region,
} from '@/types';

const getImportanceLabel = (importance: string) => {
  switch (importance) {
    case 'minor':
      return { label: '小型事件', color: 'text-gray-600', bg: 'bg-gray-100' };
    case 'moderate':
      return { label: '中型事件', color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'major':
      return { label: '大型事件', color: 'text-amber-600', bg: 'bg-amber-100' };
    case 'catastrophic':
      return { label: '史诗级事件', color: 'text-red-600', bg: 'bg-red-100' };
    default:
      return { label: '未知', color: 'text-gray-600', bg: 'bg-gray-100' };
  }
};

export default function HistoryArchive() {
  const [activeTab, setActiveTab] = useState<HistoryArchiveTab>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('全部');
  const [selectedRegion, setSelectedRegion] = useState<string>('全部');
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [selectedFigure, setSelectedFigure] = useState<string>('全部');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const tabs: { id: HistoryArchiveTab; label: string; icon: typeof Clock }[] = [
    { id: 'timeline', label: '历史时间线', icon: Clock },
    { id: 'events', label: '历史事件', icon: ScrollText },
    { id: 'figures', label: '历史人物', icon: Users },
    { id: 'eras', label: '时代概览', icon: Crown },
  ];

  const filteredEvents = useMemo(() => {
    let events = [...historicalEvents];

    if (searchQuery) {
      events = searchHistoricalEvents(searchQuery);
    }
    if (selectedEra !== '全部') {
      events = events.filter((e) => e.era === selectedEra);
    }
    if (selectedRegion !== '全部') {
      events = events.filter((e) => e.region === selectedRegion);
    }
    if (selectedType !== '全部') {
      events = events.filter((e) => e.type === selectedType);
    }
    if (selectedFigure !== '全部') {
      events = events.filter((e) => e.participants.some((p) => p.name === selectedFigure));
    }

    return events.sort((a, b) => a.year - b.year);
  }, [searchQuery, selectedEra, selectedRegion, selectedType, selectedFigure]);

  const filteredFigures = useMemo(() => {
    let figures = [...historicalFigures];

    if (searchQuery) {
      figures = searchHistoricalFigures(searchQuery);
    }
    if (selectedEra !== '全部') {
      figures = figures.filter((f) => f.era === selectedEra);
    }
    if (selectedRegion !== '全部') {
      figures = figures.filter((f) => f.region === selectedRegion);
    }

    return figures;
  }, [searchQuery, selectedEra, selectedRegion]);

  const figureNames = useMemo(() => {
    return ['全部', ...historicalFigures.map((f) => f.name)];
  }, []);

  const handleEventClick = (event: HistoricalEvent) => {
    setSelectedEvent(event);
  };

  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  const resetFilters = () => {
    setSelectedEra('全部');
    setSelectedRegion('全部');
    setSelectedType('全部');
    setSelectedFigure('全部');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen relative">
      <FloatingDecorations />
      <Navbar />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 backdrop-blur-sm border border-amber-300/50 mb-4">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-body text-amber-700">追溯童话的起源</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-fairy text-gradient-fairy mb-3">
              童话历史考古馆
            </h1>
            <p className="text-gray-600 font-body max-w-2xl mx-auto">
              世界中发生过的重要事件都会自动沉淀为历史文献。浏览王国兴衰、英雄诞生、怪物入侵等历史记录，
              感受童话世界可追溯的发展轨迹。
            </p>
          </div>

          <div className="fairy-card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fairy-purple/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索历史事件、人物、地点..."
                  className="fairy-input pl-12 pr-4 w-full"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 border border-fairy-purple/20 text-gray-700 font-body hover:border-fairy-purple hover:text-fairy-purple transition-colors"
              >
                <Filter className="w-5 h-5" />
                筛选
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-fairy-purple/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-body text-gray-600 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      时代
                    </label>
                    <select
                      value={selectedEra}
                      onChange={(e) => setSelectedEra(e.target.value)}
                      className="fairy-input text-sm w-full"
                    >
                      <option value="全部">全部时代</option>
                      {HISTORICAL_ERAS.map((era) => (
                        <option key={era} value={era}>{era}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      地区
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="fairy-input text-sm w-full"
                    >
                      {REGIONS.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-gray-600 mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      类型
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="fairy-input text-sm w-full"
                    >
                      <option value="全部">全部类型</option>
                      {HISTORICAL_EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {EVENT_TYPE_ICONS[type]} {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-gray-600 mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      人物
                    </label>
                    <select
                      value={selectedFigure}
                      onChange={(e) => setSelectedFigure(e.target.value)}
                      className="fairy-input text-sm w-full"
                    >
                      {figureNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-fairy-purple hover:text-fairy-purple/80 font-body"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="fairy-card p-2 mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-fairy text-white shadow-md'
                        : 'text-gray-600 hover:bg-fairy-purple/10 hover:text-fairy-purple'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'timeline' && <TimelineView events={filteredEvents} onEventClick={handleEventClick} />}
          {activeTab === 'events' && <EventsView events={filteredEvents} onEventClick={handleEventClick} />}
          {activeTab === 'figures' && <FiguresView figures={filteredFigures} />}
          {activeTab === 'eras' && <ErasView eras={eraSummaries} />}
        </div>
      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeEventDetail} />}
    </div>
  );
}

function TimelineView({ events, onEventClick }: { events: HistoricalEvent[]; onEventClick: (e: HistoricalEvent) => void }) {
  const eventsByEra = useMemo(() => {
    const grouped: Record<string, HistoricalEvent[]> = {};
    HISTORICAL_ERAS.forEach((era) => {
      grouped[era] = [];
    });
    events.forEach((e) => {
      if (grouped[e.era]) {
        grouped[e.era].push(e);
      }
    });
    return grouped;
  }, [events]);

  const getEraColor = (era: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      '创世纪元': { bg: 'from-yellow-400 to-amber-500', border: 'border-amber-300', text: 'text-amber-700' },
      '黄金时代': { bg: 'from-amber-400 to-yellow-500', border: 'border-yellow-300', text: 'text-yellow-700' },
      '英雄时代': { bg: 'from-red-400 to-orange-500', border: 'border-orange-300', text: 'text-orange-700' },
      '王国时代': { bg: 'from-blue-400 to-indigo-500', border: 'border-indigo-300', text: 'text-indigo-700' },
      '魔法复兴': { bg: 'from-purple-400 to-pink-500', border: 'border-purple-300', text: 'text-purple-700' },
      '近代': { bg: 'from-teal-400 to-cyan-500', border: 'border-teal-300', text: 'text-teal-700' },
    };
    return colors[era] || colors['黄金时代'];
  };

  return (
    <div className="relative">
      {HISTORICAL_ERAS.map((era) => {
        const eraEvents = eventsByEra[era];
        if (eraEvents.length === 0) return null;
        const eraColor = getEraColor(era);
        const eraSummary = eraSummaries.find((e) => e.era === era);

        return (
          <div key={era} className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${eraColor.bg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-3xl">{eraSummary?.eraEmoji}</span>
              </div>
              <div>
                <h2 className={`text-2xl font-fairy ${eraColor.text}`}>{era}</h2>
                <p className="text-sm text-gray-500 font-body">
                  {eraSummary?.startYear} - {eraSummary?.endYear}年 · {eraEvents.length}个重要事件
                </p>
              </div>
            </div>

            <div className="relative pl-8 ml-8 border-l-2 border-dashed border-fairy-purple/30">
              {eraEvents.map((event, index) => {
                const typeColors = EVENT_TYPE_COLORS[event.type as HistoricalEventType];
                const importance = getImportanceLabel(event.importance);
                return (
                  <div
                    key={event.id}
                    className="relative mb-6 last:mb-0 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`absolute -left-10 top-4 w-5 h-5 rounded-full ${typeColors.bg} border-2 ${typeColors.border} shadow-md group-hover:scale-125 transition-transform`}
                    />

                    <div
                      onClick={() => onEventClick(event)}
                      className="fairy-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${event.coverColor}30` }}
                        >
                          {event.coverEmoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs text-gray-500 font-body">第 {event.year} 年</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body ${typeColors.bg} ${typeColors.text}`}>
                              {EVENT_TYPE_ICONS[event.type as HistoricalEventType]} {event.type}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body ${importance.bg} ${importance.color}`}>
                              {importance.label}
                            </span>
                          </div>
                          <h3 className="font-fairy text-lg text-gray-800 mb-1 group-hover:text-fairy-purple transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 font-body line-clamp-2">{event.description}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 font-body">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.participants.length}人参与
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-fairy-purple group-hover:translate-x-1 transition-all flex-shrink-0 mt-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-body">没有找到符合条件的历史事件</p>
        </div>
      )}
    </div>
  );
}

function EventsView({ events, onEventClick }: { events: HistoricalEvent[]; onEventClick: (e: HistoricalEvent) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const typeColors = EVENT_TYPE_COLORS[event.type as HistoricalEventType];
        const importance = getImportanceLabel(event.importance);
        return (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="fairy-card p-5 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
          >
            <div
              className="w-full h-32 rounded-xl mb-4 flex items-center justify-center text-5xl relative overflow-hidden"
              style={{ backgroundColor: `${event.coverColor}20` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
              <span className="relative z-10">{event.coverEmoji}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body ${typeColors.bg} ${typeColors.text}`}>
                {EVENT_TYPE_ICONS[event.type as HistoricalEventType]} {event.type}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body ${importance.bg} ${importance.color}`}>
                {importance.label}
              </span>
            </div>

            <h3 className="font-fairy text-xl text-gray-800 mb-2 group-hover:text-fairy-purple transition-colors">
              {event.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-body mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {event.era} · 第{event.year}年
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.region}
              </span>
            </div>

            <p className="text-sm text-gray-600 font-body line-clamp-2 mb-4">{event.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {event.participants.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full bg-white border-2 border-fairy-purple/20 flex items-center justify-center text-lg"
                    title={p.name}
                  >
                    {p.portraitEmoji}
                  </div>
                ))}
                {event.participants.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-body">
                    +{event.participants.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-fairy-purple font-body group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                查看详情
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        );
      })}

      {events.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <ScrollText className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-body">没有找到符合条件的历史事件</p>
        </div>
      )}
    </div>
  );
}

function FiguresView({ figures }: { figures: HistoricalFigure[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {figures.map((figure) => (
        <div key={figure.id} className="fairy-card p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fairy-purple/20 to-fairy-pink/20 flex items-center justify-center text-4xl">
              {figure.portraitEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-fairy text-lg text-gray-800 truncate">{figure.name}</h3>
              {figure.title && (
                <p className="text-xs text-fairy-purple font-body truncate">{figure.title}</p>
              )}
              <p className="text-xs text-gray-500 font-body">{figure.role}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-body line-clamp-2 mb-4">{figure.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
              <Calendar className="w-3 h-3" />
              <span>{figure.era}</span>
              <span className="text-gray-300">·</span>
              <span>{figure.birthYear}{figure.deathYear ? ` - ${figure.deathYear}` : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
              <MapPin className="w-3 h-3" />
              <span>{figure.region}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-fairy-purple/10">
            <p className="text-xs text-gray-500 font-body mb-2">主要成就：</p>
            <div className="flex flex-wrap gap-1">
              {figure.achievements.slice(0, 2).map((achievement, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-fairy-purple/5 text-fairy-purple text-[10px] font-body"
                >
                  <Star className="w-3 h-3" />
                  {achievement}
                </span>
              ))}
              {figure.achievements.length > 2 && (
                <span className="text-[10px] text-gray-400 font-body">+{figure.achievements.length - 2}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {figure.isProtagonist && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-body">
                <Award className="w-3 h-3" />
                正面人物
              </span>
            )}
            {figure.isVillain && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-body">
                <Flame className="w-3 h-3" />
                反派角色
              </span>
            )}
          </div>
        </div>
      ))}

      {figures.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-body">没有找到符合条件的历史人物</p>
        </div>
      )}
    </div>
  );
}

function ErasView({ eras }: { eras: EraSummary[] }) {
  return (
    <div className="space-y-6">
      {eras.map((era, index) => (
        <div
          key={era.era}
          className="fairy-card p-6 hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-fairy-purple/20 via-fairy-pink/20 to-fairy-gold/20 flex items-center justify-center text-5xl shadow-inner">
                {era.eraEmoji}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h2 className="text-2xl font-fairy text-gradient-fairy">{era.era}</h2>
                <span className="text-sm text-gray-500 font-body">
                  {era.startYear} - {era.endYear} 年
                </span>
              </div>
              <p className="text-gray-600 font-body mb-4">{era.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-fairy text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-fairy-purple" />
                    时代特征
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {era.characteristics.map((char, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded-lg bg-fairy-purple/5 text-fairy-purple text-xs font-body"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-fairy text-gray-700 mb-2 flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-amber-500" />
                    重大事件
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {era.majorEvents.map((event, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-body"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-fairy text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    代表人物
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {era.keyFigures.map((figure, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-body"
                      >
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventDetailModal({ event, onClose }: { event: HistoricalEvent; onClose: () => void }) {
  const typeColors = EVENT_TYPE_COLORS[event.type as HistoricalEventType];
  const importance = getImportanceLabel(event.importance);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="fairy-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-bounce-soft">
        <div
          className="h-40 flex items-center justify-center relative"
          style={{ backgroundColor: `${event.coverColor}30` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
          <span className="text-7xl relative z-10">{event.coverEmoji}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-colors z-20"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body ${typeColors.bg} ${typeColors.text}`}>
              {EVENT_TYPE_ICONS[event.type as HistoricalEventType]} {event.type}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body ${importance.bg} ${importance.color}`}>
              {importance.label}
            </span>
            {event.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body bg-green-100 text-green-700">
                <Award className="w-3 h-3" />
                已考证
              </span>
            )}
          </div>

          <h2 className="text-3xl font-fairy text-gray-800 mb-2">{event.title}</h2>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {event.era} · 第 {event.year} 年
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.region} · {event.location}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="font-fairy text-lg text-gray-800 mb-3 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-fairy-purple" />
              事件概述
            </h3>
            <p className="text-gray-600 font-body leading-relaxed">{event.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-fairy text-lg text-gray-800 mb-3 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-500" />
              详细经过
            </h3>
            <div className="space-y-4">
              {event.detailedContent.map((content, idx) => (
                <p key={idx} className="text-gray-600 font-body leading-relaxed">
                  {content}
                </p>
              ))}
            </div>
          </div>

          {event.participants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-fairy text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                相关人物
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.participants.map((person) => (
                  <div key={person.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-white border border-fairy-purple/20 flex items-center justify-center text-xl">
                      {person.portraitEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{person.name}</p>
                      <p className="text-xs text-gray-500 font-body truncate">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.consequences.length > 0 && (
            <div className="mb-6">
              <h3 className="font-fairy text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fairy-gold" />
                历史影响
              </h3>
              <div className="space-y-2">
                {event.consequences.map((consequence, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-fairy-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-fairy-gold font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-gray-600 font-body">{consequence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.sources.length > 0 && (
            <div className="pt-4 border-t border-fairy-purple/10">
              <p className="text-xs text-gray-400 font-body">
                史料来源：{event.sources.join('、')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
