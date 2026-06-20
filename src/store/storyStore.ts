import { create } from 'zustand';
import type {
  Story,
  Region,
  StoryCharacter,
  CharacterType,
  InteractiveStory,
  StoryProgress,
  UserChoiceRecord,
  EndingRoute,
  EndingPathStep,
  MagicItem,
  MagicItemCategory,
  MagicItemRarity,
  Creature,
  CreatureHabitat,
  CreatureAbilityType,
  DangerLevel,
  WeatherType,
  WeatherEffect,
  WeatherForecast,
  WEATHER_INFO,
} from '@/types';
import { stories } from '@/data/stories';
import { characters } from '@/data/characters';
import { interactiveStories } from '@/data/interactiveStories';
import { magicItems } from '@/data/magicItems';
import { creatures } from '@/data/creatures';

interface StoryState {
  stories: Story[];
  characters: StoryCharacter[];
  interactiveStories: InteractiveStory[];
  magicItems: MagicItem[];
  customMagicItems: MagicItem[];
  creatures: Creature[];
  unlockedCreatures: Set<string>;
  searchQuery: string;
  selectedRegion: Region;
  selectedCharacterType: CharacterType;
  selectedMagicItemCategory: MagicItemCategory;
  selectedMagicItemRarity: MagicItemRarity | '全部';
  selectedCreatureHabitat: CreatureHabitat;
  selectedCreatureAbility: CreatureAbilityType;
  selectedCreatureDanger: DangerLevel;
  combineSlots: (MagicItem | null)[];
  likedStories: Set<string>;
  storyProgress: Record<string, StoryProgress>;
  regionWeathers: Record<Exclude<Region, '全部'>, WeatherType>;
  currentGlobalWeather: WeatherType;
  weatherChangeTimer: number;
  unlockedWeatherStories: Set<string>;
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: Region) => void;
  setSelectedCharacterType: (type: CharacterType) => void;
  setSelectedMagicItemCategory: (category: MagicItemCategory) => void;
  setSelectedMagicItemRarity: (rarity: MagicItemRarity | '全部') => void;
  setSelectedCreatureHabitat: (habitat: CreatureHabitat) => void;
  setSelectedCreatureAbility: (ability: CreatureAbilityType) => void;
  setSelectedCreatureDanger: (danger: DangerLevel) => void;
  setCombineSlot: (index: number, item: MagicItem | null) => void;
  clearCombineSlots: () => void;
  addCustomMagicItem: (item: MagicItem) => void;
  removeCustomMagicItem: (id: string) => void;
  toggleLike: (storyId: string) => void;
  isLiked: (storyId: string) => boolean;
  unlockCreature: (creatureId: string) => void;
  isCreatureUnlocked: (creatureId: string) => boolean;
  initStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
  setCurrentNode: (interactiveStoryId: string, nodeId: string) => void;
  recordChoice: (interactiveStoryId: string, nodeId: string, choiceId: string) => void;
  addVisitedNode: (interactiveStoryId: string, nodeId: string) => void;
  addDiscoveredEnding: (
    interactiveStoryId: string,
    endingNodeId: string,
    route: EndingRoute
  ) => void;
  resetStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
  setRegionWeather: (region: Exclude<Region, '全部'>, weather: WeatherType) => void;
  setGlobalWeather: (weather: WeatherType) => void;
  advanceWeather: () => void;
  getWeatherByRegion: (region: Region) => WeatherType;
  getWeatherEffect: (weather: WeatherType) => WeatherEffect;
  getWeatherForecast: (region: Region) => WeatherForecast;
  isRegionUnlocked: (region: Region) => boolean;
  isStoryWeatherUnlocked: (storyId: string, storyRegion: Region, storyTags: string[]) => boolean;
  unlockWeatherStory: (storyId: string) => void;
  getCharacterWeatherBuff: (characterType: CharacterType, weather: WeatherType) => number;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories,
  characters,
  interactiveStories,
  magicItems,
  customMagicItems: [],
  creatures,
  unlockedCreatures: new Set(),
  searchQuery: '',
  selectedRegion: '全部',
  selectedCharacterType: '全部',
  selectedMagicItemCategory: '全部',
  selectedMagicItemRarity: '全部',
  selectedCreatureHabitat: '全部',
  selectedCreatureAbility: '全部',
  selectedCreatureDanger: '全部',
  combineSlots: [null, null, null, null, null],
  likedStories: new Set(),
  storyProgress: {},
  regionWeathers: {
    '丹麦': '晴朗',
    '德国': '晴朗',
    '中国': '花瓣雨',
    '阿拉伯': '晴朗',
    '古希腊': '晴朗',
    '法国': '花瓣雨',
    '俄罗斯': '白雪',
    '日本': '花瓣雨',
    '印度': '彩虹桥',
    '北欧': '魔法极光',
    '英国': '月光夜',
  },
  currentGlobalWeather: '晴朗',
  weatherChangeTimer: 300,
  unlockedWeatherStories: new Set(),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedCharacterType: (type) => set({ selectedCharacterType: type }),
  setSelectedMagicItemCategory: (category) => set({ selectedMagicItemCategory: category }),
  setSelectedMagicItemRarity: (rarity) => set({ selectedMagicItemRarity: rarity }),
  setSelectedCreatureHabitat: (habitat) => set({ selectedCreatureHabitat: habitat }),
  setSelectedCreatureAbility: (ability) => set({ selectedCreatureAbility: ability }),
  setSelectedCreatureDanger: (danger) => set({ selectedCreatureDanger: danger }),
  toggleLike: (storyId) => {
    const current = get().likedStories;
    const next = new Set(current);
    if (next.has(storyId)) {
      next.delete(storyId);
    } else {
      next.add(storyId);
    }
    set({ likedStories: next });
  },
  isLiked: (storyId) => get().likedStories.has(storyId),
  unlockCreature: (creatureId) => {
    const current = get().unlockedCreatures;
    if (current.has(creatureId)) return;
    const next = new Set(current);
    next.add(creatureId);
    set({ unlockedCreatures: next });
  },
  isCreatureUnlocked: (creatureId) => get().unlockedCreatures.has(creatureId),
  setCombineSlot: (index, item) => {
    const current = get().combineSlots;
    const next = [...current];
    if (item === null) {
      next[index] = null;
    } else {
      const existingIndex = next.findIndex((s) => s?.id === item.id);
      if (existingIndex !== -1 && existingIndex !== index) {
        next[existingIndex] = null;
      }
      next[index] = item;
    }
    set({ combineSlots: next });
  },
  clearCombineSlots: () => set({ combineSlots: [null, null, null, null, null] }),
  addCustomMagicItem: (item) => {
    const current = get().customMagicItems;
    set({ customMagicItems: [item, ...current] });
  },
  removeCustomMagicItem: (id) => {
    const current = get().customMagicItems;
    set({ customMagicItems: current.filter((i) => i.id !== id) });
  },

  initStoryProgress: (interactiveStoryId, startNodeId) => {
    const current = get().storyProgress;
    if (current[interactiveStoryId]) return;
    const story = interactiveStories.find((s) => s.id === interactiveStoryId);
    if (!story) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          storyId: story.storyId,
          currentNodeId: startNodeId,
          visitedNodes: [startNodeId],
          choiceHistory: [],
          discoveredEndings: [],
          endingRoutes: {},
        },
      },
    });
  },

  setCurrentNode: (interactiveStoryId, nodeId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          currentNodeId: nodeId,
        },
      },
    });
  },

  recordChoice: (interactiveStoryId, nodeId, choiceId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    const record: UserChoiceRecord = {
      nodeId,
      choiceId,
      timestamp: Date.now(),
    };
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          choiceHistory: [...progress.choiceHistory, record],
        },
      },
    });
  },

  addVisitedNode: (interactiveStoryId, nodeId) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    if (progress.visitedNodes.includes(nodeId)) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          visitedNodes: [...progress.visitedNodes, nodeId],
        },
      },
    });
  },

  addDiscoveredEnding: (interactiveStoryId, endingNodeId, route) => {
    const current = get().storyProgress;
    const progress = current[interactiveStoryId];
    if (!progress) return;
    if (progress.discoveredEndings.includes(endingNodeId)) return;
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          ...progress,
          discoveredEndings: [...progress.discoveredEndings, endingNodeId],
          endingRoutes: {
            ...progress.endingRoutes,
            [endingNodeId]: route,
          },
        },
      },
    });
  },

  resetStoryProgress: (interactiveStoryId, startNodeId) => {
    const current = get().storyProgress;
    const story = interactiveStories.find((s) => s.id === interactiveStoryId);
    if (!story) return;
    const existingDiscovered = current[interactiveStoryId]?.discoveredEndings || [];
    const existingRoutes = current[interactiveStoryId]?.endingRoutes || {};
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          storyId: story.storyId,
          currentNodeId: startNodeId,
          visitedNodes: [startNodeId],
          choiceHistory: [],
          discoveredEndings: existingDiscovered,
          endingRoutes: existingRoutes,
        },
      },
    });
  },

  setRegionWeather: (region, weather) => {
    const current = get().regionWeathers;
    set({
      regionWeathers: {
        ...current,
        [region]: weather,
      },
    });
  },

  setGlobalWeather: (weather) => {
    set({ currentGlobalWeather: weather });
  },

  advanceWeather: () => {
    const { regionWeathers, currentGlobalWeather } = get();
    const weathers: WeatherType[] = ['晴朗', '白雪', '流星雨', '魔法极光', '糖果风暴', '花瓣雨', '月光夜', '彩虹桥'];
    const randomWeather = (): WeatherType => weathers[Math.floor(Math.random() * weathers.length)];

    const newWeathers = { ...regionWeathers };
    const regions = Object.keys(newWeathers) as Exclude<Region, '全部'>[];
    const regionsToChange = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < regionsToChange; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      newWeathers[region] = randomWeather();
    }

    set({
      regionWeathers: newWeathers,
      currentGlobalWeather: randomWeather(),
      weatherChangeTimer: 300 + Math.floor(Math.random() * 180),
    });
  },

  getWeatherByRegion: (region) => {
    if (region === '全部') return get().currentGlobalWeather;
    return get().regionWeathers[region] || '晴朗';
  },

  getWeatherEffect: (weather): WeatherEffect => {
    const effects: Record<WeatherType, WeatherEffect> = {
      晴朗: {
        characterBuff: {},
        unlockedRegions: [],
        hiddenStoryBonus: 0,
        storyUnlockTags: [],
        explorationModifier: 1,
      },
      白雪: {
        characterBuff: { '人鱼': 20, '精灵': 15, '公主': 10 },
        unlockedRegions: ['北欧', '俄罗斯'],
        hiddenStoryBonus: 10,
        storyUnlockTags: ['冰雪', '雪', '冬日', '寒冷'],
        explorationModifier: 0.9,
      },
      流星雨: {
        characterBuff: { '巫师': 30, '仙女': 25, '精灵': 20 },
        unlockedRegions: [],
        hiddenStoryBonus: 25,
        storyUnlockTags: ['愿望', '星', '奇迹', '魔法'],
        explorationModifier: 1.15,
      },
      魔法极光: {
        characterBuff: { '巫师': 25, '精灵': 25, '仙女': 20, '巨龙': 15 },
        unlockedRegions: ['北欧'],
        hiddenStoryBonus: 20,
        storyUnlockTags: ['魔法', '极光', '神秘', '力量'],
        explorationModifier: 1.2,
      },
      糖果风暴: {
        characterBuff: { '公主': 20, '矮人': 15, '动物': 15 },
        unlockedRegions: [],
        hiddenStoryBonus: 5,
        storyUnlockTags: ['甜蜜', '糖果', '幸福', '快乐'],
        explorationModifier: 1.1,
      },
      花瓣雨: {
        characterBuff: { '公主': 15, '仙女': 15, '王子': 10 },
        unlockedRegions: ['日本', '中国'],
        hiddenStoryBonus: 15,
        storyUnlockTags: ['爱情', '花', '浪漫', '春天'],
        explorationModifier: 1.1,
      },
      月光夜: {
        characterBuff: { '女巫': 25, '狼人': 30, '精灵': 20, '动物': 15 },
        unlockedRegions: ['英国'],
        hiddenStoryBonus: 25,
        storyUnlockTags: ['夜晚', '月', '神秘', '变身'],
        explorationModifier: 1.1,
      },
      彩虹桥: {
        characterBuff: { '仙女': 25, '精灵': 20, '公主': 15, '王子': 15 },
        unlockedRegions: ['印度', '古希腊'],
        hiddenStoryBonus: 20,
        storyUnlockTags: ['仙境', '彩虹', '传说', '神'],
        explorationModifier: 1.25,
      },
    };
    return effects[weather];
  },

  getWeatherForecast: (region): WeatherForecast => {
    const weathers: WeatherType[] = ['晴朗', '白雪', '流星雨', '魔法极光', '糖果风暴', '花瓣雨', '月光夜', '彩虹桥'];
    const current = region === '全部' ? get().currentGlobalWeather : get().regionWeathers[region];
    const next = weathers[Math.floor(Math.random() * weathers.length)];

    const hours = ['现在', '1小时后', '3小时后', '6小时后', '12小时后', '明天'];
    const hourly = hours.map((h, i) => ({
      time: h,
      weather: i === 0 ? current : weathers[Math.floor(Math.random() * weathers.length)],
    }));

    return {
      region,
      currentWeather: current,
      nextWeather: next,
      nextWeatherIn: get().weatherChangeTimer,
      hourlyForecast: hourly,
    };
  },

  isRegionUnlocked: (region): boolean => {
    if (region === '全部') return true;
    const weather = get().regionWeathers[region as Exclude<Region, '全部'>] || '晴朗';
    const effect = get().getWeatherEffect(weather);
    if (effect.unlockedRegions.length === 0) return true;
    return effect.unlockedRegions.includes(region);
  },

  isStoryWeatherUnlocked: (storyId, storyRegion, storyTags): boolean => {
    if (get().unlockedWeatherStories.has(storyId)) return true;
    const weather = get().getWeatherByRegion(storyRegion);
    const effect = get().getWeatherEffect(weather);
    if (effect.storyUnlockTags.length === 0) return true;
    return storyTags.some((tag) => effect.storyUnlockTags.some((unlockTag) => tag.includes(unlockTag) || unlockTag.includes(tag)));
  },

  unlockWeatherStory: (storyId) => {
    const current = get().unlockedWeatherStories;
    const next = new Set(current);
    next.add(storyId);
    set({ unlockedWeatherStories: next });
  },

  getCharacterWeatherBuff: (characterType, weather): number => {
    const effect = get().getWeatherEffect(weather);
    return effect.characterBuff[characterType] || 0;
  },
}));

