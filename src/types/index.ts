export type CharacterType = 
  | '全部'
  | '公主'
  | '王子'
  | '巫师'
  | '巨龙'
  | '精灵'
  | '动物'
  | '女巫'
  | '国王'
  | '王后'
  | '矮人'
  | '人鱼'
  | '猎人'
  | '仙女'
  | '狼人'
  | '其他';

export const CHARACTER_TYPES: CharacterType[] = [
  '全部',
  '公主',
  '王子',
  '巫师',
  '巨龙',
  '精灵',
  '动物',
  '女巫',
  '国王',
  '王后',
  '矮人',
  '人鱼',
  '猎人',
  '仙女',
  '狼人',
  '其他',
];

export interface StoryCharacter {
  id: string;
  name: string;
  type: CharacterType;
  description: string;
  personality: string;
  appearance: string;
  storyId: string;
  storyTitle: string;
  coverImage: string;
  coverColor: string;
  traits: string[];
  isProtagonist?: boolean;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  region: string;
  tags: string[];
  coverImage: string;
  coverColor: string;
  summary: string;
  content: string[];
  isHot?: boolean;
  createdAt: string;
  characters: string[];
}

export type Region = '全部' | '丹麦' | '德国' | '中国' | '阿拉伯' | '古希腊' | '法国' | '俄罗斯' | '日本' | '印度' | '北欧' | '英国';

export const REGIONS: Region[] = ['全部', '丹麦', '德国', '中国', '阿拉伯', '古希腊', '法国', '俄罗斯', '日本', '印度', '北欧', '英国'];

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
}

export type StoryNodeType = 'start' | 'normal' | 'choice' | 'ending';

export type EndingType = 'happy' | 'sad' | 'neutral' | 'secret';

export interface StoryNode {
  id: string;
  type: StoryNodeType;
  content: string;
  choices?: StoryChoice[];
  endingType?: EndingType;
  endingTitle?: string;
}

export interface InteractiveStory {
  id: string;
  storyId: string;
  title: string;
  startNodeId: string;
  nodes: Record<string, StoryNode>;
}

export interface UserChoiceRecord {
  nodeId: string;
  choiceId: string;
  timestamp: number;
}

export interface EndingPathStep {
  nodeId: string;
  nodeContent: string;
  choiceId: string | null;
  choiceText: string | null;
}

export interface EndingRoute {
  endingNodeId: string;
  endingTitle: string;
  endingType: EndingType;
  endingContent: string;
  path: EndingPathStep[];
  discoveredAt: number;
}

export interface StoryProgress {
  storyId: string;
  currentNodeId: string;
  visitedNodes: string[];
  choiceHistory: UserChoiceRecord[];
  discoveredEndings: string[];
  endingRoutes: Record<string, EndingRoute>;
}

export interface TreeNodeData {
  id: string;
  node: StoryNode;
  level: number;
  x: number;
  y: number;
  isVisited: boolean;
  isCurrentPath: boolean;
  children: TreeNodeData[];
  parentId: string | null;
}

export type MagicItemCategory =
  | '全部'
  | '神器'
  | '饰品'
  | '服饰'
  | '交通工具'
  | '植物'
  | '书籍'
  | '容器'
  | '武器'
  | '其他';

export const MAGIC_ITEM_CATEGORIES: MagicItemCategory[] = [
  '全部',
  '神器',
  '饰品',
  '服饰',
  '交通工具',
  '植物',
  '书籍',
  '容器',
  '武器',
  '其他',
];

export type MagicItemRarity = '普通' | '稀有' | '史诗' | '传说' | '神话';

export const MAGIC_ITEM_RARITIES: MagicItemRarity[] = ['普通', '稀有', '史诗', '传说', '神话'];

export const RARITY_COLORS: Record<MagicItemRarity, { bg: string; border: string; text: string; glow: string }> = {
  '普通': {
    bg: 'from-gray-400 to-gray-500',
    border: 'border-gray-400/50',
    text: 'text-gray-600',
    glow: 'shadow-gray-300/50',
  },
  '稀有': {
    bg: 'from-blue-400 to-cyan-500',
    border: 'border-blue-400/50',
    text: 'text-blue-600',
    glow: 'shadow-blue-300/50',
  },
  '史诗': {
    bg: 'from-purple-500 to-pink-500',
    border: 'border-purple-400/50',
    text: 'text-purple-600',
    glow: 'shadow-purple-300/50',
  },
  '传说': {
    bg: 'from-amber-400 to-orange-500',
    border: 'border-amber-400/50',
    text: 'text-amber-600',
    glow: 'shadow-amber-300/50',
  },
  '神话': {
    bg: 'from-fairy-gold via-pink-400 to-fairy-purple',
    border: 'border-fairy-gold/50',
    text: 'text-fairy-purple',
    glow: 'shadow-fairy-gold/50',
  },
};

