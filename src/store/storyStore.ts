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