export const getHotStories = (stories: Story[]): Story[] => {
  return stories.filter((story) => story.isHot);
};

export const getStoryById = (stories: Story[], id: string): Story | undefined => {
  return stories.find((story) => story.id === id);
};

export const getFilteredStories = (
  stories: Story[],
  searchQuery: string,
  selectedRegion: Region
): Story[] => {
  return stories.filter((story) => {
    const matchesRegion = selectedRegion === '全部' || story.region === selectedRegion;
    const matchesSearch =
      searchQuery === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });
};

export const searchStories = (stories: Story[], query: string): Story[] => {
  if (!query.trim()) return [];
  return stories.filter(
    (story) =>
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.author.toLowerCase().includes(query.toLowerCase()) ||
      story.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      story.summary.toLowerCase().includes(query.toLowerCase())
  );
};

export const getFilteredCharacters = (
  characters: StoryCharacter[],
  selectedType: CharacterType
): StoryCharacter[] => {
  if (selectedType === '全部') return characters;
  return characters.filter((c) => c.type === selectedType);
};

export const getCharacterById = (characters: StoryCharacter[], id: string): StoryCharacter | undefined => {
  return characters.find((c) => c.id === id);
};

export const getCharactersByStoryId = (characters: StoryCharacter[], storyId: string): StoryCharacter[] => {
  return characters.filter((c) => c.storyId === storyId);
};