export interface MagicItemAbility {
  name: string;
  description: string;
  manaCost?: number | string;
  cooldown?: string;
}

export interface MagicItem {
  id: string;
  name: string;
  category: MagicItemCategory;
  rarity: MagicItemRarity;
  emoji: string;
  coverColor: string;
  description: string;
  originStory: string;
  storyTitle: string;
  storyAuthor: string;
  storyRegion: string;
  abilities: MagicItemAbility[];
  tags: string[];
  powerLevel: number;
  isCustom?: boolean;
  parentIds?: string[];
  createdAt?: number;
  isSpecialRecipe?: boolean;
}

export type CreatureHabitat =
  | '全部'
  | '天空'
  | '海洋'
  | '森林'
  | '山脉'
  | '地底'
  | '沼泽'
  | '极地'
  | '沙漠'
  | '仙境';

export const CREATURE_HABITATS: CreatureHabitat[] = [
  '全部',
  '天空',
  '海洋',
  '森林',
  '山脉',
  '地底',
  '沼泽',
  '极地',
  '沙漠',
  '仙境',
];

export type CreatureAbilityType =
  | '全部'
  | '飞行'
  | '魔法'
  | '变形'
  | '治愈'
  | '预知'
  | '力量'
  | '速度'
  | '幻术'
  | '永生';

export const CREATURE_ABILITIES: CreatureAbilityType[] = [
  '全部',
  '飞行',
  '魔法',
  '变形',
  '治愈',
  '预知',
  '力量',
  '速度',
  '幻术',
  '永生',
];

export type DangerLevel = '全部' | '温和' | '中立' | '危险' | '极度危险';

export const DANGER_LEVELS: DangerLevel[] = ['全部', '温和', '中立', '危险', '极度危险'];

export const DANGER_COLORS: Record<DangerLevel, { bg: string; border: string; text: string; glow: string }> = {
  '全部': {
    bg: 'from-gray-400 to-gray-500',
    border: 'border-gray-400/50',
    text: 'text-gray-600',
    glow: 'shadow-gray-300/50',
  },
  '温和': {
    bg: 'from-green-400 to-emerald-500',
    border: 'border-green-400/50',
    text: 'text-green-600',
    glow: 'shadow-green-300/50',
  },
  '中立': {
    bg: 'from-blue-400 to-cyan-500',
    border: 'border-blue-400/50',
    text: 'text-blue-600',
    glow: 'shadow-blue-300/50',
  },
  '危险': {
    bg: 'from-orange-400 to-red-500',
    border: 'border-orange-400/50',
    text: 'text-orange-600',
    glow: 'shadow-orange-300/50',
  },
  '极度危险': {
    bg: 'from-red-500 via-pink-500 to-purple-600',
    border: 'border-red-500/50',
    text: 'text-red-600',
    glow: 'shadow-red-300/50',
  },
};

export interface CreatureAbility {
  name: string;
  description: string;
}

export interface Creature {
  id: string;
  name: string;
  latinName: string;
  emoji: string;
  coverColor: string;
  habitat: Exclude<CreatureHabitat, '全部'>;
  abilities: CreatureAbility[];
  abilityTypes: Exclude<CreatureAbilityType, '全部'>[];
  dangerLevel: Exclude<DangerLevel, '全部'>;
  description: string;
  appearance: string;
  behavior: string;
  originStory: string;
  storyTitle: string;
  storyRegion: string;
  traits: string[];
  lifespan: string;
  size: string;
  rarity: '普通' | '稀有' | '史诗' | '传说' | '神话';
}

export type WeatherType =
  | '晴朗'
  | '白雪'
  | '流星雨'
  | '魔法极光'
  | '糖果风暴'
  | '花瓣雨'
  | '月光夜'
  | '彩虹桥';

export const WEATHER_TYPES: WeatherType[] = [
  '晴朗',
  '白雪',
  '流星雨',
  '魔法极光',
  '糖果风暴',
  '花瓣雨',
  '月光夜',
  '彩虹桥',
];

export interface WeatherInfo {
  type: WeatherType;
  icon: string;
  description: string;
  color: string;
  bgGradient: string;
  effects: string[];
}

