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

export interface StoryProgress {
  storyId: string;
  currentNodeId: string;
  visitedNodes: string[];
  choiceHistory: UserChoiceRecord[];
  discoveredEndings: string[];
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