export const getInteractiveStoryByStoryId = (
  interactiveStories: InteractiveStory[],
  storyId: string
): InteractiveStory | undefined => {
  return interactiveStories.find((s) => s.storyId === storyId);
};

export const buildStoryTree = (
  interactiveStory: InteractiveStory,
  visitedNodes: string[],
  currentNodeId: string
) => {
  const { nodes, startNodeId } = interactiveStory;

  const getLevel = (nodeId: string, targetId: string, path: string[] = []): number => {
    if (nodeId === targetId) return path.length;
    const node = nodes[nodeId];
    if (!node?.choices) return -1;
    for (const choice of node.choices) {
      const result = getLevel(choice.nextNodeId, targetId, [...path, nodeId]);
      if (result !== -1) return result;
    }
    return -1;
  };

  const nodesByLevel: Record<number, string[]> = {};
  const maxLevel = { value: 0 };

  const traverse = (nodeId: string, level: number, visited: Set<string>) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!nodesByLevel[level]) nodesByLevel[level] = [];
    nodesByLevel[level].push(nodeId);
    if (level > maxLevel.value) maxLevel.value = level;

    const node = nodes[nodeId];
    if (node?.choices) {
      for (const choice of node.choices) {
        traverse(choice.nextNodeId, level + 1, new Set(visited));
      }
    }
  };

  traverse(startNodeId, 0, new Set());

  const currentPath = new Set<string>();
  let tempId = currentNodeId;
  while (tempId) {
    currentPath.add(tempId);
    let found = false;
    for (const [nId, node] of Object.entries(nodes)) {
      if (node.choices) {
        for (const choice of node.choices) {
          if (choice.nextNodeId === tempId) {
            tempId = nId;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    if (!found) break;
  }

  const positioned: Record<string, { x: number; y: number }> = {};
  const levelWidth = 180;
  const nodeHeight = 100;

  for (let level = 0; level <= maxLevel.value; level++) {
    const nodeIds = nodesByLevel[level] || [];
    const totalWidth = (nodeIds.length - 1) * levelWidth;
    const startX = -totalWidth / 2;
    nodeIds.forEach((nodeId, index) => {
      positioned[nodeId] = {
        x: startX + index * levelWidth,
        y: level * nodeHeight,
      };
    });
  }

  return {
    positioned,
    nodesByLevel,
    maxLevel: maxLevel.value,
    currentPath,
    visitedSet: new Set(visitedNodes),
    nodes,
  };
};

export const getAllMagicItems = (
  magicItems: MagicItem[], customMagicItems: MagicItem[]): MagicItem[] => {
  return [...magicItems, ...customMagicItems];
};

export const getFilteredMagicItems = (
  items: MagicItem[],
  category: MagicItemCategory,
  rarity: MagicItemRarity | '全部',
  searchQuery: string
): MagicItem[] => {
  return items.filter((item) => {
    const matchesCategory = category === '全部' || item.category === category;
    const matchesRarity = rarity === '全部' || item.rarity === rarity;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.abilities.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesRarity && matchesSearch;
  });
};

export const getMagicItemById = (
  items: MagicItem[],
  id: string
): MagicItem | undefined => {
  return items.find((i) => i.id === id);
};

export const getMagicItemsByStory = (
  items: MagicItem[],
  storyTitle: string
): MagicItem[] => {
  return items.filter((i) => i.storyTitle === storyTitle);
};

export const getMagicItemsByRarity = (
  items: MagicItem[],
  rarity: MagicItemRarity
): MagicItem[] => {
  return items.filter((i) => i.rarity === rarity);
};

export const getFilteredCreatures = (
  creatures: Creature[],
  habitat: CreatureHabitat,
  ability: CreatureAbilityType,
  danger: DangerLevel,
  searchQuery: string
): Creature[] => {
  return creatures.filter((creature) => {
    const matchesHabitat = habitat === '全部' || creature.habitat === habitat;
    const matchesAbility = ability === '全部' || creature.abilityTypes.includes(ability as Exclude<CreatureAbilityType, '全部'>);
    const matchesDanger = danger === '全部' || creature.dangerLevel === danger;
    const matchesSearch =
      searchQuery === '' ||
      creature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.traits.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      creature.abilities.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesHabitat && matchesAbility && matchesDanger && matchesSearch;
  });
};

export const getCreatureById = (
  creatures: Creature[],
  id: string
): Creature | undefined => {
  return creatures.find((c) => c.id === id);
};

export const getCreaturesByHabitat = (
  creatures: Creature[],
  habitat: Exclude<CreatureHabitat, '全部'>
): Creature[] => {
  return creatures.filter((c) => c.habitat === habitat);
};
