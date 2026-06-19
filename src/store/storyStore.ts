import { create } from 'zustand';
import type { Story, Region, StoryCharacter, CharacterType } from '@/types';
import { stories } from '@/data/stories';
import { characters } from '@/data/characters';

interface StoryState {
  stories: Story[];
  characters: StoryCharacter[];
  searchQuery: string;
  selectedRegion: Region;
  selectedCharacterType: CharacterType;
  likedStories: Set<string>;
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: Region) => void;
  setSelectedCharacterType: (type: CharacterType) => void;
  toggleLike: (storyId: string) => void;
  isLiked: (storyId: string) => boolean;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories,
  characters,
  searchQuery: '',
  selectedRegion: '全部',
  selectedCharacterType: '全部',
  likedStories: new Set(),

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