export const WEATHER_INFO: Record<WeatherType, WeatherInfo> = {
  晴朗: {
    type: '晴朗',
    icon: '☀️',
    description: '阳光明媚，万物复苏，所有角色状态最佳',
    color: '#FFD700',
    bgGradient: 'from-amber-200 via-yellow-100 to-orange-200',
    effects: ['角色心情+10%', '探索范围正常', '故事灵感+5%'],
  },
  白雪: {
    type: '白雪',
    icon: '❄️',
    description: '皑皑白雪覆盖大地，冰雪奇缘悄然上演',
    color: '#B0E0E6',
    bgGradient: 'from-blue-100 via-slate-100 to-indigo-100',
    effects: ['冰雪角色强化+20%', '北部地区解锁', '隐藏雪之故事可触发'],
  },
  流星雨: {
    type: '流星雨',
    icon: '🌠',
    description: '流星划过夜空，许下愿望吧！奇迹即将发生',
    color: '#9370DB',
    bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    effects: ['愿望成功率+30%', '隐藏剧情触发+25%', '稀有道具出现率+15%'],
  },
  魔法极光: {
    type: '魔法极光',
    icon: '🌌',
    description: '绚丽极光舞动天际，魔法能量充盈世界',
    color: '#7FFFD4',
    bgGradient: 'from-emerald-900 via-teal-800 to-purple-900',
    effects: ['魔法角色强化+25%', '魔法道具效果+20%', '极光地区故事解锁'],
  },
  糖果风暴: {
    type: '糖果风暴',
    icon: '🍬',
    description: '甜蜜糖果从天而降，空气中弥漫幸福的味道',
    color: '#FFB6C1',
    bgGradient: 'from-pink-200 via-rose-100 to-fuchsia-200',
    effects: ['全体角色心情+20%', '甜蜜故事章节解锁', '能量恢复速度+30%'],
  },
  花瓣雨: {
    type: '花瓣雨',
    icon: '🌸',
    description: '缤纷花瓣随风飘落，浪漫气息弥漫',
    color: '#FFC0CB',
    bgGradient: 'from-pink-100 via-rose-50 to-red-100',
    effects: ['爱情故事触发+30%', '女性角色强化+15%', '东方地区故事加成'],
  },
  月光夜: {
    type: '月光夜',
    icon: '🌙',
    description: '皎洁月光倾泻而下，神秘生物悄然苏醒',
    color: '#C0C0C0',
    bgGradient: 'from-slate-800 via-blue-900 to-indigo-950',
    effects: ['夜间生物觉醒', '神秘故事解锁+25%', '狼人/精灵强化+20%'],
  },
  彩虹桥: {
    type: '彩虹桥',
    icon: '🌈',
    description: '七彩彩虹连接天地，通往仙境的桥梁显现',
    color: '#FF69B4',
    bgGradient: 'from-red-200 via-yellow-100 to-purple-200',
    effects: ['仙境地区可进入', '所有属性+10%', '传说故事触发率+20%'],
  },
};

export interface WeatherForecast {
  region: Region;
  currentWeather: WeatherType;
  nextWeather: WeatherType;
  nextWeatherIn: number;
  hourlyForecast: { time: string; weather: WeatherType }[];
}

export interface WeatherEffect {
  characterBuff: Partial<Record<CharacterType, number>>;
  unlockedRegions: Region[];
  hiddenStoryBonus: number;
  storyUnlockTags: string[];
  explorationModifier: number;
}

export type TheaterAssetType = 'character' | 'scene' | 'prop';

export interface TheaterAsset {
  id: string;
  type: TheaterAssetType;
  name: string;
  emoji: string;
  category: string;
  description: string;
  coverColor: string;
}

export type AnimationType = 'none' | 'bounce' | 'float' | 'twinkle' | 'shake' | 'spin' | 'fadeIn' | 'slideLeft' | 'slideRight';

export const ANIMATION_TYPES: { type: AnimationType; name: string; icon: string }[] = [
  { type: 'none', name: '无动画', icon: '⏸️' },
  { type: 'bounce', name: '弹跳', icon: '⬆️' },
  { type: 'float', name: '漂浮', icon: '☁️' },
  { type: 'twinkle', name: '闪烁', icon: '✨' },
  { type: 'shake', name: '摇晃', icon: '💫' },
  { type: 'spin', name: '旋转', icon: '🌀' },
  { type: 'fadeIn', name: '淡入', icon: '🌅' },
  { type: 'slideLeft', name: '左滑入', icon: '👈' },
  { type: 'slideRight', name: '右滑入', icon: '👉' },
];

export interface PlacedAsset {
  instanceId: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  animation: AnimationType;
  zIndex: number;
  dialogueId?: string;
}

export interface SceneDialogue {
  id: string;
  speakerName: string;
  speakerEmoji: string;
  text: string;
  color: string;
}

