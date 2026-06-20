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
