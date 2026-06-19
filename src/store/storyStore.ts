import { create } from 'zustand';
import type { Story, Region, StoryCharacter, CharacterType, InteractiveStory, StoryProgress, UserChoiceRecord } from '@/types';
import { stories } from '@/data/stories';
import { characters } from '@/data/characters';
import { interactiveStories } from '@/data/interactiveStories';

interface StoryState {
  stories: Story[];
  characters: StoryCharacter[];
  interactiveStories: InteractiveStory[];
  searchQuery: string;
  selectedRegion: Region;
  selectedCharacterType: CharacterType;
  likedStories: Set<string>;
  storyProgress: Record<string, StoryProgress>;
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: Region) => void;
  setSelectedCharacterType: (type: CharacterType) => void;
  toggleLike: (storyId: string) => void;
  isLiked: (storyId: string) => boolean;
  initStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
  setCurrentNode: (interactiveStoryId: string, nodeId: string) => void;
  recordChoice: (interactiveStoryId: string, nodeId: string, choiceId: string) => void;
  addVisitedNode: (interactiveStoryId: string, nodeId: string) => void;
  addDiscoveredEnding: (interactiveStoryId: string, endingNodeId: string) => void;
  resetStoryProgress: (interactiveStoryId: string, startNodeId: string) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories,
  characters,
  interactiveStories,
  searchQuery: '',
  selectedRegion: '全部',
  selectedCharacterType: '全部',
  likedStories: new Set(),
  storyProgress: {},

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedCharacterType: (type) => set({ selectedCharacterType: type }),
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

  addDiscoveredEnding: (interactiveStoryId, endingNodeId) => {
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
        },
      },
    });
  },

  resetStoryProgress: (interactiveStoryId, startNodeId) => {
    const current = get().storyProgress;
    const story = interactiveStories.find((s) => s.id === interactiveStoryId);
    if (!story) return;
    const existingDiscovered = current[interactiveStoryId]?.discoveredEndings || [];
    set({
      storyProgress: {
        ...current,
        [interactiveStoryId]: {
          storyId: story.storyId,
          currentNodeId: startNodeId,
          visitedNodes: [startNodeId],
          choiceHistory: [],
          discoveredEndings: existingDiscovered,
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