export interface TheaterScene {
  id: string;
  name: string;
  backgroundId: string;
  placedAssets: PlacedAsset[];
  dialogues: SceneDialogue[];
  narrative: string;
  duration: number;
}

export interface TheaterBackground {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  description: string;
}

export interface TheaterPerformance {
  id: string;
  title: string;
  description: string;
  scenes: TheaterScene[];
  createdAt: number;
  updatedAt: number;
  coverSceneId?: string;
}

export type TheaterEditorMode = 'edit' | 'play';
export type TheaterPanelTab = 'characters' | 'scenes' | 'props' | 'storyboard' | 'dialogue';

export type CourseCategory = '魔法' | '炼金术' | '骑士精神' | '龙语';

export const COURSE_CATEGORIES: CourseCategory[] = ['魔法', '炼金术', '骑士精神', '龙语'];

export type LessonType = 'lesson' | 'quiz' | 'game';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  difficulty: '入门' | '初级' | '中级' | '高级';
  hint?: string;
}

export interface GameChallenge {
  id: string;
  type: 'matching' | 'sequence' | 'spell' | 'potion';
  title: string;
  description: string;
  instructions: string;
  data: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: LessonType;
  order: number;
  description: string;
  content?: string[];
  quizQuestions?: QuizQuestion[];
  gameChallenge?: GameChallenge;
  experienceReward: number;
  badgeFragment?: string;
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  emoji: string;
  coverColor: string;
  difficulty: '入门' | '初级' | '中级' | '高级';
  duration: string;
  lessons: Lesson[];
  totalExperience: number;
  completionBadge: SkillBadge;
  completionTitle: Title;
  prerequisites?: string[];
}

export interface SkillBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: '普通' | '稀有' | '史诗' | '传说';
  courseId: string;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: '普通' | '稀有' | '史诗' | '传说';
  requirement: string;
}

export interface AcademyProgress {
  completedLessons: Set<string>;
  completedCourses: Set<string>;
  earnedBadges: Set<string>;
  earnedTitles: Set<string>;
  currentTitle: string | null;
  totalExperience: number;
  quizScores: Record<string, number>;
  lessonStars: Record<string, number>;
}

export type MatchingGameItem = {
  id: string;
  left: string;
  right: string;
  leftEmoji?: string;
  rightEmoji?: string;
};

export type SpellGameData = {
  spellName: string;
  spellEmoji: string;
  incantation: string;
  description: string;
  instructions?: string;
  sequence: string[];
};

export type PotionGameData = {
  potionName: string;
  potionEmoji: string;
  description: string;
  ingredients: { id: string; name: string; emoji: string; correctOrder: number }[];
};

export type CosmicEventType =
  | '巨龙苏醒'
  | '魔镜失控'
  | '时光塔崩塌'
  | '星辰坠落'
  | '魔法风暴'
  | '精灵叛乱'
  | '水晶觉醒'
  | '梦境入侵'
  | '彩虹断裂'
  | '深渊裂隙';

export const COSMIC_EVENT_TYPES: CosmicEventType[] = [
  '巨龙苏醒',
  '魔镜失控',
  '时光塔崩塌',
  '星辰坠落',
  '魔法风暴',
  '精灵叛乱',
  '水晶觉醒',
  '梦境入侵',
  '彩虹断裂',
  '深渊裂隙',
];

export type CosmicEventStatus = 'upcoming' | 'active' | 'completed';

export type CosmicEventSeverity = 'minor' | 'moderate' | 'major' | 'catastrophic';

export const COSMIC_EVENT_SEVERITIES: { severity: CosmicEventSeverity; name: string; color: string }[] = [
  { severity: 'minor', name: '小型事件', color: '#60A5FA' },
  { severity: 'moderate', name: '中型事件', color: '#A78BFA' },
  { severity: 'major', name: '大型事件', color: '#F59E0B' },
  { severity: 'catastrophic', name: '宇宙级事件', color: '#EF4444' },
];

export interface CosmicEventEffect {
  type: 'weather' | 'region' | 'character' | 'story' | 'magicItem' | 'creature';
  target: string;
  modifier: number;
  description: string;
}

export interface CosmicEvent {
  id: string;
  type: CosmicEventType;
  name: string;
  description: string;
  backstory: string;
  emoji: string;
  coverColor: string;
  severity: CosmicEventSeverity;
  region: Region | '全部';
  duration: number;
  effects: CosmicEventEffect[];
  objectives: EventObjective[];
  rewards: EventReward[];
  triggerCondition?: string;
}

export interface EventObjective {
  id: string;
  description: string;
  type: 'read' | 'collect' | 'explore' | 'create' | 'discover';
  target: number;
  reward: number;
}

