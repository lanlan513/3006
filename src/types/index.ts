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