export interface EventReward {
  type: 'title' | 'badge' | 'magicItem' | 'experience' | 'currency';
  name: string;
  emoji: string;
  rarity: MagicItemRarity;
}

export interface ActiveCosmicEvent {
  eventId: string;
  status: CosmicEventStatus;
  startTime: number;
  endTime: number;
  progress: Record<string, number>;
  completedObjectives: string[];
  claimedRewards: string[];
  participantCount: number;
}

export interface WorldState {
  era: string;
  eraEmoji: string;
  worldLevel: number;
  totalEventsCompleted: number;
  worldStability: number;
  magicDensity: number;
  unlockedRegions: Region[];
  globalBuffs: WorldBuff[];
  currentEraDescription: string;
  eraHistory: EraEntry[];
}

export interface WorldBuff {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: number;
  startTime: number;
  effects: CosmicEventEffect[];
}

export interface EraEntry {
  era: string;
  eraEmoji: string;
  startedAt: number;
  endedAt?: number;
  majorEvents: string[];
  description: string;
}

export interface EventLeaderboardEntry {
  rank: number;
  playerName: string;
  avatarEmoji: string;
  score: number;
  eventsParticipated: number;
  eventsCompleted: number;
  titles: string[];
}

export interface EventHistoryRecord {
  eventId: string;
  eventName: string;
  eventType: CosmicEventType;
  emoji: string;
  severity: CosmicEventSeverity;
  startTime: number;
  endTime: number;
  outcome: 'success' | 'partial' | 'failure';
  worldImpact: string;
  totalParticipants: number;
  playerParticipated: boolean;
  playerScore?: number;
  playerRank?: number;
}

export type CosmicEventTab = 'current' | 'history' | 'leaderboard' | 'worldState';

export type DreamSceneType = '扭曲城堡' | '镜像森林' | '梦境海洋' | '星空草原' | '遗忘迷宫' | '心灵花园' | '恐惧深渊' | '愿望之巅';

export const DREAM_SCENE_TYPES: DreamSceneType[] = [
  '扭曲城堡',
  '镜像森林',
  '梦境海洋',
  '星空草原',
  '遗忘迷宫',
  '心灵花园',
  '恐惧深渊',
  '愿望之巅',
];

export type DreamMood = '甜蜜' | '奇幻' | '忧郁' | '诡异' | '壮丽' | '迷幻';

export interface DreamCreature {
  id: string;
  name: string;
  originalCreatureId?: string;
  emoji: string;
  twistedEmoji: string;
  coverColor: string;
  description: string;
  twistedDescription: string;
  isNightmare: boolean;
  abilities: string[];
  symbolism: string;
}

export interface DreamLocation {
  id: string;
  name: string;
  type: DreamSceneType;
  originalRegion?: Region;
  description: string;
  twistedDescription: string;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  discovered: boolean;
  connectedLocationIds: string[];
  symbolism: string;
}

export interface InnerWish {
  id: string;
  title: string;
  description: string;
  depth: '表面' | '深层' | '潜意识';
  relatedTraits: string[];
  granted: boolean;
  unlockCondition: string;
  symbolism: string;
}

export interface InnerFear {
  id: string;
  title: string;
  description: string;
  intensity: '轻微' | '中等' | '强烈' | '极致';
  relatedTraits: string[];
  confronted: boolean;
  confrontationHint: string;
  symbolism: string;
}

export interface DreamMemory {
  id: string;
  characterId: string;
  timestamp: number;
  locationId: string;
  type: 'encounter' | 'revelation' | 'confrontation' | 'wish_granted' | 'discovery';
  title: string;
  description: string;
  impactOnDream: number;
}

export interface CharacterDreamState {
  characterId: string;
  dreamLevel: number;
  lucidity: number;
  dreamStability: number;
  distortionLevel: number;
  dreamLocations: DreamLocation[];
  discoveredLocationIds: string[];
  currentLocationId: string | null;
  encounteredCreatureIds: string[];
  innerWishes: InnerWish[];
  innerFears: InnerFear[];
  wishProgress: Record<string, number>;
  fearProgress: Record<string, number>;
  dreamMemories: DreamMemory[];
  unlockedDreamLayers: number;
  totalDreamTime: number;
  lastDreamEntry?: number;
}

export interface DreamMapNode {
  id: string;
  locationId: string;
  x: number;
  y: number;
  connections: string[];
  distortionLevel: number;
  mood: DreamMood;
}

export interface DreamEncounterOption {
  id: string;
  text: string;
  outcome: 'positive' | 'negative' | 'neutral' | 'revelation';
  impactDescription: string;
  lucidityChange: number;
  stabilityChange: number;
  wishProgress?: number;
  fearProgress?: number;
  grantsWishId?: string;
  confrontsFearId?: string;
  unlocksLocationId?: string;
}

export interface DreamEncounter {
  id: string;
  locationId: string;
  characterId: string;
  type: 'creature' | 'memory' | 'symbol' | 'wish' | 'fear';
  title: string;
  narrative: string;
  creatureId?: string;
  visualEmoji: string;
  options: DreamEncounterOption[];
}

export interface DreamEvolutionTrigger {
  type: 'wish_granted' | 'fear_confronted' | 'location_discovered' | 'memory_created' | 'dream_level_up';
  threshold: number;
  newLocationTypes?: DreamSceneType[];
  distortionShift?: number;
  description: string;
}

export type DayNightPhase = 'dawn' | 'day' | 'dusk' | 'night';

export type DreamTab = 'overview' | 'map' | 'wishes' | 'fears' | 'memories' | 'character-select';

export type HistoricalEra =
  | '创世纪元'
  | '黄金时代'
  | '英雄时代'
  | '王国时代'
  | '魔法复兴'
  | '近代';

export const HISTORICAL_ERAS: HistoricalEra[] = [
  '创世纪元',
  '黄金时代',
  '英雄时代',
  '王国时代',
  '魔法复兴',
  '近代',
];

export type HistoricalEventType =
  | '王国兴衰'
  | '英雄诞生'
  | '怪物入侵'
  | '魔法发现'
  | '战争冲突'
  | '和平条约'
  | '自然灾害'
  | '文化繁荣'
  | '神器出世'
  | '重要婚礼';

export const HISTORICAL_EVENT_TYPES: HistoricalEventType[] = [
  '王国兴衰',
  '英雄诞生',
  '怪物入侵',
  '魔法发现',
  '战争冲突',
  '和平条约',
  '自然灾害',
  '文化繁荣',
  '神器出世',
  '重要婚礼',
];

export const EVENT_TYPE_ICONS: Record<HistoricalEventType, string> = {
  '王国兴衰': '🏰',
  '英雄诞生': '⚔️',
  '怪物入侵': '🐉',
  '魔法发现': '✨',
  '战争冲突': '🗡️',
  '和平条约': '🕊️',
  '自然灾害': '🌋',
  '文化繁荣': '📚',
  '神器出世': '💎',
  '重要婚礼': '💒',
};

export const EVENT_TYPE_COLORS: Record<HistoricalEventType, { bg: string; border: string; text: string }> = {
  '王国兴衰': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  '英雄诞生': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  '怪物入侵': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  '魔法发现': { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  '战争冲突': { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
  '和平条约': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  '自然灾害': { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
  '文化繁荣': { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' },
  '神器出世': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
  '重要婚礼': { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
};

export interface HistoricalFigure {
  id: string;
  name: string;
  title?: string;
  role: string;
  description: string;
  era: HistoricalEra;
  region: Region;
  isProtagonist?: boolean;
  isVillain?: boolean;
  relatedStories: string[];
  achievements: string[];
  birthYear: number;
  deathYear?: number;
  portraitEmoji: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  type: HistoricalEventType;
  era: HistoricalEra;
  year: number;
  region: Region;
  location: string;
  description: string;
  detailedContent: string[];
  participants: HistoricalFigure[];
  consequences: string[];
  relatedStories: string[];
  importance: 'minor' | 'moderate' | 'major' | 'catastrophic';
  coverEmoji: string;
  coverColor: string;
  isVerified: boolean;
  sources: string[];
}

export type HistoryArchiveTab = 'timeline' | 'events' | 'figures' | 'eras';

export interface EraSummary {
  era: HistoricalEra;
  eraEmoji: string;
  startYear: number;
  endYear: number;
  description: string;
  majorEvents: string[];
  keyFigures: string[];
  characteristics: string[];
}

export type LanguageRace = '精灵' | '龙' | '海妖';

export const LANGUAGE_RACES: LanguageRace[] = ['精灵', '龙', '海妖'];

export const LANGUAGE_RACE_INFO: Record<LanguageRace, { name: string; emoji: string; color: string; bgColor: string; description: string }> = {
  '精灵': {
    name: '精灵语',
    emoji: '🧝',
    color: 'text-emerald-600',
    bgColor: 'from-emerald-100 to-teal-100',
    description: '优美流畅的古老语言，每个音节都蕴含着自然的韵律',
  },
  '龙': {
    name: '龙语',
    emoji: '🐉',
    color: 'text-red-600',
    bgColor: 'from-red-100 to-orange-100',
    description: '雄浑有力的远古语言，每个字都带着烈焰的威严',
  },
  '海妖': {
    name: '海妖语',
    emoji: '🧜',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-100 to-blue-100',
    description: '悠扬婉转的深海语言，每个词都如同海浪般起伏',
  },
};

export interface LanguageWord {
  id: string;
  race: LanguageRace;
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  difficulty: '入门' | '初级' | '中级' | '高级';
  unlocked: boolean;
  unlockCondition?: string;
  etymology?: string;
}

export interface GrammarRule {
  id: string;
  race: LanguageRace;
  title: string;
  description: string;
  examples: { original: string; translation: string; explanation: string }[];
  difficulty: '入门' | '初级' | '中级' | '高级';
  unlocked: boolean;
  requiredWords?: string[];
}

interface PuzzlePair {
  left: string;
  right: string;
}

interface BasePuzzleData {
  hints?: string[];
}

interface MatchingPuzzleData extends BasePuzzleData {
  pairs: PuzzlePair[];
}

interface TranslatePuzzleData extends BasePuzzleData {
  question: string;
  answer: string;
}

interface FillBlankPuzzleData extends BasePuzzleData {
  sentence: string;
  answer: string;
  meaning?: string;
}

interface AnagramPuzzleData extends BasePuzzleData {
  letters: string[];
  answer: string;
  meaning?: string;
}

export type WordPuzzle =
  | {
      id: string;
      race: LanguageRace;
      type: 'matching';
      title: string;
      description: string;
      difficulty: '入门' | '初级' | '中级' | '高级';
      rewardWordIds: string[];
      rewardGrammarIds?: string[];
      data: MatchingPuzzleData;
      experienceReward: number;
    }
  | {
      id: string;
      race: LanguageRace;
      type: 'translate';
      title: string;
      description: string;
      difficulty: '入门' | '初级' | '中级' | '高级';
      rewardWordIds: string[];
      rewardGrammarIds?: string[];
      data: TranslatePuzzleData;
      experienceReward: number;
    }
  | {
      id: string;
      race: LanguageRace;
      type: 'fillBlank';
      title: string;
      description: string;
      difficulty: '入门' | '初级' | '中级' | '高级';
      rewardWordIds: string[];
      rewardGrammarIds?: string[];
      data: FillBlankPuzzleData;
      experienceReward: number;
    }
  | {
      id: string;
      race: LanguageRace;
      type: 'anagram';
      title: string;
      description: string;
      difficulty: '入门' | '初级' | '中级' | '高级';
      rewardWordIds: string[];
      rewardGrammarIds?: string[];
      data: AnagramPuzzleData;
      experienceReward: number;
    };

export interface AncientStele {
  id: string;
  name: string;
  race: LanguageRace;
  location: string;
  era: HistoricalEra;
  coverEmoji: string;
  coverColor: string;
  originalText: string;
  translatedText: string;
  hiddenPlot?: string;
  requiredWords: string[];
  requiredGrammar: string[];
  translationProgress: number;
  discovered: boolean;
  fullyTranslated: boolean;
  storyRevelation?: string;
  relatedStoryId?: string;
}

export interface LanguageProgress {
  race: LanguageRace;
  level: number;
  experience: number;
  unlockedWords: Set<string>;
  unlockedGrammar: Set<string>;
  completedPuzzles: Set<string>;
  discoveredSteles: Set<string>;
  translatedSteles: Set<string>;
}

export type DecipherTab = 'overview' | 'vocabulary' | 'grammar' | 'steles' | 'puzzles';

export const DECIPHER_TABS: { id: DecipherTab; label: string; icon: string }[] = [
  { id: 'overview', label: '总览', icon: '📖' },
  { id: 'vocabulary', label: '词汇', icon: '📝' },
  { id: 'grammar', label: '语法', icon: '📚' },
  { id: 'steles', label: '古代石碑', icon: '🗿' },
  { id: 'puzzles', label: '解谜', icon: '🧩' },
];

export type StationType = '普通车站' | '枢纽车站' | '魔法车站' | '边境车站' | '终点站';

export const STATION_TYPES: StationType[] = ['普通车站', '枢纽车站', '魔法车站', '边境车站', '终点站'];

export type TrainType = '蒸汽列车' | '魔法快车' | '资源运输' | '皇家专列' | '梦幻列车';

export const TRAIN_TYPES: TrainType[] = ['蒸汽列车', '魔法快车', '资源运输', '梦幻列车'];

export type ResourceType = '旅客' | '魔法晶石' | '故事素材' | '魔法材料' | '稀有矿石' | '魔法道具' | '食物' | '魔法书籍';

export const RESOURCE_TYPES: ResourceType[] = ['旅客', '魔法晶石', '故事素材', '魔法材料', '稀有矿石', '魔法道具', '食物', '魔法书籍'];

export type RailwayEventType = 
  | '奇遇'
  | '故事触发'
  | '资源奖励'
  | '角色相遇'
  | '天气影响'
  | '神秘事件'
  | '支线任务'
  | '意外延迟'
  | '发现秘密'
  | '魔法故障';

export const RAILWAY_EVENT_TYPES: RailwayEventType[] = [
  '奇遇', '故事触发', '资源奖励', '角色相遇',
  '天气影响', '神秘事件', '支线任务', '意外延迟', '发现秘密', '魔法故障'
];

export interface RailwayStation {
  id: string;
  name: string;
  type: StationType;
  region: Region;
  x: number;
  y: number;
  color: string;
  description: string;
  icon: string;
  level: number;
  capacity: number;
  built: boolean;
  buildCost: number;
  connectedStationIds: string[];
  specialFeature?: string;
  unlocked?: boolean;
  unlockCondition?: string;
  storyIds?: string[];
  characterIds?: string[];
}

export interface MagicTrain {
  id: string;
  name: string;
  type: TrainType;
  emoji: string;
  color: string;
  speed: number;
  capacity: number;
  currentStationId: string;
  nextStationId?: string;
  cargo: {
    resourceType: ResourceType;
    amount: number;
  }[];
  passengers: {
    characterId?: string;
    name: string;
    emoji: string;
  }[];
  status: '停靠' | '行驶中' | '维修中' | '待机';
  departureTime?: number;
  arrivalTime?: number;
  routeId?: string;
}

export interface RailwayRoute {
  id: string;
  name: string;
  startStationId: string;
  endStationId: string;
  distance: number;
  travelTime: number;
  built: boolean;
  buildCost: number;
  color: string;
  unlockCondition?: string;
  eventChance: number;
  storyId?: string;
}

export interface RailwayEvent {
  id: string;
  name: string;
  type: RailwayEventType;
  title: string;
  description: string;
  emoji: string;
  routeIds?: string[];
  stationIds?: string[];
  region?: Region | '全部';
  triggerCondition?: string;
  rewards: {
    type: '资源' | '故事' | '经验' | '道具' | '角色' | '秘密';
    item?: string;
    amount?: number;
    storyId?: string;
    characterId?: string;
    itemId?: string;
    secretId?: string;
  }[];
  choices?: {
    id: string;
    text: string;
    outcome: string;
  }[];
  cooldown: number;
  lastTriggered?: number;
}

export interface ActiveRailwayEvent {
  eventId: string;
  routeId: string;
  trainId: string;
  startTime: number;
  status: 'active' | 'resolved';
  choices?: string;
  resolvedAt?: number;
}

export interface RailwayProgress {
  builtStations: Set<string>;
  builtRoutes: Set<string>;
  trains: MagicTrain[];
  resources: Record<ResourceType, number>;
  magicCrystals: number;
  experience: number;
  level: number;
  activeEvents: ActiveRailwayEvent[];
  eventHistory: {
    eventId: string;
    timestamp: number;
    outcome: string;
  }[];
  stationUpgrades: Record<string, number>;
  discoveredSecrets: Set<string>;
  encounteredCharacters: Set<string>;
  completedSideStories: Set<string>;
  totalPassengersTransported: number;
  totalResourcesTransported: number;
}

export type RailwayTab = 'map' | 'stations' | 'trains' | 'events' | 'resources' | 'build';

export const RAILWAY_TABS: { id: RailwayTab; label: string; icon: string }[] = [
  { id: 'map', label: '铁路地图', icon: '🗺️' },
  { id: 'stations', label: '车站管理', icon: '🏰' },
  { id: 'trains', label: '列车调度', icon: '🚂' },
  { id: 'events', label: '事件记录', icon: '✨' },
  { id: 'resources', label: '资源仓库', icon: '📦' },
  { id: 'build', label: '建设规划', icon: '🔨' },
];

export interface BuildOption {
  type: 'station' | 'route';
  targetId: string;
  cost: number;
  requirements?: string[];
}

export interface TrainSchedule {
  trainId: string;
  routeId: string;
  departureTime: number;
  autoRepeat: boolean;
}

export interface TransportLog {
  id: string;
  trainId: string;
  routeId: string;
  startTime: number;
  endTime: number;
  cargo: {
    resourceType: ResourceType;
    amount: number;
  }[];
  passengers: string[];
  eventTriggered?: string;
  rewards?: string;
}

